"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiSignup } from "@/lib/api-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiSignup(email, password, name);
      router.push("/closet");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Mobile wordmark */}
      <span className="lg:hidden block font-serif text-2xl mb-12 tracking-tight">closetiq</span>

      <h1 className="font-serif text-3xl mb-2">Create account</h1>
      <p className="font-sans text-xs uppercase tracking-widest text-muted mb-10">
        Start building your wardrobe
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest mb-2">
            Name <span className="text-muted">(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-black"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-widest mb-2">
            Email
          </label>
          <input
            id="signup-email"
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
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-black"
            placeholder="Min. 8 characters"
          />
        </div>

        {error && (
          <p className="font-sans text-xs text-terracotta border border-terracotta px-3 py-2">
            {error}
          </p>
        )}

        <button
          id="signup-submit"
          type="submit"
          disabled={loading}
          className="btn-black w-full mt-4 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account →"}
        </button>
      </form>

      <p className="font-sans text-xs text-muted mt-8 border-t border-black pt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-black underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
