import { Link } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";

const SCORE_OVERRIDES = {
    // Add measured project scores here by Firestore document id when available.
    // Firestore fields on the project document take precedence over this map.
};

function getProjectScores(project) {
    const override = SCORE_OVERRIDES[project.id] || {};
    const source = project.scores || project.metrics || {};

    return {
        perf: project.perf || project.performance || source.perf || source.performance || override.perf || "Fast",
        seo: project.seo || source.seo || override.seo || "SEO-ready",
        mobile: project.mobile || source.mobile || override.mobile || "Mobile-first",
        load: project.load || source.load || override.load || "1-3s",
    };
}

export default function ProjectsSection() {
    const { projects, loading, error } = useProjects();

    return (
        <section
            id="projects"
            className="relative z-10 px-4 pt-12 pb-28 md:pt-16 md:pb-32 scroll-mt-32"
        >
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <p className="mb-3 text-[0.68rem] uppercase tracking-[0.18em] text-white/35">
                        Case Studies
                    </p>
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
                                <ProjectCard project={p} scores={getProjectScores(p)} />
                            </Reveal>
                        ))}
                    </div>
                )}

                {/* CTA block (conversion loop) */}
                <div
                    className="mt-10 rounded-lg border p-6 md:p-8"
                    style={{
                        background: "linear-gradient(135deg, rgba(20,20,23,0.9), rgba(10,10,11,0.95))",
                        borderColor: "var(--border)",
                    }}
                >
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
                            <Link
                                to="/free-review"
                                className="rounded-md bg-white px-4 py-2 font-semibold text-black transition hover:opacity-90"
                            >
                                Get My Free Review
                            </Link>
                            <a
                                href="#pricing"
                                className="rounded-md border px-4 py-2 font-semibold text-white/80 transition hover:bg-white/10"
                                style={{ borderColor: "var(--border-hi)" }}
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
