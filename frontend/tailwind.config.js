/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // --- Custom mapped aliases to prevent breaking existing classes ---
        bg: "hsl(var(--background))",
        card: "hsl(var(--card))",
        text: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        brand: {
          400: "hsl(var(--primary) / 0.8)",
          500: "hsl(var(--primary))",
          600: "hsl(var(--primary) / 1.2)",
        },
        // --- Wati Design System Colors (fixed brand palette, not theme-dependent) ---
        wati: {
          green:      '#00C97A',  // slightly deeper for light-mode contrast
          pink:       '#E8457A',  // deeper pink for readability
          yellow:     '#F5D800',  // deeper yellow for contrast
          blue:       '#1A9FD8',  // deeper blue for readability
          dark:       '#1D1D1B',
          greenLight: '#C2F5E0',  // pastel bg — text must be wati-dark
          pinkLight:  '#FFD6E7',
          blueLight:  '#D6EEFF',
          yellowLight:'#FFF3B0',
        },
        // --- Shadcn Default Theme Properties ---
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--primary) / .35), 0 20px 70px rgba(0,0,0,.15)",
        soft: "0 10px 40px -10px rgba(0,0,0,.08)",
        hard: "4px 4px 0px 0px #1D1D1B",
        "hard-white": "4px 4px 0px 0px rgba(255,255,255,0.15)",
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
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
