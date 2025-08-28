// src/sections/PricingSection.jsx
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

export default function PricingSection() {
    const tiers = [
        {
            name: "Starter Site",
            price: "$300",
            blurb: "Single-page landing built to look great on mobile.",
            features: [
                "About + Gallery + Contact",
                "Responsive (mobile-first)",
                "Fast load times",
                "Basic on-page SEO",
                "1–2 week turnaround",
                "2 revision rounds",
            ],
            cta: "Get Starter",
        },
        {
            name: "Business Site",
            price: "$600",
            blurb: "Multi-page site with SEO setup and clean navigation.",
            features: [
                "Home, About, Services, Gallery, Contact",
                "Responsive design",
                "On-page SEO setup",
                "Analytics installed",
                "2–3 week turnaround",
                "2 revision rounds",
            ],
            cta: "Start Business Site",
            highlight: true,
        },
        {
            name: "E-commerce / Booking",
            price: "$1,000+",
            blurb: "Sell products or take appointments with secure checkout.",
            features: [
                "Stripe/PayPal checkout or booking calendar",
                "Product/Service management",
                "Email notifications",
                "On-page SEO",
                "3–5 week timeline",
                "Admin walkthrough",
            ],
            cta: "Discuss Your Store",
        },
    ];

    const goContact = () => {
        const scroll = () =>
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (!location.hash.startsWith("#/")) location.hash = "#/";
        setTimeout(scroll, 0);
    };

    return (
        <section
            id="pricing"
            className="relative z-10 px-4 pt-12 pb-28 md:pt-16 md:pb-32 scroll-mt-32 md:scroll-mt-40"
        >
            <div className="mx-auto max-w-6xl">
                <Reveal once enter={0.1} exit={0} rootMargin="-8% 0px -80% 0px">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Packages & Pricing</h2>
                    <p className="text-white/80 mb-6">
                        Transparent “from” pricing. Exact quotes depend on scope and timeline.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((t, i) => {
                        const base = i * 90; // stagger base per card
                        return (
                            <div
                                key={t.name}
                                className={[
                                    "rounded-2xl border border-white/10 bg-black/10 backdrop-blur-md",
                                    "shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden p-6 text-white",
                                    t.highlight ? "ring-1 ring-white/20" : "",
                                ].join(" ")}
                            >
                                <Reveal y={8} delay={base}>
                                    <div className="text-sm uppercase tracking-wide text-white/70">{t.name}</div>
                                </Reveal>

                                <Reveal y={8} delay={base + 80}>
                                    <div className="mt-2 text-3xl font-bold">{t.price}</div>
                                </Reveal>

                                <Reveal y={8} delay={base + 120}>
                                    <p className="mt-2 text-white/80">{t.blurb}</p>
                                </Reveal>

                                <ul className="mt-4 space-y-2 text-white/80">
                                    {t.features.map((f, idx) => (
                                        <Reveal key={f} y={8} delay={base + 160 + idx * 40}>
                                            <li className="flex gap-2">
                                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                                                <span>{f}</span>
                                            </li>
                                        </Reveal>
                                    ))}
                                </ul>

                                <Reveal y={8} delay={base + 160 + t.features.length * 40 + 80}>
                                    <Link
                                        to={`/contact?plan=${encodeURIComponent(t.name)}`}
                                        className="btn mt-6 w-full">
                                        {t.cta}
                                    </Link>
                                </Reveal>

                                <Reveal y={8} delay={base + 160 + t.features.length * 40 + 140}>
                                    <p className="mt-3 text-xs text-white/60">
                                        *Pricing is “from” and may vary with scope. 50% deposit to start.
                                    </p>
                                </Reveal>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-black/10 backdrop-blur-md p-6 text-white/80">
                    <Reveal y={8}>
                        <h3 className="font-semibold text-white mb-2">Popular add-ons</h3>
                    </Reveal>
                    <div className="flex flex-wrap gap-2">
                        {["Logo refresh", "Copywriting", "Speed/SEO tune-up", "Maintenance plan"].map((a, j) => (
                            <Reveal key={a} y={8} delay={j * 60}>
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm">
                                    {a}
                                </span>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
