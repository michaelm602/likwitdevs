import { Link } from "react-router-dom";
import { Mail, Instagram, Facebook, Github } from "lucide-react";
import Reveal from "./Reveal";

export default function Footer() {
    const year = new Date().getFullYear();

    function scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -80; // adjust if you want more/less offset
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    }

    return (
        <footer className="mt-10 border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 py-8 grid gap-8 md:grid-cols-3 text-white/90">
                {/* Brand */}
                <Reveal>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Likwit Devs</h3>
                        <p className="mt-2 text-sm text-white/70">
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
                            <button
                                onClick={() => scrollToSection("about")}
                                className="block text-left hover:text-white w-full"
                            >
                                About
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
                            {/*
                            <a href="https://instagram.com" target="_blank" rel="noreferrer"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                                <Instagram size={18} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                                <Facebook size={18} />
                            </a> */}
                            <a href="https://github.com/michaelm602" target="_blank" rel="noreferrer"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                                <Github size={18} />
                            </a>

                        </div>
                    </Reveal>
                </div>

            </div >

            <div className="border-t border-white/10 text-center text-xs text-white/60 py-4">
                © {year} Likwit Devs. All rights reserved.
            </div>
        </footer >
    );
}
