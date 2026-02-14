// src/sections/PricingSection.jsx
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

export default function PricingSection() {
    const tiers = [
        {
            name: "Starter Site",
            price: "$300",
            blurb: "Single-page landing built to convert on mobile.",
            features: [
                "Hero + Services + Gallery + Contact",
                "Mobile-first responsive layout",
                "Fast load times",
                "Basic on-page SEO (titles/meta/headings)",
                "1–2 week turnaround",
                "2 revision rounds",
            ],
            cta: "Get Starter",
        },
        {
            name: "Business Site",
            price: "$600",
            blurb: "Multi-page site with clean navigation + SEO foundation.",
            features: [
                "Home, About, Services, Gallery, Contact",
                "Mobile-first responsive design",
                "On-page SEO setup + sitemap/robots",
                "Analytics installed",
                "2–3 week turnaround",
                "2 revision rounds",
            ],
            cta: "Start Business Site",
            highlight: true,
            badge: "Most Popular",
        },
        {
            name: "E-commerce / Booking",
            price: "$1,000+",
            blurb: "Sell products or take appointments with secure setup.",
            features: [
                "Stripe/PayPal checkout OR booking calendar",
                "Product/service management",
                "Email notifications",
                "On-page SEO",
                "3–5 week timeline",
                "Admin walkthrough",
            ],
            cta: "Discuss Your Store",
        },
    ];

    const maintenance = [
        {
            name: "Care Plan",
            price: "$49/mo",
            items: ["Hosting + uptime monitoring", "Small content edits", "Basic security updates"],
        },
        {
            name: "Growth Plan",
            price: "$99/mo",
            items: ["Everything in Care", "Monthly performance/SEO tune-up", "Priority support"],
            highlight: true,
        },
        {
            name: "Scale Plan",
            price: "$149/mo",
            items: ["Everything in Growth", "Monthly landing page/test", "Analytics summary report"],
        },
    ];

    return (
        <section
            id="pricing"
            className="relative z-10 px-4 pt-12 pb-16 md:pt-16 md:pb-20 pb-safe scroll-mt-32 md:scroll-mt-40"
        >
            <div className="mx-auto max-w-6xl">
                <Reveal once enter={0.1} exit={0} rootMargin="-8% 0px -80% 0px">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Packages & Pricing
                    </h2>
                    <p className="text-white/80 mb-6">
                        Transparent “from” pricing. Exact quotes depend on scope and timeline.
                    </p>
                </Reveal>

                {/* Build Packages */}
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
                                {t.badge && (
                                    <div className="mb-3 inline-flex items-center rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs text-white/90">
                                        {t.badge}
                                    </div>
                                )}

                                <Reveal y={8} delay={base}>
                                    <div className="text-sm uppercase tracking-wide text-white/70">
                                        {t.name}
                                    </div>
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
                                        className="btn mt-6 w-full"
                                    >
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

                {/* Maintenance (Recurring Revenue) */}
                <div className="mt-10">
                    <Reveal y={8}>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                            Optional Maintenance Plans (monthly)
                        </h3>
                    </Reveal>
                    <Reveal y={8} delay={60}>
                        <p className="text-white/75 mb-6">
                            For businesses that want updates handled without chasing a developer.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {maintenance.map((m, i) => (
                            <div
                                key={m.name}
                                className={[
                                    "rounded-2xl border border-white/10 bg-black/10 backdrop-blur-md p-6 text-white",
                                    m.highlight ? "ring-1 ring-white/20" : "",
                                ].join(" ")}
                            >
                                <div className="text-sm uppercase tracking-wide text-white/70">
                                    {m.name}
                                </div>
                                <div className="mt-2 text-3xl font-bold">{m.price}</div>

                                <ul className="mt-4 space-y-2 text-white/80">
                                    {m.items.map((it) => (
                                        <li key={it} className="flex gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                                            <span>{it}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to={`/contact?plan=${encodeURIComponent(m.name)}`}
                                    className="btn mt-6 w-full"
                                >
                                    Choose {m.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add-ons */}
                <div className="mt-10 rounded-2xl border border-white/10 bg-black/10 backdrop-blur-md p-6 text-white/80">
                    <Reveal y={8}>
                        <h3 className="font-semibold text-white mb-2">Popular add-ons</h3>
                    </Reveal>
                    <div className="flex flex-wrap gap-2">
                        {["Logo refresh", "Copywriting", "Speed/SEO tune-up", "Maintenance plan"].map(
                            (a, j) => (
                                <Reveal key={a} y={8} delay={j * 60}>
                                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm">
                                        {a}
                                    </span>
                                </Reveal>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
