/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary:    { DEFAULT: "#2D3E50", dark: "#1B263B" },
        secondary:  { DEFAULT: "#2A9D8F", dark: "#1F7A73" },
        accent:     { DEFAULT: "#4C78D9", dark: "#3B5BB5" },
        success:    { DEFAULT: "#6DBF7B", dark: "#4E9F5B" },
        background: { DEFAULT: "#F2F4F7", dark: "#0F172A" },
        surface:    { DEFAULT: "#FFFFFF", dark: "#111827" },
        muted:      { DEFAULT: "#E5E7EB", dark: "#1F2937" },
        content:    { DEFAULT: "#1F2937", dark: "#F9FAFB" },
        subtle:     { DEFAULT: "#64748B", dark: "#9CA3AF" },
        border:     { DEFAULT: "#D1D5DB", dark: "#374151" },
        error:      { DEFAULT: "#EF4444", dark: "#F87171" },
      },
    },
  },
  plugins: [],
};
