import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // From DESIGN.md (warm neutral, calm, minimal)
          primary: "#EDE6DF",
          secondary: "#C8B6A6",
          text: "#2B2B2B",
          muted: "#7A6F68",
          accent: "#8B5E5E",
        },
      },
      keyframes: {
        "lp-breathe": {
          "0%, 100%": { transform: "translateZ(0) scale(1)", opacity: "1" },
          "50%": { transform: "translateZ(0) scale(1.01)", opacity: "0.92" },
        },
        "lp-float": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -6px, 0)" },
        },
      },
      animation: {
        "lp-breathe": "lp-breathe 3s ease-in-out infinite",
        "lp-float": "lp-float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
