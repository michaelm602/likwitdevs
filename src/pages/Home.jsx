import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { ArrowRight, BadgeCheck, PhoneCall, Search, Workflow } from "lucide-react";
import Typewriter from "../components/Typewriter";
import { CursorGlow, MotionCard, MotionReveal } from "../components/PremiumMotion";
import AboutSection from "../sections/AboutSection";
import PricingSection from "../sections/PricingSection";
import useEnrichedWorkProjects from "../hooks/useEnrichedWorkProjects";
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../lib/analytics";
import TestimonialsSection from "../sections/TestimonialsSection";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const proofItems = [
    "8 Projects Built",
    "Custom Built - No Templates",
    "Work Directly With The Developer",
    "Free Website Review",
    "Websites · Systems · Software",
];

const heroOutcomes = [
    {
        title: "Get Found in Portland",
        copy: "Show up when locals search for what you do -- built-in SEO from day one.",
        icon: Search,
        label: "Local visibility",
    },
    {
        title: "Replace Paper With Systems",
        copy: "Digital intake, booking, and admin tools that give your business a cleaner way to run.",
        icon: Workflow,
        label: "Cleaner operations",
    },
    {
        title: "Turn Visitors Into Calls",
        copy: "Every page built to push people toward booking -- not just browsing.",
        icon: PhoneCall,
        label: "Stronger conversion",
    },
];

const whyItems = [
    {
        title: "You work directly with the builder",
        copy:
            "No handoff chain or mystery team. You talk with the person planning, designing, building, and launching your site.",
    },
    {
        title: "Custom websites, not templates",
        copy:
            "Your site is shaped around your services, customers, trust signals, and next step instead of squeezed into a generic layout.",
    },
    {
        title: "Oregon-based support",
        copy:
            "Local context matters. I build for businesses that need clear communication, practical support, and a site that feels trustworthy.",
    },
    {
        title: "You own the website and content",
        copy:
            "No lock-in games. Your domain, content, and site direction stay yours, with optional support when you want it.",
    },
    {
        title: "Built for calls, leads, and bookings",
        copy:
            "The design is not just there to look good. It is structured to build confidence and move visitors toward contacting you.",
    },
    {
        title: "Clear communication start to finish",
        copy:
            "You know what is happening, what comes next, and what decisions are needed before launch.",
    },
];

const reviewSteps = [
    "We review your website.",
    "We identify the biggest trust, mobile, SEO, and conversion issues.",
    "We send clear recommendations.",
    "If it makes sense, we talk about fixing it.",
];

const projectBadges = {
    "forest-pathways": ["Website", "Local SEO"],
    "nw-autofix": ["Website Rebuild", "Local SEO"],
    "diamond-auto": ["Business System", "Admin Dashboard"],
    "blessed-n-polished": ["Website", "Booking Flow"],
    "freva-construction": ["Website", "Construction"],
    "nails-by-elysia": ["Website", "Custom Booking System"],
    "iep-compass": ["AI Product", "Education"],
    "likwit-blvd": ["E-Commerce", "Portfolio"],
};

const defaultHomeProjectSlugs = ["forest-pathways", "nw-autofix", "diamond-auto", "iep-compass"];
const maxHomeProjects = 4;

function getProjectImage(project) {
    return (
        project.imageUrl ||
        project.imageURL ||
        project.thumbnailUrl ||
        project.thumbnail ||
        project.image ||
        project.coverImage ||
        project.screenshotUrl ||
        ""
    );
}

function getProjectBadges(project) {
    return project.badges?.length ? project.badges : projectBadges[project.slug] || [];
}

function getHomeOrder(project) {
    return Number.isFinite(Number(project.homeOrder)) ? Number(project.homeOrder) : Number.MAX_SAFE_INTEGER;
}

function sortHomeProjects(a, b) {
    const homeOrderDifference = getHomeOrder(a) - getHomeOrder(b);
    if (homeOrderDifference !== 0) return homeOrderDifference;

    return (a.projectOrder ?? a.order ?? 0) - (b.projectOrder ?? b.order ?? 0);
}

