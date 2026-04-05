import { Link } from "react-router-dom";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import Typewriter from "../components/Typewriter";
import ProjectsSection from "../sections/ProjectsSection";
import AboutSection from "../sections/AboutSection";
import PricingSection from "../sections/PricingSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import useSEO from "../hooks/useSEO";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Home() {
  useSEO({
    title: "Your Website Is Losing You Customers",
    description:
      "Most small business websites drive people away without the owner ever knowing. We fix that -- and turn your site into something that actually rings your phone.",
    canonical: "https://www.likwitdevs.com/",
  });
    const [reviewName, setReviewName] = useState("");
    const [reviewEmail, setReviewEmail] = useState("");
    const [reviewUrl, setReviewUrl] = useState("");
    const [reviewBiz, setReviewBiz] = useState("");
    const [reviewStatus, setReviewStatus] = useState({ sending: false, ok: null });

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
                            Your Website Isn't Getting You Calls... And It's Costing You Jobs
                        </h1>

                        {/* Subheadline -- static so visitors and crawlers read it instantly */}
                        <p className="mt-3 text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl">
                            I build conversion-focused websites for Portland service businesses that turn visitors into real calls, quote requests, and booked work.
                        </p>
                        <p className="mt-3 text-sm sm:text-base text-white/65 max-w-2xl">
                            Every day your site underperforms, people click, hesitate, and hire someone else.
                        </p>

                        {/* Typewriter -- decorative secondary line */}
                        <p className="mt-2 text-sm sm:text-base text-white/55 h-6">
                            <Typewriter
                                texts={[
                                    "Turn clicks into calls.",
                                    "Turn traffic into paying clients.",
                                    "Get found locally. Get hired faster.",
                                    "More leads. Better clients.",
                                    "Websites that actually bring in business.",
                                ]}
                                speed={70}
                                pause={2200}
                            />
                        </p>

                        {/* CTAs */}
                        <div className="mt-6">
                            <a
                                href="#audit"
                                className="inline-block rounded-xl px-6 py-3 bg-white text-black font-semibold text-sm sm:text-base hover:bg-neutral-100 transition-colors shadow-lg"
                            >
                                Find Out What Your Website Is Costing You →
                            </a>
                            <div className="mt-3 flex gap-2 text-sm text-white/60">
                                <a href="#projects" className="hover:text-white/90 transition">View Work</a>
                                <span>·</span>
                                <Link to="/contact" className="hover:text-white/90 transition">Contact</Link>
                                <span>·</span>
                                <Link to="/web-design-portland" className="hover:text-white/90 transition">Portland Web Design</Link>
                            </div>
                            {/* Trust signal */}
                            <p className="mt-3 text-xs text-white/50">
                                5.0 ★ Google Rating · Portland-based · Work directly with me · Launch in 1-3 weeks
                            </p>
                        </div>

                        {/* Quick outcome strip */}
                        <div className="mt-8 grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                                <div className="text-white font-semibold">Get Found in Portland</div>
                                <p className="text-white/75 text-sm mt-1">
                                    Show up when locals search for what you do -- built-in SEO from day one.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                                <div className="text-white font-semibold">Look Like the Pro You Are</div>
                                <p className="text-white/75 text-sm mt-1">
                                    Clean, fast design that builds trust before you even answer the phone.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                                <div className="text-white font-semibold">Turn Visitors Into Calls</div>
                                <p className="text-white/75 text-sm mt-1">
                                    Every page built to push people toward booking -- not just browsing.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHO WE BUILD FOR */}
            <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Who This Is For</h2>
                <p className="text-white/60 text-sm mb-6">If your website looks fine but isn't bringing in calls, quote requests, or booked work, this is for you.</p>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

                    {[
                        {
                            title: "Contractors",
                            desc: "For contractors losing calls because their site isn't building trust fast enough or making it easy to request a quote.",
                            to: "/web-design-for-contractors",
                        },
                        {
                            title: "Painters",
                            desc: "For painters whose work sells in person, but their website isn't doing enough to bring in estimate requests.",
                            to: "/web-design-for-painters",
                        },
                        {
                            title: "Tattoo Artists",
                            desc: "For artists relying on Instagram DMs while serious clients are searching Google and booking somewhere else.",
                            to: "/website-design-for-tattoo-artists",
                        },
                        {
                            title: "Salons",
                            desc: "For salon owners missing bookings because their site feels outdated, unclear, or harder to trust than the competition.",
                            to: "/web-design-for-salons",
                        },
                        {
                            title: "Restaurants",
                            desc: "For restaurants losing hungry customers because their site is slow on mobile, hard to use, or missing the basics people need fast.",
                            to: "/web-design-for-restaurants",
                        },
                    ].map((niche) => (
                        <Link
                            key={niche.title}
                            to={niche.to}
                            className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur hover:bg-white/10 transition-colors group"
                        >
                            <div className="text-white font-semibold group-hover:underline">{niche.title}</div>
                            <p className="text-white/65 text-sm mt-1 leading-snug">{niche.desc}</p>
                        </Link>
                    ))}
                </div>
                <p className="mt-5 text-white/45 text-sm">
                    See our full{" "}
                    <Link to="/web-design-portland" className="text-white/60 underline underline-offset-2 hover:text-white/90 transition">
                        Portland web design services
                    </Link>{" "}
                    -- process, pricing, and what sets us apart from agencies.
                </p>
            </section>

            {/* PROJECTS */}
            <div id="projects">
                <ProjectsSection />
            </div>

            {/* TESTIMONIALS */}
            <TestimonialsSection />

            {/* LEAD MAGNET: FREE REVIEW */}
            <section id="audit" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
                <div className="rounded-3xl border border-white/15 bg-black/20 backdrop-blur-md p-6 md:p-10">
                    <div className="md:flex md:items-start md:justify-between gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                Free Website Review (No fluff, just fixes)
                            </h2>
                            <p className="mt-2 text-white/80">
                                Share your site and I'll send back a direct breakdown of what's costing you customers -- covering speed, mobile experience, SEO structure, and how well your site moves visitors to act.
                            </p>

                            <ul className="mt-4 space-y-2 text-white/75 text-sm">
                                <li>✅ Speed + mobile performance (the first thing visitors judge)</li>
                                <li>✅ SEO structure (titles, descriptions, crawlability)</li>
                                <li>✅ Conversion review (CTA placement, layout, trust signals)</li>
                                <li>✅ Clear next steps with an honest cost estimate</li>
                            </ul>
                        </div>

                        <div className="mt-6 md:mt-0 w-full md:max-w-sm">
                            {reviewStatus.ok === true ? (
                                <div className="rounded-2xl bg-black/20 border border-white/10 p-6 text-center">
                                    <div className="text-2xl mb-2">✅</div>
                                    <p className="text-white font-semibold">Got it -- I'll be in touch.</p>
                                    <p className="text-white/60 text-sm mt-1">Expect a real breakdown within 1 business day.</p>
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
                                    <label htmlFor="audit-name" className="block text-sm text-white/80">Your Name <span className="text-white/40">(required)</span></label>
                                    <input
                                        id="audit-name"
                                        type="text"
                                        value={reviewName}
                                        onChange={(e) => setReviewName(e.target.value)}
                                        placeholder="Jane Smith"
                                        className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-white/30"
                                    />

                                    <label htmlFor="audit-email" className="block text-sm text-white/80 mt-4">Email <span className="text-white/40">(required)</span></label>
                                    <input
                                        id="audit-email"
                                        type="email"
                                        value={reviewEmail}
                                        onChange={(e) => setReviewEmail(e.target.value)}
                                        placeholder="you@yourbusiness.com"
                                        className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-white/30"
                                    />

                                    <label htmlFor="audit-url" className="block text-sm text-white/80 mt-4">Website URL <span className="text-white/40">(optional)</span></label>
                                    <input
                                        id="audit-url"
                                        type="url"
                                        value={reviewUrl}
                                        onChange={(e) => setReviewUrl(e.target.value)}
                                        placeholder="https://yourbusiness.com"
                                        className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-white/30"
                                    />

                                    <label htmlFor="audit-biz" className="block text-sm text-white/80 mt-4">Your Industry <span className="text-white/40">(optional)</span></label>
                                    <input
                                        id="audit-biz"
                                        type="text"
                                        value={reviewBiz}
                                        onChange={(e) => setReviewBiz(e.target.value)}
                                        placeholder="e.g. Contractor, tattoo artist, salon"
                                        className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-white/30"
                                    />

                                    {reviewStatus.ok === false && (
                                        <p className="mt-3 text-sm text-red-400">Something went wrong -- try emailing me directly at likwitdevs@gmail.com</p>
                                    )}

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            disabled={reviewStatus.sending}
                                            onClick={async () => {
                                                if (!reviewName.trim() || !reviewEmail.trim()) return;
                                                setReviewStatus({ sending: true, ok: null });
                                                try {
                                                    await emailjs.send(
                                                        SERVICE_ID,
                                                        TEMPLATE_ID,
                                                        {
                                                            from_name: reviewName.trim(),
                                                            from_email: reviewEmail.trim(),
                                                            reply_to: reviewEmail.trim(),
                                                            website: reviewUrl.trim() || "Not provided",
                                                            business: reviewBiz.trim() || "Not provided",
                                                            intent: "review",
                                                            source: "home-review-form",
                                                            message: `Free website review request.\n\nWebsite: ${reviewUrl.trim() || "Not provided"}\nIndustry: ${reviewBiz.trim() || "Not provided"}`,
                                                        },
                                                        { publicKey: PUBLIC_KEY }
                                                    );
                                                    setReviewStatus({ sending: false, ok: true });
                                                } catch {
                                                    setReviewStatus({ sending: false, ok: false });
                                                }
                                            }}
                                            className="w-full text-center rounded-xl px-4 py-2.5 bg-white text-black font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50"
                                        >
                                            {reviewStatus.sending ? "Sending..." : "Send Me My Free Review →"}
                                        </button>
                                    </div>

                                    <p className="mt-3 text-xs text-white/50">
                                        No spam. I'll reply within 1 business day with a real breakdown, not a template.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <PricingSection />
            <AboutSection />
        </>
    );
}


