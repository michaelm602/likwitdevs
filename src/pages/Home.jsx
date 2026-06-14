import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import Typewriter from "../components/Typewriter";
import AboutSection from "../sections/AboutSection";
import PricingSection from "../sections/PricingSection";
import useEnrichedWorkProjects from "../hooks/useEnrichedWorkProjects";
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../lib/analytics";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const proofItems = [
    "Local Oregon Businesses",
    "Custom Built - No Templates",
    "Work Directly With The Developer",
    "Free Website Review",
    "Mobile-First Builds",
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
        title: "Your Website Is Losing You Customers",
        description:
            "Most small business websites drive people away without the owner ever knowing. We fix that -- and turn your site into something that actually rings your phone.",
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
            <section className="relative">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="relative py-14 md:py-24">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                            Your Website Isn't Getting You Calls... And It's Costing You Jobs
                        </h1>

                        <p className="mt-3 text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl">
                            I build conversion-focused websites for Portland service businesses that turn visitors into real calls, quote requests, and booked work.
                        </p>
                        <p className="mt-3 text-sm sm:text-base text-white/80 max-w-2xl">
                            Every day your site underperforms, people click, hesitate, and hire someone else.
                        </p>

                        <p className="mt-2 text-sm sm:text-base text-white/70 h-6">
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

                        <div className="mt-6">
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
                                className="inline-block rounded-xl px-6 py-3 bg-white text-black font-semibold text-sm sm:text-base hover:bg-neutral-100 transition-colors shadow-lg"
                            >
                                Get My Free Review
                            </a>
                            <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/75">
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
                                    className="hover:text-white/90 transition"
                                >
                                    View Work
                                </a>
                                <span>|</span>
                                <Link
                                    to="/contact"
                                    onClick={() =>
                                        trackEvent({
                                            eventName: "cta_click",
                                            targetPath: "/contact",
                                            metadata: {
                                                label: "Contact",
                                                location: "home-hero-secondary",
                                            },
                                        })
                                    }
                                    className="hover:text-white/90 transition"
                                >
                                    Contact
                                </Link>
                                <span>|</span>
                                <Link to="/web-design-portland" className="hover:text-white/90 transition">Portland Web Design</Link>
                            </div>
                            <p className="mt-3 text-xs text-white/70">
                                5.0 Google Rating | Portland-based | Work directly with me | Launch in 1-3 weeks
                            </p>
                        </div>

                        <div className="mt-8 grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                                <div className="text-white font-semibold">Get Found in Portland</div>
                                <p className="text-white/80 text-sm mt-1">
                                    Show up when locals search for what you do -- built-in SEO from day one.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                                <div className="text-white font-semibold">Look Like the Pro You Are</div>
                                <p className="text-white/80 text-sm mt-1">
                                    Clean, fast design that builds trust before you even answer the phone.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                                <div className="text-white font-semibold">Turn Visitors Into Calls</div>
                                <p className="text-white/80 text-sm mt-1">
                                    Every page built to push people toward booking -- not just browsing.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST PROOF STRIP */}
            <section aria-label="Likwit Devs proof points" className="mx-auto max-w-6xl px-4 -mt-4 md:-mt-10">
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-md sm:grid-cols-3 lg:grid-cols-5">
                    {proofItems.map((item) => (
                        <div
                            key={item}
                            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white/80"
                        >
                            {item}
                        </div>
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
                    {recentProjects.map((project) => {
                        const imageUrl = getProjectImage(project);
                        const badges = getProjectBadges(project);

                        return (
                            <article
                                key={project.name}
                                className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-md transition-colors hover:bg-white/[0.07]"
                            >
                                {/* Thumbnail size: change md:max-w-[28rem] back to md:max-w-sm to restore the previous compact card height. */}
                                <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/25 md:max-w-[28rem] md:self-center">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={project.imageAlt || `${project.name} project preview`}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                            style={{ objectPosition: project.imageFocus || "50% 25%" }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-white/[0.04] px-4 text-center">
                                            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                                                Project Preview Coming Soon
                                            </span>
                                        </div>
                                    )}
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
                                        className="mt-auto inline-flex pt-5 text-sm font-semibold text-white/80 underline underline-offset-4 transition hover:text-white"
                                    >
                                        See The Build -&gt;
                                    </Link>
                                </div>
                            </article>
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
                        {whyItems.map((item) => (
                            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <h3 className="font-semibold text-white">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/80">{item.copy}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LEAD MAGNET: FREE REVIEW */}
            <section id="audit" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
                <div className="rounded-3xl border border-white/15 bg-black/20 backdrop-blur-md p-6 md:p-10">
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
                                    className="rounded-2xl bg-black/20 border border-white/10 p-4"
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
                                            className="w-full text-center rounded-xl px-4 py-2.5 bg-white text-black font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50"
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
                </div>
            </section>

            <PricingSection />
            <AboutSection />

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
                        className="w-full rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black shadow-lg"
                    >
                        Free Review
                    </a>
                </div>
            </div>
        </>
    );
}
