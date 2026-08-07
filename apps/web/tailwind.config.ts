import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#0A0A0A",
        cream: "#F5F5F0",
        linen: "#E8E5DF",
        sand: "#D4CFC5",
        terracotta: "#C0522A",
        muted: "#6D6964",
      },
      fontFamily: {
        didot: ["Didot", "Didot LT Std", "Bodoni Moda", "Bodoni MT", "Book Antiqua", "Georgia", "serif"],
        serif: ["Didot", "Didot LT Std", "Bodoni Moda", "Bodoni MT", "Book Antiqua", "Georgia", "serif"],
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        playfair: ["Playfair Display", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["0.7rem", { lineHeight: "1.2" }],
        xs:   ["0.8rem",  { lineHeight: "1.4" }],
        sm:   ["0.9rem",  { lineHeight: "1.5" }],
        base: ["1rem",    { lineHeight: "1.6" }],
        lg:   ["1.2rem",  { lineHeight: "1.5" }],
        xl:   ["1.4rem",  { lineHeight: "1.4" }],
        "2xl": ["1.7rem", { lineHeight: "1.3" }],
        "3xl": ["2.1rem", { lineHeight: "1.25" }],
        "4xl": ["2.8rem", { lineHeight: "1.15" }],
        "5xl": ["3.8rem", { lineHeight: "1.1" }],
        "6xl": ["5rem",   { lineHeight: "1.05" }],
      },
      borderColor: {
        DEFAULT: "#0A0A0A",
      },
      borderWidth: {
        DEFAULT: "1px",
        "2": "2px",
        "3": "3px",
      },
    },
  },
  plugins: [],
};

export default config;
