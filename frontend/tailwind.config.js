/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#166534", // Deeper, more professional green
          surface: "#F8FAFC", // Cleaner, light gray surface
          slate: "#64748B", // Refined slate for text
          dark: "#0F172A", // Deep navy-dark
          lime: "#CCFBF1", // Minty accent
          amber: "#FEF3C7", // Soft warm accent
        },
      },
      borderRadius: {
        bento: "20px", // More rounded for modern look
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        bento:
          "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
        premium:
          "0px 20px 40px rgba(0, 0, 0, 0.04), 0px 4px 10px rgba(0, 0, 0, 0.02)",
        glass: "inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        sans: ["'Inter'", "'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
      },
    },
  },
  plugins: [],
};
