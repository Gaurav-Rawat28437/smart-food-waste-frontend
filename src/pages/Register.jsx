import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/api";
import { AuthShell } from "./Auth";
import { ErrorBox, SuccessBox } from "../components/ui";

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("DONOR");
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.sendOtp(form.email);
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.verifyOtp(form.email, form.otp);
      setMessage("Email verified. Create your account now.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Password must contain uppercase, lowercase, number and symbol —
      // this matches the backend's validator.isStrongPassword check.
      await auth.signup({ name: form.name, email: form.email, password: form.password, role });
      setMessage("Account created. Please sign in.");
      setTimeout(() => nav("/login"), 700);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Choose your role and connect to the food redistribution network.">
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-forest-50/70 p-1">
        {["DONOR", "NGO"].map((r) => (
          <button
            key={r}
            className={`rounded-lg py-2.5 text-sm font-bold transition ${
              role === r ? "bg-white text-forest-600 shadow-sm" : "text-forest-500/70"
            }`}
            onClick={() => setRole(r)}
          >
            {r === "DONOR" ? "Donor" : "NGO"}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {error && <ErrorBox message={error} />}
        {message && <SuccessBox message={message} />}
      </div>

      {step === 1 && (
        <form className="flex flex-col gap-4" onSubmit={sendOtp}>
          <label className="field">
            Full name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="field">
            Email
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <button className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Sending OTP…" : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="flex flex-col gap-4" onSubmit={verify}>
          <label className="field">
            One-time code
            <input inputMode="numeric" maxLength={6} required value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} />
          </label>
          <button className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Verifying…" : "Verify email"}
          </button>
          <button type="button" className="text-sm font-bold text-forest-600" onClick={() => setStep(1)}>
            Change email
          </button>
        </form>
      )}

      {step === 3 && (
        <form className="flex flex-col gap-4" onSubmit={signup}>
          <label className="field">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span className="text-xs font-normal text-forest-400">
              Needs an uppercase and lowercase letter, a number, and a symbol.
            </span>
          </label>
          <button className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Creating…" : `Create ${role === "DONOR" ? "donor" : "NGO"} account`}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-forest-500">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-forest-600">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
