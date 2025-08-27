import Reveal from "../components/Reveal";

export default function AboutSection() {
    return (
        <section
            id="about"
            className="scroll-mt-32 md:scroll-mt-40 px-4 py-12 md:py-20"
        >
            <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-black/10 backdrop-blur-md shadow-xl shadow-black/80 p-6 md:p-10">
                <Reveal as="h2"
                    once={false}
                    y={16}
                    duration={520}
                    enter={0.30}
                    exit={0.12}
                    rootMargin="-18% 0px -18% 0px">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">About Me</h2>
                    <p className="text-white/90 max-w-3xl">
                        I’m Michael, the builder behind <span className="font-semibold">Likwit Devs</span>.
                        I design and ship **fast, mobile-first websites** that look clean and convert.
                        My focus is performance (Core Web Vitals), simple content editing, and custom visuals
                        so your brand actually stands out.
                    </p>
                </Reveal>
                <Reveal>
                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80">
                        <li>• Landing pages and small business sites</li>
                        <li>• CMS or no-code editing (you can update content)</li>
                        <li>• Speed + SEO best practices</li>
                        <li>• Integrations: email, forms, booking, payments</li>
                    </ul>

                </Reveal>
                <Reveal>
                    <div className="mt-6 flex flex-wrap gap-2 text-sm text-white/80">
                        <span className="px-3 py-1 rounded-lg bg-white/10">React</span>
                        <span className="px-3 py-1 rounded-lg bg-white/10">Tailwind</span>
                        <span className="px-3 py-1 rounded-lg bg-white/10">Firebase</span>
                        <span className="px-3 py-1 rounded-lg bg-white/10">Stripe</span>
                        <span className="px-3 py-1 rounded-lg bg-white/10">EmailJS</span>
                    </div>
                </Reveal>
                <Reveal>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3 text-white/80">
                        <div><span className="text-white font-semibold">1.</span> Brief & scope</div>
                        <div><span className="text-white font-semibold">2.</span> Design → build</div>
                        <div><span className="text-white font-semibold">3.</span> Launch & handoff</div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
