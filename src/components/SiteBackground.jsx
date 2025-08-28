// src/components/SiteBackground.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground";

export default function SiteBackground() {
    const { pathname } = useLocation();
    const [showFx, setShowFx] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setShowFx(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <>
            {/* Fixed image layer (no background-attachment; very stable on mobile) */}
            <div
                aria-hidden
                className="fixed inset-0 -z-30 pointer-events-none select-none"
            >
                <img
                    src="/images/computerbg.jpg"
                    alt=""
                    className="
            absolute inset-0 w-full
            object-cover
            [transform:translateZ(0)]
            will-change-transform
          "
                    draggable={false}
                />
            </div>

            {/* Tint overlay */}
            <div
                aria-hidden
                className="fixed inset-0 -z-20 bg-black/30 pointer-events-none
                   h-svh md:h-dvh"
                style={{ transform: "translateZ(0)", willChange: "opacity" }}
            />

            {/* Particles (mounted one tick later) */}
            {showFx && (
                <div
                    aria-hidden
                    className="fixed inset-0 -z-10 pointer-events-none
                     h-svh md:h-dvh"
                    style={{ transform: "translateZ(0)" }}
                >
                    <ParticlesBackground key={pathname} />
                </div>
            )}
        </>
    );
}
