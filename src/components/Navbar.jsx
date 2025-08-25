import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm transition
   ${isActive ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"}`;

export default function Navbar() {
    const [authed, setAuthed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setAuthed(!!u));
        return () => unsub();
    }, []);

    async function handleSignOut() {
        try {
            await signOut(auth);
            navigate("/"); // send to Home after logout
        } catch (e) {
            console.error("Sign out failed:", e);
        }
    }

    return (
        <header className="left-0 right-0 top-6 z-50 mt-10">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10
                        bg-black/10 backdrop-blur-md px-4 py-3">
                    <NavLink to="/" className="text-white font-semibold">
                        Likwit Devs
                    </NavLink>

                    <nav className="flex items-center gap-1">
                        <NavLink to="/" className={linkClass}>Home</NavLink>
                        <NavLink to="/contact" className={linkClass}>Contact</NavLink>

                        {authed && (
                            <>
                                <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                                <button
                                    onClick={handleSignOut}
                                    className="ml-2 px-3 py-1.5 rounded-lg text-sm text-white
                             bg-white/20 hover:bg-white/30 transition"
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
