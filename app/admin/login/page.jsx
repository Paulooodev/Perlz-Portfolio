"use client";

// Split into two parts so useSearchParams() lives inside a Suspense boundary.
// This is required by Next.js production build — dev is lenient about it.

import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "./actions";
import { LogIn, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  return (
    // Suspense fallback shows while the inner form is hydrating.
    // We just show a faded version of the same shell so there's no layout jump.
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  );
}

// ----------------------------------------------------------------------------
// The actual form — uses useSearchParams() to read ?next=... param.
// Must be inside <Suspense> because that hook bails out of static rendering.
// ----------------------------------------------------------------------------
function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <LoginShell>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="you@example.com"
            disabled={isPending}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="••••••••"
            disabled={isPending}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 h-12 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              <LogIn size={16} />
              Sign In
            </>
          )}
        </button>
      </form>
    </LoginShell>
  );
}

// ----------------------------------------------------------------------------
// LoginShell — pure visual shell, no logic. Used both as the loaded form's
// container AND as the Suspense fallback. This way there's no layout jump
// while the form hydrates.
// ----------------------------------------------------------------------------
function LoginShell({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            PERLZ
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-[0.3em] font-bold">
            Admin Panel
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter your credentials to manage the catalog.
          </p>

          {children}
        </div>

        <p className="mt-6 text-center text-gray-600 text-xs">
          Forgot your password? Reset it from the Supabase dashboard.
        </p>
      </div>
    </div>
  );
}