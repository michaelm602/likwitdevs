import Reveal from "../components/Reveal";
import ReviewCard from "../components/ReviewCard";
import useReviews from "../hooks/useReviews";

export default function ReviewsSection({
    title = "What Clients Say",
    eyebrow = "Client Reviews",
    copy = "Real feedback from businesses that trusted Likwit Devs with their website, workflow, or digital presence.",
    query = {},
    className = "",
}) {
    const { reviews, loading, error } = useReviews(query);

    if (!loading && (error || reviews.length === 0)) return null;

    return (
        <section className={`mx-auto max-w-6xl px-4 pt-2 pb-10 md:pb-14 ${className}`}>
            <Reveal>
                <div className="rounded-3xl border border-white/15 bg-black/20 p-6 backdrop-blur-md md:p-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{eyebrow}</p>
                        <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">{title}</h2>
                        {copy && <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">{copy}</p>}
                    </div>

                    {loading ? (
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="h-56 rounded-2xl border border-white/10 bg-white/[0.04]" />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    )}
                </div>
            </Reveal>
        </section>
    );
}
