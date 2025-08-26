import { useLocation } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground";

export default function SiteBackground() {
    const { pathname } = useLocation();
    const bgUrl = `${import.meta.env.BASE_URL}images/computerbg.jpg`;

    return (
        <>
            {/* Background image */}
            <div
                aria-hidden
                className="
          fixed -z-30 left-0 right-0 top-0 h-svh
          bg-center bg-cover md:bg-fixed
        "
                style={{ backgroundImage: `url(${bgUrl})` }}
            />

            {/* Tint overlay */}
            <div
                aria-hidden
                className="fixed -z-20 left-0 right-0 top-0 h-svh bg-black/30 pointer-events-none"
            />

            {/* Particles */}
            <div
                aria-hidden
                className="fixed -z-10 left-0 right-0 top-0 h-svh pointer-events-none"
            >
                <ParticlesBackground key={pathname} />
            </div>
        </>
    );
}
