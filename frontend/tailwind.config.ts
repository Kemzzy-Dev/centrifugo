import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        body: "linear-gradient(181deg, #F7EEE7 0.47%, #F9E9A3 277.67%, #FD0 438.32%)",
        navbar:
          "linear-gradient(181deg, #F7EEE7 100%, #F9E9A3 100%, #FD0 100%)",
      },
      boxShadow: {
        "custom-inset":
          "-2px -2px 0px 0px rgba(0, 0, 0, 0.32) inset, 2px 2px 0px 0px rgba(255, 255, 255, 0.4) inset"
      },

      colors: {
        error: "#FF3355",
        primary: {
          DEFAULT: "#FFFAD9",
          50: "#F1FBFF",
          100: "#D5F3FF",
          200: "#ACE8FF",
          300: "#82DCFF",
          400: "#58D1FF",
          500: "#00A8E8",
          600: "#0086BA",
          700: "#00658B",
          800: "#00435D",
          900: "#00222E",
          C600: "#FF0057",
          B900: "#332C00",
          blue: "#00A8E8",
          pink: "#FF4081",
          yellow: {
            DEFAULT: "#FFDD00",
            300: "#FFF08C",
            400: "#FFEB66",
            500: "#CCB100",
            700: "#FAD02C",
            800: "#665800",
            900: "#332C00",
          },
        },
        secondary: {
          DEFAULT: "#1A202C",
          orange: "#FF5722",
          green: "#4CAF50",
          B400: "#FF9A7A",
        },
        neutral: {
          DEFAULT: "#1A202C",
          500: "#9F9F9F",
          600: "#7F7F7F",
          800: "#404040",
          900: "#202020",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
