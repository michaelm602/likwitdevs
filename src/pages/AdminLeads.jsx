import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
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

const proposalPackages = [
    {
        name: "Starter",
        label: "Starter ($800)",
        price: "$800",
        timeline: "1-2 weeks",
        scope: [
            "Single-page landing site with hero, services, gallery, and contact sections",
            "Mobile-first responsive layout",
            "On-page SEO setup for titles, meta, headings, and schema",
            "Two revision rounds before launch",
        ],
    },
    {
        name: "Core",
        label: "Core ($1,500)",
        price: "$1,500",
        timeline: "2-3 weeks",
        scope: [
            "Multi-page business website with home, about, services, gallery, and contact pages",
            "Mobile-first responsive design and development",
            "On-page SEO, sitemap/robots setup, and analytics installation",
            "30-day post-launch support",
        ],
    },
    {
        name: "Premium",
        label: "Premium ($2,500+)",
        price: "$2,500+",
        timeline: "3-4 weeks",
        scope: [
            "Everything in Core",
            "Booking or scheduling integration",
            "Customer intake capture and email notifications",
            "Admin access to bookings or submissions with delivery walkthrough",
        ],
    },
    {
        name: "Custom Systems",
        label: "Custom Systems ($4,000+)",
        price: "$4,000+",
        timeline: "Quoted after scope review",
        scope: [
            "Custom planning around the business workflow",
            "Multi-step intake, portal, dashboard, or AI-assisted tool build",
            "Data capture and management interface",
            "Launch support, handoff, and scoped next steps",
        ],
    },
];


const auditTemplateOptions = [
    "General Business",
    "Contractor",
    "Salon / Beauty",
    "Therapist",
    "Auto Repair",
    "Photographer",
];

const auditTemplates = {
    "General Business": {
        snapshot: "The website should quickly explain what the business does, who it helps, and what action a visitor should take next.",
        trustSignals: "- Customer reviews\n- Clear business contact information\n- Photos of real work, team, or location",
        conversionOpportunities: "- Clear primary call-to-action\n- Simple contact form\n- Click-to-call button on mobile",
        priorityIssues: "- Clarify the main offer above the fold\n- Make the next step easier to find\n- Strengthen proof and credibility near the top of the page",
        recommendedNextSteps: "Start with the highest-friction parts of the visitor path: homepage clarity, mobile contact flow, and trust signals.",
    },
    Contractor: {
        snapshot: "The website should help homeowners quickly understand the services offered, see proof of completed work, and request an estimate with confidence.",
        trustSignals: "- Project gallery\n- Reviews\n- License and insurance information",
        conversionOpportunities: "- Request estimate CTA\n- Service area pages\n- Photo-backed service pages",
        priorityIssues: "- Feature completed projects more prominently\n- Add service-area content for local searches\n- Make estimate requests easy from every major page",
        recommendedNextSteps: "Prioritize a stronger project gallery, service-area structure, and a clearer estimate request flow.",
    },
    "Salon / Beauty": {
        snapshot: "The website should make services, style, pricing expectations, and booking steps easy to understand from a phone.",
        trustSignals: "- Client reviews\n- Service photos\n- Studio or provider photos",
        conversionOpportunities: "- Book appointment CTA\n- Service menu with clear categories\n- Intake or appointment request form",
        priorityIssues: "- Make booking the clearest next step\n- Organize services for fast scanning\n- Add visual proof near service descriptions",
        recommendedNextSteps: "Focus on mobile booking flow, service clarity, and stronger visual proof for new clients.",
    },
    Therapist: {
        snapshot: "The website should feel trustworthy, calm, and clear while helping visitors understand fit, services, and how to take the next step privately.",
        trustSignals: "- Credentials and specialties\n- Clear privacy-aware language\n- Professional headshot or office photo",
        conversionOpportunities: "- Consultation request CTA\n- Service/specialty pages\n- Insurance or private-pay clarity",
        priorityIssues: "- Clarify who the practice helps\n- Make the inquiry path feel low-pressure\n- Add specialties and location signals for search",
        recommendedNextSteps: "Improve service clarity, trust signals, and the private inquiry path before adding more content.",
    },
    "Auto Repair": {
        snapshot: "The website should make the shop easy to trust, easy to contact, and easy to choose when a driver needs help quickly.",
        trustSignals: "- Customer reviews\n- ASE certifications\n- Shop photos",
        conversionOpportunities: "- Click-to-call button\n- Online appointment request\n- Repair intake form",
        priorityIssues: "- Put phone and appointment actions higher on mobile\n- Add shop proof and certifications near service content\n- Create service pages for common repair searches",
        recommendedNextSteps: "Prioritize mobile click-to-call, appointment requests, repair intake, and trust proof around reviews and certifications.",
    },
    Photographer: {
        snapshot: "The website should show the quality of the work quickly, explain packages clearly, and guide visitors toward an inquiry.",
        trustSignals: "- Portfolio galleries\n- Client reviews\n- Featured sessions or publications",
        conversionOpportunities: "- Inquiry CTA\n- Package or starting-price section\n- Session type pages",
        priorityIssues: "- Make portfolio categories easier to browse\n- Clarify the inquiry process\n- Add stronger calls-to-action after galleries",
        recommendedNextSteps: "Focus on portfolio navigation, package clarity, and inquiry flow so visitors know what to do after viewing the work.",
    },
};
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
        lead.originPage,
        lead.landingPage,
        lead.referrer,
        lead.message,
        lead.rawMessage,
    ].join(" ").toLowerCase();

    return haystack.includes(search.toLowerCase());
}

