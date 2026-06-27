import { Link } from "react-router-dom";
import { createElement, useMemo } from "react";
import { CalendarCheck2, Globe2, Sparkles, Workflow } from "lucide-react";
import Reveal from "../components/Reveal";
import { CursorGlow, MotionCard } from "../components/PremiumMotion";
import WorkProjectImage from "../components/WorkProjectImage";
import { workProjects } from "../data/workProjects";
import useEnrichedWorkProjects from "../hooks/useEnrichedWorkProjects";
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../lib/analytics";
import TestimonialsSection from "../sections/TestimonialsSection";

const problemCards = [
    {
        title: "Need More Leads?",
        solution: "Professional websites and local SEO",
        href: "#business-websites",
        icon: Globe2,
    },
    {
        title: "Need Online Booking?",
        solution: "Scheduling and booking systems",
        href: "#booking-systems",
        icon: CalendarCheck2,
    },
    {
        title: "Need To Replace Paper Forms?",
        solution: "Intake systems and workflow automation",
        href: "#workflow-automation",
        icon: Workflow,
    },
    {
        title: "Need Custom Software?",
        solution: "AI tools and business applications",
        href: "#custom-software",
        icon: Sparkles,
    },
];

const services = [
    {
        id: "business-websites",
        icon: Globe2,
        eyebrow: "Websites",
        title: "Business Websites & Website Rebuilds",
        description:
            "Fast, mobile-first websites and rebuilds for small businesses that need clearer positioning, stronger trust signals, and a better path from visitor to customer.",
        bullets: [
            "Custom website design and development",
            "Website rebuilds for outdated or unreliable sites",
            "Service pages, contact paths, and local SEO structure",
            "Mobile-first layouts built for real customer behavior",
            "Performance, accessibility, and launch fundamentals",
            "Clear ownership of your website and content",
        ],
        projectSlugs: ["forest-pathways", "nw-autofix", "blessed-n-polished", "freva-construction"],
        price: "Starting at $800",
        cta: "Plan My Website",
        contactIntent: "business-website",
    },
    {
        id: "booking-systems",
        icon: CalendarCheck2,
        eyebrow: "Booking",
        title: "Booking & Scheduling Systems",
        description:
            "Booking flows that make it easier for customers to request appointments, choose services, and take the next step without sending everything through DMs or scattered messages.",
        bullets: [
            "Service and appointment request flows",
            "Booking-focused landing pages",
            "Customer contact and preference capture",
            "Service presentation that supports decision-making",
            "Calendar, form, or third-party booking integrations",
            "Mobile-friendly booking paths",
        ],
        projectSlugs: ["blessed-n-polished", "nails-by-elysia"],
        price: "Starting at $2,500+",
        cta: "Build My Booking Flow",
        contactIntent: "booking-system",
    },
    {
        id: "workflow-automation",
        icon: Workflow,
        eyebrow: "Operations",
        title: "Intake Systems, Portals & Business Automation",
        description:
            "Internal tools and customer workflows that replace scattered paperwork, organize information, and give your business a cleaner way to manage requests.",
        bullets: [
            "Multi-step intake forms",
            "Customer and project information capture",
            "Photo uploads and structured submissions",
            "Admin dashboards for reviewing records",
            "Status tracking, notes, and print-friendly views",
            "Workflow automation around real business processes",
        ],
        projectSlugs: ["diamond-auto"],
        price: "Starting at $4,000+",
        cta: "Map My Workflow",
        contactIntent: "workflow-automation",
    },
    {
        id: "custom-software",
        icon: Sparkles,
        eyebrow: "Software",
        title: "AI Tools & Custom Software",
        description:
            "Custom applications, AI-assisted tools, dashboards, and software products built around the way your business actually works.",
        bullets: [
            "Custom business applications",
            "AI-assisted tools and workflows",
            "Customer portals and internal dashboards",
            "Data capture and management interfaces",
            "Product prototypes and owned software builds",
            "Integrations with existing tools where practical",
        ],
        projectSlugs: ["iep-compass", "likwit-blvd", "diamond-auto"],
        price: "Starting at $4,000+",
        cta: "Discuss Custom Software",
        contactIntent: "custom-software",
    },
];

