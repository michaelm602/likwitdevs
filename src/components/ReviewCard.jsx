import { ExternalLink } from "lucide-react";
import { clampRating, getReviewSourceLabel } from "../lib/reviews";

function StarRating({ rating }) {
    const normalizedRating = clampRating(rating);

    return (
        <div className="flex gap-0.5" aria-label={`${normalizedRating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, index) => (
                <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-4 w-4 ${index < normalizedRating ? "text-yellow-400" : "text-white/20"}`}
                    aria-hidden="true"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.95 2.679c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
            ))}
        </div>
    );
}

export default function ReviewCard({ review }) {
    const sourceLabel = getReviewSourceLabel(review.source);

    return (
        <article className="flex h-full flex-col gap-3 rounded-2xl border border-white/15 bg-black/20 p-6 shadow-[0_4px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <StarRating rating={review.rating} />
            <p className="flex-1 text-sm leading-relaxed text-white/85">"{review.reviewText}"</p>
            <div>
                <div className="text-sm font-semibold text-white">{review.clientName}</div>
                {review.companyName && <div className="mt-0.5 text-xs text-white/55">{review.companyName}</div>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-2">
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">
                    {sourceLabel}
                </span>
                {review.sourceUrl && (
                    <a
                        href={review.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 transition hover:text-white"
                    >
                        View on {review.source}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                )}
            </div>
        </article>
    );
}
