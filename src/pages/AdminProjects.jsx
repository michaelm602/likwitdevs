import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuthGate from "../hooks/useAuthGate";
import { auth, db, storage } from "../lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
    addDoc, collection, onSnapshot, orderBy, query,
    serverTimestamp, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// helpers
function slugify(s) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function toTags(s) { return s.split(",").map(t => t.trim()).filter(Boolean); }

// ✅ NEW: always return absolute https:// URL
function normalizeUrl(u = "") {
    const s = (u || "").trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    return `https://${s}`;
}

export default function AdminProjects() {
    const ok = useAuthGate(); // null=loading, true=allowed, false=not allowed
    const [authed, setAuthed] = useState(false);
    const [busy, setBusy] = useState(false);
    const [list, setList] = useState([]);
    const [form, setForm] = useState({
        title: "", href: "", summary: "", description: "", tags: "",
        order: 1, published: true, file: null, preview: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, u => setAuthed(!!u));
        return () => unsub();
    }, []);

    // live list (all projects, admin view)
    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const unsub = onSnapshot(q, snap => {
            setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, []);

    if (ok === null) {
        return <div className="min-h-screen grid place-items-center p-6 text-white">Checking access…</div>;
    }
    if (ok === false) {
        return (
            <main className="min-h-screen grid place-items-center p-6 text-white">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center space-y-3 text-white">
                    <div>Not authorized</div>
                    <Link to="/admin/login" className="inline-flex px-4 py-2 rounded-xl bg-white text-black">Go to Login</Link>
                </div>
            </main>
        );
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (busy) return;

        const { title, href, file } = form;
        const hrefNormalized = normalizeUrl(href); // ✅ make absolute

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

            // write doc
            await addDoc(collection(db, "projects"), {
                title: form.title,
                href: hrefNormalized,            // ✅ save normalized URL
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

            // reset form
            setForm({
                title: "", href: "", summary: "", description: "", tags: "",
                order: 1, published: true, file: null, preview: ""
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
        await updateDoc(doc(db, "projects", p.id), {
            published: !p.published,
            updatedAt: serverTimestamp(),
        });
    }

    async function saveOrder(p, value) {
        await updateDoc(doc(db, "projects", p.id), {
            order: Number(value) || 1,
            updatedAt: serverTimestamp(),
        });
    }

    async function removeProject(p) {
        if (!confirm(`Delete "${p.title}"?`)) return;
        try {
            await deleteDoc(doc(db, "projects", p.id));
            if (p.imagePath) {
                await deleteObject(ref(storage, p.imagePath)).catch(() => { });
            }
        } catch (err) {
            console.error(err);
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
                    <Link to="/" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">View site</Link>
                    {authed && (
                        <>
                            <Link to="/admin" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">Admin</Link>
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
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />

                {/* ✅ normalize on blur so it becomes https://... */}
                <input
                    className="input md:col-span-1"
                    placeholder="Live site URL (https://…)"
                    value={form.href}
                    onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
                    onBlur={e => setForm(f => ({ ...f, href: normalizeUrl(e.target.value) }))}
                />

                <input
                    className="input md:col-span-2"
                    placeholder="What is this? (short summary)"
                    onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                />
                <textarea
                    className="input md:col-span-2"
                    rows={3}
                    placeholder="What does it do? (features, purpose)"
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />

                <input
                    className="input md:col-span-1"
                    placeholder="tags (comma separated)"
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                />
                <input
                    className="input md:col-span-1"
                    type="number" min="1" placeholder="Order (1 = top)"
                    onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                />

                <label className="flex items-center gap-2 md:col-span-1 text-white/90">
                    <input
                        type="checkbox"
                        defaultChecked
                        onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                    />
                    Published
                </label>

                <div className="md:col-span-1 flex items-center gap-3">
                    <input
                        className="input flex-1"
                        type="file" accept="image/*"
                        onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setForm(f => ({ ...f, file, preview: file ? URL.createObjectURL(file) : "" }));
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
                {list.map(p => {
                    const hrefAbs = normalizeUrl(p.href); // ✅ render as absolute
                    return (
                        <div
                            key={p.id}
                            className="grid md:grid-cols-[180px_1fr_auto] items-center gap-3 p-3 rounded-2xl border border-white/10 bg-white/5"
                        >
                            <div
                                className="aspect-video bg-center bg-cover rounded-lg border border-white/10"
                                style={{ backgroundImage: `url('${p.imageUrl || ""}')` }}
                            />
                            <div>
                                <div className="font-semibold">{p.title}</div>
                                {p.summary && <div className="text-sm text-white/85">{p.summary}</div>}
                                {p.description && <div className="text-xs text-white/70 mt-1">{p.description}</div>}
                                <a href={hrefAbs} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white text-sm">
                                    {hrefAbs}
                                </a>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {(p.tags || []).map(t => (
                                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <label className="text-xs text-white/70">Order</label>
                                <input
                                    defaultValue={p.order || 1}
                                    onBlur={(e) => saveOrder(p, e.target.value)}
                                    className="w-16 bg-white/10 rounded px-2 py-1 text-sm"
                                />
                                <button onClick={() => togglePublished(p)} className="btn-subtle">
                                    {p.published ? "Unpublish" : "Publish"}
                                </button>
                                <button onClick={() => removeProject(p)} className="btn-subtle">Delete</button>
                            </div>
                        </div>
                    );
                })}
                {list.length === 0 && (
                    <div className="text-white/70">No projects yet. Add your first one above.</div>
                )}
            </div>
        </main>
    );
}
