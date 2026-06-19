import { useRef, useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import useSEO from "../hooks/useSEO";
import PolicyNotice from "../components/PolicyNotice";
import { getLeadAttribution, trackEvent } from "../lib/analytics";

const MotionForm = motion.form;

function normalizeUrl(value) {
    const v = value.trim();
    if (!v) return v;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

const projectTypeByIntent = {
    audit: "Free Website Audit",
    review: "Free Website Review",
    "free-review": "Free Website Review",
    webdev: "Business Website / Website Rebuild",
    "quote-webdev": "Business Website / Website Rebuild",
    seo: "Business Website / Website Rebuild",
    "quote-seo": "Business Website / Website Rebuild",
    "business-website": "Business Website / Website Rebuild",
    "booking-system": "Booking or Scheduling System",
    "workflow-automation": "Intake System / Workflow Automation",
    "custom-software": "Custom Software / AI Tool",
};

const projectTypeOptions = [
    "Not sure yet",
    "Free Website Review",
    "Business Website / Website Rebuild",
    "Booking or Scheduling System",
    "Intake System / Workflow Automation",
    "Custom Software / AI Tool",
];

const subjectLabelByProjectType = {
    "Free Website Audit": "Website Audit",
    "Free Website Review": "Website Review",
    "Business Website / Website Rebuild": "Business Website",
    "Booking or Scheduling System": "Booking System",
    "Intake System / Workflow Automation": "Workflow Automation",
    "Custom Software / AI Tool": "Custom Software",
};

function sanitizeSubjectPart(value) {
    return String(value || "")
        .replace(/&(?:#x2F|#47|sol);/gi, "-")
        .replace(/&amp;/gi, "&")
        .replace(/\s*\/\s*/g, " - ")
        .replace(/[<>]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function getInquiryTitle(projectType, name) {
    const subjectProjectType = subjectLabelByProjectType[projectType] || projectType || "Website Inquiry";
    const safeProjectType = sanitizeSubjectPart(subjectProjectType);
    const safeName = sanitizeSubjectPart(name) || "New Inquiry";

    return `[${safeProjectType}] ${safeName}`;
}

function getSourcePage() {
    if (typeof window === "undefined") return "";
    return `${window.location.pathname}${window.location.search}`;
}

export default function Contact({ embedded = false, source = "contact", intent: intentProp = "" }) {
    const formRef = useRef(null);
    const [status, setStatus] = useState({ sending: false, ok: null, msg: "" });
    const [formStarted, setFormStarted] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Query params
    const plan = searchParams.get("plan") || "";
    const intent = intentProp || searchParams.get("intent") || "";
    const website = searchParams.get("website") || "";
    const business = searchParams.get("business") || "";
    const intentProjectType = projectTypeByIntent[intent] || "";
    const hasIntentProjectType = Boolean(intentProjectType);
    const [projectType, setProjectType] = useState("");

    useSEO({
        title: "Ready to Stop Losing Customers?",
        description:
          "Tell us about your business and we'll show you exactly how we can help. Most clients start seeing more calls and bookings within the first 30 days.",
        canonical: "https://www.likwitdevs.com/contact",
    });

    // Badge label logic
    const selectedLabel =
        intentProjectType || plan;

    const plans = ["Starter", "Core", "Premium", "Custom Systems", "Care", "Growth", "Partner"];
    const [selectOpen, setSelectOpen] = useState(false);

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const intentPrefills = useMemo(() => ({
        audit:
            `Hi! I'd like a fast website audit.\n\n` +
            `Website URL:\n` +
            `Main issue I'm noticing:\n` +
            `Business type:\n`,
        review:
            `Hi! I'd like a free website review.\n\n` +
            `Main goal:\n` +
            `• More calls / leads\n` +
            `• Better mobile experience\n` +
            `• Faster load speed\n` +
            `• Cleaner design / trust\n\n` +
            `Website URL:\n`,
        "free-review":
            `Hi! I'd like a free website review.\n\n` +
            `Main goal:\n` +
            `â€¢ More calls / leads\n` +
            `â€¢ Better mobile experience\n` +
            `â€¢ Faster load speed\n` +
            `â€¢ Cleaner design / trust\n\n` +
            `Website URL:\n`,
        "business-website":
            `Hi! I'm interested in a business website or website rebuild.\n\n` +
            `Business name:\n` +
            `Current website, if any:\n` +
            `Main goal:\n` +
            `Pages or features needed:\n` +
            `Timeline:\n`,
        "booking-system":
            `Hi! I'm interested in a booking or scheduling system.\n\n` +
            `Business name:\n` +
            `Services people need to book:\n` +
            `Current booking process:\n` +
            `What should happen after someone books?\n`,
        "workflow-automation":
            `Hi! I'm interested in an intake system or workflow automation.\n\n` +
            `Business name:\n` +
            `Current manual process:\n` +
            `Information you need to collect:\n` +
            `Who needs to review or manage submissions?\n`,
        "custom-software":
            `Hi! I'm interested in custom software or an AI tool.\n\n` +
            `Business / project name:\n` +
            `Problem the tool should solve:\n` +
            `Who will use it:\n` +
            `Existing tools or data involved:\n`,
        "quote-webdev":
            `Hi! I'd like a quote for a new website.\n\n` +
            `Business name:\n` +
            `Type of business:\n` +
            `Do you already have a website?\n` +
            `What pages / features do you need?\n` +
            `Timeline:\n`,
        "quote-seo":
            `Hi! I'd like a quote for SEO help.\n\n` +
            `Website URL:\n` +
            `Business type:\n` +
            `City / service area:\n` +
            `Main goal:\n` +
            `Any current SEO issues you know about:\n`,
    }), []);

    useEffect(() => {
        setProjectType(intentProjectType || "");
    }, [intentProjectType]);

    // Prefill message on load
    useEffect(() => {
        const form = formRef.current;
        if (!form) return;

        const current = form.message.value.trim();

        // Intent-based prefill
        if (intent && intentPrefills[intent] && !current) {
            form.message.value = intentPrefills[intent];
            return;
        }

        // Plan prefill
        if (plan && !current) {
            form.message.value =
                `Hi! I'm interested in ${plan}. A few details about my project:\n\n` +
                `• Business / project name:\n` +
                `• Goals for the site:\n` +
                `• Pages / features needed:\n` +
                `• Timeline:\n`;
        }
    }, [plan, intent, website, business, intentPrefills]);

    function setPlan(newPlan) {
        const form = formRef.current;
        const next = new URLSearchParams(searchParams);

        if (newPlan) next.set("plan", newPlan);
        else next.delete("plan");

        setSearchParams(next, { replace: true });
        setSelectOpen(false);

        if (form) {
            const existing = form.message.value;
            const prefixRe = /^Hi! I'm interested in (.+)\./;

            if (!existing.trim() || prefixRe.test(existing)) {
                form.message.value = newPlan
                    ? `Hi! I'm interested in ${newPlan}. A few details about my project:\n\n` +
                    `• Business / project name:\n` +
                    `• Goals for the site:\n` +
                    `• Pages / features needed:\n` +
                    `• Timeline:\n`
                    : "";
            }
        }
    }

    function goPricing() {
        navigate({ pathname: "/", hash: "#pricing" });
    }

    function handleFormStarted() {
        if (formStarted) return;
        setFormStarted(true);
        trackEvent({
            eventName: "contact_form_started",
            serviceIntent: intent,
            metadata: {
                source,
                hasIntent: Boolean(intent),
                projectType: projectType || intentProjectType || "Not sure yet",
            },
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (status.sending) return;

        const form = formRef.current;
        const name = form.from_name.value.trim();
        const email = form.from_email.value.trim();
        const message = form.message.value.trim();
        const websiteVal = normalizeUrl((form.website_url?.value || "").trim() || website);
        const businessVal = (form.business_type?.value || "").trim() || business;
        const projectTypeVal = projectType || "Not sure yet";
        const inquiryTitle = getInquiryTitle(projectTypeVal, name);
        const sourcePage = getSourcePage();
        const attribution = getLeadAttribution();
        const submittedMessage =
            `Project Type: ${projectTypeVal}\n` +
            `Raw Intent: ${intent || "none"}\n\n` +
            message;

        if (!name || !email || !message) {
            setStatus({ sending: false, ok: false, msg: "Please fill out all fields." });
            return;
        }

        setStatus({ sending: true, ok: null, msg: "" });
        trackEvent({
            eventName: "contact_form_submitted",
            serviceIntent: intent,
            metadata: {
                source,
                hasIntent: Boolean(intent),
                projectType: projectTypeVal,
            },
        });

        let leadSaved = false;
        let emailSent = false;
        let leadId = "";

        try {
            const leadRef = await addDoc(collection(db, "leads"), {
                name,
                email,
                replyTo: email,
                website: websiteVal,
                projectType: projectTypeVal,
                rawIntent: intent,
                message: submittedMessage,
                rawMessage: message,
                source,
                sourcePage,
                originPage: attribution.originPage,
                landingPage: attribution.landingPage,
                referrer: attribution.referrer,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: "New",
                notes: "",
                estimatedValue: null,
            });
            leadId = leadRef.id;
            leadSaved = true;
            trackEvent({
                eventName: "lead_created",
                serviceIntent: intent,
                leadId,
                originPage: attribution.originPage,
                landingPage: attribution.landingPage,
                referrer: attribution.referrer,
                metadata: {
                    source,
                    projectType: projectTypeVal,
                },
            });
        } catch (err) {
            console.error("Lead save failed", err);
            trackEvent({
                eventName: "lead_create_failed",
                serviceIntent: intent,
                metadata: {
                    source,
                    projectType: projectTypeVal,
                },
            });
        }

        try {
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    title: inquiryTitle,
                    name,
                    email,
                    from_name: name,
                    from_email: email,
                    message: submittedMessage,
                    raw_message: message,
                    plan,
                    intent,
                    project_type: projectTypeVal,
                    projectType: projectTypeVal,
                    raw_intent: intent,
                    website: websiteVal,
                    website_url: websiteVal,
                    business: businessVal,
                    business_type: businessVal,
                    reply_to: email,
                    source,
                },
                { publicKey: PUBLIC_KEY }
            );
            emailSent = true;
            trackEvent({
                eventName: "emailjs_sent",
                serviceIntent: intent,
                leadId,
                metadata: {
                    source,
                    projectType: projectTypeVal,
                },
            });
        } catch (err) {
            console.error("EmailJS notification failed", err);
            trackEvent({
                eventName: "emailjs_failed",
                serviceIntent: intent,
                leadId,
                metadata: {
                    source,
                    projectType: projectTypeVal,
                },
            });
        }

        if (emailSent) {
            setStatus({ sending: false, ok: true, msg: "Thanks! Your message was sent." });
            form.reset();
            return;
        }

        if (leadSaved) {
            setStatus({
                sending: false,
                ok: true,
                msg: "Thanks! Your request was saved. I may need to follow up manually if the email notification is delayed.",
            });
            form.reset();
            return;
        }

        setStatus({
            sending: false,
            ok: false,
            msg: "Could not send. Try again later.",
        });
    }

    return (
        <section
            className={
                embedded
                    ? "w-full"
                    : "min-h-screen grid place-items-center bg-transparent px-4 pt-28"
            }
        >
            <MotionForm
                ref={formRef}
                onSubmit={handleSubmit}
                onFocus={handleFormStarted}
                initial={{ y: 12 }}
                animate={{ y: 0, transition: { duration: 0.28, ease: "easeOut" } }}
                className={`w-full max-w-xl card p-6 text-white space-y-5 transform-gpu ${embedded ? "mx-auto" : ""
                    }`}
            >
                <h2 className="text-2xl font-semibold">
                    {intentProjectType || "Let's Fix What's Costing You Customers"}
                </h2>

                <div className="h-px bg-white/10" />

                {/* Honeypot */}
                <input
                    type="text"
                    name="company"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                />

                {/* Selected plan / audit badge */}
                <div className="text-sm text-white/90">
                    {selectedLabel ? (
                        <>
                            Interested in:{" "}
                            <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
                                {selectedLabel}
                            </span>

                            {!hasIntentProjectType && (
                                <button
                                    type="button"
                                    onClick={() => setSelectOpen((v) => !v)}
                                    className="ml-2 text-white/70 hover:text-white underline"
                                >
                                    change
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={goPricing}
                                className="ml-3 text-white/70 hover:text-white underline"
                            >
                                view packages
                            </button>
                        </>
                    ) : (
                        <>
                            Not sure yet?{" "}
                            <button
                                type="button"
                                onClick={() => setSelectOpen((v) => !v)}
                                className="text-white/70 hover:text-white underline"
                            >
                                choose a package
                            </button>
                            <button
                                type="button"
                                onClick={goPricing}
                                className="ml-3 text-white/70 hover:text-white underline"
                            >
                                view packages
                            </button>
                        </>
                    )}
                </div>

                {selectOpen && (
                    <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-2 w-full max-w-xs">
                        {plans.map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPlan(p)}
                                className="block w-full text-left rounded-md px-3 py-2 hover:bg-white/10"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}

                {intentProjectType && (
                    <p className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80">
                        You're asking about: <span className="font-semibold text-white">{intentProjectType}</span>
                    </p>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-white/80">Your name</label>
                        <input name="from_name" className="input mt-1" placeholder="Jane Doe" />
                    </div>

                    <div>
                        <label className="text-sm text-white/80">Email</label>
                        <input
                            name="from_email"
                            type="email"
                            className="input mt-1"
                            placeholder="you@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-white/80">Project Type</label>
                    <select
                        name="project_type"
                        className="input mt-1"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                    >
                        <option value="">Not sure yet</option>
                        {projectTypeOptions
                            .filter((option) => option !== "Not sure yet")
                            .map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                    </select>
                </div>

                {(intent === "review" || intent === "free-review" || intent === "audit") && (
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-white/80">Website URL</label>
                            <input
                                name="website_url"
                                type="url"
                                className="input mt-1"
                                placeholder="https://yourbusiness.com"
                                defaultValue={website}
                                onBlur={(e) => { e.target.value = normalizeUrl(e.target.value); }}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-white/80">Your Industry</label>
                            <input
                                name="business_type"
                                className="input mt-1"
                                placeholder="e.g. Contractor, restaurant"
                                defaultValue={business}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="text-sm text-white/80">Message</label>
                    <textarea
                        name="message"
                        rows="7"
                        className="input mt-1"
                        placeholder="How can I help?"
                    />
                </div>

                <PolicyNotice />

                <button type="submit" disabled={status.sending} className="w-full btn disabled:opacity-60">
                    {status.sending ? "Sending..." : "Send"}
                </button>

                {status.ok === true && <p className="text-green-300">{status.msg}</p>}
                {status.ok === false && <p className="text-red-300">{status.msg}</p>}
            </MotionForm>
        </section>
    );
}
