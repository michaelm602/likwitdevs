import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Contact from "./Contact";

export default function FreeAudit() {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!searchParams.get("intent")) {
            const next = new URLSearchParams(searchParams);
            next.set("intent", "audit");
            setSearchParams(next, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    return (
        <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
            <div className="w-full max-w-3xl space-y-20 mx-auto">
                {/* Glass Intro Panel */}
                <div className="card p-6 md:p-8 text-white text-center space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        You made a smart move.
                    </h1>

                    <p className="text-white/80 text-base md:text-lg leading-relaxed">
                        Drop your website below and I’ll personally review speed, SEO, and structure —
                        then tell you exactly what to fix to get more leads.
                    </p>

                    <p className="text-white/60 text-sm">
                        ⚡ Most audits are delivered within 24 hours.
                    </p>
                </div>

                {/* Contact Form (embedded mode so it doesn’t add its own full-screen padding) */}
                <Contact embedded />
            </div>
        </section>
    );
}
