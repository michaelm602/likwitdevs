import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal";
import useSEO from "../../hooks/useSEO";
import ProjectsSection from "../../sections/ProjectsSection";

/* ─── DATA ────────────────────────────────────────────────────────────── */

const problems = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
        ),
        title: "Invisible on Google",
        desc: "If you're not on page one when someone searches 'contractor Portland' or 'tattoo shop near me,' you don't exist. Most Portland business websites are built without a single local SEO consideration.",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-6 3h.008v.008H6.75v-.008Z" />
            </svg>
        ),
        title: "Broken on Mobile",
        desc: "Over 65% of Portland searches happen on a phone. If your site loads slowly, squishes text, or buries your phone number — visitors leave in under 8 seconds and call your competitor instead.",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
        ),
        title: "No Clear Path to Contact",
        desc: "Nice photos and a wall of text don't get you hired. If a visitor can't figure out how to reach you in 5 seconds, they won't. Most websites are built to look good — not to convert.",
    },
];

const niches = [
    {
        label: "Contractors & Trades",
        desc: "Roofers, electricians, plumbers, HVAC, and general contractors who need quote requests and calls from homeowners — not website browsers.",
        to: "/web-design-for-home-services",
    },
    {
        label: "Painters",
        desc: "Before-and-after galleries, project areas, and quote forms that turn clicks into painting estimates.",
        to: "/web-design-for-home-services",
    },
    {
        label: "Tattoo Artists & Shops",
        desc: "Portfolio-forward sites that rank on Google and make it easy for clients to book — without relying on Instagram alone.",
        to: "/website-design-for-tattoo-artists",
    },
    {
        label: "Salons & Beauty",
        desc: "Hair stylists, nail techs, lash artists, and estheticians who want online bookings and a professional presence that matches their work.",
        to: "/web-design-for-salons",
    },
    {
        label: "Restaurants & Food",
        desc: "Menu, hours, location, and ordering — on a site that loads fast and shows up when locals search for dinner.",
        to: "/web-design-for-restaurants",
    },
    {
        label: "Service Businesses",
        desc: "Cleaners, photographers, movers, pet groomers — anyone who sells a service and needs a site that does the selling 24/7.",
        to: "/small-business-website-design",
    },
];

const process = [
    {
        step: "01",
        title: "Free Review",
        desc: "Send your current site (or describe what you need). I'll take a look and give you an honest breakdown of what's working and what's costing you customers — no charge.",
    },
    {
        step: "02",
        title: "Scope & Strategy",
        desc: "We nail down pages, goals, and timeline in one quick call. You'll know exactly what's being built, what it costs, and when it's done — before anything starts.",
    },
    {
        step: "03",
        title: "Design & Build",
        desc: "I build your site fast — no hand-off chains, no account managers, no delays waiting for approvals. You see progress in days, not weeks of silence.",
    },
    {
        step: "04",
        title: "Launch & Handoff",
        desc: "Your site goes live. You get a walkthrough, full ownership of your domain and files, and a site that's ready to rank from day one.",
    },
];

const included = [
    "Mobile-first responsive design — sharp on every screen",
    "Fast load times — Core Web Vitals optimized from day one",
    "Local SEO setup: page titles, meta descriptions, schema markup",
    "Google Business Profile-ready structure",
    "Clear CTAs and contact forms placed where buyers look",
    "Google Analytics setup included",
    "Sitemap and robots.txt so Google can crawl your site",
    "2 rounds of revisions before launch",
    "You own everything — domain, content, no lock-in",
];

const testimonials = [
    {
        name: "Elysia Hernandez",
        biz: "Elegance By Elysia",
        quote: "Great experience working with LikWitDevs on my website. Fast communication, clean design, and they delivered exactly what I needed. Highly recommend for anyone looking for reliable web development.",
    },
    {
        name: "Katrina Garcia",
        biz: "Blessed N Polished",
        quote: "I'm so happy with the website they created for my nail business! From the beginning they listened to what I wanted and made the whole process easy and stress-free. The design is beautiful, professional, and exactly what I envisioned.",
    },
];

