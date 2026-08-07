"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiLogin } from "@/lib/api-client";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await apiLogin(email, password);
      setToken(token);
      router.push("/closet");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Mobile wordmark */}
      <span className="lg:hidden block font-serif text-2xl mb-12 tracking-tight">closetiq</span>

      <h1 className="font-serif text-3xl mb-2">Welcome back</h1>
      <p className="font-sans text-xs uppercase tracking-widest text-muted mb-10">
        Sign in to your wardrobe
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-black"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-widest mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-black"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="font-sans text-xs text-terracotta border border-terracotta px-3 py-2">
            {error}
          </p>
        )}

        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="btn-black w-full mt-4 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Login →"}
        </button>
      </form>

      <p className="font-sans text-xs text-muted mt-8 border-t border-black pt-6">
        No account?{" "}
        <Link href="/signup" className="text-black underline underline-offset-2">
          Create one
        </Link>
      </p>
    </div>
  );
}
