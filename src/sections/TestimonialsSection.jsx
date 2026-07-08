import ReviewsSection from "./ReviewsSection";

export default function TestimonialsSection() {
    return (
        <ReviewsSection
            title="Trusted By Small Businesses"
            eyebrow="Client Reviews"
            copy="Real feedback from business owners after launching their websites and digital systems."
            query={{ featuredOnly: true, showOnHomepage: true, limitCount: 6 }}
        />
    );
}
