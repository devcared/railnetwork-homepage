import { createSystem, defaultConfig } from "@chakra-ui/react";

// Custom System mit DB-Farben und Fonts für Chakra UI v3
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#fef2f2" },
          100: { value: "#fee2e2" },
          200: { value: "#fecaca" },
          300: { value: "#fca5a5" },
          400: { value: "#f87171" },
          500: { value: "#e2001a" }, // DB Rot (Primary)
          600: { value: "#c10015" }, // DB Rot Dark
          700: { value: "#991b1b" },
          800: { value: "#7f1d1d" },
          900: { value: "#450a0a" },
        },
        db: {
          red: { value: "#e2001a" },
          "red-dark": { value: "#c10015" },
          gray: { value: "#333b46" },
        },
      },
      fonts: {
        heading: { value: '"DBScreenHead", sans-serif' },
        body: { value: '"DBScreenSans", sans-serif' },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "4xl": { value: "2.25rem" },
        "5xl": { value: "3rem" },
      },
    },
  },
});

export default system;