const faqs = [
    {
        q: "How much does a website cost in Portland?",
        a: "A single-page landing site starts at $300. A multi-page business site is $600. E-commerce or booking systems start at $1,000. All packages include mobile-first design, on-page SEO, and 2 revision rounds. You'll get an exact quote after your free review — no surprises.",
    },
    {
        q: "Do you build websites for contractors and service businesses?",
        a: "Yes — that's the core of what we do. Contractors, painters, trades, salons, tattoo shops, restaurants. Sites built specifically to get calls and bookings from local customers in Portland and surrounding areas like Beaverton, Hillsboro, Gresham, and Lake Oswego.",
    },
    {
        q: "How long does it take to build a website?",
        a: "A Starter Site takes 1–2 weeks. A Business Site takes 2–3 weeks. E-commerce and booking sites take 3–5 weeks. I work fast and communicate throughout — you won't spend months waiting.",
    },
    {
        q: "What makes Likwit Devs different from a big Portland web agency?",
        a: "You work directly with me — not an account manager who passes your project to someone overseas. I specialize in local service businesses, not SaaS or corporate sites. Pricing is transparent, timelines are real, and I build sites to get you calls — not to win design awards.",
    },
    {
        q: "Do you do SEO for Portland businesses?",
        a: "Every site we build has on-page SEO built in from the start — proper titles, descriptions, heading structure, schema markup, and local signals. For ongoing SEO campaigns and rank tracking, ask about our Growth Plan ($99/mo).",
    },
    {
        q: "Do I need to have my own domain and hosting?",
        a: "No — we can handle domain registration and hosting as part of our Care Plan ($49/mo), or you can host independently if you prefer. You own everything either way.",
    },
];

const relatedLinks = [
    { to: "/web-design-for-home-services", label: "Contractors & Home Services" },
    { to: "/website-design-for-tattoo-artists", label: "Tattoo Artists" },
    { to: "/web-design-for-salons", label: "Salons & Beauty" },
    { to: "/web-design-for-restaurants", label: "Restaurants" },
    { to: "/small-business-website-design", label: "Small Business" },
];

/* ─── COMPONENT ───────────────────────────────────────────────────────── */

