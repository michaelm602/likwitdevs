import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

export default function ProjectsSection() {
    const { projects, loading, error } = useProjects();

    return (
        // Lift above footer + give plenty of bottom space
        <section
            id="projects"
            className="relative z-10 px-4 pt-12 pb-28 md:pt-16 md:pb-32">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Recent Work</h2>

                {loading && <p className="text-white/70">Loading projects…</p>}
                {error && <p className="text-red-300">Couldn't load projects.</p>}

                {!loading && !error && projects.length === 0 && (
                    <p className="text-white/70">No projects yet.</p>
                )}

                {!loading && !error && projects.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {projects.map((p) => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
