export default function ProjectCard({ project }) {
    const { title, summary, description, href, imageUrl, tags = [], imageFocus } = project;

    // ensure absolute URL
    const safeHref = /^https?:\/\//i.test(href || "") ? href : `https://${href || ""}`;
    const bgPos = imageFocus || "50% 25%";

    return (
        <article className="rounded-2xl border border-white/15 bg-black/40 backdrop-blur-sm shadow-xl shadow-black/80">
            {/* make the screenshot open the live site too */}
            <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-t-2xl overflow-hidden"
                aria-label={`Open ${title} in a new tab`}
            >
                <div
                    className="relative aspect-[16/9] bg-no-repeat bg-contain"
                    style={{ backgroundImage: `url('${imageUrl || ""}')`, backgroundPosition: bgPos }}
                >
                    <div className="absolute inset-0" />
                </div>
            </a>

            <div className="rounded-b-2xl p-5 pb-6 text-white">
                <h3 className="text-xl font-semibold">{title}</h3>
                {summary && <p className="mt-2 text-white/90">{summary}</p>}
                {description && <p className="mt-2 text-white/80 leading-relaxed break-words">{description}</p>}

                <div className="mt-4 flex items-center justify-between gap-3">
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map(t => (
                                <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/85">
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* ✅ real link, not <Link to> */}
                    <a
                        href={safeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn whitespace-nowrap"
                    >
                        Live site ↗
                    </a>
                </div>
            </div>
        </article>
    );
}
