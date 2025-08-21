// src/pages/AdminLogin.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [form, setForm] = useState({ email: "", pass: "" });
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const nav = useNavigate();

    const doLogin = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr("");
        try {
            await signInWithEmailAndPassword(auth, form.email, form.pass);
            nav("/admin"); // send to admin page
        } catch (e) {
            console.error(e);
            setErr("Invalid credentials");
        } finally {
            setBusy(false);
        }
    };

    return (
        <main className="min-h-screen grid place-items-center p-6">
            <form
                onSubmit={doLogin}
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
            >
                <h1 className="text-xl font-bold text-center">Admin Login</h1>

                {err && <div className="text-red-400 text-center">{err}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 rounded bg-white/10"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 rounded bg-white/10"
                    value={form.pass}
                    onChange={(e) => setForm({ ...form, pass: e.target.value })}
                />

                <button
                    type="submit"
                    disabled={busy}
                    className="w-full px-4 py-2 rounded-xl bg-white text-black"
                >
                    {busy ? "Logging in…" : "Log In"}
                </button>
            </form>
        </main>
    );
}
