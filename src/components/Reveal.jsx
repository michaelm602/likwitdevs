import { useEffect, useRef, useState } from "react";

export default function Reveal({
    as: Tag = "div",
    className = "",
    children,
    y = 24,                 // slide distance (px)
    duration = 550,         // ms
    delay = 0,              // ms
    ease = "cubic-bezier(0.22,1,0.36,1)",
    threshold = 0.15,       // portion visible to count as "in view"
    rootMargin = "-10% 0px -10% 0px", // tighten to prevent flicker near edges
    once = false,           // false = animate both ways; true = only animate in
    startVisible = true,    // show instantly if it starts on screen
    ...rest
}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(startVisible);

    useEffect(() => {
        const m = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (m.matches) { setVisible(true); return; }

        const el = ref.current;
        if (!el) return;

        // If it starts within the viewport, render as visible to avoid first-paint flicker
        if (startVisible) {
            const r = el.getBoundingClientRect();
            const within = r.top < window.innerHeight && r.bottom > 0;
            if (within) setVisible(true);
        }

        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                if (once) io.disconnect();
            } else if (!once) {
                setVisible(false);
            }
        }, { threshold, rootMargin });

        io.observe(el);
        return () => io.disconnect();
    }, [once, threshold, rootMargin, startVisible]);

    const base = {
        transition: `transform ${duration}ms ${ease} ${delay}ms, opacity ${duration}ms ${ease} ${delay}ms`,
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
    };
    const hidden = { transform: `translateY(${y}px)`, opacity: 0 };
    const shown = { transform: "translateY(0px)", opacity: 1 };

    return (
        <Tag ref={ref} className={className} style={{ ...base, ...(visible ? shown : hidden) }} {...rest}>
            {children}
        </Tag>
    );
}
