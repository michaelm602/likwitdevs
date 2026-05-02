export default function PolicyNotice({ compact = false }) {
    if (compact) {
        return (
            <div className="border-t border-white/10 text-center text-xs text-white/40 px-4 py-4 space-y-1">
                <p>
                    Your information is never sold or shared — used only to respond to your inquiry.
                </p>
                <p>
                    Deposits are <span className="text-white/55">non-refundable</span> once work has started.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 space-y-3 text-sm text-white/70">
            <p className="text-white/90 font-medium text-base">Privacy & Booking Policy</p>
            <div className="h-px bg-white/10" />
            <p>
                Your name, email, and message are used only to respond to your inquiry. We never sell,
                share, or retain your information beyond what's needed for communication. Every inquiry
                is handled with care and confidentiality.
            </p>
            <p>
                <span className="text-white/85 font-medium">Deposits & Refunds: </span>
                A deposit is required to secure your project slot — work begins immediately after
                booking. Deposits are{" "}
                <span className="text-white/85 font-medium">non-refundable once work has started</span>.
                If a project is canceled before work begins, the deposit may be partially refunded
                minus any time spent on planning or setup.
            </p>
        </div>
    );
}
