import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuthGate from "../hooks/useAuthGate";
import { auth, db, storage } from "../lib/firebase";
import { signOut } from "firebase/auth";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    doc,
    writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import { applyOrderChange } from "../utils/orderUtils";

// helpers
function slugify(s) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function toTags(s) {
    return (s || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}
function tagsToText(tags) {
    return Array.isArray(tags) ? tags.join(", ") : "";
}

// ✅ always return absolute https:// URL
function normalizeUrl(u = "") {
    const s = (u || "").trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    return `https://${s}`;
}

async function batchUpdateOrders(projects) {
    const batch = writeBatch(db);
    const col = collection(db, "projects");
    projects.forEach((p) => {
        batch.update(doc(col, p.id), { order: p.order, updatedAt: serverTimestamp() });
    });
    await batch.commit();
}

export default function AdminProjects() {
    const { loading: authLoading, ok } = useAuthGate();
    const [busy, setBusy] = useState(false);
    const [list, setList] = useState([]);

    // edit state
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState(null);
    const [savingEdit, setSavingEdit] = useState(false);
    const [editError, setEditError] = useState("");

    // optimistic rollback
    const lastGoodRef = useRef([]);

    const [form, setForm] = useState({
        title: "",
        href: "",
        summary: "",
        description: "",
        tags: "",
        order: 1,
        published: true,
        file: null,
        preview: "",
    });

    const navigate = useNavigate();

    // live list (all projects, admin view)
    useEffect(() => {
        const qy = query(collection(db, "projects"), orderBy("order", "asc"));
        const unsub = onSnapshot(qy, (snap) => {
            const next = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setList(next);
            lastGoodRef.current = next;
        });
        return () => unsub();
    }, []);

    const isEditing = useMemo(() => !!editingId, [editingId]);

    if (authLoading) {
        return <div className="min-h-screen grid place-items-center p-6 text-white">Checking access…</div>;
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

    function startEdit(p) {
        setEditError("");
        setEditingId(p.id);
        setDraft({
            title: p.title ?? "",
            href: p.href ?? "",
            summary: p.summary ?? "",
            description: p.description ?? "",
            tags: tagsToText(p.tags),
            order: p.order ?? 1,
            published: !!p.published,
            // image replace
            newFile: null,
            newPreview: "",
        });
    }

    function cancelEdit() {
        setEditError("");
        setEditingId(null);
        setDraft(null);
    }

    function optimisticSet(next) {
        setList(next);
    }

    function rollback() {
        setList(lastGoodRef.current);
    }

    async function handleSaveEdit(p) {
        if (!draft) return;

        setSavingEdit(true);
        setEditError("");

        const patch = {
            title: draft.title.trim(),
            href: normalizeUrl(draft.href),
            summary: draft.summary.trim(),
            description: draft.description.trim(),
            tags: toTags(draft.tags),
            order: Number(draft.order) || 1,
            published: !!draft.published,
            updatedAt: serverTimestamp(),
        };

        // Optimistic patch UI
        const prev = list;
        const next = prev.map((x) => (x.id === p.id ? { ...x, ...patch, href: patch.href } : x));
        optimisticSet(next);

        try {
            // Optional image replace
            if (draft.newFile) {
                const file = draft.newFile;
                const ext = (file.name.split(".").pop() || "jpg").toLowerCase();

                // Keep same path if it exists (clean replace), otherwise create one
                const imagePath =
                    p.imagePath || `projects/${slugify(draft.title || p.title || "project")}-${Date.now()}.${ext}`;

                const fileRef = ref(storage, imagePath);
                await uploadBytes(fileRef, file);
                const imageUrl = await getDownloadURL(fileRef);

                patch.imagePath = imagePath;
                patch.imageUrl = imageUrl;

                // Optimistic apply image too
                optimisticSet(
                    next.map((x) => (x.id === p.id ? { ...x, imagePath, imageUrl } : x))
                );
            }

            await updateDoc(doc(db, "projects", p.id), patch);

            setEditingId(null);
            setDraft(null);
        } catch (err) {
            console.error(err);
            rollback();
            setEditError(err?.message || "Save failed.");
        } finally {
            setSavingEdit(false);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (busy) return;

        const { title, href, file } = form;
        const hrefNormalized = normalizeUrl(href);

        if (!title || !hrefNormalized || !file) {
            alert("Title, Live link, and Image are required.");
            return;
        }

        try {
            setBusy(true);

            // upload image
            const idSlug = slugify(title) + "-" + Date.now();
            const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
            const path = `projects/${idSlug}.${ext}`;
            const fileRef = ref(storage, path);
            await uploadBytes(fileRef, file);
            const imageUrl = await getDownloadURL(fileRef);

            await addDoc(collection(db, "projects"), {
                title: form.title,
                href: hrefNormalized,
                summary: form.summary,
                description: form.description,
                tags: toTags(form.tags),
                order: Number(form.order) || 1,
                published: !!form.published,
                imagePath: path,
                imageUrl,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setForm({
                title: "",
                href: "",
                summary: "",
                description: "",
                tags: "",
                order: 1,
                published: true,
                file: null,
                preview: "",
            });
            (e.target.reset?.())?.();
        } catch (err) {
            console.error(err);
            alert("Could not add project. Check console for details.");
        } finally {
            setBusy(false);
        }
    }

    async function togglePublished(p) {
        // optimistic
        const prev = list;
        optimisticSet(prev.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)));

        try {
            await updateDoc(doc(db, "projects", p.id), {
                published: !p.published,
                updatedAt: serverTimestamp(),
            });
        } catch (e) {
            rollback();
        }
    }

    async function enforceOrder(projectId, rawValue) {
        const prev = list;
        const next = applyOrderChange(prev, projectId, rawValue);

        // optimistic reorder
        optimisticSet(next);

        try {
            await batchUpdateOrders(next);
        } catch (e) {
            console.error(e);
            rollback();
        }
    }

    async function removeProject(p) {
        if (!confirm(`Delete "${p.title}"?`)) return;

        // optimistic remove
        const prev = list;
        optimisticSet(prev.filter((x) => x.id !== p.id));

        try {
            await deleteDoc(doc(db, "projects", p.id));
            if (p.imagePath) {
                await deleteObject(ref(storage, p.imagePath)).catch(() => { });
            }
        } catch (err) {
            console.error(err);
            rollback();
            alert("Delete failed.");
        }
    }

    async function handleSignOut() {
        await signOut(auth);
        navigate("/");
    }

    return (
        <main className="min-h-screen px-4 pt-28 pb-12 text-white">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin — Projects</h1>

                <div className="flex items-center gap-2">
                    <Link to="/" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                        View site
                    </Link>
                    {ok && (
                        <>
                            <Link to="/admin" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                                Admin
                            </Link>
                            <button onClick={handleSignOut} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                                Sign out
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Add new project */}
            <form
                onSubmit={handleAdd}
                className="max-w-6xl mx-auto mt-6 grid gap-3 md:grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-6"
            >
                <input
                    className="input md:col-span-1"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />

                <input
                    className="input md:col-span-1"
                    placeholder="Live site URL (https://…)"
                    value={form.href}
                    onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                    onBlur={(e) => setForm((f) => ({ ...f, href: normalizeUrl(e.target.value) }))}
                />

                <input
                    className="input md:col-span-2"
                    placeholder="What is this? (short summary)"
                    value={form.summary}
                    onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                />

                <textarea
                    className="input md:col-span-2"
                    rows={3}
                    placeholder="What does it do? (features, purpose)"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />

                <input
                    className="input md:col-span-1"
                    placeholder="tags (comma separated)"
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                />

                <input
                    className="input md:col-span-1"
                    type="number"
                    min="1"
                    placeholder="Order (1 = top)"
                    value={form.order}
                    onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                />

                <label className="flex items-center gap-2 md:col-span-1 text-white/90">
                    <input
                        type="checkbox"
                        checked={!!form.published}
                        onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                    />
                    Published
                </label>

                <div className="md:col-span-1 flex items-center gap-3">
                    <input
                        className="input flex-1"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setForm((f) => ({ ...f, file, preview: file ? URL.createObjectURL(file) : "" }));
                        }}
                    />
                    {form.preview && (
                        <div
                            className="w-28 aspect-video bg-center bg-cover rounded-lg border border-white/10"
                            style={{ backgroundImage: `url('${form.preview}')` }}
                        />
                    )}
                </div>

                <button disabled={busy} className="btn md:col-span-2">
                    {busy ? "Saving…" : "Add Project"}
                </button>
            </form>

            {/* Existing projects */}
            <div className="max-w-6xl mx-auto mt-8 space-y-3">
                {list.map((p) => {
                    const hrefAbs = normalizeUrl(p.href);

                    const thisIsEditing = editingId === p.id;

                    return (
                        <div
                            key={p.id}
                            className="grid md:grid-cols-[180px_1fr_auto] items-start gap-3 p-3 rounded-2xl border border-white/10 bg-white/5"
                        >
                            <div
                                className="aspect-video bg-center bg-cover rounded-lg border border-white/10"
                                style={{ backgroundImage: `url('${p.imageUrl || ""}')` }}
                            />

                            <div className="min-w-0">
                                {!thisIsEditing ? (
                                    <>
                                        <div className="font-semibold">{p.title}</div>
                                        {p.summary && <div className="text-sm text-white/85">{p.summary}</div>}
                                        {p.description && <div className="text-xs text-white/70 mt-1">{p.description}</div>}

                                        <a
                                            href={hrefAbs}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-white/70 hover:text-white text-sm break-all"
                                        >
                                            {hrefAbs}
                                        </a>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {(p.tags || []).map((t) => (
                                                <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid gap-3">
                                        <div className="grid md:grid-cols-2 gap-3">
                                            <input
                                                className="input"
                                                placeholder="Title"
                                                value={draft?.title || ""}
                                                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                                            />
                                            <input
                                                className="input"
                                                placeholder="Live URL"
                                                value={draft?.href || ""}
                                                onChange={(e) => setDraft((d) => ({ ...d, href: e.target.value }))}
                                                onBlur={(e) => setDraft((d) => ({ ...d, href: normalizeUrl(e.target.value) }))}
                                            />
                                        </div>

                                        <input
                                            className="input"
                                            placeholder="Summary"
                                            value={draft?.summary || ""}
                                            onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))}
                                        />

                                        <textarea
                                            className="input"
                                            rows={3}
                                            placeholder="Description"
                                            value={draft?.description || ""}
                                            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                                        />

                                        <div className="grid md:grid-cols-2 gap-3">
                                            <input
                                                className="input"
                                                placeholder="tags (comma separated)"
                                                value={draft?.tags || ""}
                                                onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
                                            />

                                            <input
                                                className="input"
                                                type="number"
                                                min="1"
                                                placeholder="Order"
                                                value={draft?.order ?? 1}
                                                onChange={(e) => setDraft((d) => ({ ...d, order: e.target.value }))}
                                                onBlur={() => enforceOrder(p.id, draft?.order)}
                                            />
                                        </div>

                                        <label className="flex items-center gap-2 text-white/90">
                                            <input
                                                type="checkbox"
                                                checked={!!draft?.published}
                                                onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
                                            />
                                            Published
                                        </label>

                                        <div className="flex items-center gap-3">
                                            <input
                                                className="input flex-1"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setDraft((d) => ({
                                                        ...d,
                                                        newFile: file,
                                                        newPreview: file ? URL.createObjectURL(file) : "",
                                                    }));
                                                }}
                                            />
                                            {draft?.newPreview && (
                                                <div
                                                    className="w-28 aspect-video bg-center bg-cover rounded-lg border border-white/10"
                                                    style={{ backgroundImage: `url('${draft.newPreview}')` }}
                                                />
                                            )}
                                        </div>

                                        {editError ? <div className="text-sm text-red-300">{editError}</div> : null}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                {!thisIsEditing ? (
                                    <>
                                        <label className="text-xs text-white/70">Order</label>
                                        <input
                                            defaultValue={p.order || 1}
                                            onBlur={(e) => enforceOrder(p.id, e.target.value)}
                                            className="w-16 bg-white/10 rounded px-2 py-1 text-sm"
                                        />

                                        <button onClick={() => togglePublished(p)} className="btn-subtle">
                                            {p.published ? "Unpublish" : "Publish"}
                                        </button>

                                        <button onClick={() => startEdit(p)} className="btn-subtle">
                                            Edit
                                        </button>

                                        <button onClick={() => removeProject(p)} className="btn-subtle">
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            disabled={savingEdit}
                                            onClick={() => handleSaveEdit(p)}
                                            className="btn"
                                        >
                                            {savingEdit ? "Saving…" : "Save"}
                                        </button>
                                        <button disabled={savingEdit} onClick={cancelEdit} className="btn-subtle">
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}

                {list.length === 0 && <div className="text-white/70">No projects yet. Add your first one above.</div>}
            </div>
        </main>
    );
}
