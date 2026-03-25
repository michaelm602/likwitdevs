import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../assets/likwitdevs-logo-white-long.png";
import { auth } from "../lib/firebase";
import { Github, Mail } from "lucide-react";

const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm transition ${isActive
        ? "bg-white/20 text-white"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

export default function Navbar() {
    const [authed, setAuthed] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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

    // Navigate to Home (if not there) then smooth-scroll to the section id
    const goTo = (id) => {
        const scroll = () =>
            document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });

        setOpen(false);

        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(scroll, 120); // give Home a tick to render
        } else {
            scroll();
        }
    };

    return (
        // Sticky keeps CTA visible while scrolling (better conversion)
        <header className="sticky top-0 left-0 right-0 z-50 pt-4">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md px-4 py-3">
                    <NavLink
                        to="/"
                        className="flex items-center gap-3"
                        onClick={() => setOpen(false)}
                        aria-label="Likwit Devs home"
                    >
                        <img
                            src={logo}
                            alt="Likwit Devs"
                            className="h-11 w-auto select-none"
                            draggable="false"
                        />
                        <span className="sr-only">Likwit Devs</span>
                    </NavLink>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <button
                            onClick={() => goTo("projects")}
                            className="px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
                        >
                            Work
                        </button>

                        <NavLink to="/services" className={linkClass}>
                            Services
                        </NavLink>

                        <button
                            onClick={() => goTo("pricing")}
                            className="px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
                        >
                            Pricing
                        </button>

                        <NavLink to="/contact" className={linkClass}>
                            Contact
                        </NavLink>

                        {/* PRIMARY CTA */}
                        <button
                            onClick={() => { setOpen(false); navigate("/free-review"); }}
                            className="ml-2 px-4 py-2 rounded-xl text-sm text-white bg-white/20 hover:bg-white/30 transition"
                        >
                            Free Review
                        </button>

                        {authed && (
                            <>
                                <NavLink to="/admin" className={linkClass}>
                                    Admin
                                </NavLink>
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
                    className={`md:hidden transition-[max-height] duration-300 overflow-hidden border-x border-b border-white/10 rounded-b-2xl ${open ? "max-h-[30rem]" : "max-h-0"
                        }`}
                >
                    <div className="px-4 py-3 bg-black/20 backdrop-blur-md">
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => { setOpen(false); navigate("/free-review"); }}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-white bg-white/20 hover:bg-white/30 transition"
                                >
                                    Free Review
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => goTo("projects")}
                                    className="px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition w-full text-left"
                                >
                                    Work
                                </button>
                            </li>

                            <li>
                                <NavLink
                                    to="/services"
                                    className={linkClass}
                                    onClick={() => setOpen(false)}
                                >
                                    Services
                                </NavLink>
                            </li>

                            <li>
                                <button
                                    onClick={() => goTo("pricing")}
                                    className="px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition w-full text-left"
                                >
                                    Pricing
                                </button>
                            </li>

                            <li>
                                <NavLink
                                    to="/contact"
                                    className={linkClass}
                                    onClick={() => setOpen(false)}
                                >
                                    Contact
                                </NavLink>
                            </li>

                            {authed && (
                                <>
                                    <li>
                                        <NavLink
                                            to="/admin"
                                            className={linkClass}
                                            onClick={() => setOpen(false)}
                                        >
                                            Admin
                                        </NavLink>
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
                            <Link
                                to="/contact"
                                aria-label="Contact"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                                onClick={() => setOpen(false)}
                            >
                                <Mail size={18} />
                            </Link>

                            <a
                                href="https://github.com/michaelm602"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                                onClick={() => setOpen(false)}
                            >
                                <Github size={18} />
                            </a>

                            <a
                                href="https://www.facebook.com/profile.php?id=61577710374352"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                                onClick={() => setOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99h-2.3V12h2.3V9.8c0-2.27 1.35-3.53 3.42-3.53.99 0 2.03.18 2.03.18v2.23h-1.14c-1.13 0-1.48.7-1.48 1.42V12h2.52l-.4 2.88h-2.12v6.99A10 10 0 0 0 22 12z"/>
                                </svg>
                            </a>

                            <a
                                href="https://www.instagram.com/likwitdevs?igsh=Nml5czZlaDF0c3Jr"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                                onClick={() => setOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.756 0 8.348.014 7.069.072 5.28.157 3.669.668 2.43 1.907 1.192 3.145.681 4.756.596 6.545.014 9.348 0 9.756 0 12s.014 2.652.072 3.931c.085 1.789.596 3.4 1.835 4.638 1.238 1.239 2.849 1.75 4.638 1.835C8.348 23.986 8.756 24 12 24s3.652-.014 4.931-.072c1.789-.085 3.4-.596 4.638-1.835 1.239-1.238 1.75-2.849 1.835-4.638.058-1.279.072-1.687.072-3.931s-.014-2.652-.072-3.931c-.085-1.789-.596-3.4-1.835-4.638C20.331.668 18.72.157 16.931.072 15.652.014 15.244 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
