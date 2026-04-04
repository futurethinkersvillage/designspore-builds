"""
Switch DesignSpore from Stripe test mode to live mode.

Steps:
  1. Creates 4 live products + prices matching the test setup
  2. Creates a webhook endpoint for https://designspore.co
  3. Updates all Stripe env vars in Coolify and redeploys

Usage:
  python scripts/setup_stripe_live.py <STRIPE_LIVE_SECRET_KEY>

Get your live secret key from:
  https://dashboard.stripe.com/apikeys  (switch to "Live" mode)
"""

import sys, json
import urllib.request, urllib.parse
import paramiko

# ── Config ──────────────────────────────────────────────────────────────────
COOLIFY_HOST = "5.161.236.48"
COOLIFY_APP_ID = "1"  # DesignSpore app (id=1 in Coolify DB)
WEBHOOK_URL = "https://designspore.co/api/webhooks/stripe"

PRODUCTS = [
    {
        "key": "STRIPE_PRICE_STARTER",
        "name": "DesignSpore — Starter Plan",
        "description": "4 credits/month · One complete AI system per month",
        "unit_amount": 150000,
        "recurring": True,
    },
    {
        "key": "STRIPE_PRICE_GROWTH",
        "name": "DesignSpore — Growth Plan",
        "description": "8 credits/month · Multiple systems running in parallel",
        "unit_amount": 300000,
        "recurring": True,
    },
    {
        "key": "STRIPE_PRICE_SCALE",
        "name": "DesignSpore — Scale Plan",
        "description": "13 credits/month · Full-engagement month across your whole stack",
        "unit_amount": 500000,
        "recurring": True,
    },
    {
        "key": "STRIPE_PRICE_ONBOARDING",
        "name": "DesignSpore — Onboarding",
        "description": "Discovery call, 90-day roadmap, and website rebuild",
        "unit_amount": 50000,
        "recurring": False,
    },
]

WEBHOOK_EVENTS = [
    "checkout.session.completed",
    "customer.subscription.deleted",
    "customer.subscription.updated",
]

# ── Stripe helpers ───────────────────────────────────────────────────────────

