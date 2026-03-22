import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Contact from "./Contact";

const checkItems = [
  { label: "Load speed", desc: "What's slowing you down and costing you rankings" },
  { label: "Mobile experience", desc: "Whether your site works where your customers actually browse" },
  { label: "SEO fundamentals", desc: "Title tags, meta descriptions, heading structure" },
  { label: "Conversion path", desc: "Can a visitor find your number or book in under 10 seconds?" },
  { label: "Trust signals", desc: "Reviews, credibility cues, and first impressions" },
];

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
        title: "Let's see what your site is costing you.",
        body:
          "You scanned the code — so you're already thinking about this. Drop your site below " +
          "and I'll send back a real breakdown of what's hurting your leads. No template, no sales pitch.",
        note: "⚡ Most audits land in your inbox within 24 hours.",
        intent: "audit",
      };
    }

    return {
      title: "I'll tell you exactly what's holding your site back.",
      body:
        "Send me your site and I'll personally review it — speed, SEO, mobile, and whether it's " +
        "actually built to get you calls. You'll get a direct, specific breakdown. Not a generic checklist.",
      note: "⚡ Most reviews are back within 24 hours.",
      intent: "review",
    };
  }, [isQR]);

  return (
    <section className="min-h-screen bg-transparent px-4 pt-28 pb-16">
      <div className="w-full max-w-3xl space-y-12 mx-auto">

        {/* Glass Intro Panel */}
        <div className="card p-6 md:p-8 text-white text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {copy.title}
          </h1>

          <p className="text-white/80 text-base md:text-lg leading-relaxed">
            {copy.body}
          </p>

          <p className="text-white/55 text-sm">{copy.note}</p>

          <p className="text-white/40 text-xs tracking-wide">
            Portland-based · real feedback · no obligation
          </p>
        </div>

        {/* What I'll look at */}
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-white/50 text-xs uppercase tracking-widest text-center mb-4">What I'll look at</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {checkItems.map(({ label, desc }) => (
              <div
                key={label}
                className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm px-4 py-3"
              >
                <span className="mt-0.5 h-2 w-2 rounded-full bg-white/40 flex-shrink-0" />
                <div>
                  <p className="text-white/90 text-sm font-medium">{label}</p>
                  <p className="text-white/50 text-xs leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded form */}
        <Contact embedded source={mode} intent={copy.intent} />

      </div>
    </section>
  );
}
