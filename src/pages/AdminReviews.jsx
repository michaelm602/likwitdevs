import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import useAuthGate from "../hooks/useAuthGate";
import { auth, db } from "../lib/firebase";
import {
    REVIEW_SOURCE_OPTIONS,
    clampRating,
    frevaSeedReview,
    normalizeReviewSource,
    optionalNumber,
    sortReviews,
} from "../lib/reviews";
import { workProjects } from "../data/workProjects";

const emptyForm = {
    clientName: "",
    companyName: "",
    rating: 5,
    reviewText: "",
    source: "Google",
    sourceUrl: "",
    associatedProjectId: "",
    featured: false,
    showOnHomepage: false,
    showOnServices: false,
    displayOrder: 1,
};

function normalizeUrl(value = "") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

function reviewToForm(review) {
    return {
        clientName: review.clientName || "",
        companyName: review.companyName || "",
        rating: clampRating(review.rating),
        reviewText: review.reviewText || "",
        source: normalizeReviewSource(review.source),
        sourceUrl: review.sourceUrl || "",
        associatedProjectId: review.associatedProjectId || "",
        featured: !!review.featured,
        showOnHomepage: !!review.showOnHomepage,
        showOnServices: !!review.showOnServices,
        displayOrder: review.displayOrder ?? 1,
    };
}

function buildPayload(form) {
    return {
        clientName: form.clientName.trim(),
        companyName: form.companyName.trim(),
        rating: clampRating(form.rating),
        reviewText: form.reviewText.trim(),
        source: normalizeReviewSource(form.source),
        sourceUrl: normalizeUrl(form.sourceUrl),
        associatedProjectId: form.associatedProjectId.trim(),
        featured: !!form.featured,
        showOnHomepage: !!form.showOnHomepage,
        showOnServices: !!form.showOnServices,
        displayOrder: optionalNumber(form.displayOrder) ?? 999,
    };
}

function AdminNav({ onSignOut }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                View site
            </Link>
            <Link to="/admin" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                Projects
            </Link>
            <Link to="/admin/leads" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                Leads
            </Link>
            <Link to="/admin/reviews" className="px-3 py-2 rounded-xl bg-white/20">
                Reviews
            </Link>
            <Link to="/admin/analytics" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                Analytics
            </Link>
            <button type="button" onClick={onSignOut} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                Sign out
            </button>
        </div>
    );
}

function ProjectSelect({ value, onChange }) {
    return (
        <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
            <option value="">No associated project</option>
            {workProjects.map((project) => (
                <option key={project.slug} value={project.slug}>
                    {project.name}
                </option>
            ))}
        </select>
    );
}

function ReviewFields({ form, setForm }) {
    return (
        <>
            <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-sm text-white/80">
                    Client Name
                    <input
                        className="input"
                        value={form.clientName}
                        onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))}
                        placeholder="Client name"
                    />
                </label>
                <label className="grid gap-1 text-sm text-white/80">
                    Company Name
                    <input
                        className="input"
                        value={form.companyName}
                        onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
                        placeholder="Company name"
                    />
                </label>
            </div>

            <label className="grid gap-1 text-sm text-white/80">
                Review Text
                <textarea
                    className="input"
                    rows={4}
                    value={form.reviewText}
                    onChange={(event) => setForm((current) => ({ ...current, reviewText: event.target.value }))}
                    placeholder="Paste the review here"
                />
            </label>

            <div className="grid gap-3 md:grid-cols-[120px_180px_1fr]">
                <label className="grid gap-1 text-sm text-white/80">
                    Rating
                    <input
                        className="input"
                        type="number"
                        min="1"
                        max="5"
                        value={form.rating}
                        onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
                    />
                </label>
                <label className="grid gap-1 text-sm text-white/80">
                    Source
                    <select
                        className="input"
                        value={form.source}
                        onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))}
                    >
                        {REVIEW_SOURCE_OPTIONS.map((source) => (
                            <option key={source} value={source}>
                                {source}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="grid gap-1 text-sm text-white/80">
                    Source URL
                    <input
                        className="input"
                        value={form.sourceUrl}
                        onChange={(event) => setForm((current) => ({ ...current, sourceUrl: event.target.value }))}
                        onBlur={(event) => setForm((current) => ({ ...current, sourceUrl: normalizeUrl(event.target.value) }))}
                        placeholder="Optional"
                    />
                </label>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_160px]">
                <label className="grid gap-1 text-sm text-white/80">
                    Associated Project
                    <ProjectSelect
                        value={form.associatedProjectId}
                        onChange={(value) => setForm((current) => ({ ...current, associatedProjectId: value }))}
                    />
                </label>
                <label className="grid gap-1 text-sm text-white/80">
                    Display Order
                    <input
                        className="input"
                        type="number"
                        min="1"
                        value={form.displayOrder}
                        onChange={(event) => setForm((current) => ({ ...current, displayOrder: event.target.value }))}
                    />
                </label>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
                <label className="flex items-center gap-2 text-white/90">
                    <input
                        type="checkbox"
                        checked={!!form.featured}
                        onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                    />
                    Featured
                </label>
                <label className="flex items-center gap-2 text-white/90">
                    <input
                        type="checkbox"
                        checked={!!form.showOnHomepage}
                        onChange={(event) => setForm((current) => ({ ...current, showOnHomepage: event.target.checked }))}
                    />
                    Show on Homepage
                </label>
                <label className="flex items-center gap-2 text-white/90">
                    <input
                        type="checkbox"
                        checked={!!form.showOnServices}
                        onChange={(event) => setForm((current) => ({ ...current, showOnServices: event.target.checked }))}
                    />
                    Show on Services
                </label>
            </div>
        </>
    );
}

