import ReviewsSection from "./ReviewsSection";

export default function TestimonialsSection({ placement = "homepage" }) {
    const visibilityFilter = placement === "services"
        ? { showOnServices: true }
        : { showOnHomepage: true };

    return (
        <ReviewsSection
            title="Trusted By Small Businesses"
            eyebrow="Client Reviews"
            copy="Real feedback from business owners after launching their websites and digital systems."
            query={{ featuredOnly: true, ...visibilityFilter, limitCount: 6 }}
        />
    );
}
