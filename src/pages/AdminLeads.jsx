import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import useAuthGate from "../hooks/useAuthGate";
import { auth, db } from "../lib/firebase";
import { trackEvent } from "../lib/analytics";

const leadStatuses = ["New", "Contacted", "Discovery", "Proposal Sent", "Won", "Lost", "Spam"];

function formatDate(value) {
    const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return "Unknown";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function includesSearch(lead, search) {
    if (!search) return true;
    const haystack = [
        lead.name,
        lead.email,
        lead.website,
        lead.message,
        lead.rawMessage,
    ].join(" ").toLowerCase();

    return haystack.includes(search.toLowerCase());
}

export default function AdminLeads() {
    const { loading: authLoading, ok } = useAuthGate();
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [projectTypeFilter, setProjectTypeFilter] = useState("");
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState("");
    const [draftNotes, setDraftNotes] = useState({});
    const [savingId, setSavingId] = useState("");

    useEffect(() => {
        const leadsQuery = query(collection(db, "leads"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(
            leadsQuery,
            (snapshot) => {
                const next = snapshot.docs.map((leadDoc) => ({ id: leadDoc.id, ...leadDoc.data() }));
                setLeads(next);
                setDraftNotes((current) => {
                    const merged = { ...current };
                    next.forEach((lead) => {
                        if (merged[lead.id] === undefined) merged[lead.id] = lead.notes || "";
                    });
                    return merged;
                });
                setLoadingLeads(false);
                setError("");
            },
            (err) => {
                console.error("Lead load failed", err);
                setError("Could not load leads.");
                setLoadingLeads(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const projectTypes = useMemo(
        () => [...new Set(leads.map((lead) => lead.projectType).filter(Boolean))].sort(),
        [leads]
    );

    const filteredLeads = useMemo(
        () =>
            leads.filter((lead) => {
                if (statusFilter && lead.status !== statusFilter) return false;
                if (projectTypeFilter && lead.projectType !== projectTypeFilter) return false;
                return includesSearch(lead, search);
            }),
        [leads, projectTypeFilter, search, statusFilter]
    );

    async function handleSignOut() {
        await signOut(auth);
        navigate("/");
    }

    async function updateLead(leadId, patch) {
        setSavingId(leadId);
        try {
            await updateDoc(doc(db, "leads", leadId), {
                ...patch,
                updatedAt: serverTimestamp(),
            });
            if (patch.status) {
                trackEvent({
                    eventName: "admin_lead_status_changed",
                    leadId,
                    metadata: {
                        status: patch.status,
                    },
                });
            }
            if (Object.prototype.hasOwnProperty.call(patch, "notes")) {
                trackEvent({
                    eventName: "admin_lead_note_updated",
                    leadId,
                    metadata: {
                        hasNotes: Boolean(patch.notes),
                        noteLength: String(patch.notes || "").length,
                    },
                });
            }
        } catch (err) {
            console.error("Lead update failed", err);
            setError("Could not update lead.");
        } finally {
            setSavingId("");
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
                    <h1 className="text-2xl font-bold">Leads</h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Link to="/" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                        View site
                    </Link>
                    <Link to="/admin" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                        Projects
                    </Link>
                    <Link to="/admin/leads" className="px-3 py-2 rounded-xl bg-white/20">
                        Leads
                    </Link>
                    <button onClick={handleSignOut} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                        Sign out
                    </button>
                </div>
            </div>

            <section className="max-w-6xl mx-auto mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_180px_220px]">
                    <input
                        className="input"
                        placeholder="Search name, email, website, or message"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All statuses</option>
                        {leadStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <select
                        className="input"
                        value={projectTypeFilter}
                        onChange={(e) => setProjectTypeFilter(e.target.value)}
                    >
                        <option value="">All project types</option>
                        {projectTypes.map((projectType) => (
                            <option key={projectType} value={projectType}>
                                {projectType}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <section className="max-w-6xl mx-auto mt-6 space-y-3">
                {error && <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-red-200">{error}</div>}
                {loadingLeads && <div className="text-white/70">Loading leads...</div>}
                {!loadingLeads && filteredLeads.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                        No leads match the current filters.
                    </div>
                )}

                {filteredLeads.map((lead) => {
                    const isExpanded = expandedId === lead.id;
                    const website = lead.website || "";

                    return (
                        <article key={lead.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_160px_160px] lg:items-start">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="font-semibold text-white">{lead.name || "Unknown lead"}</h2>
                                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs text-white/70">
                                            {lead.projectType || "Not sure yet"}
                                        </span>
                                    </div>
                                    <a href={`mailto:${lead.email}`} className="mt-1 block break-all text-sm text-white/75 hover:text-white">
                                        {lead.email || "No email"}
                                    </a>
                                    {website && (
                                        <a
                                            href={website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 block break-all text-sm text-white/60 hover:text-white"
                                        >
                                            {website}
                                        </a>
                                    )}
                                </div>

                                <div className="text-sm text-white/70">
                                    <div>Intent: {lead.rawIntent || "none"}</div>
                                    <div>Created: {formatDate(lead.createdAt)}</div>
                                    <div>Source: {lead.source || "unknown"}</div>
                                </div>

                                <select
                                    className="input"
                                    value={lead.status || "New"}
                                    onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                                    disabled={savingId === lead.id}
                                >
                                    {leadStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => setExpandedId(isExpanded ? "" : lead.id)}
                                    className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                                >
                                    {isExpanded ? "Hide Details" : "View Details"}
                                </button>
                            </div>

                            <div className="mt-4">
                                <label className="text-sm text-white/80">Internal Notes</label>
                                <textarea
                                    className="input mt-1"
                                    rows={3}
                                    value={draftNotes[lead.id] ?? ""}
                                    onChange={(e) =>
                                        setDraftNotes((current) => ({ ...current, [lead.id]: e.target.value }))
                                    }
                                    onBlur={() => updateLead(lead.id, { notes: draftNotes[lead.id] || "" })}
                                    placeholder="Add private follow-up notes..."
                                    disabled={savingId === lead.id}
                                />
                            </div>

                            {isExpanded && (
                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                                        <h3 className="font-semibold text-white">Message</h3>
                                        <pre className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-white/75">
                                            {lead.message || "No message saved."}
                                        </pre>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                                        <h3 className="font-semibold text-white">Raw Message</h3>
                                        <pre className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-white/75">
                                            {lead.rawMessage || "No raw message saved."}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </article>
                    );
                })}
            </section>
        </main>
    );
}