def stripe_post(path, data, secret_key):
    encoded = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(
        f"https://api.stripe.com/v1/{path}",
        data=encoded,
        headers={
            "Authorization": f"Bearer {secret_key}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

def create_product_and_price(product_def, secret_key):
    prod = stripe_post("products", {
        "name": product_def["name"],
        "description": product_def["description"],
    }, secret_key)

    price_data = {
        "product": prod["id"],
        "unit_amount": product_def["unit_amount"],
        "currency": "usd",
    }
    if product_def["recurring"]:
        price_data["recurring[interval]"] = "month"

    price = stripe_post("prices", price_data, secret_key)
    return price["id"]

def create_webhook(secret_key):
    data = {
        "url": WEBHOOK_URL,
        "api_version": "2026-03-25.dahlia",
    }
    for i, event in enumerate(WEBHOOK_EVENTS):
        data[f"enabled_events[{i}]"] = event

    result = stripe_post("webhook_endpoints", data, secret_key)
    return result["id"], result["secret"]

def get_live_publishable_key(secret_key):
    """Derive publishable key from secret key format."""
    # Live publishable key starts with pk_live_ — user must provide it separately
    return None

# ── Coolify helpers ──────────────────────────────────────────────────────────

def coolify_set_env(client, key, value):
    """Encrypt value using Coolify's Laravel encrypt() and upsert into DB."""

    escaped = value.replace("'", "\\'")
    php = f"""<?php
chdir('/var/www/html');
define('LARAVEL_START', microtime(true));
require '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
use Illuminate\\Contracts\\Console\\Kernel;
$kernel = $app->make(Kernel::class);
$kernel->handle(new Symfony\\Component\\Console\\Input\\StringInput(''), new Symfony\\Component\\Console\\Output\\NullOutput);
echo encrypt('{escaped}');
"""
    sftp = client.open_sftp()
    with sftp.open('/tmp/enc.php', 'w') as f:
        f.write(php)
    sftp.close()

    def run(cmd):
        stdin, stdout, stderr = client.exec_command(cmd)
        return stdout.read().decode('utf-8', errors='replace').strip()

    run("docker cp /tmp/enc.php coolify:/var/www/html/enc.php")
    encrypted = run("docker exec -w /var/www/html coolify php enc.php 2>/dev/null")
    run("docker exec coolify rm /var/www/html/enc.php")
    run("rm /tmp/enc.php")

    if not encrypted.startswith("eyJ"):
        raise ValueError(f"Encryption failed for {key}: {encrypted[:200]}")

    # Delete old entries, insert new
    run(f"""docker exec coolify-db psql -U coolify -d coolify -c "DELETE FROM environment_variables WHERE resourceable_id='{COOLIFY_APP_ID}' AND key='{key}';" """)

    sql = (
        "INSERT INTO environment_variables "
        "(key, value, resourceable_id, resourceable_type, uuid, "
        "is_preview, is_shown_once, is_multiline, is_literal, "
        "is_required, is_shared, is_runtime, is_buildtime, created_at, updated_at) VALUES ("
        f"'{key}', '{encrypted}', {COOLIFY_APP_ID}, 'App\\\\Models\\\\Application', gen_random_uuid()::text, "
        "false, false, false, false, false, false, true, false, NOW(), NOW()) RETURNING id;"
    )

    sftp = client.open_sftp()
    with sftp.open('/tmp/ins.sql', 'w') as f:
        f.write(sql)
    sftp.close()

    run("docker cp /tmp/ins.sql coolify-db:/tmp/ins.sql")
    out = run("docker exec coolify-db psql -U coolify -d coolify -f /tmp/ins.sql")
    run("docker exec coolify-db rm /tmp/ins.sql")
    run("rm /tmp/ins.sql")
    return out

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    live_secret = sys.argv[1].strip()
    if not live_secret.startswith("sk_live_"):
        print(f"ERROR: Expected sk_live_... key, got: {live_secret[:20]}...")
        sys.exit(1)

    live_publishable = None
    if len(sys.argv) >= 3:
        live_publishable = sys.argv[2].strip()
    else:
        live_publishable = input("Enter live publishable key (pk_live_...): ").strip()

    if not live_publishable.startswith("pk_live_"):
        print(f"ERROR: Expected pk_live_... key")
        sys.exit(1)

    print("\n── Step 1: Creating live Stripe products & prices ──")
    price_ids = {}
    for prod in PRODUCTS:
        print(f"  Creating {prod['name']}...")
        price_id = create_product_and_price(prod, live_secret)
        price_ids[prod["key"]] = price_id
        print(f"    → {price_id}")

    print("\n── Step 2: Creating live webhook endpoint ──")
    webhook_id, webhook_secret = create_webhook(live_secret)
    print(f"  Webhook ID: {webhook_id}")
    print(f"  Webhook secret: {webhook_secret}")

    print("\n── Step 3: Updating Coolify env vars ──")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(COOLIFY_HOST, username='root', password='itRgKWFkUPVr', timeout=15)

    env_updates = {
        "STRIPE_SECRET_KEY": live_secret,
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": live_publishable,
        "STRIPE_WEBHOOK_SECRET": webhook_secret,
        **price_ids,
    }

    for key, value in env_updates.items():
        print(f"  Setting {key}...")
        coolify_set_env(ssh, key, value)
        print(f"    → OK")

    print("\n── Step 4: Triggering redeploy ──")
    def run(cmd):
        stdin, stdout, stderr = ssh.exec_command(cmd)
        return stdout.read().decode('utf-8', errors='replace').strip()

    # Get the app's UUID to trigger redeploy via Coolify API
    app_uuid = run("docker exec coolify-db psql -U coolify -d coolify -t -c \"SELECT uuid FROM applications WHERE id=1;\"").strip()
    print(f"  App UUID: {app_uuid}")

    # Trigger redeploy
    token_php = r"""<?php
chdir('/var/www/html');
define('LARAVEL_START', microtime(true));
require '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
use Illuminate\Contracts\Console\Kernel;
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();
$user = App\Models\User::where('email','futurethinkerspodcast@gmail.com')->first();
if (!$user) { echo 'USER_NOT_FOUND'; exit(1); }
$token = $user->createToken('deploy-cli');
echo $token->plainTextToken;
"""
    sftp = ssh.open_sftp()
    with sftp.open('/tmp/tok.php', 'w') as f:
        f.write(token_php)
    sftp.close()
    run("docker cp /tmp/tok.php coolify:/var/www/html/tok.php")
    token = run("docker exec coolify php /var/www/html/tok.php 2>/dev/null")
    run("docker exec coolify rm /var/www/html/tok.php")
    run("rm /tmp/tok.php")

    deploy_cmd = f"curl -s -X POST http://localhost:8000/api/v1/deploy?uuid={app_uuid}&force=true -H 'Authorization: Bearer {token}'"
    deploy_out = run(deploy_cmd)
    print(f"  Deploy response: {deploy_out[:200]}")

    ssh.close()

    print("\n✓ Done! Summary:")
    print(f"  STRIPE_SECRET_KEY: {live_secret[:25]}...")
    print(f"  STRIPE_PRICE_STARTER: {price_ids['STRIPE_PRICE_STARTER']}")
    print(f"  STRIPE_PRICE_GROWTH: {price_ids['STRIPE_PRICE_GROWTH']}")
    print(f"  STRIPE_PRICE_SCALE: {price_ids['STRIPE_PRICE_SCALE']}")
    print(f"  STRIPE_PRICE_ONBOARDING: {price_ids['STRIPE_PRICE_ONBOARDING']}")
    print(f"  STRIPE_WEBHOOK_SECRET: {webhook_secret[:30]}...")
    print("\nIMPORTANT: In the Stripe dashboard (live mode), configure the Customer Portal:")
    print("  https://dashboard.stripe.com/settings/billing/portal")
    print("  This is required for the 'Manage billing' link in the client Account page.")

if __name__ == "__main__":
    main()
