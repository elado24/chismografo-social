import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b10",
        neon: "#21f5aa",
        flame: "#ff4d67",
        citrus: "#f8d34a",
        aqua: "#46ccff"
      },
      boxShadow: {
        glow: "0 0 36px rgba(33,245,170,.24)",
        hot: "0 16px 60px rgba(255,77,103,.28)"
      },
      backgroundImage: {
        noise: "url('/noise.png')"
      }
    }
  },
  plugins: []
};

export default config;
