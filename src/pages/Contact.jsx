// src/pages/Contact.jsx
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

export default function Contact() {
    const formRef = useRef(null);
    const [status, setStatus] = useState({ sending: false, ok: null, msg: "" });

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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
                { from_name: name, from_email: email, message, reply_to: email },
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
                <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-white/80">Your name</label>
                        <input name="from_name" className="mt-1 w-full rounded-lg bg-white/10 p-2 outline-none" placeholder="Jane Doe" />
                    </div>
                    <div>
                        <label className="text-sm text-white/80">Email</label>
                        <input name="from_email" type="email" className="mt-1 w-full rounded-lg bg-white/10 p-2 outline-none" placeholder="you@email.com" />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-white/80">Message</label>
                    <textarea name="message" rows="5" className="mt-1 w-full rounded-lg bg-white/10 p-2 outline-none" placeholder="How can I help?" />
                </div>

                <button type="submit" disabled={status.sending} className="w-full rounded-xl bg-white/90 text-black font-semibold py-2 hover:bg-white disabled:opacity-60">
                    {status.sending ? "Sending..." : "Send"}
                </button>

                {status.ok === true && <p className="text-green-300">{status.msg}</p>}
                {status.ok === false && <p className="text-red-300">{status.msg}</p>}
            </motion.form>
        </section>
    );
}
