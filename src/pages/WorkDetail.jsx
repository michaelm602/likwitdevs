import { Link, useParams } from "react-router-dom";
import WorkProjectImage from "../components/WorkProjectImage";
import useEnrichedWorkProjects from "../hooks/useEnrichedWorkProjects";
import useSEO from "../hooks/useSEO";
import { getWorkProject, missingProjectHistory, projectCategories } from "../data/workProjects";

function getProjectTypeLabel(project) {
    return projectCategories[project.category] || "Project";
}

export default function WorkDetail() {
    const { slug } = useParams();
    const staticProject = getWorkProject(slug);
    const { projects, loading } = useEnrichedWorkProjects();
    const enrichedProject = projects.find((item) => item.slug === slug);
    const project = enrichedProject || staticProject;
    const liveUrl = project?.liveUrl || project?.liveHref || "";

    useSEO({
        title: project ? `${project.name} | Likwit Devs Work` : "Project Not Found | Likwit Devs",
        description: project
            ? project.summary
            : "The requested Likwit Devs project could not be found.",
        canonical: `https://www.likwitdevs.com/work/${slug || ""}`,
    });

    if (!project && loading) {
        return (
            <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
                <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/20 p-6 text-white backdrop-blur-md">
                    <p className="text-white/80">Loading project...</p>
                </div>
            </section>
        );
    }

    if (!project) {
        return (
            <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
                <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/20 p-6 text-white backdrop-blur-md">
                    <h1 className="text-3xl font-bold">Project not found</h1>
                    <p className="mt-3 text-white/80">That project page is not available yet.</p>
                    <Link to="/work" className="mt-6 inline-flex text-sm font-semibold underline underline-offset-4">
                        Back to Work
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
            <div className="mx-auto max-w-5xl space-y-10">
                <header className="max-w-3xl">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link to="/work" className="text-sm font-semibold text-white/70 underline underline-offset-4 hover:text-white">
                            Back to Work
                        </Link>
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-fit rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-100"
                            >
                                Visit Live Site -&gt;
                            </a>
                        )}
                    </div>
                    <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/60">
                        {getProjectTypeLabel(project)} | {project.industry}
                    </p>
                    <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight text-white">{project.name}</h1>
                    <p className="mt-4 text-base md:text-lg leading-relaxed text-white/90">{project.summary}</p>
                    {project.badges?.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {project.badges.map((badge) => (
                                <span
                                    key={badge}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white/80"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* TODO: Add video walkthrough, launch metrics, or before/after visuals here. */}
                <WorkProjectImage project={project} loading={loading} className="rounded-3xl bg-black/20 backdrop-blur-md" />

                <div className="grid gap-5 md:grid-cols-3">
                    <article className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-md">
                        <h2 className="text-xl font-semibold text-white">Overview</h2>
                        <p className="mt-3 text-sm leading-relaxed text-white/80">
                            {project.overview || project.summary || missingProjectHistory}
                        </p>
                    </article>

                    <article className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-md">
                        <h2 className="text-xl font-semibold text-white">Challenge</h2>
                        {/* TODO: Need project history from Michael. */}
                        <p className="mt-3 text-sm leading-relaxed text-white/80">
                            {project.challenge || missingProjectHistory}
                        </p>
                    </article>

                    <article className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-md">
                        <h2 className="text-xl font-semibold text-white">Solution</h2>
                        {/* TODO: Need project history from Michael. */}
                        <p className="mt-3 text-sm leading-relaxed text-white/80">
                            {project.solution || missingProjectHistory}
                        </p>
                    </article>
                </div>

                <section className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
                    <h2 className="text-2xl font-semibold text-white">Current Status</h2>
                    {/* TODO: Need project history from Michael. */}
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80">
                        {project.status || missingProjectHistory}
                    </p>
                    {/* TODO: Add launch date, performance numbers, lead metrics, and client quote when available. */}
                </section>
            </div>
        </section>
    );
}
