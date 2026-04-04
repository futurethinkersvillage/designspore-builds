import sys, io, paramiko
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '5.161.236.48'
APP_UUID = 'hyhfgc8q0nhkzvj80ztxga0e'
USER_ID = 0  # futurethinkerspodcast@gmail.com

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username='root', password='itRgKWFkUPVr', timeout=15)

def run(cmd):
    stdin, stdout, stderr = client.exec_command(cmd)
    return stdout.read().decode('utf-8', errors='replace').strip()

php_lines = [
    "<?php",
    "chdir('/var/www/html');",
    "define('LARAVEL_START', microtime(true));",
    "require '/var/www/html/vendor/autoload.php';",
    "$app = require '/var/www/html/bootstrap/app.php';",
    "$kernel = $app->make(Illuminate\\\\Contracts\\\\Console\\\\Kernel::class);",
    "$kernel->bootstrap();",
    f"$user = App\\\\Models\\\\User::find({USER_ID});",
    "if (!$user) { echo 'NOT_FOUND'; exit(1); }",
    "$token = $user->createToken('cli');",
    "echo $token->plainTextToken;",
]
php = "\n".join(php_lines)

sftp = client.open_sftp()
with sftp.open('/tmp/tok3.php', 'w') as f:
    f.write(php)
sftp.close()

run("docker cp /tmp/tok3.php coolify:/var/www/html/tok3.php")
token = run("docker exec coolify php /var/www/html/tok3.php 2>/dev/null")
run("docker exec coolify rm /var/www/html/tok3.php")
run("rm /tmp/tok3.php")

print("Token:", (token[:50] + "...") if len(token) > 50 else token)

if token and '|' in token:
    out = run(f'curl -s -X GET "http://localhost:8000/api/v1/deploy?uuid={APP_UUID}&force=true" -H "Authorization: Bearer {token}"')
    print("Deploy:", out[:300])
else:
    print("Token failed:", token[:200])

client.close()
