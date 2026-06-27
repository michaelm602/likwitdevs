// src/layouts/AnimatedLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedLayout() {
    const location = useLocation();
    const reduceMotion = useReducedMotion();

    // optional: jump to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait" initial={false}>
            <Motion.div
                key={location.pathname}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={reduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }}
                exit={reduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -8, transition: { duration: 0.22, ease: "easeIn" } }}
                style={{ minHeight: "100vh" }}
            >
                <Outlet />
            </Motion.div>
        </AnimatePresence>
    );
}
