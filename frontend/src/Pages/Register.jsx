import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { register as registerApi, login as loginApi } from "../services/auth";
import { setAuth } from "../store/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "Reader", // default valid value
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function normalizeRole(role) {
    const v = String(role || "").trim().toLowerCase();
    return v === "writer" ? "Writer" : "Reader";
  }

  function validate() {
    if (!form.username.trim()) return "Username is required.";
    if (!form.email.trim()) return "Email is required.";
    if ((form.password || "").length < 6) return "Password must be at least 6 characters.";
    if (!["Reader", "Writer"].includes(normalizeRole(form.role))) return "Role must be Reader or Writer.";
    return "";
  }

  function formatApiError(data) {
    if (!data) return "";
    if (typeof data === "string") return data;
    try {
      return Object.entries(data)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join(" | ");
    } catch {
      return "Registration failed.";
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const msg = validate();
    if (msg) return setErr(msg);

    setLoading(true);
    try {
      // Always send the exact fields your DRF serializer expects
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: normalizeRole(form.role),
      };

      await registerApi(payload); // 201 on success

      // Auto sign-in using username (SimpleJWT expects username, not email)
      const user = await loginApi({ username: payload.username, password: payload.password });

      // Store user in your Redux state (adjust if your setAuth expects a different shape)
      dispatch(setAuth(user));

      navigate("/dashboard");
    } catch (e) {
      const apiMsg = formatApiError(e?.response?.data);
      setErr(apiMsg || e?.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="mb-6 text-center text-2xl font-semibold">Join Writely</h1>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span className="text-sm text-white/70">Username</span>
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            className="rounded-lg bg-white/10 px-3 py-2 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-white/70">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="rounded-lg bg-white/10 px-3 py-2 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-white/70">Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            className="rounded-lg bg-white/10 px-3 py-2 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            required
            minLength={6}
          />
        </label>

        <div className="grid gap-2">
          <span className="text-sm text-white/70">Role</span>
          <div className="flex gap-2">
            {["Reader", "Writer"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                className={`flex-1 rounded-xl px-3 py-2 ring-1 ${
                  form.role === r
                    ? "bg-white text-neutral-950 ring-white"
                    : "bg-white/10 text-white ring-white/20"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {err && <p className="text-sm text-red-300">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-white text-neutral-950 px-4 py-2 font-medium shadow hover:shadow-md disabled:opacity-70"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-sm text-white/70">
          Already have an account? <a href="/login" className="underline">Sign in</a>
        </p>
      </form>
    </AuthLayout>
  );
}
