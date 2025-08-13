import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { login as loginApi } from "../services/auth";
import { setAuth } from "../store/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.username.trim()) return setErr("Username is required.");
    if (!form.password) return setErr("Password is required.");

    setLoading(true);
    try {
      const data = await loginApi({
        username: form.username.trim(),
        password: form.password,
      });
      dispatch(setAuth(data));
      navigate("/dashboard");
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || "Invalid credentials";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="mb-6 text-center text-2xl font-semibold">Welcome back</h1>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span className="text-sm text-white/70">Username</span>
          <input
            className="rounded-lg bg-white/10 px-3 py-2 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            name="username"
            value={form.username}
            onChange={onChange}
            required
            autoComplete="username"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-white/70">Password</span>
          <input
            className="rounded-lg bg-white/10 px-3 py-2 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            autoComplete="current-password"
          />
        </label>

        {err && <p className="text-sm text-red-300">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-white text-neutral-950 px-4 py-2 font-medium shadow hover:shadow-md disabled:opacity-70"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-sm text-white/70">
          New here? <a href="/register" className="underline">Create an account</a>
        </p>
      </form>
    </AuthLayout>
  );
}
