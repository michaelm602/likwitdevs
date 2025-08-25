import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook, Github } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-10 border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 py-8 grid gap-8 md:grid-cols-3 text-white/90">
                {/* Brand */}
                <div>
                    <h3 className="text-lg font-semibold text-white">Likwit Devs</h3>
                    <p className="mt-2 text-sm text-white/70">
                        Modern, responsive websites with clean UX and custom visuals.
                    </p>
                </div>

                {/* Links */}
                <nav className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-2">
                        <p className="text-white/60 font-medium">Pages</p>
                        <Link className="block hover:text-white" to="/">Home</Link>
                        <Link className="block hover:text-white" to="/contact">Contact</Link>
                        {/* <Link className="block hover:text-white" to="/gallery">Gallery</Link> */}
                        {/* add more links if you have pages */}
                    </div>
                    <div className="space-y-2">
                        <p className="text-white/60 font-medium">Services</p>
                        <span className="block text-white/70">Portfolio Sites</span>
                        <span className="block text-white/70">E-commerce</span>
                        <span className="block text-white/70">Brand Visuals</span>
                    </div>
                </nav>

                {/* Contact / Socials */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-white mb-2">Get in touch</h4>
                    <li className="flex items-center gap-2">
                        <Mail className="w-5 h-5 opacity-80" />
                        <Link to="/contact" className="hover:underline hover:text-white">
                            likwitdevs@gmail.com
                        </Link>
                    </li>

                    <div className="mt-2 flex items-center gap-3">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                            <Instagram size={18} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                            <Facebook size={18} />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                            <Github size={18} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 text-center text-xs text-white/60 py-4">
                © {year} Likwit Devs. All rights reserved.
            </div>
        </footer>
    );
}
