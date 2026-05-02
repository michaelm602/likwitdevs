import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Github } from "lucide-react";
import Reveal from "./Reveal";
import logoMark from "../assets/likwitdevs-logo-white.png";
import PolicyNotice from "./PolicyNotice";


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
                            <Link className="block hover:text-white" to="/web-design-portland">Web Design Portland</Link>
                            <Link className="block hover:text-white" to="/web-design-for-salons">Salon Websites</Link>
                            <Link className="block hover:text-white" to="/web-design-for-restaurants">Restaurant Websites</Link>
                            <Link className="block hover:text-white" to="/web-design-for-home-services">Home Service Websites</Link>
                            <Link className="block hover:text-white" to="/web-design-for-contractors">Contractor Websites</Link>
                            <Link className="block hover:text-white" to="/web-design-for-painters">Painter Websites</Link>
                            <Link className="block hover:text-white" to="/small-business-website-design">Small Business Websites</Link>
                            <Link className="block hover:text-white" to="/web-design-for-tattoo-shops">Tattoo Shop Websites</Link>
                            <Link className="block hover:text-white" to="/website-design-for-tattoo-artists">Tattoo Artist Portfolios</Link>
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
                            <a
                                href="https://www.facebook.com/profile.php?id=61577710374352"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99h-2.3V12h2.3V9.8c0-2.27 1.35-3.53 3.42-3.53.99 0 2.03.18 2.03.18v2.23h-1.14c-1.13 0-1.48.7-1.48 1.42V12h2.52l-.4 2.88h-2.12v6.99A10 10 0 0 0 22 12z"/>
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/likwitdevs?igsh=Nml5czZlaDF0c3Jr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.756 0 8.348.014 7.069.072 5.28.157 3.669.668 2.43 1.907 1.192 3.145.681 4.756.596 6.545.014 9.348 0 9.756 0 12s.014 2.652.072 3.931c.085 1.789.596 3.4 1.835 4.638 1.238 1.239 2.849 1.75 4.638 1.835C8.348 23.986 8.756 24 12 24s3.652-.014 4.931-.072c1.789-.085 3.4-.596 4.638-1.835 1.239-1.238 1.75-2.849 1.835-4.638.058-1.279.072-1.687.072-3.931s-.014-2.652-.072-3.931c-.085-1.789-.596-3.4-1.835-4.638C20.331.668 18.72.157 16.931.072 15.652.014 15.244 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                                </svg>
                            </a>
                        </div>
                    </Reveal>
                </div>
            </div>

            <PolicyNotice compact />

            <div className="text-center text-xs text-white/60 py-4">
                © 2025 Likwit Devs. All rights reserved.
            </div>
        </footer>
    );
}
