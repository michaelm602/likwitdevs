import {
    motion as Motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "framer-motion";

const revealVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
};

export function MotionReveal({
    as = "div",
    children,
    className = "",
    delay = 0,
    amount = 0.18,
    ...props
}) {
    const reduceMotion = useReducedMotion();
    const Component = Motion[as] || Motion.div;

    return (
        <Component
            className={className}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount }}
            variants={revealVariants}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
            {...props}
        >
            {children}
        </Component>
    );
}

export function MotionCard({
    as = "div",
    children,
    className = "",
    delay = 0,
    lift = 6,
    ...props
}) {
    const reduceMotion = useReducedMotion();
    const Component = Motion[as] || Motion.div;

    return (
        <Component
            className={className}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            whileHover={reduceMotion ? undefined : { y: -lift }}
            whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            transition={{
                opacity: { duration: 0.45, delay },
                y: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.18 },
            }}
            {...props}
        >
            {children}
        </Component>
    );
}

export function CursorGlow({ children, className = "" }) {
    const reduceMotion = useReducedMotion();
    const pointerX = useMotionValue(72);
    const pointerY = useMotionValue(32);
    const smoothX = useSpring(pointerX, { stiffness: 180, damping: 28, mass: 0.35 });
    const smoothY = useSpring(pointerY, { stiffness: 180, damping: 28, mass: 0.35 });
    const glow = useMotionTemplate`radial-gradient(520px circle at ${smoothX}% ${smoothY}%, rgba(0, 149, 255, 0.17), transparent 64%)`;

    function handlePointerMove(event) {
        if (reduceMotion || event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
        pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
    }

    function handlePointerLeave() {
        pointerX.set(72);
        pointerY.set(32);
    }

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <Motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background: reduceMotion
                        ? "radial-gradient(520px circle at 72% 32%, rgba(0, 149, 255, 0.13), transparent 64%)"
                        : glow,
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
