import Reveal from "../components/Reveal";

export default function AboutSection() {
    return (
        <section id="about" className="scroll-mt-24 px-4 py-12 md:py-20">
            <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-black/10 backdrop-blur-md p-6 md:p-10">
                <Reveal>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        About
                    </h2>

                    <p className="text-white/90 max-w-3xl">
                        I’m Michael — the builder behind{" "}
                        <span className="font-semibold">Likwit Devs</span>. I design and ship{" "}
                        <span className="font-semibold">fast, mobile-first websites</span>{" "}
                        that look clean and make it easy for customers to call, book, or buy.
                        My focus is performance (Core Web Vitals), simple content editing, and
                        custom visuals so your brand actually stands out.
                    </p>

                    <p className="text-white/80 max-w-3xl mt-3">
                        Real talk: most small business websites fail because they’re slow,
                        confusing, or don’t tell people what to do next. I build with a
                        conversion-first mindset — and I don’t ship messy, fragile nonsense.
                    </p>

                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80">
                        <li>• Landing pages and small business sites</li>
                        <li>• Content editing (so you can update your own stuff)</li>
                        <li>• Speed + SEO best practices</li>
                        <li>• Integrations: email, forms, booking, payments</li>
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2 text-sm text-white/80">
                        <span className="px-3 py-1 rounded-lg bg-white/10">React</span>
                        <span className="px-3 py-1 rounded-lg bg-white/10">Tailwind</span>
                        <span className="px-3 py-1 rounded-lg bg-white/10">Firebase</span>
                        <span className="px-3 py-1 rounded-lg bg-white/10">Stripe</span>
                        <span className="px-3 py-1 rounded-lg bg-white/10">EmailJS</span>
                    </div>

                    {/* Process */}
                    <div className="mt-8 grid gap-3 sm:grid-cols-3 text-white/80">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <span className="text-white font-semibold">1.</span> Brief & scope
                            <div className="text-white/70 text-sm mt-1">
                                You tell me the goal. I translate it into a plan.
                            </div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <span className="text-white font-semibold">2.</span> Design → build
                            <div className="text-white/70 text-sm mt-1">
                                Clean UI, fast performance, conversion layout.
                            </div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <span className="text-white font-semibold">3.</span> Launch & handoff
                            <div className="text-white/70 text-sm mt-1">
                                Go live, walkthrough, and optional maintenance plan.
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href="#audit"
                            className="btn-subtle text-white bg-white/15 hover:bg-white/20 backdrop-blur-md"
                        >
                            Get a Free Website Audit
                        </a>
                        <a
                            href="#pricing"
                            className="btn-subtle text-white bg-black/10 hover:bg-black/20 backdrop-blur-md"
                        >
                            View Packages
                        </a>
                    </div>

                    {/* Trust line */}
                    <p className="mt-6 text-xs text-white/60">
                        Built with a systems mindset: performance, reliability, and clean handoff.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
