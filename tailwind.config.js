/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f172a",
        bg2: "#0b1222",
        card: "#111a30",
        accent: "#5be2b0",
        accent2: "#66a6ff",
        muted: "#97a1ba",
      },
      boxShadow: {
        card: "0 20px 50px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