export default function WebDesignPortland() {
    useSEO({
        title: "Your Website Is Losing You Customers (Portland)",
        description:
            "Most Portland business websites look fine—but quietly lose customers every day. If your competitors are getting the calls, this is why.",
        canonical: "https://www.likwitdevs.com/web-design-portland",
    });

    return (
        <div className="min-h-screen bg-transparent px-4 pt-28 pb-20">
            <div className="mx-auto max-w-6xl space-y-16">

                {/* ── HERO ──────────────────────────────────────────── */}
                <section>
                    <Reveal once>
                        <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
                            Portland, OR · Web Design & Development
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
                            Your Portland Website Isn't Getting Calls — Here's Why
                        </h1>
                        <p className="mt-4 text-lg text-white/80 max-w-2xl leading-relaxed">
                            If your website isn't bringing in leads, it's not doing its job. We fix what's broken and turn it into something that actually gets you customers.
                        </p>
                        <p className="mt-3 text-white/60 max-w-2xl">
                            Not a template shop. Not outsourced overseas. One Portland developer — hands-on from first call to launch.
                        </p>
                    </Reveal>

                    <Reveal once delay={100}>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link to="/free-review" className="inline-block rounded-xl px-6 py-3 bg-white text-black font-semibold text-sm hover:bg-neutral-100 transition-colors shadow-lg">
                                Find Out What Your Website Is Costing You →
                            </Link>
                            <a href="#projects" className="inline-block rounded-xl px-6 py-3 bg-white/10 border border-white/15 text-white text-sm font-medium hover:bg-white/15 transition-colors backdrop-blur">
                                View Our Work
                            </a>
                        </div>
                        <p className="mt-4 text-xs text-white/45">
                            Portland-based · Real client work · Built to get you calls
                        </p>
                    </Reveal>
                </section>

                {/* ── THE PROBLEM ───────────────────────────────────── */}
                <section>
                    <Reveal once>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Most Portland Business Websites Don't Get You Customers
                        </h2>
                        <p className="text-white/70 max-w-2xl mb-8">
                            Every week your website sits there, someone else gets the call you should've had. Here's what's usually going wrong.
                        </p>
                    </Reveal>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {problems.map((p, i) => (
                            <Reveal key={p.title} once y={16} delay={i * 80}>
                                <div className="h-full rounded-2xl bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md border border-white/10 shadow-lg p-5 text-white">
                                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3 text-white/80">
                                        {p.icon}
                                    </div>
                                    <p className="font-semibold mb-1">{p.title}</p>
                                    <p className="text-white/70 text-sm leading-relaxed">{p.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── WHAT THIS MEANS ──────────────────────────────── */}
                <section>
                    <Reveal once>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            What This Actually Means for Your Business
                        </h2>
                        <p className="text-white/70 max-w-2xl mb-8">
                            A website problem usually doesn't look dramatic. It just shows up as fewer calls, fewer quote requests, and competitors getting picked before you even know someone was searching.
                        </p>
                    </Reveal>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: "Lost Calls", desc: "People are landing on your site, hesitating, and leaving without reaching out." },
                            { title: "Missed Local Searches", desc: "If you're not showing up when someone searches in Portland, you're not even in the running." },
                            { title: "Weaker First Impressions", desc: "A slow, outdated, or confusing site makes people trust the next business instead." },
                            { title: "Revenue Leaks", desc: "Most bad websites don't fail loudly—they just quietly cost you work every week." },
                        ].map((c, i) => (
                            <Reveal key={c.title} once y={16} delay={i * 80}>
                                <div className="h-full rounded-2xl bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md border border-white/10 shadow-lg p-5 text-white">
                                    <p className="font-semibold mb-1">{c.title}</p>
                                    <p className="text-white/70 text-sm leading-relaxed">{c.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── WHO THIS IS FOR ───────────────────────────────── */}
                <section>
                    <Reveal once>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Who We Build For
                        </h2>
                        <p className="text-white/70 max-w-2xl mb-8">
                            We work with Portland-area service businesses that are serious about getting more customers. Not lifestyle brands. Not startups. Real local businesses that need their phone ringing.
                        </p>
                    </Reveal>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {niches.map((n, i) => (
                            <Reveal key={n.label} once y={16} delay={i * 60}>
                                <Link
                                    to={n.to}
                                    className="block h-full rounded-2xl bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md border border-white/10 shadow-lg p-5 text-white hover:bg-white/5 transition-colors group"
                                >
                                    <p className="font-semibold mb-1 group-hover:underline">{n.label}</p>
                                    <p className="text-white/70 text-sm leading-relaxed">{n.desc}</p>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── OUR SOLUTION ──────────────────────────────────── */}
                <section>
                    <Reveal once>
                        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
                            <div className="md:grid md:grid-cols-2 md:gap-10 md:items-start">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                                        Web Design Portland That Actually Works
                                    </h2>
                                    <p className="text-white/75 leading-relaxed mb-4">
                                        Big agencies charge $5,000–$15,000 and take six months. DIY builders look like DIY builders. There's a better option: a Portland web developer who specializes in exactly your type of business, works fast, and keeps prices transparent.
                                    </p>
                                    <p className="text-white/75 leading-relaxed">
                                        Every site we build is custom — no Squarespace, no Wix, no drag-and-drop templates. Fast load times, local SEO from the start, and a layout that pushes visitors toward calling or booking — not scrolling and bouncing.
                                    </p>
                                    <Link to="/free-review" className="inline-block mt-6 rounded-xl px-5 py-2.5 bg-white text-black font-semibold text-sm hover:bg-neutral-100 transition-colors">
                                        Find Out What Your Website Is Costing You →
                                    </Link>
                                </div>

                                <div className="mt-8 md:mt-0">
                                    <h3 className="text-sm uppercase tracking-wide text-white/60 mb-4">
                                        What's included in every build
                                    </h3>
                                    <ul className="space-y-3">
                                        {included.map((item, i) => (
                                            <Reveal key={item} y={8} delay={i * 40}>
                                                <li className="flex gap-2 text-white/80 text-sm">
                                                    <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-white/50 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            </Reveal>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ── LOCAL SEO ─────────────────────────────────────── */}
                <section>
                    <Reveal once>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            Why Local SEO Matters for Portland Businesses
                        </h2>
                    </Reveal>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Reveal once y={16} delay={0}>
                            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md p-6 text-white">
                                <h3 className="font-semibold text-white mb-2">Portland searches are hyperlocal</h3>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    When someone in SE Portland searches "roof repair near me" or a Beaverton homeowner Googles "painter Portland OR," Google ranks local businesses first. If your site doesn't have the right signals — local schema, proper page titles, Google Business alignment — you're invisible in those results no matter how nice your site looks.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal once y={16} delay={80}>
                            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md p-6 text-white">
                                <h3 className="font-semibold text-white mb-2">We build with local ranking in mind</h3>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    Every site we build includes structured data markup, geo-targeted page titles, proper heading hierarchy, and a sitemap — the technical foundation Google needs to understand where you are and who you serve. We also make your site Google Business Profile-ready so your organic and map listings reinforce each other.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal once y={16} delay={160}>
                            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md p-6 text-white">
                                <h3 className="font-semibold text-white mb-2">Speed is a local ranking factor</h3>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    Google penalizes slow sites — especially on mobile. Every site we build is optimized for Core Web Vitals: compressed images, minimal blocking scripts, and fast hosting. A faster site ranks higher and keeps visitors around long enough to contact you.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal once y={16} delay={240}>
                            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md p-6 text-white">
                                <h3 className="font-semibold text-white mb-2">Serving Portland and surrounding areas</h3>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    We build for businesses across the Portland metro: SE Portland, NE Portland, NW, Beaverton, Hillsboro, Gresham, Lake Oswego, Tigard, and beyond. If your customers are local, your site should be built to reach them locally.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ── PROCESS ───────────────────────────────────────── */}
                <section>
                    <Reveal once>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            How It Works
                        </h2>
                        <p className="text-white/70 max-w-2xl mb-8">
                            No confusing onboarding. No months of silence. Here's the whole process from first contact to launch.
                        </p>
                    </Reveal>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {process.map((s, i) => (
                            <Reveal key={s.step} once y={16} delay={i * 80}>
                                <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md p-5 text-white">
                                    <div className="text-3xl font-bold text-white/20 mb-3 font-mono">{s.step}</div>
                                    <p className="font-semibold mb-2">{s.title}</p>
                                    <p className="text-white/70 text-sm leading-relaxed">{s.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── PORTFOLIO ─────────────────────────────────────── */}
                <ProjectsSection />

                {/* ── TESTIMONIALS ──────────────────────────────────── */}
                <section>
                    <Reveal once>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            What Clients Say
                        </h2>
                        <p className="text-white/70 max-w-2xl mb-8">
                            5.0 ★ on Google · Every review is real, verified, and unedited.
                        </p>
                    </Reveal>
                    <div className="grid gap-5 md:grid-cols-2">
                        {testimonials.map((t, i) => (
                            <Reveal key={t.name} once y={16} delay={i * 80}>
                                <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md p-6 text-white">
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, j) => (
                                            <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <blockquote className="text-white/85 text-sm leading-relaxed mb-4">
                                        "{t.quote}"
                                    </blockquote>
                                    <div>
                                        <p className="font-semibold text-white text-sm">{t.name}</p>
                                        <p className="text-white/55 text-xs">{t.biz}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                    <Reveal once delay={160}>
                        <p className="mt-4 text-center">
                            <a
                                href="https://www.google.com/search?q=Likwit+Devs+reviews"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white/55 hover:text-white/80 transition underline"
                            >
                                Read our Google reviews ↗
                            </a>
                        </p>
                    </Reveal>
                </section>

                {/* ── FAQ ───────────────────────────────────────────── */}
                <section>
                    <Reveal once>
                        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-6 md:p-10 text-white">
                            <h2 className="text-2xl font-bold mb-8">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-7">
                                {faqs.map(({ q, a }, i) => (
                                    <Reveal key={q} y={8} delay={i * 50}>
                                        <div>
                                            <p className="font-semibold text-white">{q}</p>
                                            <p className="mt-2 text-white/72 text-sm leading-relaxed">{a}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ── INTERNAL LINKS ────────────────────────────────── */}
                <section>
                    <Reveal once>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-3">
                            We also specialize in:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {relatedLinks.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-sm text-white/80 hover:text-white hover:bg-black/70 transition"
                                >
                                    {label}
                                </Link>
                            ))}
                            <Link
                                to="/"
                                className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-sm text-white/80 hover:text-white hover:bg-black/70 transition"
                            >
                                ← Homepage
                            </Link>
                        </div>
                    </Reveal>
                </section>

                {/* ── FINAL CTA ─────────────────────────────────────── */}
                <section>
                    <Reveal once>
                        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md shadow-lg p-8 md:p-12 text-center text-white">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">
                                Ready to Get More Calls From Your Website?
                            </h2>
                            <p className="text-white/75 max-w-xl mx-auto mb-7 leading-relaxed">
                                Send your current site and I'll give you a real breakdown of what's holding it back — covering speed, mobile experience, local SEO, and conversion. No cost, no pitch, just honest feedback.
                            </p>
                            <Link
                                to="/free-review"
                                className="inline-block rounded-xl px-7 py-3.5 bg-white text-black font-semibold text-sm hover:bg-neutral-100 transition-colors shadow-lg"
                            >
                                Find Out What Your Website Is Costing You →
                            </Link>
                            <p className="mt-4 text-xs text-white/45">
                                No spam. Reply within 1 business day. No commitment required.
                            </p>
                        </div>
                    </Reveal>
                </section>

            </div>
        </div>
    );
}
