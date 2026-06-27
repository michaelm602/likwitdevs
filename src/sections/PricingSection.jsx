// src/sections/PricingSection.jsx
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { MotionCard } from "../components/PremiumMotion";

export default function PricingSection() {
    const tiers = [
        {
            name: "Starter",
            price: "$800",
            blurb: "A simple, fast, credible online presence for solo service providers.",
            features: [
                "Hero + Services + Gallery + Contact",
                "Mobile-first responsive layout",
                "On-page SEO titles, meta, headings, and schema",
                "Fast load times",
                "1-2 week turnaround",
                "2 revision rounds",
            ],
            cta: "Get Starter",
        },
        {
            name: "Core",
            price: "$1,500",
            blurb: "Your complete business website, built to rank locally and convert visitors.",
            features: [
                "Home, About, Services, Gallery, Contact",
                "Mobile-first responsive design",
                "On-page SEO + sitemap/robots setup",
                "Google Search Console setup",
                "Analytics installed",
                "2-3 week turnaround",
                "2 revision rounds",
                "30-day post-launch support",
            ],
            cta: "Start Core Build",
            highlight: true,
            badge: "Most Popular",
        },
        {
            name: "Premium",
            price: "$2,500+",
            blurb: "A website plus booking, intake, and customer communication workflows.",
            features: [
                "Everything in Core",
                "Booking or scheduling integration",
                "Service/package selection + pricing display",
                "Customer intake capture",
                "Email notifications and confirmations",
                "Admin access to bookings/submissions",
                "3-4 week turnaround",
                "Admin walkthrough on delivery",
            ],
            cta: "Discuss Premium",
        },
        {
            name: "Custom Systems",
            price: "$4,000+",
            blurb: "Custom software, dashboards, AI tools, and workflows quoted by scope.",
            features: [
                "Multi-step intake systems",
                "Admin dashboards and portals",
                "AI-assisted tools or web applications",
                "Internal operations software",
                "Integrations where practical",
                "Scoped planning before build",
                "Quoted per project",
            ],
            cta: "Scope a Custom System",
        },
    ];

    const maintenance = [
        {
            name: "Care",
            price: "$79/mo",
            items: ["Hosting + uptime monitoring", "Small content edits", "Basic security updates"],
        },
        {
            name: "Growth",
            price: "$149/mo",
            items: ["Everything in Care", "Monthly performance/SEO tune-up", "Priority support"],
            highlight: true,
        },
        {
            name: "Partner",
            price: "$299/mo",
            items: ["Everything in Growth", "Monthly landing page or feature", "Analytics review"],
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
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
                    {tiers.map((t, i) => {
                        const base = i * 90; // stagger base per card
                        return (
                            <MotionCard
                                as="article"
                                key={t.name}
                                delay={i * 0.07}
                                lift={t.highlight ? 5 : 3}
                                className={[
                                    "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-black/25 p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-md transition-colors md:p-6",
                                    t.highlight
                                        ? "border-white/25 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(0,0,0,0.36))] ring-1 ring-white/10 shadow-[0_22px_65px_rgba(0,0,0,0.42),0_0_28px_rgba(255,255,255,0.035)]"
                                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]",
                                ].join(" ")}
                            >
                                {t.highlight && (
                                    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/75 to-transparent" />
                                )}
                                <Reveal y={8} delay={base}>
                                    <div className="flex min-h-7 items-start justify-between gap-3">
                                        <div className="text-sm uppercase tracking-wide text-white/70">
                                            {t.name}
                                        </div>
                                        {t.badge && (
                                            <div className="shrink-0 rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-1 text-[11px] font-semibold leading-none text-white/85">
                                                {t.badge}
                                            </div>
                                        )}
                                    </div>
                                </Reveal>

                                <Reveal y={8} delay={base + 80}>
                                    <div className="mt-1 text-3xl font-bold">{t.price}</div>
                                </Reveal>

                                <Reveal y={8} delay={base + 120}>
                                    <p className="mt-2 text-sm leading-6 text-white/80">{t.blurb}</p>
                                </Reveal>

                                <ul className="mt-4 grid gap-x-5 gap-y-1.5 text-sm leading-6 text-white/80 lg:grid-cols-2">
                                    {t.features.map((f, idx) => (
                                        <Reveal key={f} y={8} delay={base + 160 + idx * 40}>
                                            <li className="flex gap-2">
                                                <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${t.highlight ? "bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.35)]" : "bg-white/60"}`} />
                                                <span>{f}</span>
                                            </li>
                                        </Reveal>
                                    ))}
                                </ul>

                                <div className="mt-auto pt-5">
                                    <Reveal y={8} delay={base + 160 + t.features.length * 40 + 80}>
                                        <Link
                                            to={`/contact?plan=${encodeURIComponent(t.name)}`}
                                            className="premium-cta w-full"
                                        >
                                            {t.cta}
                                        </Link>
                                    </Reveal>

                                    <Reveal y={8} delay={base + 160 + t.features.length * 40 + 140}>
                                        <p className="mt-2 text-xs leading-5 text-white/60">
                                            *Pricing is “from” and may vary with scope. 50% deposit to start.
                                        </p>
                                    </Reveal>
                                </div>
                            </MotionCard>
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
                        {maintenance.map((m, index) => (
                            <MotionCard
                                as="article"
                                key={m.name}
                                delay={index * 0.06}
                                lift={3}
                                className={[
                                    "rounded-2xl border bg-black/20 p-6 text-white backdrop-blur-md transition-colors",
                                    m.highlight ? "border-white/20 ring-1 ring-white/10" : "border-white/10 hover:border-white/20",
                                ].join(" ")}
                            >
                                <div className="text-sm uppercase tracking-wide text-white/70">
                                    {m.name}
                                </div>
                                <div className="mt-2 text-3xl font-bold">{m.price}</div>

                                <ul className="mt-4 space-y-1.5 text-sm leading-6 text-white/80">
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
                            </MotionCard>
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
