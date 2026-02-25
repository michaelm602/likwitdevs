import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Contact from "./Contact";

export default function FreeAudit({ mode = "cta" }) {
const [searchParams, setSearchParams] = useSearchParams();

    const isQR = mode === "qr";

    // QR: keep audit intent in URL for tracking + prefills
    // CTA: do NOT touch the URL (keep it clean)
    useEffect(() => {
        if (!isQR) return;

        if (!searchParams.get("intent")) {
            const next = new URLSearchParams(searchParams);
            next.set("intent", "audit");
            setSearchParams(next, { replace: true });
        }
    }, [isQR, searchParams, setSearchParams]);

    const copy = useMemo(() => {
        if (isQR) {
            return {
                title: "Quick audit intake.",
                body:
                    "Since you scanned the code, this form is set up for a fast website audit request. " +
                    "Drop your site and I’ll send back what’s costing you leads.",
                note: "⚡ Most audits are delivered within 24 hours.",
                intent: "audit",
            };
        }

        return {
            title: "Get your free review.",
            body:
                "Drop your website below and I’ll personally review speed, SEO, and structure — " +
                "then send you a direct breakdown of what to fix to get more leads.",
            note: "⚡ Most reviews are delivered within 24 hours.",
            intent: "review",
        };
    }, [isQR]);

    return (
        <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
            <div className="w-full max-w-3xl space-y-20 mx-auto">
                {/* Glass Intro Panel */}
                <div className="card p-6 md:p-8 text-white text-center space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        {copy.title}
                    </h1>

                    <p className="text-white/80 text-base md:text-lg leading-relaxed">
                        {copy.body}
                    </p>

                    <p className="text-white/60 text-sm">{copy.note}</p>
                </div>

                {/* Embedded form */}
                <Contact embedded source={mode} intent={copy.intent} />
            </div>
        </section>
    );
}