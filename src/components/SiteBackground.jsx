// src/components/SiteBackground.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground";

export default function SiteBackground() {
    const { pathname } = useLocation();
    const bgUrl = `${import.meta.env.BASE_URL}images/computerbg.jpg`;
    const [showFx, setShowFx] = useState(false);

    // Mount heavy visuals a tick after first paint to avoid initial flash
    useEffect(() => {
        const id = requestAnimationFrame(() => setShowFx(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <>
            {/* Background image */}
            <div
                aria-hidden
                className="fixed -z-30 left-0 right-0 top-0 inset-0 bg-center bg-cover md:bg-fixed"
                style={{ backgroundImage: `url(${bgUrl})`, willChange: "transform", transform: "translateZ(0)" }}
            />
            {/* Tint */}
            <div
                aria-hidden
                className="fixed -z-20 left-0 right-0 top-0 h-svh bg-black/30 pointer-events-none"
                style={{ willChange: "opacity", transform: "translateZ(0)" }}
            />
            {/* Particles (deferred mount) */}
            {showFx && (
                <div
                    aria-hidden
                    className="fixed -z-10 left-0 right-0 top-0 h-svh pointer-events-none"
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                >
                    <ParticlesBackground key={pathname} />
                </div>
            )}
        </>
    );
}
