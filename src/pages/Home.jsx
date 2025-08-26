import Typewriter from "../components/Typewriter";
import ParticlesBackground from "../components/ParticlesBackground";
import ProjectsSection from "../sections/ProjectsSection";
import AboutSection from "../sections/AboutSection";
import Reveal from "../components/Reveal";

export default function Home() {
    return (
        <>
            {/* HERO */}
            <section className="relative overflow-hidden hero-stable">
                {/* Background / particles */}
                <ParticlesBackground className="pointer-events-none absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />

                {/* Content */}

                <div className="mx-auto max-w-6xl px-4">

                    <div className="relative py-14 md:py-24">
                        <Reveal>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                                Welcome to My Portfolio
                            </h1>
                        </Reveal>
                        <Reveal>
                            <p className="mt-3 text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl">
                                <Typewriter
                                    texts={[
                                        "I build and design modern, responsive websites.",
                                        "I make sites that are fast, professional, and mobile-friendly.",
                                        "I add custom artwork and visuals to make your brand stand out.",
                                    ]}
                                    speed={70}
                                    pause={1600}
                                />
                            </p>
                        </Reveal>
                        <button
                            onClick={() => {
                                document.getElementById("projects")?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                            className="btn-subtle text-white bg-black/10 backdrop-blur-md mt-3"
                        >
                            <Reveal>
                                View Projects
                            </Reveal>
                        </button>


                    </div>

                </div>

                {/* Optional: background image slot (keeps aspect + avoids fixed heights)
            <div className="absolute inset-0 -z-10">
              <img src="/images/computerbg.jpg" alt="" className="w-full h-full object-cover" />
            </div> */}

            </section>

            {/* PROJECTS */}
            <ProjectsSection />
            <AboutSection />
        </>
    );
}
