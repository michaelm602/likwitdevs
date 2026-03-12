import Reveal from "../components/Reveal";

const testimonials = [
    {
        text: "Great experience working with LikWitDevs on my website. Fast communication, clean design, and they delivered exactly what I needed. Highly recommend for anyone looking for reliable web development.",
        name: "Elysia Hernandez",
        business: null,
    },
    {
        text: "I'm so happy with the website they created for my nail business! From the beginning they listened to what I wanted and made the whole process easy and stress-free. The design is beautiful, professional, and exactly what I envisioned.",
        name: "Katrina Garcia",
        business: "Blessed N Polished",
    },
];

function StarRow() {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-yellow-400"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.95 2.679c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
            ))}
        </div>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="mx-auto max-w-6xl px-4 pt-2 pb-10 md:pb-14">
            <Reveal>
            <div className="rounded-3xl border border-white/15 bg-black/20 backdrop-blur-md p-6 md:p-10">
                {/* Trust bar */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 backdrop-blur-md px-4 py-2 text-sm text-white/80">
                        <span className="text-yellow-400 font-semibold">5.0 ★</span>
                        <span className="text-white/50">|</span>
                        <span>
                            <span style={{color:"#4285F4"}}>G</span>
                            <span style={{color:"#EA4335"}}>o</span>
                            <span style={{color:"#FBBC05"}}>o</span>
                            <span style={{color:"#4285F4"}}>g</span>
                            <span style={{color:"#34A853"}}>l</span>
                            <span style={{color:"#EA4335"}}>e</span>
                            {" "}Rating
                        </span>
                    </div>
                    <div className="rounded-full border border-white/15 bg-black/20 backdrop-blur-md px-4 py-2 text-sm text-white/60">
                        2 Google Reviews
                    </div>
                </div>

                {/* Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {testimonials.map((t) => (
                        <div
                            key={t.name}
                            className="rounded-2xl border border-white/15 bg-black/20 backdrop-blur-md p-6 flex flex-col gap-3 shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
                        >
                            <StarRow />
                            <p className="text-white/85 text-sm leading-relaxed flex-1">
                                "{t.text}"
                            </p>
                            <div className="mt-1">
                                <div className="text-white font-semibold text-sm">{t.name}</div>
                                {t.business && (
                                    <div className="text-white/55 text-xs mt-0.5">{t.business}</div>
                                )}
                            </div>
                            <div className="pt-2 border-t border-white/10">
                                <span className="text-xs text-white/40 tracking-wide uppercase">Google Review</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <a
                        href="https://www.google.com/search?q=Likwit+Devs+Reviews"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-xl border border-white/15 bg-black/20 hover:bg-black/30 backdrop-blur-md px-6 py-2.5 text-sm text-white transition"
                    >
                        Read More Reviews on{" "}
                        <span style={{color:"#4285F4"}}>G</span>
                        <span style={{color:"#EA4335"}}>o</span>
                        <span style={{color:"#FBBC05"}}>o</span>
                        <span style={{color:"#4285F4"}}>g</span>
                        <span style={{color:"#34A853"}}>l</span>
                        <span style={{color:"#EA4335"}}>e</span>
                    </a>
                </div>
            </div>
            </Reveal>
        </section>
    );
}
