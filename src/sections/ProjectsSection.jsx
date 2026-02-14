import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";

export default function ProjectsSection() {
    const { projects, loading, error } = useProjects();

    return (
        <section
            id="projects"
            className="relative z-10 px-4 pt-12 pb-28 md:pt-16 md:pb-32 scroll-mt-32"
        >
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Recent Work
                    </h2>
                    <p className="text-white/75 mb-6 max-w-3xl">
                        Real builds with speed, mobile-first UI, and clean conversion flow.
                        Want something like this? Hit the audit button and I’ll tell you what your
                        current site is doing wrong.
                    </p>
                </Reveal>

                {loading && <p className="text-white/70">Loading projects…</p>}
                {error && <p className="text-red-300">Couldn't load projects.</p>}

                {!loading && !error && projects.length === 0 && (
                    <p className="text-white/70">No projects yet.</p>
                )}

                {!loading && !error && projects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((p, idx) => (
                            <Reveal key={p.id} y={10} delay={idx * 70}>
                                <ProjectCard project={p} />
                            </Reveal>
                        ))}
                    </div>
                )}

                {/* CTA block (conversion loop) */}
                <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
                    <Reveal y={10}>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                            Want a site that actually brings customers?
                        </h3>
                    </Reveal>
                    <Reveal y={10} delay={60}>
                        <p className="mt-2 text-white/80 max-w-2xl">
                            I’ll review your current site and send back a quick list of fixes: speed, mobile,
                            SEO structure, and call-to-action flow.
                        </p>
                    </Reveal>

                    <Reveal y={10} delay={120}>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <a
                                href="#audit"
                                className="btn-subtle text-white bg-white/15 hover:bg-white/20 backdrop-blur-md"
                            >
                                Get a Free Website Audit
                            </a>
                            <a
                                href="#pricing"
                                className="btn-subtle text-white bg-black/10 hover:bg-black/20 backdrop-blur-md"
                            >
                                View Packages
                            </a>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
