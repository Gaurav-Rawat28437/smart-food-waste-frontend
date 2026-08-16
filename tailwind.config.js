/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EC",
        ink: "#16211A",
        forest: {
          50: "#EAF3EC",
          100: "#CFE4D5",
          200: "#9FC9AB",
          300: "#6FAD81",
          400: "#3F9159",
          500: "#1F7A46",
          600: "#186339",
          700: "#123524",
          800: "#0E291C",
          900: "#0A1D13",
        },
        harvest: {
          100: "#FBEBC6",
          300: "#F1CE7F",
          500: "#E2A93B",
          600: "#C58B22",
        },
        clay: {
          100: "#F7DCD1",
          300: "#E4A98F",
          500: "#C1592F",
          600: "#A3441F",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["'Public Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(18, 53, 36, 0.25)",
        card: "0 1px 2px rgba(18, 53, 36, 0.06), 0 8px 24px -12px rgba(18, 53, 36, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise .5s ease-out both",
      },
    },
  },
  plugins: [],
};
