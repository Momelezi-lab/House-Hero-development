import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1E40AF",
        },
        success: "#10B981",
        highlight: "#F59E0B",
        background: {
          light: "#F3F4F6",
        },
        text: {
          dark: "#111827",
          muted: "#6B7280",
        },
        border: {
          grey: "#D1D5DB",
        },
        // Legacy support - map old colors to new
        secondary: "#2563EB",
        accent: "#2563EB",
        danger: "#ef4444",
        warning: "#F59E0B",
        info: "#2563EB",
        light: "#F3F4F6",
        dark: "#111827",
      },
    },
  },
  plugins: [],
};
export default config;

