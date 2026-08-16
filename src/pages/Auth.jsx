import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Brand } from "../components/Shell";
import { ErrorBox } from "../components/ui";

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[1.1fr_.9fr]">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-forest-800 to-forest-500 p-[52px] text-white md:flex">
        <div className="[&_strong]:text-white [&_span]:text-forest-100">
          <Brand />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold">
            <HeartHandshake size={15} /> Food with purpose
          </span>
          <h2 className="mt-5 max-w-lg font-display text-5xl font-semibold leading-tight">
            Make every meal count.
          </h2>
          <p className="mt-4 max-w-md text-forest-100">
            Every donation can become a timely meal when donors and NGOs work from the same view.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          <Link to="/" className="text-sm text-forest-500 hover:text-forest-700">
            ← Home
          </Link>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">{title}</h1>
          <p className="mt-1 text-forest-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      nav("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage donations, claims and impact.">
      <form className="mt-7 flex flex-col gap-4" onSubmit={submit}>
        {error && <ErrorBox message={error} />}
        <label className="field">
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="field">
          Password
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="btn-primary mt-1 w-full py-3" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-forest-500">
          No account?{" "}
          <Link to="/register" className="font-bold text-forest-600">
            Create one
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
