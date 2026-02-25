import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Typewriter from "../components/Typewriter";
import ProjectsSection from "../sections/ProjectsSection";
import AboutSection from "../sections/AboutSection";
import PricingSection from "../sections/PricingSection";

export default function Home() {
    const navigate = useNavigate();
    const [reviewUrl, setReviewUrl] = useState("");
    const [reviewBiz, setReviewBiz] = useState("");

    return (
        <>
            {/* HERO */}
            <section className="relative overflow-hidden hero-stable">
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
                                    "Fast load times so customers don’t leave before you say hello.",
                                    "Built for mobile, where most of your traffic lives.",
                                    "Structured to show up when people search for what you do.",
                                    "Clear next steps so visitors actually take action.",
                                ]}
                                speed={70}
                                pause={1600}
                            />
                        </p>

                        {/* CTAs */}
                        <div className="mt-5">
                            <a
                                href="#audit"
                                className="btn-subtle text-white bg-white/15 hover:bg-white/20 backdrop-blur-md"
                            >
                                Get a Free Website Review
                            </a>
                            <div className="mt-3 flex gap-2 text-sm text-white/60">
                                <a href="#projects" className="hover:text-white/90 transition">View Work</a>
                                <span>·</span>
                                <Link to="/contact" className="hover:text-white/90 transition">Contact</Link>
                            </div>
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

            {/* LEAD MAGNET: FREE REVIEW */}
            <section id="audit" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-10">
                    <div className="md:flex md:items-start md:justify-between gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                Free Website Review (No fluff, just fixes)
                            </h2>
                            <p className="mt-2 text-white/80">
                                Share your site and I’ll send back a direct breakdown of what’s costing you customers — covering speed, mobile experience, SEO structure, and how well your site moves visitors to act.
                            </p>

                            <ul className="mt-4 space-y-2 text-white/75 text-sm">
                                <li>✅ Speed + mobile performance (the first thing visitors judge)</li>
                                <li>✅ SEO structure (titles, descriptions, crawlability)</li>
                                <li>✅ Conversion review (CTA placement, layout, trust signals)</li>
                                <li>✅ Clear next steps with an honest cost estimate</li>
                            </ul>
                        </div>

                        {/* Minimal form for now: routes to Contact.
                Later we can wire EmailJS/Firebase function right here. */}
                        <div className="mt-6 md:mt-0 w-full md:max-w-sm">
                            <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
                                <label htmlFor="audit-url" className="block text-sm text-white/80">Website URL</label>
                                <input
                                    id="audit-url"
                                    type="url"
                                    value={reviewUrl}
                                    onChange={(e) => setReviewUrl(e.target.value)}
                                    placeholder="https://yourbusiness.com"
                                    className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-white/30"
                                />

                                <label htmlFor="audit-biz" className="block text-sm text-white/80 mt-4">Your Industry</label>
                                <input
                                    id="audit-biz"
                                    type="text"
                                    value={reviewBiz}
                                    onChange={(e) => setReviewBiz(e.target.value)}
                                    placeholder="e.g. Contractor, restaurant, law firm"
                                    className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-white/30"
                                />

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const qs = new URLSearchParams();
                                            qs.set("intent", "review");
                                            if (reviewUrl.trim()) qs.set("website", reviewUrl.trim());
                                            if (reviewBiz.trim()) qs.set("business", reviewBiz.trim());
                                            navigate(`/contact?${qs.toString()}`);
                                        }}
                                        className="w-full text-center rounded-xl px-4 py-2 bg-white/15 hover:bg-white/20 text-white"
                                    >
                                        Get My Free Review
                                    </button>
                                </div>




                                <p className="mt-3 text-xs text-white/50">
                                    Every review is written personally — specific to your site, not a template.
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
