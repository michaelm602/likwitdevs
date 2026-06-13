import { Link } from "react-router-dom";
import WorkProjectImage from "../components/WorkProjectImage";
import useEnrichedWorkProjects from "../hooks/useEnrichedWorkProjects";
import useSEO from "../hooks/useSEO";
import { projectCategories } from "../data/workProjects";

function ProjectGrid({ title, projects, loading }) {
    if (projects.length === 0) return null;

    return (
        <section className="space-y-5">
            <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">{title}</p>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">{title}</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                {projects.map((project) => (
                    <article
                        key={project.slug}
                        className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-md transition-colors hover:bg-white/[0.07]"
                    >
                        {/* TODO: Add final cropped screenshots, video clips, or before/after visuals as project media becomes available. */}
                        <WorkProjectImage project={project} loading={loading} />

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

                        <Link
                            to={`/work/${project.slug}`}
                            className="mt-5 inline-flex text-sm font-semibold text-white/80 underline underline-offset-4 transition hover:text-white"
                        >
                            See The Build -&gt;
                        </Link>
                    </article>
                ))}
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
                <header className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">Project Portfolio</p>
                    <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight text-white">
                        Client work and owned products from Likwit Devs.
                    </h1>
                    <p className="mt-4 text-base md:text-lg leading-relaxed text-white/80">
                        This is the home base for completed client work and Likwit Devs owned products. Full case studies will grow here as project history, visuals, and verified details are documented.
                    </p>
                </header>

                <ProjectGrid title={projectCategories.client} projects={clientProjects} loading={loading} />
                <ProjectGrid title={projectCategories.owned} projects={ownedProjects} loading={loading} />
            </div>
        </section>
    );
}
