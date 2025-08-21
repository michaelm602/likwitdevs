// src/components/Typewriter.jsx
import { useEffect, useState } from "react";

export default function Typewriter({
    texts = [],       // array of strings
    speed = 50,       // ms per char
    pause = 1500,     // pause after each full text
    className = ""
}) {
    const [out, setOut] = useState("");
    const [index, setIndex] = useState(0); // which text we’re on
    const [char, setChar] = useState(0);   // which character we’re typing
    const [forward, setForward] = useState(true);

    useEffect(() => {
        let timer;

        if (forward) {
            if (char < texts[index].length) {
                timer = setTimeout(() => setChar(char + 1), speed);
            } else {
                // full word typed, pause before backspacing
                timer = setTimeout(() => setForward(false), pause);
            }
        } else {
            if (char > 0) {
                timer = setTimeout(() => setChar(char - 1), speed / 2);
            } else {
                // move to next text
                setForward(true);
                setIndex((index + 1) % texts.length);
            }
        }

        setOut(texts[index].slice(0, char));

        return () => clearTimeout(timer);
    }, [char, forward, index, texts, speed, pause]);

    return (
        <span className={className}>
            {out}
            <span className="cursor">|</span>
        </span>
    );
}
