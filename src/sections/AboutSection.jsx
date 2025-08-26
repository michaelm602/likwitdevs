import Reveal from "../components/Reveal";

export default function AboutSection() {
    return (
        <section
            id="about"
            className="scroll-mt-32 md:scroll-mt-40 px-4 py-12 md:py-20"
        >
            <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-black/10 backdrop-blur-md p-6 md:p-10">
                <Reveal as="h2" className="text-2xl md:text-3xl font-bold text-white mb-4" once={false}>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">About Me</h2>
                </Reveal>
                <Reveal>
                    <p className="text-white/90 max-w-3xl">
                        I’m Michael — the builder behind <span className="font-semibold">Likwit Devs</span>.
                        I design and ship clean, mobile-first websites for artists, small businesses, and creators.
                        My focus is speed, polish, and simple admin tools so you can update content without headaches.
                        Need e-commerce, booking, or custom visuals? I’ve got you.
                    </p>
                </Reveal>
                <Reveal>
                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80">
                        <li>• React + Tailwind, Firebase (Auth/Firestore/Storage)</li>
                        <li>• Stripe & PayPal checkout, EmailJS notifications</li>
                        <li>• Image galleries, admin panels, and fast hosting</li>
                        <li>• Branding help: visuals, hero media, light effects</li>
                    </ul>
                </Reveal>
            </div>
        </section>
    );
}
