/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", sm: "1.25rem" } },
    extend: {
      screens: {
        xs: "375px", // small phones
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      fontSize: {
        // sane responsive clamps for headings
        "fluid-h1": ["clamp(1.75rem, 2vw + 1rem, 3rem)", { lineHeight: "1.1" }],
        "fluid-h2": ["clamp(1.25rem, 1.2vw + 1rem, 2rem)", { lineHeight: "1.2" }],
        "fluid-body": ["clamp(0.95rem, 0.3vw + 0.85rem, 1.1rem)", { lineHeight: "1.6" }],
      },
    },
  },
  plugins: [],
};
