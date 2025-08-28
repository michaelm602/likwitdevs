import { useRef, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

export default function Contact() {
    const formRef = useRef(null);
    const [status, setStatus] = useState({ sending: false, ok: null, msg: "" });

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const plan = searchParams.get("plan") || "";
    const plans = ["Starter Site", "Business Site", "E-commerce / Booking"];
    const [selectOpen, setSelectOpen] = useState(false);

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Prefill message when arriving with a plan and message is empty
    useEffect(() => {
        const form = formRef.current;
        if (!form) return;
        if (plan && !form.message.value.trim()) {
            form.message.value =
                `Hi! I'm interested in the ${plan} package. A few details about my project:\n\n` +
                `• Business / project name:\n` +
                `• Goals for the site:\n` +
                `• Pages / features needed:\n` +
                `• Timeline:\n`;
        }
    }, [plan]);

    // Update plan (URL + message if it's still the auto-prefill)
    function setPlan(newPlan) {
        const form = formRef.current;
        const next = new URLSearchParams(searchParams);

        if (newPlan) next.set("plan", newPlan);
        else next.delete("plan");

        setSearchParams(next, { replace: true });
        setSelectOpen(false);

        // Replace the prefill header if user hasn't typed a custom message
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
            () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" }),
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
                    plan, // add {{plan}} in your EmailJS template to display it
                    reply_to: email,
                },
                { publicKey: PUBLIC_KEY }
            );
            setStatus({ sending: false, ok: true, msg: "Thanks! Your message was sent." });
            form.reset();
        } catch {
            setStatus({ sending: false, ok: false, msg: "Could not send. Try again later." });
        }
    }

    return (
        <section className="min-h-screen grid place-items-center bg-transparent px-4 pt-28">
            <motion.form
                ref={formRef}
                onSubmit={handleSubmit}
                initial={{ y: 12 }}
                animate={{ y: 0, transition: { duration: 0.28, ease: "easeOut" } }}
                className="w-full max-w-xl bg-black/40 backdrop-blur-md border border-white/10
                   rounded-2xl p-6 text-white space-y-4 transform-gpu"
            >
                <h2 className="text-2xl font-semibold">Contact</h2>
                {/* Honeypot */}
                <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

                {/* Selected plan + inline selector */}
                <div className="text-sm text-white/90">
                    {plan ? (
                        <>
                            Interested in:{" "}
                            <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
                                {plan}
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectOpen((v) => !v)}
                                className="ml-2 text-white/70 hover:text-white underline"
                            >
                                change
                            </button>
                            <button
                                type="button"
                                onClick={goPricing}
                                className="ml-3 text-white/70 hover:text-white underline"
                            >
                                view packages
                            </button>
                            <input type="hidden" name="plan" value={plan} />
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
                        <button
                            type="button"
                            onClick={() => setPlan("")}
                            className="block w-full text-left rounded-md px-3 py-2 hover:bg-white/10 text-white/70"
                        >
                            No specific plan
                        </button>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-white/80">Your name</label>
                        <input
                            name="from_name"
                            className="mt-1 w-full rounded-lg bg-white/10 p-2 outline-none"
                            placeholder="Jane Doe"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-white/80">Email</label>
                        <input
                            name="from_email"
                            type="email"
                            className="mt-1 w-full rounded-lg bg-white/10 p-2 outline-none"
                            placeholder="you@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-white/80">Message</label>
                    <textarea
                        name="message"
                        rows="5"
                        className="mt-1 w-full rounded-lg bg-white/10 p-2 outline-none"
                        placeholder="How can I help?"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status.sending}
                    className="w-full rounded-xl bg-white/90 text-black font-semibold py-2 hover:bg-white disabled:opacity-60"
                >
                    {status.sending ? "Sending..." : "Send"}
                </button>

                {status.ok === true && <p className="text-green-300">{status.msg}</p>}
                {status.ok === false && <p className="text-red-300">{status.msg}</p>}
            </motion.form>
        </section>
    );
}
