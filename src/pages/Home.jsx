import Typewriter from "../components/Typewriter";
import "../App.css";
import ParticlesBackground from "../components/ParticlesBackground";

export default function Home() {
    return (
        <div className="hero">
            {/* Dark overlay */}
            <div className="hero-overlay"></div>
            {/* Content */}
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
    );
}
