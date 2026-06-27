import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { MotionCard, MotionReveal } from "../components/PremiumMotion";
import WorkProjectImage from "../components/WorkProjectImage";
import useEnrichedWorkProjects from "../hooks/useEnrichedWorkProjects";
import useSEO from "../hooks/useSEO";
import { projectCategories } from "../data/workProjects";
import { trackEvent } from "../lib/analytics";

function ProjectGrid({ title, projects, loading }) {
    if (projects.length === 0) return null;

    return (
        <section className="space-y-5">
            <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">{title}</p>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">{title}</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                {projects.map((project, index) => {
                    const liveUrl = project.liveUrl || project.liveHref || "";

                    return (
                        <MotionCard
                            as="article"
                            key={project.slug}
                            delay={index * 0.06}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.3)] backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.065]"
                        >
                            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-white/70 via-white/25 to-transparent transition-transform duration-700 group-hover:scale-x-100 motion-reduce:transition-none" />
                            {/* TODO: Add final cropped screenshots, video clips, or before/after visuals as project media becomes available. */}
                            <WorkProjectImage project={project} loading={loading} className="work-project-image rounded-xl" />

                            <p className="mt-5 text-xs uppercase tracking-[0.16em] text-white/70">
                                {project.industry}
                            </p>
                            <h3 className="mt-2 text-2xl font-semibold text-white">{project.name}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/90">{project.summary}</p>

                            {project.badges?.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {project.badges.map((badge) => (
                                        <span
                                            key={badge}
                                            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/75"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Link
                                    to={`/work/${project.slug}`}
                                    onClick={() =>
                                        trackEvent({
                                            eventName: "project_case_study_click",
                                            targetPath: `/work/${project.slug}`,
                                            projectSlug: project.slug,
                                            projectName: project.name,
                                            metadata: {
                                                location: "work-project-card",
                                            },
                                        })
                                    }
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition hover:text-white"
                                >
                                    See The Build <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                                </Link>
                                {liveUrl && (
                                    <a
                                        href={liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() =>
                                            trackEvent({
                                                eventName: "project_live_site_click",
                                                targetUrl: liveUrl,
                                                projectSlug: project.slug,
                                                projectName: project.name,
                                                metadata: {
                                                    location: "work-project-card",
                                                },
                                            })
                                        }
                                        className="inline-flex w-fit rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.1] hover:text-white"
                                    >
                                        Visit Live Site -&gt;
                                    </a>
                                )}
                            </div>
                        </MotionCard>
                    );
                })}
            </div>
        </section>
    );
}

export default function Work() {
    const { projects, loading } = useEnrichedWorkProjects();
    const clientProjects = projects.filter((project) => project.category === "client");
    const ownedProjects = projects.filter((project) => project.category === "owned");

    useSEO({
        title: "Work | Likwit Devs",
        description:
            "Explore Likwit Devs project work for local businesses, service brands, and custom operational tools.",
        canonical: "https://www.likwitdevs.com/work",
    });

    return (
        <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
            <div className="mx-auto max-w-6xl space-y-12">
                <MotionReveal as="header" className="max-w-3xl" amount={0.05}>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">Project Portfolio</p>
                    <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight text-white">
                        Client work and owned products from Likwit Devs.
                    </h1>
                    <p className="mt-4 text-base md:text-lg leading-relaxed text-white/80">
                        This is the home base for completed client work and Likwit Devs owned products. Full case studies will grow here as project history, visuals, and verified details are documented.
                    </p>
                </MotionReveal>

                <ProjectGrid title={projectCategories.client} projects={clientProjects} loading={loading} />
                <ProjectGrid title={projectCategories.owned} projects={ownedProjects} loading={loading} />
            </div>
        </section>
    );
}
