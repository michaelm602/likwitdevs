export const REVIEW_SOURCE_OPTIONS = ["Google", "Facebook", "Email", "Text", "Other"];

export const frevaSeedReview = {
    clientName: "Fredi Vazquez",
    companyName: "Freva Construction LLC",
    rating: 5,
    reviewText:
        "Likwit Devs was very helpful and did an amazing job on my hardscape website that definitely improved the look of my business! Couldn't be happier with the outcome. I would definitely recommend!",
    source: "Google",
    sourceUrl: "",
    associatedProjectId: "freva-construction",
    featured: true,
    showOnHomepage: true,
    showOnServices: true,
    displayOrder: 1,
};

export function clampRating(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 5;
    return Math.min(5, Math.max(1, Math.round(number)));
}

export function optionalNumber(value) {
    if (value === "" || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

export function normalizeReviewSource(value) {
    return REVIEW_SOURCE_OPTIONS.includes(value) ? value : "Other";
}

export function getReviewSourceLabel(source) {
    const normalized = normalizeReviewSource(source);
    return `${normalized} Review`;
}

function toMillis(value) {
    const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
}

export function sortReviews(a, b) {
    const orderDifference = (Number(a.displayOrder) || 9999) - (Number(b.displayOrder) || 9999);
    if (orderDifference !== 0) return orderDifference;
    return toMillis(b.createdAt) - toMillis(a.createdAt);
}
