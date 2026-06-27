import { lazy, Suspense } from "react";

const ReactBitsBeams = lazy(() => import("./ReactBitsBeams"));

export default function SiteBackground() {
    return (
        <>
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-30 bg-black"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-20 opacity-60"
            >
                <Suspense fallback={null}>
                    <ReactBitsBeams
                        lightColor="#ffffff"
                        beamWidth={3}
                        beamHeight={30}
                        beamNumber={20}
                        speed={2}
                        noiseIntensity={1.75}
                        scale={0.2}
                        rotation={30}
                    />
                </Suspense>
            </div>
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(circle at 50% 38%, rgba(0,0,0,0.06), rgba(0,0,0,0.34) 72%), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.48))",
                }}
            />
        </>
    );
}
