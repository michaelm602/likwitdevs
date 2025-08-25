import { useLocation } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground";

export default function SiteBackground() {
    const { pathname } = useLocation();
    const bgUrl = `${import.meta.env.BASE_URL}images/computerbg.jpg`;

    return (
        <>
            <div aria-hidden className="fixed inset-0 -z-30 bg-center bg-cover md:bg-fixed"
                style={{ backgroundImage: `url(${bgUrl})` }} />
            <div aria-hidden className="fixed inset-0 -z-20 bg-black/30 pointer-events-none" />
            <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
                <ParticlesBackground key={pathname} />
            </div>
        </>
    );
}
