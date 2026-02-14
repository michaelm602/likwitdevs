import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Typewriter from "../components/Typewriter";
import ParticlesBackground from "../components/ParticlesBackground";
import ProjectsSection from "../sections/ProjectsSection";
import AboutSection from "../sections/AboutSection";
import PricingSection from "../sections/PricingSection";

export default function Home() {
    const navigate = useNavigate();
    const [auditUrl, setAuditUrl] = useState("");
    const [auditBiz, setAuditBiz] = useState("");

    return (
        <>
            {/* HERO */}
            <section className="relative overflow-hidden hero-stable">
                {/* Background / particles */}
                <ParticlesBackground className="pointer-events-none absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent" />

                {/* Content */}
                <div className="mx-auto max-w-6xl px-4">
                    <div className="relative py-14 md:py-24">
                        {/* Headline = outcome, not tech */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                            Websites that turn visitors into paying clients.
                        </h1>

                        {/* Subtext = business value, still using your Typewriter */}
                        <p className="mt-3 text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl">
                            <Typewriter
                                texts={[
                                    "Fast load times that keep customers from bouncing.",
                                    "Mobile-first design that looks legit on every phone.",
                                    "SEO-ready structure so Google can actually find you.",
                                    "Clear calls-to-action that drive calls, bookings, and leads.",
                                ]}
                                speed={70}
                                pause={1600}
                            />
                        </p>

                        {/* CTAs */}
                        <div className="mt-5 flex flex-wrap gap-3">
                            {/* Primary CTA: Lead magnet */}
                            <a
                                href="#audit"
                                className="btn-subtle text-white bg-white/15 hover:bg-white/20 backdrop-blur-md"
                            >
                                Get a Free Website Audit
                            </a>

                            {/* Secondary CTA: proof */}
                            <a
                                href="#projects"
                                className="btn-subtle text-white bg-black/10 hover:bg-black/20 backdrop-blur-md"
                            >
                                View Work
                            </a>

                            {/* Optional: direct contact route */}
                            <Link
                                to="/contact"
                                className="btn-subtle text-white/90 bg-black/10 hover:bg-black/20 backdrop-blur-md"
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Trust/benefit chips */}
                        <div className="mt-5 flex flex-wrap gap-2 text-sm text-white/80">
                            <span className="px-3 py-1 rounded-lg bg-white/10">Nationwide / Remote</span>
                            <span className="px-3 py-1 rounded-lg bg-white/10">Fast Loads</span>
                            <span className="px-3 py-1 rounded-lg bg-white/10">SEO Structure</span>
                            <span className="px-3 py-1 rounded-lg bg-white/10">Mobile-First</span>
                            <span className="px-3 py-1 rounded-lg bg-white/10">Conversion Focused</span>
                        </div>

                        {/* Quick “productized” strip */}
                        <div className="mt-8 grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                                <div className="text-white font-semibold">Speed + Trust</div>
                                <p className="text-white/75 text-sm mt-1">
                                    Your site loads fast, looks clean, and doesn’t feel sketchy. Customers stay.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                                <div className="text-white font-semibold">SEO Foundation</div>
                                <p className="text-white/75 text-sm mt-1">
                                    Proper structure + metadata so you can rank without praying to the Google gods.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                                <div className="text-white font-semibold">Leads Built-In</div>
                                <p className="text-white/75 text-sm mt-1">
                                    CTAs, contact flow, and layout designed to push visitors into action.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LEAD MAGNET: FREE AUDIT */}
            <section id="audit" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-10">
                    <div className="md:flex md:items-start md:justify-between gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                Free Website Audit (No fluff, just fixes)
                            </h2>
                            <p className="mt-2 text-white/80">
                                Send your website link and I’ll reply with a quick breakdown of what’s hurting your
                                conversions: speed, mobile layout, SEO basics, and your call-to-action flow.
                            </p>

                            <ul className="mt-4 space-y-2 text-white/75 text-sm">
                                <li>✅ Speed + mobile issues (bounce-rate killers)</li>
                                <li>✅ SEO structure check (titles, descriptions, indexing basics)</li>
                                <li>✅ Conversion fixes (CTA placement, layout, trust signals)</li>
                                <li>✅ Clear next steps + rough estimate to fix it</li>
                            </ul>
                        </div>

                        {/* Minimal form for now: routes to Contact.
                Later we can wire EmailJS/Firebase function right here. */}
                        <div className="mt-6 md:mt-0 w-full md:max-w-sm">
                            <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
                                <label className="block text-sm text-white/80">Website URL</label>
                                <input
                                    type="url"
                                    value={auditUrl}
                                    onChange={(e) => setAuditUrl(e.target.value)}
                                    placeholder="https://yourbusiness.com"
                                    className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-white/30"
                                />

                                <label className="block text-sm text-white/80 mt-4">Business type</label>
                                <input
                                    type="text"
                                    value={auditBiz}
                                    onChange={(e) => setAuditBiz(e.target.value)}
                                    placeholder="Contractor, barber, cleaning, etc."
                                    className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-white/30"
                                />

                                <div className="mt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const qs = new URLSearchParams();
                                            qs.set("intent", "audit");
                                            if (auditUrl.trim()) qs.set("website", auditUrl.trim());
                                            if (auditBiz.trim()) qs.set("business", auditBiz.trim());
                                            navigate(`/contact?${qs.toString()}`);
                                        }}
                                        className="w-full text-center rounded-xl px-4 py-2 bg-white/15 hover:bg-white/20 text-white"
                                    >
                                        Submit via Contact
                                    </button>

                                    <a
                                        href="#projects"
                                        className="w-full text-center rounded-xl px-4 py-2 bg-black/20 hover:bg-black/30 text-white/90"
                                    >
                                        See Work
                                    </a>
                                </div>




                                <p className="mt-3 text-xs text-white/50">
                                    No spam. No pressure. Just a real audit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROJECTS */}
            {/* IMPORTANT: ensure you have an element with id="projects".
          If ProjectsSection doesn’t include it internally, keep this wrapper. */}
            <div id="projects">
                <ProjectsSection />
            </div>

            <AboutSection />
            <PricingSection />
        </>
    );
}