export default function Home() {
    useSEO({
        title: "Portland Web Design, Booking Systems & Custom Software | Likwit Devs",
        description: "Likwit Devs builds websites, booking systems, intake workflows, and custom software for Portland small businesses. Custom-built. No templates. Work directly with the developer.",
        canonical: "https://www.likwitdevs.com/",
    });

    const [reviewName, setReviewName] = useState("");
    const [reviewEmail, setReviewEmail] = useState("");
    const [reviewUrl, setReviewUrl] = useState("");
    const [reviewBiz, setReviewBiz] = useState("");
    const [reviewStatus, setReviewStatus] = useState({ sending: false, ok: null, message: "" });
    const [reviewErrors, setReviewErrors] = useState({});
    const [reviewFormStarted, setReviewFormStarted] = useState(false);
    const { projects: enrichedProjects } = useEnrichedWorkProjects();
    const recentProjects = useMemo(() => {
        const selectedProjects = enrichedProjects
            .filter((project) => project.showOnHome === true)
            .sort(sortHomeProjects);
        const selectedSlugs = new Set(selectedProjects.map((project) => project.slug));
        const fallbackProjects = defaultHomeProjectSlugs
            .map((slug) => enrichedProjects.find((project) => project.slug === slug))
            .filter(Boolean)
            .filter((project) => !selectedSlugs.has(project.slug))
            .filter((project) => !(project.homeVisibilityConfigured && project.showOnHome === false))
            .sort(sortHomeProjects);

        return [...selectedProjects, ...fallbackProjects].slice(0, maxHomeProjects);
    }, [enrichedProjects]);

    function handleReviewFormStarted() {
        if (reviewFormStarted) return;
        setReviewFormStarted(true);
        trackEvent({
            eventName: "contact_form_started",
            serviceIntent: "free-review",
            metadata: {
                source: "home-review-form",
            },
        });
    }

    async function handleReviewSubmit(e) {
        e.preventDefault();

        const errors = {};
        if (!reviewName.trim()) errors.name = "Please enter your name.";
        if (!reviewEmail.trim()) errors.email = "Please enter your email.";
        if (reviewEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewEmail.trim())) {
            errors.email = "Please enter a valid email address.";
        }

        setReviewErrors(errors);
        if (Object.keys(errors).length > 0) {
            setReviewStatus({
                sending: false,
                ok: false,
                message: "Please fix the highlighted fields so I can send your review.",
            });
            return;
        }

        setReviewStatus({ sending: true, ok: null, message: "" });
        trackEvent({
            eventName: "contact_form_submitted",
            serviceIntent: "free-review",
            metadata: {
                source: "home-review-form",
                hasWebsite: Boolean(reviewUrl.trim()),
                hasIndustry: Boolean(reviewBiz.trim()),
            },
        });

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
            setReviewStatus({
                sending: false,
                ok: true,
                message: "Got it - I will be in touch with a real breakdown within 1 business day.",
            });
            trackEvent({
                eventName: "emailjs_sent",
                serviceIntent: "free-review",
                metadata: {
                    source: "home-review-form",
                },
            });
        } catch {
            setReviewStatus({
                sending: false,
                ok: false,
                message: "Something went wrong - try emailing me directly at likwitdevs@gmail.com.",
            });
            trackEvent({
                eventName: "emailjs_failed",
                serviceIntent: "free-review",
                metadata: {
                    source: "home-review-form",
                },
            });
        }
    }

    return (
        <>
            {/* HERO */}
            <section className="relative px-4 pt-10 pb-16 md:pt-16 md:pb-24">
                <div className="mx-auto max-w-6xl">
                    <div className="relative">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-x-8 -inset-y-10 bg-[radial-gradient(ellipse_at_34%_45%,rgba(0,0,0,0.5),transparent_68%)]"
                        />
                        <div className="relative grid gap-10 py-8 md:py-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
                            <MotionReveal className="max-w-3xl" amount={0.05}>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.35)]" />
                                    Portland-built digital systems
                                </div>
                                <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl">
                                    Your Business Runs on Systems. {" "}
                                    <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                                        Let's Build Better Ones.
                                    </span>
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
                                    I build websites, booking systems, intake workflows, and custom software for Portland small businesses — the kind that gets you more calls, less paperwork, and customers who actually follow through.
                                </p>
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                                    Most small business owners are running on tools that slow them down — bad websites, paper forms, and booking flows that live in DMs. I fix that.
                                </p>

                                <p className="mt-3 h-6 text-sm text-white/60 sm:text-base">
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

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <a
                                        href="#audit"
                                        onClick={() =>
                                            trackEvent({
                                                eventName: "cta_click",
                                                targetPath: "#audit",
                                                serviceIntent: "free-review",
                                                metadata: {
                                                    label: "Get My Free Review",
                                                    location: "home-hero",
                                                },
                                            })
                                        }
                                        className="premium-cta group text-sm sm:text-base"
                                    >
                                        Get My Free Review
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-0.5" aria-hidden="true" />
                                    </a>
                                    <a
                                        href="#projects"
                                        onClick={() =>
                                            trackEvent({
                                                eventName: "cta_click",
                                                targetPath: "#projects",
                                                metadata: {
                                                    label: "View Work",
                                                    location: "home-hero-secondary",
                                                },
                                            })
                                        }
                                        className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                                    >
                                        View Work
                                    </a>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/65">
                                    <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-white/55" aria-hidden="true" />5.0 Google Rating</span>
                                    <span>Portland-based</span>
                                    <span>8 projects built</span>
                                    <Link to="/contact" className="transition hover:text-white">Contact</Link>
                                    <Link to="/web-design-portland" className="transition hover:text-white">Portland Web Design</Link>
                                </div>
                            </MotionReveal>

                            <div className="grid gap-3" aria-label="Business outcomes">
                                {heroOutcomes.map((outcome, index) => {
                                    const Icon = outcome.icon;
                                    return (
                                        <MotionCard
                                            as="article"
                                            key={outcome.title}
                                            delay={0.12 + index * 0.08}
                                            lift={4}
                                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.26)] backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.055]"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/70 transition duration-300 group-hover:scale-105 group-hover:bg-white/[0.09] motion-reduce:transform-none">
                                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">{outcome.label}</p>
                                                    <h2 className="mt-1 font-semibold text-white">{outcome.title}</h2>
                                                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{outcome.copy}</p>
                                                </div>
                                            </div>
                                            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-white/70 via-white/25 to-transparent transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none" />
                                        </MotionCard>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST PROOF STRIP */}
            <section aria-label="Likwit Devs proof points" className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#2a2a2a] bg-black/45 p-3 shadow-[0_16px_45px_rgba(0,0,0,0.35)] backdrop-blur-md sm:grid-cols-3 lg:grid-cols-5">
                    {proofItems.map((item, index) => (
                        <MotionCard
                            key={item}
                            delay={index * 0.04}
                            lift={2}
                            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-white/75 transition-colors hover:border-white/20 hover:text-white"
                        >
                            {item}
                        </MotionCard>
                    ))}
                </div>
            </section>

            {/* RECENT PROJECTS */}
            <section id="projects" className="mx-auto max-w-6xl px-4 py-12 md:py-16 scroll-mt-32">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Recent Projects</p>
                        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">Businesses We've Helped</h2>
                    </div>
                    <p className="max-w-2xl text-sm text-white/80">
                        Real client work, real business problems solved, and real builds launched across websites, intake flows, admin tools, and local credibility work.
                    </p>
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-2">
                    {recentProjects.map((project, index) => {
                        const imageUrl = getProjectImage(project);
                        const badges = getProjectBadges(project);

                        return (
                            <MotionCard
                                as="article"
                                key={project.name}
                                delay={index * 0.07}
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4 shadow-[0_20px_55px_rgba(0,0,0,0.32)] backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.065]"
                            >
                                {/* Thumbnail size: change md:max-w-[28rem] back to md:max-w-sm to restore the previous compact card height. */}
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/25 md:max-w-[28rem] md:self-center">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={project.imageAlt || `${project.name} project preview`}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.035]"
                                            style={{ objectPosition: project.imageFocus || "50% 25%" }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-white/[0.04] px-4 text-center">
                                            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                                                Project Preview Coming Soon
                                            </span>
                                        </div>
                                    )}
                                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_28%,rgba(255,255,255,0.1)_48%,transparent_68%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none" />
                                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>

                                <div className="flex flex-1 flex-col">
                                    <div className="mt-4 flex min-h-8 flex-wrap content-start gap-1.5">
                                        {badges.map((badge) => (
                                            <span
                                                key={`${project.slug}-${badge}`}
                                                className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 className="mt-3 text-xl font-semibold text-white">{project.name}</h3>
                                    <p
                                        className="mt-3 overflow-hidden text-sm leading-relaxed text-white/90"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 3,
                                        }}
                                    >
                                        {project.summary}
                                    </p>
                                    <Link
                                        to={`/work/${project.slug}`}
                                        onClick={() =>
                                            trackEvent({
                                                eventName: "project_case_study_click",
                                                targetPath: `/work/${project.slug}`,
                                                projectSlug: project.slug,
                                                projectName: project.name,
                                                metadata: {
                                                    location: "home-recent-projects",
                                                },
                                            })
                                        }
                                        className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-white/70 transition hover:text-white"
                                    >
                                        See The Build <ArrowRight className="h-4 w-4 transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1" aria-hidden="true" />
                                    </Link>
                                </div>
                            </MotionCard>
                        );
                    })}
                </div>
            </section>

            {/* WHY CHOOSE */}
            <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                <div className="rounded-3xl border border-white/15 bg-black/20 p-6 backdrop-blur-md md:p-10">
                    <div className="max-w-3xl">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Why Businesses Choose Likwit Devs</p>
                        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
                            A clearer build process, a better first impression, and a site you actually own.
                        </h2>
                        <p className="mt-3 text-sm md:text-base text-white/80">
                            Most buyers are trying to answer the same questions: Can I trust you? Will this be easy? Will the website help my business? This is how I remove those doubts.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {whyItems.map((item, index) => (
                            <MotionCard key={item.title} delay={index * 0.04} lift={4} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]">
                                <h3 className="font-semibold text-white">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/80">{item.copy}</p>
                            </MotionCard>
                        ))}
                    </div>
                </div>
            </section>

            <TestimonialsSection />

            {/* LEAD MAGNET: FREE REVIEW */}
            <section id="audit" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
                <CursorGlow className="monochrome-glow rounded-3xl border border-[#2a2a2a] bg-[linear-gradient(145deg,rgba(24,24,27,0.86),rgba(10,10,11,0.9))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-md md:p-10">
                    <div className="md:flex md:items-start md:justify-between gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                Free Website Review
                            </h2>
                            <p className="mt-2 text-white/90">
                                Share your site and I'll send back a direct breakdown of what's costing you customers -- covering speed, mobile experience, SEO structure, and how well your site moves visitors to act.
                            </p>

                            <ul className="mt-4 space-y-2 text-white/80 text-sm">
                                <li>Speed + mobile performance (the first thing visitors judge)</li>
                                <li>SEO structure (titles, descriptions, crawlability)</li>
                                <li>Conversion review (CTA placement, layout, trust signals)</li>
                                <li>Clear next steps with an honest cost estimate</li>
                            </ul>

                            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <h3 className="font-semibold text-white">What happens after you request a review?</h3>
                                <ol className="mt-3 space-y-3 text-sm text-white/90">
                                    {reviewSteps.map((step, index) => (
                                        <li key={step} className="flex gap-3">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                                                {index + 1}
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                                <p className="mt-4 text-sm font-medium text-white/90">
                                    No pressure. No obligation. Just a useful review.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-0 w-full md:max-w-sm">
                            {reviewStatus.ok === true ? (
                                <div className="rounded-2xl bg-black/20 border border-white/10 p-6 text-center">
                                    <p className="text-white font-semibold">Got it -- I'll be in touch.</p>
                                    <p className="text-white/80 text-sm mt-1">{reviewStatus.message}</p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleReviewSubmit}
                                    onFocus={handleReviewFormStarted}
                                    noValidate
                                    className="rounded-2xl border border-[#2a2a2a] bg-black/35 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.3)]"
                                >
                                    <label htmlFor="audit-name" className="block text-sm text-white/90">
                                        Your Name <span className="text-white/70">(required)</span>
                                    </label>
                                    <input
                                        id="audit-name"
                                        type="text"
                                        required
                                        aria-invalid={reviewErrors.name ? "true" : "false"}
                                        aria-describedby={reviewErrors.name ? "audit-name-error" : undefined}
                                        value={reviewName}
                                        onChange={(e) => {
                                            setReviewName(e.target.value);
                                            setReviewErrors((current) => ({ ...current, name: "" }));
                                        }}
                                        placeholder="Jane Smith"
                                        className={`mt-2 w-full rounded-xl bg-black/30 border px-3 py-2 text-white placeholder:text-white/60 outline-none focus:border-white/30 ${reviewErrors.name ? "border-red-400" : "border-white/10"}`}
                                    />
                                    {reviewErrors.name && (
                                        <p id="audit-name-error" className="mt-2 text-xs text-red-300">{reviewErrors.name}</p>
                                    )}

                                    <label htmlFor="audit-email" className="block text-sm text-white/90 mt-4">
                                        Email <span className="text-white/70">(required)</span>
                                    </label>
                                    <input
                                        id="audit-email"
                                        type="email"
                                        required
                                        aria-invalid={reviewErrors.email ? "true" : "false"}
                                        aria-describedby={reviewErrors.email ? "audit-email-error" : undefined}
                                        value={reviewEmail}
                                        onChange={(e) => {
                                            setReviewEmail(e.target.value);
                                            setReviewErrors((current) => ({ ...current, email: "" }));
                                        }}
                                        placeholder="you@yourbusiness.com"
                                        className={`mt-2 w-full rounded-xl bg-black/30 border px-3 py-2 text-white placeholder:text-white/60 outline-none focus:border-white/30 ${reviewErrors.email ? "border-red-400" : "border-white/10"}`}
                                    />
                                    {reviewErrors.email && (
                                        <p id="audit-email-error" className="mt-2 text-xs text-red-300">{reviewErrors.email}</p>
                                    )}

                                    <label htmlFor="audit-url" className="block text-sm text-white/90 mt-4">
                                        Website URL <span className="text-white/70">(optional)</span>
                                    </label>
                                    <input
                                        id="audit-url"
                                        type="url"
                                        value={reviewUrl}
                                        onChange={(e) => setReviewUrl(e.target.value)}
                                        placeholder="https://yourbusiness.com"
                                        className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/60 outline-none focus:border-white/30"
                                    />

                                    <label htmlFor="audit-biz" className="block text-sm text-white/90 mt-4">
                                        Your Industry <span className="text-white/70">(optional)</span>
                                    </label>
                                    <input
                                        id="audit-biz"
                                        type="text"
                                        value={reviewBiz}
                                        onChange={(e) => setReviewBiz(e.target.value)}
                                        placeholder="e.g. Contractor, tattoo artist, salon"
                                        className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white placeholder:text-white/60 outline-none focus:border-white/30"
                                    />

                                    {reviewStatus.ok === false && reviewStatus.message && (
                                        <p className="mt-3 text-sm text-red-300" role="alert">{reviewStatus.message}</p>
                                    )}

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            disabled={reviewStatus.sending}
                                            className="premium-cta w-full"
                                        >
                                            {reviewStatus.sending ? "Sending..." : "Request My Free Review"}
                                        </button>
                                    </div>

                                    <p className="mt-3 text-xs text-white/70">
                                        No spam. I'll reply within 1 business day with a real breakdown, not a template.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </CursorGlow>
            </section>

            <PricingSection />
            <AboutSection />

            <section className="mx-auto max-w-6xl px-4 pt-2 pb-20 md:pb-24" aria-labelledby="final-review-heading">
                <CursorGlow className="monochrome-glow rounded-3xl border border-[#2a2a2a] bg-[#0d0d0e]/90 px-6 py-10 text-center shadow-[0_28px_80px_rgba(0,0,0,0.44)] backdrop-blur-md md:px-10 md:py-14">
                    <MotionReveal amount={0.2}>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Your next step</p>
                        <h2 id="final-review-heading" className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-white md:text-4xl">
                            Ready for a clearer next step?
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                            No pressure. No obligation. Just a useful review.
                        </p>
                        <a
                            href="#audit"
                            onClick={() =>
                                trackEvent({
                                    eventName: "cta_click",
                                    targetPath: "#audit",
                                    serviceIntent: "free-review",
                                    metadata: {
                                        label: "Request My Free Review",
                                        location: "home-final-cta",
                                    },
                                })
                            }
                            className="premium-cta group mt-7"
                        >
                            Request My Free Review
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-0.5" aria-hidden="true" />
                        </a>
                    </MotionReveal>
                </CursorGlow>
            </section>

            <div
                className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/85 px-4 pt-3 backdrop-blur-md md:hidden"
                style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
            >
                <div className="mx-auto flex max-w-md items-center justify-center">
                    {/* TODO: Add a tel: CTA here when a public business phone number is available. */}
                    <a
                        href="#audit"
                        onClick={() =>
                            trackEvent({
                                eventName: "cta_click",
                                targetPath: "#audit",
                                serviceIntent: "free-review",
                                metadata: {
                                    label: "Free Review",
                                    location: "mobile-sticky-cta",
                                },
                            })
                        }
                        className="premium-cta w-full text-sm"
                    >
                        Free Review
                    </a>
                </div>
            </div>
        </>
    );
}
