export default function WorkProjectImage({ project, loading, className = "rounded-xl" }) {
    const baseClass = `relative flex aspect-[16/9] items-center justify-center overflow-hidden border border-white/10 bg-white/[0.04] ${className}`;

    if (loading && !project.imageUrl) {
        return (
            <div className={baseClass} aria-label={`Loading ${project.name} project visual`}>
                <div className="absolute inset-0 animate-pulse bg-white/[0.06]" />
                <span className="relative text-xs uppercase tracking-[0.16em] text-white/60">
                    Loading project visual
                </span>
            </div>
        );
    }

    if (project.imageUrl) {
        return (
            <div className={baseClass}>
                <img
                    src={project.imageUrl}
                    alt={project.imageAlt || `${project.name} project preview`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: project.imageFocus || "50% 25%" }}
                />
            </div>
        );
    }

    return (
        <div className={baseClass}>
            <span className="text-xs uppercase tracking-[0.16em] text-white/60">
                Project visual coming soon
            </span>
        </div>
    );
}
