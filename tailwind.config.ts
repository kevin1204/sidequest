import type { Config } from "tailwindcss";

/**
 * Design tokens mirrored from the imported TalentTie design system
 * (TalentTie_design/styles.css :root). Tailwind augments the ported
 * CSS — preflight is disabled so the design's own reset stays the
 * source of visual truth.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        tl: {
          50: "#eef6f4",
          100: "#d4e9e3",
          200: "#a9d3ca",
          300: "#76b6a8",
          400: "#439484",
          500: "#2a8071",
          600: "#1f7a6b",
          700: "#19655a",
          800: "#154f47",
          900: "#123f39",
        },
        primary: "var(--primary)",
        teal: "#2aa897",
        amber: "#b45309",
        green: "#047857",
        rose: "#be123c",
        ink: "#0d1a18",
        "ink-2": "#2a3a37",
        muted: "#62736f",
        "muted-2": "#8a9a95",
        line: "#e3ebe8",
        "line-2": "#eef3f1",
        bg: "#f5f8f7",
        "bg-2": "#eef3f1",
        card: "#ffffff",
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xs: "8px",
        sm: "10px",
        md: "14px",
        lg: "18px",
        xl: "24px",
        pill: "999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(16,28,56,.06)",
        sm: "0 1px 3px rgba(16,28,56,.07), 0 1px 2px rgba(16,28,56,.04)",
        md: "0 4px 14px rgba(16,28,56,.08), 0 1px 3px rgba(16,28,56,.05)",
        lg: "0 16px 40px rgba(16,28,56,.12), 0 4px 10px rgba(16,28,56,.06)",
        brand: "0 8px 24px rgba(31,122,107,.24)",
      },
      transitionTimingFunction: {
        ease: "cubic-bezier(.22,.61,.36,1)",
      },
      maxWidth: {
        shell: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
