import useAuthGate from "../hooks/useAuthGate";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Link } from "react-router-dom";

export default function AdminProjects() {
    const ok = useAuthGate(); // null=loading, true=allowed, false=not allowed

    if (ok === null) return <div className="p-10 text-center">Checking access…</div>;
    if (ok === false) {
        return (
            <main className="min-h-screen grid place-items-center p-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center space-y-3">
                    <div>Not authorized</div>
                    <Link to="/admin/login" className="inline-flex px-4 py-2 rounded-xl bg-white text-black">Go to Login</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-6">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin — Projects</h1>
                <div className="flex gap-2">
                    <Link to="/" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">View site</Link>
                    <button onClick={() => signOut(auth)} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">Sign out</button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <p>You’re in! We’ll add the project manager UI next.</p>
            </div>
        </main>
    );
}
