import { useEffect, useRef, useState } from "react";

/** Anti-flicker Reveal: different thresholds for enter/exit (hysteresis) */
export default function Reveal({
    as: Tag = "div",
    className = "",
    children,
    y = 24,
    duration = 550,
    delay = 0,
    ease = "cubic-bezier(0.22,1,0.36,1)",
    // Hysteresis: higher to enter, lower to exit
    enter = 0.25,                // intersectionRatio to show
    exit = 0.12,                 // intersectionRatio to hide
    rootMargin = "-12% 0px -12% 0px",
    once = false,
    startVisible = true,
    ...rest
}) {
    const elRef = useRef(null);
    const [visible, setVisible] = useState(startVisible);
    const visibleRef = useRef(visible);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reduce.matches) { setVisible(true); visibleRef.current = true; return; }

        const el = elRef.current;
        if (!el) return;

        // If starting on-screen, render visible to avoid first-paint flash
        if (startVisible) {
            const r = el.getBoundingClientRect();
            const within = r.top < window.innerHeight && r.bottom > 0;
            if (within) { setVisible(true); visibleRef.current = true; }
        }

        // Fine-grained thresholds so we can read intersectionRatio accurately
        const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
        const io = new IntersectionObserver(([entry]) => {
            const ratio = entry.intersectionRatio ?? 0;

            if (!visibleRef.current && ratio >= enter) {
                visibleRef.current = true;
                setVisible(true);
                if (once) io.disconnect();
            } else if (!once && visibleRef.current && ratio <= exit) {
                visibleRef.current = false;
                setVisible(false);
            }
        }, { threshold: thresholds, rootMargin });

        io.observe(el);
        return () => io.disconnect();
    }, [enter, exit, rootMargin, once, startVisible]);

    const base = {
        transition: `transform ${duration}ms ${ease} ${delay}ms, opacity ${duration}ms ${ease} ${delay}ms`,
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
    };
    const hidden = { transform: `translateY(${y}px)`, opacity: 0 };
    const shown = { transform: "translateY(0px)", opacity: 1 };

    return (
        <Tag
            ref={elRef}
            className={className}
            style={{ ...base, ...(visible ? shown : hidden) }}
            {...rest}
        >
            {children}
        </Tag>
    );
}