export default function AdminReviews() {
    const { loading: authLoading, ok } = useAuthGate();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const lastGoodRef = useRef([]);

    useEffect(() => {
        if (!ok) return undefined;

        const reviewsQuery = query(collection(db, "reviews"), orderBy("displayOrder", "asc"));
        const unsubscribe = onSnapshot(
            reviewsQuery,
            (snapshot) => {
                const next = snapshot.docs.map((reviewDoc) => ({ id: reviewDoc.id, ...reviewDoc.data() })).sort(sortReviews);
                setReviews(next);
                lastGoodRef.current = next;
                setError("");
                setForm((current) => ({
                    ...current,
                    displayOrder: current.displayOrder || next.length + 1,
                }));
            },
            (err) => {
                console.error("Admin reviews load failed", err);
                setError("Could not load reviews.");
            }
        );

        return () => unsubscribe();
    }, [ok]);

    async function handleSignOut() {
        await signOut(auth);
        navigate("/");
    }

    function validate(payload) {
        if (!payload.clientName) return "Client name is required.";
        if (!payload.reviewText) return "Review text is required.";
        if (!payload.companyName) return "Company name is required.";
        return "";
    }

    async function handleAdd(event) {
        event.preventDefault();
        if (busy) return;

        const payload = buildPayload(form);
        const validationError = validate(payload);
        if (validationError) {
            setError(validationError);
            return;
        }

        setBusy(true);
        setError("");
        try {
            await addDoc(collection(db, "reviews"), {
                ...payload,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            setForm({ ...emptyForm, displayOrder: reviews.length + 2 });
        } catch (err) {
            console.error("Add review failed", err);
            setError("Could not add review.");
        } finally {
            setBusy(false);
        }
    }

    async function handleSeedFreva() {
        if (busy) return;
        setBusy(true);
        setError("");

        try {
            const existing = reviews.find(
                (review) =>
                    review.associatedProjectId === frevaSeedReview.associatedProjectId &&
                    review.clientName === frevaSeedReview.clientName
            );

            if (existing) {
                await updateDoc(doc(db, "reviews", existing.id), {
                    ...frevaSeedReview,
                    updatedAt: serverTimestamp(),
                });
            } else {
                await addDoc(collection(db, "reviews"), {
                    ...frevaSeedReview,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            }
        } catch (err) {
            console.error("Seed Freva review failed", err);
            setError("Could not seed the Freva review. Make sure you are signed in as the admin owner.");
        } finally {
            setBusy(false);
        }
    }

    function startEdit(review) {
        setEditingId(review.id);
        setDraft(reviewToForm(review));
        setError("");
    }

    function cancelEdit() {
        setEditingId(null);
        setDraft(null);
        setError("");
    }

    async function saveEdit(reviewId) {
        if (!draft || busy) return;
        const payload = buildPayload(draft);
        const validationError = validate(payload);
        if (validationError) {
            setError(validationError);
            return;
        }

        const previous = reviews;
        setReviews(previous.map((review) => (review.id === reviewId ? { ...review, ...payload } : review)));
        setBusy(true);
        setError("");

        try {
            await updateDoc(doc(db, "reviews", reviewId), {
                ...payload,
                updatedAt: serverTimestamp(),
            });
            setEditingId(null);
            setDraft(null);
        } catch (err) {
            console.error("Save review failed", err);
            setReviews(lastGoodRef.current);
            setError("Could not save review.");
        } finally {
            setBusy(false);
        }
    }

    async function removeReview(review) {
        if (!confirm(`Delete review from ${review.clientName}?`)) return;

        const previous = reviews;
        setReviews(previous.filter((item) => item.id !== review.id));
        setError("");

        try {
            await deleteDoc(doc(db, "reviews", review.id));
        } catch (err) {
            console.error("Delete review failed", err);
            setReviews(previous);
            setError("Could not delete review.");
        }
    }

    if (authLoading) {
        return <div className="min-h-screen grid place-items-center p-6 text-white">Checking access...</div>;
    }

    if (!ok) {
        return (
            <main className="min-h-screen grid place-items-center p-6 text-white">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center space-y-3 text-white">
                    <div>Not authorized</div>
                    <Link to="/admin/login" className="inline-flex px-4 py-2 rounded-xl bg-white text-black">
                        Go to Login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-4 pt-28 pb-12 text-white">
            <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">Admin</p>
                    <h1 className="text-2xl font-bold">Reviews</h1>
                    <p className="mt-1 text-sm text-white/65">Manage client reviews shown across the site.</p>
                </div>
                <AdminNav onSignOut={handleSignOut} />
            </div>

            {error && (
                <div className="max-w-6xl mx-auto mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-red-200">
                    {error}
                </div>
            )}

            <section className="max-w-6xl mx-auto mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Add Review</h2>
                        <p className="mt-1 text-sm text-white/60">Use the Freva seed button once, or add reviews manually.</p>
                    </div>
                    <button type="button" onClick={handleSeedFreva} disabled={busy} className="btn-subtle">
                        Seed Freva Review
                    </button>
                </div>

                <form onSubmit={handleAdd} className="mt-5 grid gap-4">
                    <ReviewFields form={form} setForm={setForm} />
                    <div>
                        <button type="submit" disabled={busy} className="btn">
                            {busy ? "Saving..." : "Add Review"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="max-w-6xl mx-auto mt-8 space-y-3">
                {reviews.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                        No reviews yet. Add one above or seed the Freva review.
                    </div>
                ) : (
                    reviews.map((review) => {
                        const isEditing = editingId === review.id;
                        const associatedProject = workProjects.find((project) => project.slug === review.associatedProjectId);

                        return (
                            <article key={review.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                {!isEditing ? (
                                    <div className="grid gap-4 lg:grid-cols-[1fr_190px] lg:items-start">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="font-semibold text-white">{review.clientName}</h2>
                                                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs text-white/70">
                                                    {review.rating || 5}/5 {review.source || "Review"}
                                                </span>
                                                {review.featured && (
                                                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-100">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-white/60">{review.companyName}</p>
                                            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80">"{review.reviewText}"</p>
                                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                                                <span>Order #{review.displayOrder || 999}</span>
                                                <span>{review.showOnHomepage ? "Homepage" : "Not homepage"}</span>
                                                <span>{review.showOnServices ? "Services" : "Not services"}</span>
                                                <span>{associatedProject?.name || review.associatedProjectId || "No project"}</span>
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <button type="button" onClick={() => startEdit(review)} className="btn-subtle">
                                                Edit
                                            </button>
                                            <button type="button" onClick={() => removeReview(review)} className="btn-subtle">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        <ReviewFields form={draft} setForm={setDraft} />
                                        <div className="flex flex-wrap gap-2">
                                            <button type="button" onClick={() => saveEdit(review.id)} disabled={busy} className="btn">
                                                {busy ? "Saving..." : "Save"}
                                            </button>
                                            <button type="button" onClick={cancelEdit} disabled={busy} className="btn-subtle">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}
            </section>
        </main>
    );
}
