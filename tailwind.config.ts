import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        db: {
          red: "#e2001a",
          "red-dark": "#c10015",
          gray: "#333b46",
        },
      },
      boxShadow: {
        brand: "0 25px 50px -12px rgba(14, 165, 233, 0.25)",
      },
      fontFamily: {
        "db-screenhead": ['"DBScreenHead"', "sans-serif"],
        "db-screensans": ['"DBScreenSans"', "sans-serif"],
        "db-screensans-digital": ['"DBScreenSansDigital"', "sans-serif"],
        "db-screensanscond": ['"DBScreenSansCond"', "sans-serif"],
        "db-screennews": ['"DBScreenNews"', "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

