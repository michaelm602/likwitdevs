import Typewriter from "../components/Typewriter";
import ParticlesBackground from "../components/ParticlesBackground";
import ProjectsSection from "../sections/ProjectsSection";
import AboutSection from "../sections/AboutSection";

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
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                            Websites that outpace your competition.
                        </h1>
                        <p className="mt-3 text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl">

                            <Typewriter
                                texts={[
                                    "Blazing-fast performance & Core Web Vitals friendly.",
                                    "Mobile-first design with clean, modern UI.",
                                    "SEO-ready builds and simple content editing.",
                                    "Custom visuals so your brand actually stands out.",
                                ]}
                                speed={70}
                                pause={1600}
                            />
                        </p>
                        <button
                            onClick={() => {
                                document.getElementById("projects")?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                            className="btn-subtle text-white bg-black/10 backdrop-blur-md mt-3"
                        >
                            View Projects
                        </button>
                        <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/80">
                            <span className="px-3 py-1 rounded-lg bg-white/10">Responsive</span>
                            <span className="px-3 py-1 rounded-lg bg-white/10">Fast Loads</span>
                            <span className="px-3 py-1 rounded-lg bg-white/10">SEO Ready</span>
                            <span className="px-3 py-1 rounded-lg bg-white/10">Modern UI</span>
                        </div>


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
