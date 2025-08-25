import { NavLink, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Instagram, Facebook, Github, Mail } from "lucide-react"; // 👈 add this

const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm transition
   ${isActive ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"}`;

export default function Navbar() {
    const [authed, setAuthed] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setAuthed(!!u));
        return () => unsub();
    }, []);

    async function handleSignOut() {
        try {
            await signOut(auth);
            navigate("/");
            setOpen(false);
        } catch (e) {
            console.error("Sign out failed:", e);
        }
    }

    return (
        <header className="left-0 right-0 z-50 mt-6">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10
                        bg-black/10 backdrop-blur-md px-4 py-3">
                    <NavLink to="/" className="text-white font-semibold" onClick={() => setOpen(false)}>
                        Likwit Devs
                    </NavLink>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink to="/" className={linkClass}>Home</NavLink>
                        {/* About scroll */}
                        <button
                            onClick={() => {
                                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
                        >
                            About
                        </button>
                        <NavLink to="/contact" className={linkClass}>Contact</NavLink>
                        {authed && (
                            <>
                                <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                                <button
                                    onClick={handleSignOut}
                                    className="ml-2 px-3 py-1.5 rounded-lg text-sm text-white bg-white/20 hover:bg-white/30 transition"
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                    </nav>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-white/90"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                    >
                        Menu
                    </button>
                </div>

                {/* Mobile drawer */}
                <div
                    id="mobile-nav"
                    className={`md:hidden transition-[max-height] duration-300 overflow-hidden border-x border-b border-white/10 rounded-b-2xl
          ${open ? "max-h-80" : "max-h-0"}`}
                >
                    <div className="px-4 py-3 bg-black/10 backdrop-blur-md">
                        <ul className="space-y-2">
                            <li>
                                <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                                        setOpen(false);
                                    }}
                                    className="px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition w-full text-left"
                                >
                                    About
                                </button>
                            </li>
                            <li>
                                <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>Contact</NavLink>
                            </li>

                            {authed && (
                                <>
                                    <li>
                                        <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>Admin</NavLink>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleSignOut}
                                            className="px-3 py-2 rounded-lg text-sm text-white bg-white/20 hover:bg-white/30 transition w-full text-left"
                                        >
                                            Sign out
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* Divider */}
                        <div className="my-3 h-px bg-white/10" />

                        {/* Socials row */}
                        <div className="flex items-center gap-3">
                            {/* Contact Page link */}
                            <Link
                                to="/contact"
                                aria-label="Contact"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                                onClick={() => setOpen(false)}
                            >
                                <Mail size={18} />
                            </Link>

                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                                onClick={() => setOpen(false)}
                            >
                                <Instagram size={18} />
                            </a>

                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                                onClick={() => setOpen(false)}
                            >
                                <Facebook size={18} />
                            </a>

                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                                onClick={() => setOpen(false)}
                            >
                                <Github size={18} />
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}
