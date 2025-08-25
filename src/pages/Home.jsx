import Typewriter from "../components/Typewriter";
import ParticlesBackground from "../components/ParticlesBackground";
import ProjectsSection from "../sections/ProjectsSection";
import "../App.css";

export default function Home() {
    return (
        <>
            {/* HERO */}
            <div className="hero">
                <div className="hero-overlay" />
                <ParticlesBackground className="hero-particles" />

                <div className="hero-content">
                    <h1 className="hero-title">Welcome to My Portfolio</h1>
                    <p className="hero-subtitle">
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
                </div>
            </div>

            {/* PROJECTS — outside hero */}
            <ProjectsSection />
        </>
    );
}

