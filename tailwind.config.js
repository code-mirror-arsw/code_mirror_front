import {heroui} from "@heroui/theme"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}", // ✅ para que detecte TODOS los archivos JSX/TSX de src
],

  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",         // Azul fuerte
        secondary: "#3B82F6",       // Azul suave
        accent: "#60A5FA",          // Azul claro (acento)
        background: "#0F172A",      // Fondo azul oscuro
        card: "#1E293B",            // Fondo tarjetas oscuro
        muted: "#64748B",           // Texto suave en dark mode
        light: "#F8FAFC",           // Texto blanco/ligero

        // Paleta modo claro
        lightmode: {
          background: "#F8FAFC",    // Fondo blanco
          card: "#E2E8F0",          // Fondo tarjetas claro
          text: "#0F172A",          // Texto oscuro
        },
      },
    },
  },
  plugins: [heroui()],
};

