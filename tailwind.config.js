export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Base layers
        bg: "#0f172a",        // main background (deep navy)
        surface: "#111827",   // cards, modals
        navbar: "#0b1220",    // slightly darker than bg

        // Borders & dividers
        border: "#1f2937",

        // Text
        textMain: "#f1f5f9",
        textMuted: "#94a3b8",

        // Accent options (pick ONE as primary)
        accentRed: "#ef4444",
        accentViolet: "#8b5cf6",
        accentAmber: "#f59e0b",

        // Optional hover states
        accentRedHover: "#dc2626",
        accentVioletHover: "#7c3aed",
        accentAmberHover: "#d97706",
      },
    },
  },
  plugins: [],
};