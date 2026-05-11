import Reveal from "./Reveal";

const DEFAULT_SCORES = {
    perf: "Fast",
    seo: "SEO-ready",
    mobile: "Mobile-first",
    load: "1-3s",
};

export default function ProjectCard({ project, scores = DEFAULT_SCORES }) {
    const { title, summary, description, href, imageUrl, tags = [], imageFocus } = project;

    const safeHref = /^https?:\/\//i.test(href || "") ? href : `https://${href || ""}`;
    const bgPos = imageFocus || "50% 25%";
    const uniqueTags = [...new Set(tags)].slice(0, 4);
    const category = uniqueTags[0] || "Case Study";
    const scoreItems = [
        ["Perf", scores.perf || DEFAULT_SCORES.perf, "border-b border-r sm:border-b-0"],
        ["SEO", scores.seo || DEFAULT_SCORES.seo, "border-b sm:border-b-0 sm:border-r"],
        ["Mobile", scores.mobile || DEFAULT_SCORES.mobile, "border-r"],
        ["Load", scores.load || DEFAULT_SCORES.load, ""],
    ];

    return (
        <article
            className="
                group relative overflow-hidden rounded-lg border
                transition duration-300 ease-out
                hover:-translate-y-1 focus-within:-translate-y-1
            "
            style={{
                background: "linear-gradient(180deg, rgba(20,20,23,0.92), rgba(10,10,11,0.96))",
                borderColor: "var(--border)",
                boxShadow: "0 20px 70px rgba(0,0,0,0.42)",
            }}
        >
            <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden border-b"
                style={{ borderColor: "var(--border)" }}
                aria-label={`Open ${title} in a new tab`}
            >
                <Reveal>
                    <div
                        className="relative aspect-[16/9] bg-no-repeat bg-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                        style={{
                            backgroundColor: "var(--bg-lift)",
                            backgroundImage: imageUrl ? `url('${imageUrl}')` : "none",
                            backgroundPosition: bgPos,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                        <div className="absolute left-4 top-4 rounded-md border border-white/15 bg-black/45 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
                            {category}
                        </div>
                    </div>
                </Reveal>
            </a>

            <Reveal>
                <div className="p-5 text-white md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/35">
                                Live Build
                            </p>
                            <h3 className="mt-2 text-xl font-semibold leading-tight text-white md:text-2xl">
                                {title}
                            </h3>
                        </div>

                        <a
                            href={safeHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 rounded-md border px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white hover:text-black"
                            style={{ borderColor: "var(--border-hi)" }}
                        >
                            View
                        </a>
                    </div>

                    {summary && <p className="mt-4 text-white/80">{summary}</p>}
                    {description && (
                        <p className="mt-2 break-words leading-relaxed text-white/62">
                            {description}
                        </p>
                    )}

                    {uniqueTags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {uniqueTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-md border px-2.5 py-1 text-xs text-white/70"
                                    style={{
                                        background: "rgba(255,255,255,0.035)",
                                        borderColor: "var(--border)",
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div
                        className="mt-6 grid grid-cols-2 overflow-hidden rounded-md border sm:grid-cols-4"
                        style={{ borderColor: "var(--border)" }}
                    >
                        {scoreItems.map(([label, value, borders]) => (
                            <div
                                key={label}
                                className={`px-3 py-3 ${borders}`}
                                style={{
                                    borderColor: "var(--border)",
                                    background: "rgba(255,255,255,0.025)",
                                }}
                            >
                                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-white/32">
                                    {label}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-white/82">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>
        </article>
    );
}
