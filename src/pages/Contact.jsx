import { useRef, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

export default function Contact() {
    const formRef = useRef(null);
    const [status, setStatus] = useState({ sending: false, ok: null, msg: "" });

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Query params
    const plan = searchParams.get("plan") || "";
    const intent = searchParams.get("intent") || "";
    const website = searchParams.get("website") || "";
    const business = searchParams.get("business") || "";

    // Badge label logic
    const selectedLabel = intent === "audit" ? "Free Website Audit" : plan;

    const plans = ["Starter Site", "Business Site", "E-commerce / Booking"];
    const [selectOpen, setSelectOpen] = useState(false);

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Prefill message on load
    useEffect(() => {
        const form = formRef.current;
        if (!form) return;

        const current = form.message.value.trim();

        // Audit prefill
        if (intent === "audit" && !current) {
            form.message.value =
                `Hi! I'd like a free website audit.\n\n` +
                `• Website: ${website || "(paste link here)"}\n` +
                `• Business type: ${business || "(type here)"}\n\n` +
                `What I want help with:\n` +
                `• More leads / calls\n` +
                `• Better mobile experience\n` +
                `• Speed + SEO improvements\n\n` +
                `Anything else you should know:\n`;
            return;
        }

        // Plan prefill
        if (plan && !current) {
            form.message.value =
                `Hi! I'm interested in the ${plan} package. A few details about my project:\n\n` +
                `• Business / project name:\n` +
                `• Goals for the site:\n` +
                `• Pages / features needed:\n` +
                `• Timeline:\n`;
        }
    }, [plan, intent, website, business]);

    function setPlan(newPlan) {
        const form = formRef.current;
        const next = new URLSearchParams(searchParams);

        if (newPlan) next.set("plan", newPlan);
        else next.delete("plan");

        setSearchParams(next, { replace: true });
        setSelectOpen(false);

        if (form) {
            const existing = form.message.value;
            const prefixRe = /^Hi! I'm interested in the (.+) package\./;

            if (!existing.trim() || prefixRe.test(existing)) {
                form.message.value = newPlan
                    ? `Hi! I'm interested in the ${newPlan} package. A few details about my project:\n\n` +
                    `• Business / project name:\n` +
                    `• Goals for the site:\n` +
                    `• Pages / features needed:\n` +
                    `• Timeline:\n`
                    : "";
            }
        }
    }

    function goPricing() {
        navigate("/");
        setTimeout(
            () =>
                document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" }),
            80
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (status.sending) return;

        const form = formRef.current;
        const name = form.from_name.value.trim();
        const email = form.from_email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            setStatus({ sending: false, ok: false, msg: "Please fill out all fields." });
            return;
        }

        try {
            setStatus({ sending: true, ok: null, msg: "" });

            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    from_name: name,
                    from_email: email,
                    message,
                    plan,
                    intent,
                    website,
                    business,
                    reply_to: email,
                },
                { publicKey: PUBLIC_KEY }
            );

            setStatus({ sending: false, ok: true, msg: "Thanks! Your message was sent." });
            form.reset();
        } catch {
            setStatus({
                sending: false,
                ok: false,
                msg: "Could not send. Try again later.",
            });
        }
    }

    return (
        <section className="min-h-screen grid place-items-center bg-transparent px-4 pt-28">
            <motion.form
                ref={formRef}
                onSubmit={handleSubmit}
                initial={{ y: 12 }}
                animate={{ y: 0, transition: { duration: 0.28, ease: "easeOut" } }}
                className="w-full max-w-xl card p-6 text-white space-y-5 transform-gpu"
            >
                <h2 className="text-2xl font-semibold">Contact</h2>
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

                            {intent !== "audit" && (
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

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-white/80">Your name</label>
                        <input
                            name="from_name"
                            className="input mt-1"
                            placeholder="Jane Doe"
                        />
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
                    <label className="text-sm text-white/80">Message</label>
                    <textarea
                        name="message"
                        rows="5"
                        className="input mt-1"
                        placeholder="How can I help?"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status.sending}
                    className="w-full btn disabled:opacity-60"
                >
                    {status.sending ? "Sending..." : "Send"}
                </button>

                {status.ok === true && (
                    <p className="text-green-300">{status.msg}</p>
                )}
                {status.ok === false && (
                    <p className="text-red-300">{status.msg}</p>
                )}
            </motion.form>
        </section>
    );
}