const processSteps = [
    {
        title: "Discovery",
        copy: "We clarify the business problem, customer path, current tools, and what the system needs to make easier.",
    },
    {
        title: "Planning",
        copy: "We map the pages, workflow, data, integrations, and launch scope before writing code.",
    },
    {
        title: "Build",
        copy: "We design, develop, test, and refine the system with clear checkpoints along the way.",
    },
    {
        title: "Launch & Support",
        copy: "We deploy the finished build, verify the core paths, and stay available for support or next steps.",
    },
];

const buildItems = [
    "Websites",
    "Website Rebuilds",
    "Local SEO",
    "Booking Systems",
    "Admin Dashboards",
    "Intake Forms",
    "Customer Portals",
    "Workflow Automation",
    "AI Tools",
    "SaaS Applications",
    "E-Commerce",
    "Custom Software",
];

const recentBuildSlugs = ["iep-compass", "diamond-auto", "nw-autofix", "forest-pathways"];
const maxRecentBuilds = 4;

function getProject(slug) {
    return workProjects.find((project) => project.slug === slug);
}

function getServicesOrder(project) {
    return Number.isFinite(Number(project.servicesOrder)) ? Number(project.servicesOrder) : Number.MAX_SAFE_INTEGER;
}

function sortServicesProjects(a, b) {
    const servicesOrderDifference = getServicesOrder(a) - getServicesOrder(b);
    if (servicesOrderDifference !== 0) return servicesOrderDifference;

    return (a.projectOrder ?? a.order ?? 0) - (b.projectOrder ?? b.order ?? 0);
}

function BulletList({ items }) {
    return (
        <ul className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
            {items.map((item, index) => (
                <Reveal key={item} y={8} delay={80 + index * 35}>
                    <li className="flex gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/60" />
                        <span>{item}</span>
                    </li>
                </Reveal>
            ))}
        </ul>
    );
}

function AccentIcon({ icon }) {
    return createElement(icon, { className: "h-5 w-5", "aria-hidden": true });
}