function optionalNumber(value) {
    if (value === "" || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function parsePriceAmount(value) {
    const normalized = String(value || "").replace(/[^0-9.]/g, "");
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
}

function formatCurrency(value, hasPlus = false) {
    if (!Number.isFinite(value)) return "TBD";
    return `${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value)}${hasPlus ? "+" : ""}`;
}

function normalizeDepositPercentage(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 50;
    return Math.min(100, Math.max(0, number));
}

function getPackage(name) {
    return proposalPackages.find((item) => item.name === name) || proposalPackages[1];
}

function inferPackageName(lead) {
    const projectType = String(lead?.projectType || "").toLowerCase();
    const message = `${lead?.message || ""} ${lead?.rawMessage || ""}`.toLowerCase();
    const text = `${projectType} ${message}`;

    if (text.includes("custom software") || text.includes("ai") || text.includes("workflow") || text.includes("automation") || text.includes("dashboard") || text.includes("portal")) return "Custom Systems";
    if (text.includes("booking") || text.includes("scheduling") || text.includes("appointment") || text.includes("intake")) return "Premium";
    if (text.includes("website") || text.includes("rebuild") || text.includes("seo")) return "Core";
    return "Starter";
}

function getDefaultProposalForm(lead) {
    const recommendedPackage = inferPackageName(lead);
    const selectedPackage = getPackage(recommendedPackage);

    return {
        clientName: lead?.name || "",
        projectType: lead?.projectType || "Not sure yet",
        recommendedPackage,
        timeline: selectedPackage.timeline,
        price: selectedPackage.price,
        depositPercentage: 50,
        notes: selectedPackage.scope.map((item) => `- ${item}`).join("\n"),
    };
}

const packageFitDefaults = {
    Starter: "Ideal when the business needs a credible online presence without unnecessary complexity.",
    Core: "Ideal when the business needs a complete multi-page website built to rank locally and convert visitors.",
    Premium: "Ideal when the business needs booking, intake, or customer communication workflows instead of handling everything manually.",
    "Custom Systems": "Ideal when the business has a workflow that cannot be solved cleanly with a basic website or off-the-shelf tool.",
};

const aiCustomSoftwareFit = "Ideal when the project requires a custom tool, automation, dashboard, or AI-assisted workflow.";

const optionalUpgradeDefaults = {
    Starter: ["Online booking", "Customer intake forms", "SEO growth campaign", "Maintenance plan"],
    Core: ["Online booking", "Customer intake forms", "Admin dashboard", "SEO growth campaign", "Maintenance plan"],
    Premium: ["Admin dashboard", "SEO growth campaign", "Maintenance plan", "Custom automation"],
    "Custom Systems": ["Online booking", "SEO growth campaign", "Maintenance plan", "Custom automation"],
};

function isAiCustomSoftwareProject(form) {
    const text = `${form.projectType || ""} ${form.notes || ""}`.toLowerCase();
    return text.includes("ai") || text.includes("custom software") || text.includes("custom tool") || text.includes("automation") || text.includes("dashboard");
}

function getWhyPackageFits(form) {
    if (form.recommendedPackage === "Custom Systems" && isAiCustomSoftwareProject(form)) {
        return aiCustomSoftwareFit;
    }
    return packageFitDefaults[form.recommendedPackage] || packageFitDefaults.Core;
}

function getOptionalFutureUpgrades(form) {
    return optionalUpgradeDefaults[form.recommendedPackage] || optionalUpgradeDefaults.Core;
}

function formatBullets(items) {
    return items.map((item) => `- ${item}`).join("\n");
}

function getClientProjectType(value) {
    const projectType = String(value || "").trim();
    if (!projectType || projectType.toLowerCase() === "not sure yet") return "";
    return projectType;
}

function getProjectSummary(form) {
    const projectType = getClientProjectType(form.projectType);
    const clientName = form.clientName || "the client";
    if (!projectType) {
        return `${clientName} shared a project need that would benefit from a clear, practical build plan. The recommended path is ${form.recommendedPackage || "Core"} because it gives the project the right amount of structure without adding unnecessary complexity.`;
    }
    return `${clientName} is looking for help with ${projectType}. The recommended path is ${form.recommendedPackage || "Core"} because it gives the project the right amount of structure without adding unnecessary complexity.`;
}

function getScopeText(form) {
    return String(form.notes || "").trim() || "Scope can be confirmed by email before the build begins.";
}

function getDepositText(form) {
    const amount = parsePriceAmount(form.price);
    const hasPlus = String(form.price || "").includes("+");
    const percentage = normalizeDepositPercentage(form.depositPercentage);
    if (!amount) return `${percentage}% deposit required to reserve the project slot.`;
    return `${percentage}% deposit: ${formatCurrency(Math.round(amount * (percentage / 100)), hasPlus)} due to reserve the project slot.`;
}

function buildProposal(form, lead) {
    const packageName = form.recommendedPackage || "Core";
    const clientName = form.clientName || "Client";
    const projectSummary = getProjectSummary(form);
    const scope = getScopeText(form);
    const whyThisFits = getWhyPackageFits(form);
    const optionalFutureUpgrades = getOptionalFutureUpgrades(form);
    const deposit = getDepositText(form);
    const createdAt = new Date().toISOString();

    const clientProposalText = `Likwit Devs Project Recommendation

Hi ${clientName},

Based on what you shared, I'd recommend starting with the ${packageName} package.

Recommended Package
${packageName} - ${form.price || "TBD"}

Why This Package Fits
${whyThisFits}

What We'll Build
${scope}

Timeline
${form.timeline || "Timeline to be confirmed"}

Investment
${form.price || "TBD"}

Deposit
${deposit}

Optional Future Upgrades
${formatBullets(optionalFutureUpgrades)}

Next Step
If this looks good, reply with approval and I'll send the onboarding checklist. From there, you can send your logo, photos, content, and any account access needed. We can confirm details by email before I start building.`;

    const markdown = `# Likwit Devs Project Recommendation

Hi ${clientName},

Based on what you shared, I'd recommend starting with the **${packageName}** package.

## Recommended Package
${packageName} - ${form.price || "TBD"}

## Why This Package Fits
${whyThisFits}

## What We'll Build
${scope}

## Timeline
${form.timeline || "Timeline to be confirmed"}

## Investment
${form.price || "TBD"}

## Deposit
${deposit}

## Optional Future Upgrades
${formatBullets(optionalFutureUpgrades)}

## Next Step
If this looks good, reply with approval and I'll send the onboarding checklist. From there, you can send your logo, photos, content, and any account access needed. We can confirm details by email before I start building.`;

    const internalSummaryText = `Internal Scope Summary

Lead: ${clientName}
Project Type: ${getClientProjectType(form.projectType) || "To be confirmed"}
Recommended Package: ${packageName}
Timeline: ${form.timeline || "Timeline to be confirmed"}
Price: ${form.price || "TBD"}
Deposit: ${deposit}

Why this package fits:
${whyThisFits}

Scope notes:
${scope}

Operational next step:
Send onboarding checklist after client approval. Confirm assets, content, account access, and any final details by email.`;

    return {
        id: `${lead?.id || "lead"}-${Date.now()}`,
        leadId: lead?.id || "",
        clientName: form.clientName || "",
        projectType: form.projectType || "",
        recommendedPackage: packageName,
        timeline: form.timeline || "",
        price: form.price || "",
        depositPercentage: normalizeDepositPercentage(form.depositPercentage),
        depositRequired: deposit,
        notes: scope,
        projectSummary,
        whyThisFits,
        optionalFutureUpgrades,
        clientProposalText,
        internalSummaryText,
        plainText: clientProposalText,
        markdown,
        createdAt,
        createdBy: "admin",
    };
}

async function copyText(value) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}


function normalizeAuditStatus(status) {
    if (status === "sent" || status === "responded") return status;
    return "draft";
}

function getAuditStatusLabel(status) {
    const normalized = normalizeAuditStatus(status);
    if (normalized === "responded") return "Audit responded";
    if (normalized === "sent") return "Audit sent";
    return "Audit draft";
}

function textValue(value) {
    return String(value || "").trim();
}

function getLeadBusinessName(lead) {
    return lead?.businessName || lead?.company || lead?.name || "";
}

function getLeadWebsite(lead) {
    return lead?.website || lead?.url || "";
}

function getDefaultAuditForm(lead) {
    const template = "General Business";
    const preset = auditTemplates[template];

    return {
        businessName: getLeadBusinessName(lead),
        contactName: lead?.name || "",
        website: getLeadWebsite(lead),
        template,
        snapshot: preset.snapshot,
        trustSignals: preset.trustSignals,
        conversionOpportunities: preset.conversionOpportunities,
        priorityIssues: preset.priorityIssues,
        recommendedNextSteps: preset.recommendedNextSteps,
        internalNotes: "",
    };
}

function hydrateAuditForm(audit, lead) {
    const fallback = getDefaultAuditForm(lead);
    const sections = audit?.sections || {};

    return {
        businessName: audit?.businessName || fallback.businessName,
        contactName: audit?.contactName || fallback.contactName,
        website: audit?.website || fallback.website,
        template: audit?.template || fallback.template,
        snapshot: sections.snapshot || audit?.snapshot || fallback.snapshot,
        trustSignals: sections.trustSignals || audit?.trustSignals || fallback.trustSignals,
        conversionOpportunities: sections.conversionOpportunities || audit?.conversionOpportunities || fallback.conversionOpportunities,
        priorityIssues: sections.priorityIssues || audit?.priorityIssues || fallback.priorityIssues,
        recommendedNextSteps: sections.recommendedNextSteps || audit?.recommendedNextSteps || fallback.recommendedNextSteps,
        internalNotes: audit?.internalNotes || "",
    };
}

function formatAuditSection(value, fallback) {
    return textValue(value) || fallback;
}

function buildAuditOutput(form) {
    const businessName = textValue(form.businessName) || "the business";
    const website = textValue(form.website);

    return `Website Review & Improvement Opportunities
Prepared for ${businessName}

Business Snapshot
${formatAuditSection(form.snapshot, "The website should make the business easy to understand, trust, and contact.")}${website ? `\n\nWebsite reviewed: ${website}` : ""}

Trust Signals
${formatAuditSection(form.trustSignals, "- Customer reviews\n- Clear contact information\n- Real photos or examples")}

Conversion Opportunities
${formatAuditSection(form.conversionOpportunities, "- Clear call-to-action\n- Simple contact path\n- Mobile-friendly next step")}

Priority Improvements
${formatAuditSection(form.priorityIssues, "- Clarify the offer\n- Reduce contact friction\n- Add proof near key decision points")}

Recommended Next Steps
${formatAuditSection(form.recommendedNextSteps, "Start with the improvements most likely to help visitors trust the business and take action.")}`;
}

function buildAuditPayload({ auditId, form, lead, status }) {
    const normalizedStatus = normalizeAuditStatus(status);
    const outputText = buildAuditOutput(form);
    const payload = {
        id: auditId || "",
        leadId: lead?.id || "",
        businessName: textValue(form.businessName),
        contactName: textValue(form.contactName),
        website: textValue(form.website),
        template: form.template || "General Business",
        status: normalizedStatus,
        sections: {
            snapshot: textValue(form.snapshot),
            trustSignals: textValue(form.trustSignals),
            conversionOpportunities: textValue(form.conversionOpportunities),
            priorityIssues: textValue(form.priorityIssues),
            recommendedNextSteps: textValue(form.recommendedNextSteps),
        },
        internalNotes: textValue(form.internalNotes),
        clientFacingTitle: "Website Review & Improvement Opportunities",
        outputText,
        updatedAt: serverTimestamp(),
    };

    if (normalizedStatus === "sent") payload.sentAt = serverTimestamp();
    if (normalizedStatus === "responded") payload.respondedAt = serverTimestamp();

    return payload;
}

function AuditModal({ lead, onClose }) {
    const [auditId, setAuditId] = useState(lead?.latestAuditId || "");
    const [form, setForm] = useState(() => getDefaultAuditForm(lead));
    const [auditStatus, setAuditStatus] = useState(normalizeAuditStatus(lead?.auditStatus));
    const [loading, setLoading] = useState(Boolean(lead?.latestAuditId));
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const preview = useMemo(() => buildAuditOutput(form), [form]);

    useEffect(() => {
        let cancelled = false;

        async function loadAudit() {
            if (!lead?.latestAuditId) {
                setAuditId("");
                setForm(getDefaultAuditForm(lead));
                setAuditStatus(normalizeAuditStatus(lead?.auditStatus));
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const auditRef = doc(db, "audits", lead.latestAuditId);
                const snapshot = await getDoc(auditRef);
                if (cancelled) return;

                if (snapshot.exists()) {
                    const audit = { id: snapshot.id, ...snapshot.data() };
                    setAuditId(snapshot.id);
                    setForm(hydrateAuditForm(audit, lead));
                    setAuditStatus(normalizeAuditStatus(audit.status || lead.auditStatus));
                    setMessage("Existing audit loaded.");
                } else {
                    setAuditId("");
                    setForm(getDefaultAuditForm(lead));
                    setAuditStatus(normalizeAuditStatus(lead?.auditStatus));
                    setMessage("Could not find the saved audit. Starting a new draft.");
                }
            } catch (err) {
                console.error("Audit load failed", err);
                if (!cancelled) setMessage("Could not load existing audit.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadAudit();

        return () => {
            cancelled = true;
        };
    }, [lead]);

    function updateForm(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
        setMessage("");
    }

    function applyTemplate(template) {
        const preset = auditTemplates[template] || auditTemplates["General Business"];
        setForm((current) => ({
            ...current,
            template,
            snapshot: preset.snapshot,
            trustSignals: preset.trustSignals,
            conversionOpportunities: preset.conversionOpportunities,
            priorityIssues: preset.priorityIssues,
            recommendedNextSteps: preset.recommendedNextSteps,
        }));
        setMessage(`${template} template applied.`);
    }

    async function persistAudit(nextStatus = "draft") {
        if (!lead?.id) return null;

        const normalizedStatus = normalizeAuditStatus(nextStatus);
        const currentAuditId = auditId || "";
        const payload = buildAuditPayload({ auditId: currentAuditId, form, lead, status: normalizedStatus });

        setSaving(true);
        setMessage("");
        try {
            let nextAuditId = currentAuditId;
            if (nextAuditId) {
                await updateDoc(doc(db, "audits", nextAuditId), payload);
            } else {
                const docRef = await addDoc(collection(db, "audits"), {
                    ...payload,
                    id: "",
                    createdAt: serverTimestamp(),
                    createdBy: "admin",
                });
                nextAuditId = docRef.id;
                await updateDoc(doc(db, "audits", nextAuditId), { id: nextAuditId });
                setAuditId(nextAuditId);
            }

            await updateDoc(doc(db, "leads", lead.id), {
                auditStatus: normalizedStatus,
                latestAuditId: nextAuditId,
                updatedAt: serverTimestamp(),
            });

            setAuditStatus(normalizedStatus);
            setMessage(normalizedStatus === "draft" ? "Audit draft saved." : `Audit marked as ${normalizedStatus}.`);
            return nextAuditId;
        } catch (err) {
            console.error("Audit save failed", err);
            setMessage("Could not save audit.");
            return null;
        } finally {
            setSaving(false);
        }
    }

    async function copyAudit() {
        try {
            await copyText(preview);
            setMessage("Audit copied.");
        } catch (err) {
            console.error("Audit copy failed", err);
            setMessage("Could not copy audit.");
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm md:py-10">
            <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-neutral-950 p-4 text-white shadow-2xl md:p-6">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/50">Website Audit</p>
                        <h2 className="mt-1 text-2xl font-bold">Generate Audit</h2>
                        <p className="mt-1 text-sm text-white/65">
                            Use presets, edit the findings, save a draft, and copy the client-facing review.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs capitalize text-white/70">
                            {auditStatus}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20 disabled:opacity-60"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-white/70">Loading audit...</div>
                ) : (
                    <div className="mt-5 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
                        <div className="space-y-4">
                            <label className="grid gap-1 text-sm text-white/80">
                                Industry Template
                                <select
                                    className="input"
                                    value={form.template}
                                    onChange={(e) => applyTemplate(e.target.value)}
                                >
                                    {auditTemplateOptions.map((template) => (
                                        <option key={template} value={template}>
                                            {template}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="grid gap-3 md:grid-cols-2">
                                <label className="grid gap-1 text-sm text-white/80">
                                    Business Name
                                    <input
                                        className="input"
                                        value={form.businessName}
                                        onChange={(e) => updateForm("businessName", e.target.value)}
                                    />
                                </label>
                                <label className="grid gap-1 text-sm text-white/80">
                                    Website
                                    <input
                                        className="input"
                                        value={form.website}
                                        onChange={(e) => updateForm("website", e.target.value)}
                                    />
                                </label>
                            </div>

                            <label className="grid gap-1 text-sm text-white/80">
                                Business Snapshot
                                <textarea
                                    className="input min-h-24"
                                    value={form.snapshot}
                                    onChange={(e) => updateForm("snapshot", e.target.value)}
                                />
                            </label>

                            <div className="grid gap-3 md:grid-cols-2">
                                <label className="grid gap-1 text-sm text-white/80">
                                    Trust Signals
                                    <textarea
                                        className="input min-h-36"
                                        value={form.trustSignals}
                                        onChange={(e) => updateForm("trustSignals", e.target.value)}
                                    />
                                </label>
                                <label className="grid gap-1 text-sm text-white/80">
                                    Conversion Opportunities
                                    <textarea
                                        className="input min-h-36"
                                        value={form.conversionOpportunities}
                                        onChange={(e) => updateForm("conversionOpportunities", e.target.value)}
                                    />
                                </label>
                            </div>

                            <label className="grid gap-1 text-sm text-white/80">
                                Priority Improvements
                                <textarea
                                    className="input min-h-32"
                                    value={form.priorityIssues}
                                    onChange={(e) => updateForm("priorityIssues", e.target.value)}
                                />
                            </label>

                            <label className="grid gap-1 text-sm text-white/80">
                                Recommended Next Steps
                                <textarea
                                    className="input min-h-28"
                                    value={form.recommendedNextSteps}
                                    onChange={(e) => updateForm("recommendedNextSteps", e.target.value)}
                                />
                            </label>

                            <label className="grid gap-1 text-sm text-white/80">
                                Internal Notes
                                <textarea
                                    className="input min-h-20"
                                    value={form.internalNotes}
                                    onChange={(e) => updateForm("internalNotes", e.target.value)}
                                />
                            </label>

                            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                <button
                                    type="button"
                                    onClick={() => persistAudit("draft")}
                                    disabled={saving}
                                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Save Draft"}
                                </button>
                                <button
                                    type="button"
                                    onClick={copyAudit}
                                    disabled={saving}
                                    className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-60"
                                >
                                    Copy Audit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => persistAudit("sent")}
                                    disabled={saving}
                                    className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-60"
                                >
                                    Mark as Sent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => persistAudit("responded")}
                                    disabled={saving}
                                    className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20 disabled:opacity-60"
                                >
                                    Mark as Responded
                                </button>
                            </div>
                            {message && <p className="text-sm text-white/70">{message}</p>}
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                            <div className="flex flex-col gap-2 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="font-semibold text-white">Client Audit Preview</h3>
                                <span className="text-xs text-white/50">Local preview. No AI requests.</span>
                            </div>
                            <pre className="mt-4 max-h-[72vh] overflow-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-white/80">{preview}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
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
    const [proposalLead, setProposalLead] = useState(null);
    const [proposalForm, setProposalForm] = useState(() => getDefaultProposalForm(null));
    const [proposalSaving, setProposalSaving] = useState(false);
    const [proposalStatus, setProposalStatus] = useState("");
    const [auditLead, setAuditLead] = useState(null);

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

    const proposalPreview = useMemo(
        () => buildProposal(proposalForm, proposalLead),
        [proposalForm, proposalLead]
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

    function openAuditModal(lead) {
        setAuditLead(lead);
    }

    function closeAuditModal() {
        setAuditLead(null);
    }

    function openProposalModal(lead) {
        setProposalLead(lead);
        setProposalForm(getDefaultProposalForm(lead));
        setProposalStatus("");
    }

    function closeProposalModal() {
        if (proposalSaving) return;
        setProposalLead(null);
        setProposalStatus("");
    }

    function updateProposalForm(field, value) {
        setProposalForm((current) => {
            if (field !== "recommendedPackage") {
                return { ...current, [field]: value };
            }

            const selectedPackage = getPackage(value);
            return {
                ...current,
                recommendedPackage: selectedPackage.name,
                timeline: selectedPackage.timeline,
                price: selectedPackage.price,
                notes: selectedPackage.scope.map((item) => `- ${item}`).join("\n"),
            };
        });
        setProposalStatus("");
    }

    async function handleCopyProposal(format) {
        try {
            await copyText(format === "markdown" ? proposalPreview.markdown : format === "internal" ? proposalPreview.internalSummaryText : proposalPreview.clientProposalText);
            setProposalStatus(format === "markdown" ? "Copied formatted markdown." : format === "internal" ? "Copied internal summary." : "Copied client proposal.");
        } catch (err) {
            console.error("Proposal copy failed", err);
            setProposalStatus("Could not copy proposal.");
        }
    }

    async function saveProposal() {
        if (!proposalLead?.id) return;
        const proposal = buildProposal(proposalForm, proposalLead);
        const proposalValue = parsePriceAmount(proposal.price);

        setProposalSaving(true);
        setProposalStatus("");
        try {
            await updateDoc(doc(db, "leads", proposalLead.id), {
                proposals: arrayUnion(proposal),
                latestProposal: proposal,
                proposalValue,
                status: "Proposal Sent",
                updatedAt: serverTimestamp(),
            });
            trackEvent({
                eventName: "admin_proposal_generated",
                leadId: proposalLead.id,
                metadata: {
                    recommendedPackage: proposal.recommendedPackage,
                    price: proposal.price,
                    depositPercentage: proposal.depositPercentage,
                },
            });
            setProposalStatus("Proposal saved to this lead.");
        } catch (err) {
            console.error("Proposal save failed", err);
            setProposalStatus("Could not save proposal.");
            setError("Could not save proposal.");
        } finally {
            setProposalSaving(false);
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
                    <Link to="/admin/reviews" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                        Reviews
                    </Link>
                    <Link to="/admin/analytics" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                        Analytics
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
                                        {lead.latestProposal && (
                                            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-100">
                                                Proposal ready
                                            </span>
                                        )}
                                        {lead.auditStatus && (
                                            <span className="rounded-full border border-sky-300/20 bg-sky-400/10 px-2 py-0.5 text-xs text-sky-100">
                                                {getAuditStatusLabel(lead.auditStatus)}
                                            </span>
                                        )}
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
                                    <div>Lead Source: {lead.originPage || lead.sourcePage || "unknown"}</div>
                                    <div>First Landing Page: {lead.landingPage || "unknown"}</div>
                                    <div className="break-all">Referrer: {lead.referrer || "direct / unknown"}</div>
                                    {lead.leadSource && (
                                        <div>How they heard: {lead.leadSource}</div>
                                    )}
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

                                <div className="grid gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openAuditModal(lead)}
                                        className="rounded-xl bg-sky-300 px-3 py-2 text-sm font-semibold text-black hover:bg-sky-200"
                                    >
                                        Generate Audit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openProposalModal(lead)}
                                        className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90"
                                    >
                                        Generate Proposal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedId(isExpanded ? "" : lead.id)}
                                        className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                                    >
                                        {isExpanded ? "Hide Details" : "View Details"}
                                    </button>
                                </div>
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

                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <label className="grid gap-1 text-sm text-white/80">
                                    Estimated Value
                                    <input
                                        className="input"
                                        type="number"
                                        min="0"
                                        step="100"
                                        defaultValue={lead.estimatedValue ?? ""}
                                        onBlur={(e) => updateLead(lead.id, { estimatedValue: optionalNumber(e.target.value) })}
                                        placeholder="Optional"
                                        disabled={savingId === lead.id}
                                    />
                                </label>
                                <label className="grid gap-1 text-sm text-white/80">
                                    Proposal Value
                                    <input
                                        className="input"
                                        type="number"
                                        min="0"
                                        step="100"
                                        defaultValue={lead.proposalValue ?? ""}
                                        onBlur={(e) => updateLead(lead.id, { proposalValue: optionalNumber(e.target.value) })}
                                        placeholder="Optional"
                                        disabled={savingId === lead.id}
                                    />
                                </label>
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

            {auditLead && <AuditModal lead={auditLead} onClose={closeAuditModal} />}

            {proposalLead && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm md:py-10">
                    <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-neutral-950 p-4 text-white shadow-2xl md:p-6">
                        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Proposal Generator</p>
                                <h2 className="mt-1 text-2xl font-bold">Generate Proposal</h2>
                                <p className="mt-1 text-sm text-white/65">
                                    Build a proposal locally, copy it, and save it to this lead.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeProposalModal}
                                className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                            <div className="space-y-4">
                                <div className="grid gap-3 md:grid-cols-2">
                                    <label className="grid gap-1 text-sm text-white/80">
                                        Client Name
                                        <input
                                            className="input"
                                            value={proposalForm.clientName}
                                            onChange={(e) => updateProposalForm("clientName", e.target.value)}
                                        />
                                    </label>
                                    <label className="grid gap-1 text-sm text-white/80">
                                        Project Type
                                        <input
                                            className="input"
                                            value={proposalForm.projectType}
                                            onChange={(e) => updateProposalForm("projectType", e.target.value)}
                                        />
                                    </label>
                                </div>

                                <label className="grid gap-1 text-sm text-white/80">
                                    Recommended Package
                                    <select
                                        className="input"
                                        value={proposalForm.recommendedPackage}
                                        onChange={(e) => updateProposalForm("recommendedPackage", e.target.value)}
                                    >
                                        {proposalPackages.map((item) => (
                                            <option key={item.name} value={item.name}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <div className="grid gap-3 md:grid-cols-[1fr_160px_150px]">
                                    <label className="grid gap-1 text-sm text-white/80">
                                        Timeline
                                        <input
                                            className="input"
                                            value={proposalForm.timeline}
                                            onChange={(e) => updateProposalForm("timeline", e.target.value)}
                                        />
                                    </label>
                                    <label className="grid gap-1 text-sm text-white/80">
                                        Price
                                        <input
                                            className="input"
                                            value={proposalForm.price}
                                            onChange={(e) => updateProposalForm("price", e.target.value)}
                                        />
                                    </label>
                                    <label className="grid gap-1 text-sm text-white/80">
                                        Deposit %
                                        <input
                                            className="input"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={proposalForm.depositPercentage}
                                            onChange={(e) => updateProposalForm("depositPercentage", e.target.value)}
                                        />
                                    </label>
                                </div>

                                <label className="grid gap-1 text-sm text-white/80">
                                    Notes / Scope
                                    <textarea
                                        className="input min-h-44"
                                        value={proposalForm.notes}
                                        onChange={(e) => updateProposalForm("notes", e.target.value)}
                                    />
                                </label>

                                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                    <button
                                        type="button"
                                        onClick={saveProposal}
                                        disabled={proposalSaving}
                                        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
                                    >
                                        {proposalSaving ? "Saving..." : "Save Proposal"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyProposal("client")}
                                        className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                                    >
                                        Copy Client Proposal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyProposal("internal")}
                                        className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                                    >
                                        Copy Internal Summary
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyProposal("markdown")}
                                        className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                                    >
                                        Copy Markdown
                                    </button>
                                </div>
                                {proposalStatus && <p className="text-sm text-white/70">{proposalStatus}</p>}
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <div className="flex flex-col gap-2 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="font-semibold text-white">Client Proposal Preview</h3>
                                    <span className="text-xs text-white/50">Local preview. No AI requests.</span>
                                </div>
                                <pre className="mt-4 max-h-[65vh] overflow-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-white/80">{proposalPreview.clientProposalText}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
