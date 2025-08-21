// src/components/ParticlesBackground.jsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // smaller bundle

export default function ParticlesBackground({ className = "" }) {
    const init = useCallback(async (engine) => {
        // loads the slim bundle -> shapes, movement, links, etc.
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={init}
            className={className}
            // Make it fill the parent (we'll absolutely position it)
            style={{ position: "absolute", inset: 0 }}
            options={{
                fpsLimit: 60,
                detectRetina: true,
                background: { color: "transparent" },
                fullScreen: { enable: false }, // stay inside parent
                pauseOnBlur: true, // auto-pause on hidden tabs
                smooth: true,

                // Respect reduced motion users
                reduceDuplicates: true,

                particles: {
                    number: {
                        value: 60,
                        density: { enable: true, area: 900 },
                    },
                    color: { value: "#ffffff" },
                    shape: { type: "circle" },
                    opacity: { value: 0.50 },
                    size: { value: { min: 1, max: 3 } },

                    links: {
                        enable: true,
                        distance: 130,
                        color: "#ffffff",
                        opacity: 0.2,
                        width: 1,
                    },

                    move: {
                        enable: true,
                        speed: 0.6,          // nice and calm
                        direction: "none",
                        outModes: { default: "out" },
                        random: false,
                        straight: false,
                    },
                },

                interactivity: {
                    detectsOn: "window",
                    events: {
                        onHover: { enable: true, mode: "repulse" }, // gentle hover reaction
                        onClick: { enable: false, mode: "push" },   // disable click spam
                        resize: true,
                    },
                    modes: {
                        repulse: { distance: 80, duration: 0.3 },
                        push: { quantity: 2 },
                    },
                },
            }}
        />
    );
}