function RelatedProjects({ slugs }) {
    const projects = slugs.map(getProject).filter(Boolean);

    if (projects.length === 0) return null;

    return (
        <div className="mt-7">
            <p className="text-xs uppercase tracking-[0.16em] text-white/60">Related Work</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {projects.map((project) => (
                    <Link
                        key={project.slug}
                        to={`/work/${project.slug}`}
                        onClick={() =>
                            trackEvent({
                                eventName: "project_case_study_click",
                                targetPath: `/work/${project.slug}`,
                                projectSlug: project.slug,
                                projectName: project.name,
                                metadata: {
                                    location: "services-related-work",
                                },
                            })
                        }
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                    >
                        {project.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

function RecentBuilds({ projects, loading }) {
    return (
        <Reveal y={24} once>
            <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 p-6 text-white shadow-lg backdrop-blur-md md:p-8">
                <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">Recent Builds</p>
                    <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
                        Systems, sites, and software already in motion.
                    </h2>
                    <p className="mt-3 text-sm md:text-base leading-relaxed text-white/80">
                        A few examples of the range Likwit Devs builds across websites, internal workflows, and owned products.
                    </p>
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {projects.map((project, index) => (
                        <Reveal key={project.slug} y={16} delay={index * 60}>
                            <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08]">
                                <WorkProjectImage project={project} loading={loading} className="rounded-xl" />
                                <h3 className="mt-4 text-lg font-semibold text-white">{project.name}</h3>
                                <p
                                    className="mt-2 overflow-hidden text-sm leading-relaxed text-white/75"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 1,
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
                                                location: "services-recent-builds",
                                            },
                                        })
                                    }
                                    className="mt-auto inline-flex pt-5 text-sm font-semibold text-white/80 underline underline-offset-4 transition hover:text-white"
                                >
                                    See The Build -&gt;
                                </Link>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>
        </Reveal>
    );
}

export default function Services() {
    const { projects: enrichedProjects, loading } = useEnrichedWorkProjects();
    const recentBuildProjects = useMemo(() => {
        const selectedProjects = enrichedProjects
            .filter((project) => project.showOnServices === true)
            .sort(sortServicesProjects);
        const selectedSlugs = new Set(selectedProjects.map((project) => project.slug));
        const fallbackProjects = recentBuildSlugs
            .map((slug) => enrichedProjects.find((project) => project.slug === slug))
            .filter(Boolean)
            .filter((project) => !selectedSlugs.has(project.slug))
            .filter((project) => !(project.servicesVisibilityConfigured && project.showOnServices === false))
            .sort(sortServicesProjects);

        return [...selectedProjects, ...fallbackProjects].slice(0, maxRecentBuilds);
    }, [enrichedProjects]);

    useSEO({
        title: "Web Design, Booking Systems & Custom Software Portland | Likwit Devs",
        description: "Portland web design studio building websites, booking systems, customer portals, intake workflows, and custom software for small businesses. Starting at $800.",
        canonical: "https://www.likwitdevs.com/services",
    });

    return (
        <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
            <div className="mx-auto max-w-6xl space-y-12">
                <Reveal once>
                    <header className="max-w-4xl">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Services</p>
                        <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight text-white">
                            Build the Systems Your Business Runs On
                        </h1>
                        <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-white/80">
                            We build websites, booking systems, customer portals, intake workflows, and custom software that help small businesses attract customers, stay organized, and grow.
                        </p>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/contact?intent=free-review"
                                onClick={() =>
                                    trackEvent({
                                        eventName: "cta_click",
                                        targetPath: "/contact?intent=free-review",
                                        serviceIntent: "free-review",
                                        metadata: {
                                            label: "Get a Free Website Review",
                                            location: "services-hero",
                                        },
                                    })
                                }
                                className="btn"
                            >
                                Get a Free Website Review
                            </Link>
                            <Link
                                to="/work"
                                onClick={() =>
                                    trackEvent({
                                        eventName: "cta_click",
                                        targetPath: "/work",
                                        metadata: {
                                            label: "See Our Work",
                                            location: "services-hero",
                                        },
                                    })
                                }
                                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08] hover:text-white"
                            >
                                See Our Work
                            </Link>
                        </div>
                    </header>
                </Reveal>

                <Reveal y={24} once>
                    <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 p-6 text-white shadow-lg backdrop-blur-md md:p-8">
                        <div className="max-w-3xl">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Start Here</p>
                            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
                                What Problem Are You Trying To Solve?
                            </h2>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {problemCards.map((card, index) => (
                                <MotionCard
                                    as="a"
                                    key={card.href}
                                    href={card.href}
                                    delay={index * 0.06}
                                    lift={5}
                                    onClick={() =>
                                        trackEvent({
                                            eventName: "service_card_click",
                                            targetPath: card.href,
                                            metadata: {
                                                title: card.title,
                                                solution: card.solution,
                                                location: "services-problem-cards",
                                            },
                                        })
                                    }
                                    className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_14px_38px_rgba(0,0,0,0.22)] transition-colors hover:border-white/20 hover:bg-white/[0.065]"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/70 transition duration-300 group-hover:scale-105 group-hover:bg-white/[0.09] motion-reduce:transform-none">
                                        <AccentIcon icon={card.icon} />
                                    </span>
                                    <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-white/75">
                                        {card.solution}
                                    </p>
                                    <span className="mt-5 inline-flex text-sm font-semibold text-white/65">
                                        Jump to service -&gt;
                                    </span>
                                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-white/70 via-white/25 to-transparent transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none" />
                                </MotionCard>
                            ))}
                        </div>
                    </section>
                </Reveal>

                <Reveal y={24} once>
                    <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 p-6 text-white shadow-lg backdrop-blur-md md:p-8">
                        <div className="max-w-3xl">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/60">How We Work</p>
                            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
                                Clear steps from idea to launch.
                            </h2>
                        </div>
                        <div className="mt-6 grid gap-4 md:grid-cols-4">
                            {processSteps.map((step, index) => (
                                <Reveal key={step.title} y={16} delay={index * 60}>
                                    <article className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                                            {index + 1}
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-white/75">{step.copy}</p>
                                    </article>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                </Reveal>

                <Reveal y={24} once>
                    <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 p-6 text-white shadow-lg backdrop-blur-md md:p-8">
                        <div className="max-w-3xl">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/60">What We Build</p>
                            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
                                Practical systems for customer-facing and internal work.
                            </h2>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {buildItems.map((item, index) => (
                                <Reveal key={item} y={12} delay={index * 30}>
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80">
                                        {item}
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                </Reveal>

                <div className="space-y-8">
                    {services.map((service, index) => (
                        <Reveal
                            key={service.id}
                            id={service.id}
                            y={24}
                            once
                            className="group relative scroll-mt-32 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-black/50 to-black/30 p-6 text-white shadow-lg backdrop-blur-md transition-colors hover:border-white/20 md:p-10"
                        >
                            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-white/70 via-white/25 to-transparent transition-transform duration-700 group-hover:scale-x-100 motion-reduce:transition-none" />
                            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/70 transition duration-300 group-hover:scale-105 motion-reduce:transform-none">
                                            <AccentIcon icon={service.icon} />
                                        </span>
                                        <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                                            {service.eyebrow}
                                        </p>
                                    </div>
                                    <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">
                                        {service.title}
                                    </h2>
                                    {service.price && (
                                        <span className="inline-block mt-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70">
                                            {service.price}
                                        </span>
                                    )}
                                    <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-white/80">
                                        {service.description}
                                    </p>
                                    <BulletList items={service.bullets} />
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                    <RelatedProjects slugs={service.projectSlugs} />
                                    <Link
                                        to={`/contact?intent=${service.contactIntent}`}
                                        onClick={() =>
                                            trackEvent({
                                                eventName: "cta_click",
                                                targetPath: `/contact?intent=${service.contactIntent}`,
                                                serviceIntent: service.contactIntent,
                                                metadata: {
                                                    label: service.cta,
                                                    serviceId: service.id,
                                                    serviceTitle: service.title,
                                                    location: "services-category-card",
                                                },
                                            })
                                        }
                                        className="btn mt-7 w-full"
                                    >
                                        {service.cta}
                                    </Link>
                                    <p className="mt-3 text-xs leading-relaxed text-white/60">
                                        We will map the scope first, then recommend the simplest build that solves the actual business problem.
                                    </p>
                                </div>
                            </div>
                            {index < services.length - 1 && (
                                <div className="mt-8 h-px bg-white/10" aria-hidden="true" />
                            )}
                        </Reveal>
                    ))}
                </div>

                <TestimonialsSection />

                <RecentBuilds projects={recentBuildProjects} loading={loading} />

                <Reveal y={24} once>
                    <CursorGlow className="monochrome-glow rounded-3xl border border-[#2a2a2a] bg-[linear-gradient(145deg,rgba(24,24,27,0.86),rgba(10,10,11,0.92))] p-6 text-center text-white shadow-[0_28px_80px_rgba(0,0,0,0.44)] backdrop-blur-md md:p-10">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Next Step</p>
                        <h2 className="mx-auto mt-2 max-w-3xl text-2xl md:text-4xl font-bold leading-tight text-white">
                            Let's Build Something That Solves a Real Problem
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-white/80">
                            Bring the workflow, website problem, or software idea. We will sort out the simplest build that moves the business forward.
                        </p>
                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                to="/contact?intent=free-review"
                                onClick={() =>
                                    trackEvent({
                                        eventName: "cta_click",
                                        targetPath: "/contact?intent=free-review",
                                        serviceIntent: "free-review",
                                        metadata: {
                                            label: "Get a Free Website Review",
                                            location: "services-final-cta",
                                        },
                                    })
                                }
                                className="premium-cta text-sm"
                            >
                                Get a Free Website Review
                            </Link>
                            <Link
                                to="/work"
                                onClick={() =>
                                    trackEvent({
                                        eventName: "cta_click",
                                        targetPath: "/work",
                                        metadata: {
                                            label: "See Our Work",
                                            location: "services-final-cta",
                                        },
                                    })
                                }
                                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08] hover:text-white"
                            >
                                See Our Work
                            </Link>
                        </div>
                    </CursorGlow>
                </Reveal>
            </div>
        </section>
    );
}
