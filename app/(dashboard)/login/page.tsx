"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginWithCredentials, loginWithGoogle } from "@/app/actions/auth";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const params = useSearchParams();
  const welcome = params.get("welcome") === "true";
  const cancelled = params.get("cancelled") === "true";

  const [state, formAction, pending] = useActionState(loginWithCredentials, {});

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-3">
          Client Portal
        </p>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-outfit, var(--font-sans))" }}
        >
          Sign In
        </h1>
      </div>

      {welcome && (
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-4 text-center">
          <p className="text-sm font-semibold text-emerald-300 mb-1">Payment confirmed — welcome aboard.</p>
          <p className="text-xs text-white/50">Your account is active. Sign in below to access your portal.</p>
        </div>
      )}

      {cancelled && (
        <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-center">
          <p className="text-sm text-white/60 mb-1">Checkout cancelled — no charge was made.</p>
          <Link href="/signup" className="text-xs text-gold hover:text-gold-light transition-colors">
            Go back to sign up →
          </Link>
        </div>
      )}

      {state?.error && (
        <p className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-center">
          {state.error}
        </p>
      )}

      {/* Google */}
      <form action={loginWithGoogle}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-white text-dark text-sm font-semibold py-3 px-4 rounded-xl hover:bg-white/90 transition-colors mb-5"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-white/[0.08]" />
        <span className="text-xs text-white/30">or</span>
        <div className="flex-1 h-px bg-white/[0.08]" />
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Email</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Password</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full bg-raised border border-white/[0.08] text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-gold text-dark text-sm font-semibold py-3 rounded-xl hover:bg-gold-light disabled:opacity-50 transition-colors"
        >
          {pending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-white/30 mt-6">
        No account?{" "}
        <Link href="/signup" className="text-gold hover:text-gold-light transition-colors">
          Get started
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-darker px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.612 14.063 17.64 11.835 17.64 9.2z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
