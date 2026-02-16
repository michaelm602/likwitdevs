import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Github } from "lucide-react";
import Reveal from "./Reveal";
import logoMark from "../assets/likwitdevs-logo-white.png";


export default function Footer() {
    const year = new Date().getFullYear();
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll to a section id, navigating home first if needed
    const goTo = (id) => {
        const scroll = () =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(scroll, 80);
        } else {
            scroll();
        }
    };

    return (
        <footer className="mt-10 border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:gap-8 md:grid-cols-3 items-start text-white/90">
                {/* Brand */}
                <Reveal>
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src={logoMark}
                                alt="Likwit Devs"
                                className="h-14 w-auto object-contain opacity-95"
                                draggable="false"
                            />
                            <div className="leading-tight">
                                <p className="text-[11px] tracking-[0.2em] text-white/50 uppercase">
                                    Websites • UI • SEO
                                </p>
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-white/70 max-w-[280px]">
                            Modern, responsive websites with clean UX and custom visuals.
                        </p>
                    </div>
                </Reveal>

                {/* Links */}
                <nav className="grid grid-cols-2 gap-2 text-sm">
                    <Reveal>
                        <div className="space-y-2">
                            <p className="text-white/60 font-medium">Pages</p>

                            <Link className="block hover:text-white" to="/">Home</Link>

                            {/* Keep links visually consistent: block, no padding */}
                            <button
                                onClick={() => goTo("about")}
                                className="block text-left w-full hover:text-white"
                            >
                                About
                            </button>

                            <button
                                onClick={() => goTo("pricing")}
                                className="block text-left w-full hover:text-white"
                            >
                                Pricing
                            </button>

                            <Link className="block hover:text-white" to="/contact">Contact</Link>
                        </div>
                    </Reveal>

                    <Reveal>
                        <div className="space-y-2">
                            <p className="text-white/60 font-medium">Services</p>
                            <span className="block text-white/70">Portfolio Sites</span>
                            <span className="block text-white/70">E-commerce</span>
                            <span className="block text-white/70">Brand Visuals</span>
                        </div>
                    </Reveal>
                </nav>

                {/* Contact / Socials */}
                <div className="space-y-3">
                    <Reveal>
                        <h4 className="font-semibold text-white mb-2">Get in touch</h4>
                        <li className="flex items-center gap-2">
                            <Mail className="w-5 h-5 opacity-80" />
                            <Link to="/contact" className="hover:underline hover:text-white">
                                likwitdevs@gmail.com
                            </Link>
                        </li>

                        <div className="mt-2 flex items-center gap-3">
                            <a
                                href="https://github.com/michaelm602"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                                <Github size={18} />
                            </a>
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="border-t border-white/10 text-center text-xs text-white/60 py-4">
                © {year} Likwit Devs. All rights reserved.
            </div>
        </footer>
    );
}
