import { useState } from "react";
import { Link } from "react-router-dom";
import SiteBackground from "../components/SiteBackground";

// ---------------------------------------------------------------------------
// Lead submission placeholder
// TODO: Replace with EmailJS — e.g.:
//   await emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY);
// TODO: Replace with Firestore — e.g.:
//   await addDoc(collection(db, "tap_leads"), { ...data, createdAt: serverTimestamp() });
// ---------------------------------------------------------------------------
async function submitLead(data) {
    console.log("[submitLead] payload:", data);
    return new Promise((resolve) => setTimeout(resolve, 600));
}

// ---------------------------------------------------------------------------
// Form field definitions
// ---------------------------------------------------------------------------
const FIELDS = [
    { key: "name", label: "Your Name", required: true, placeholder: "Jane Doe", type: "input" },
    { key: "businessName", label: "Business Name", required: true, placeholder: "Acme Roofing", type: "input" },
    { key: "contact", label: "Email or Phone", required: true, placeholder: "you@email.com or 555-555-5555", type: "input" },
    { key: "websiteOrInstagram", label: "Website or Instagram", required: false, placeholder: "https://yourbiz.com or @handle", type: "input" },
    { key: "message", label: "Anything else?", required: false, placeholder: "Tell me about your business.\n\nIf you have a website, drop the link.\nIf not, tell me what you do and what you want help with.\n\nMore leads? Better mobile? Faster site?\nLet's fix it.", type: "textarea" },
];

const INITIAL_VALUES = {
    ...Object.fromEntries(FIELDS.map((f) => [f.key, ""])),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TapLanding() {
    const [values, setValues] = useState(INITIAL_VALUES);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    function scrollToForm() {
        document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleChange(key) {
        return (e) => {
            setValues((v) => ({ ...v, [key]: e.target.value }));
            if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
        };
    }

    function validate() {
        const e = {};
        if (!values.name.trim()) e.name = "Name is required.";
        if (!values.businessName.trim()) e.businessName = "Business name is required.";
        if (!values.contact.trim()) e.contact = "Email or phone is required.";
        return e;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        try {
            await submitLead(values);
            setSubmitted(true);
        } catch {
            setErrors({ form: "Something went wrong. Please try again." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <SiteBackground />
            <div className="min-h-screen text-white flex flex-col px-4 py-10">

                {/* Brand mark */}
                <p className="text-center text-3xl font-bold tracking-[0.3em] uppercase text-white/60 mb-10">
                    Likwit Developers
                </p>

                {/* ── Hero ── */}
                <section className="max-w-lg mx-auto w-full text-center space-y-4 mb-12">
                    <h1 className="text-fluid-h1 font-bold leading-tight">
                        Professional Websites for Small Businesses — Without Agency Prices.
                    </h1>
                    <p className="text-fluid-body text-white/70 max-w-md mx-auto">
                        I help small brands, market vendors, and local businesses build fast, modern websites that actually convert.
                    </p>
                    <button
                        onClick={scrollToForm}
                        className="btn-solid px-6 py-3 text-base font-semibold mt-2"
                    >
                        Get a Free Website Review
                    </button>
                </section>

                {/* ── Pain points + Offer ── */}
                <section className="max-w-lg mx-auto w-full grid sm:grid-cols-2 gap-5 mb-8">
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 space-y-3">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                            Sound familiar?
                        </h2>
                        <ul className="space-y-2 text-white/80 text-sm">
                            <li>⚠️&nbsp; Still relying only on Instagram?</li>
                            <li>⚠️&nbsp; No real website yet?</li>
                            <li>⚠️&nbsp; Need booking or online sales?</li>
                            <li>⚠️&nbsp; Hard to explain what you do online?</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 space-y-3">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                            What you get
                        </h2>
                        <ul className="space-y-2 text-white/80 text-sm">
                            <li>✅&nbsp; Clean, mobile-friendly websites</li>
                            <li>✅&nbsp; Booking systems or online sales</li>
                            <li>✅&nbsp; Fast turnaround</li>
                            <li>✅&nbsp; Affordable starter packages</li>
                        </ul>
                    </div>
                </section>

                {/* ── Pricing line ── */}
                <div className="max-w-lg mx-auto w-full mb-12">
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4 text-center">
                        <p className="text-white/70 text-sm">
                            Yes, this card is 3D printed.{" "}
                            <span className="text-white/85 font-medium">I also create custom NFC branding tools.</span>
                        </p>
                    </div>
                </div>

                {/* ── Lead form ── */}
                <section id="lead-form" className="max-w-lg mx-auto w-full mb-16 scroll-mt-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 space-y-5">
                        <h2 className="text-xl font-semibold">Get a Free Website Review</h2>
                        <div className="h-px bg-white/10" />

                        {submitted ? (
                            <p className="text-green-300 text-base leading-relaxed py-2">
                                Got it — I'll reach out soon. If you want faster help, text/email me with your site link.
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                {FIELDS.map(({ key, label, required, placeholder, type }) => (
                                    <div key={key}>
                                        <label className="text-sm text-white/80">
                                            {label}{" "}
                                            {required
                                                ? <span className="text-red-400">*</span>
                                                : <span className="text-white/35 text-xs">(optional)</span>
                                            }
                                        </label>

                                        {type === "textarea" ? (
                                            <textarea
                                                rows={7}
                                                className="input mt-1"
                                                placeholder={placeholder}
                                                value={values[key]}
                                                onChange={handleChange(key)}
                                            />
                                        ) : (
                                            <input
                                                className="input mt-1"
                                                placeholder={placeholder}
                                                value={values[key]}
                                                onChange={handleChange(key)}
                                            />
                                        )}

                                        {errors[key] && (
                                            <p className="text-red-400 text-xs mt-1">{errors[key]}</p>
                                        )}
                                    </div>
                                ))}

                                {errors.form && (
                                    <p className="text-red-400 text-sm">{errors.form}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-solid w-full py-3 font-semibold disabled:opacity-60"
                                >
                                    {submitting ? "Sending..." : "Get a Free Website Review"}
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                {/* ── See work link ── */}
                <div className="max-w-lg mx-auto w-full mb-8">
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4 text-center">
                        <p className="text-white/60 text-sm">
                            Not convinced?{" "}
                            <Link to="/#projects" className="text-white/80 underline underline-offset-2 hover:text-white transition">
                                See recent work →
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white/25 text-xs mt-auto">
                    © {new Date().getFullYear()} Likwit Developers
                </p>
            </div>
        </>
    );
}
