/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Add paths to your template files
    "./public/index.html",
  ],
  prefix: "",
  theme: {
    extend: {
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center top, hsla(var(--foreground) / .1) 0%, hsla(var(--foreground) / 0) 70%)',
        'shiny-header': 'linear-gradient(to right, hsla(0 0 95% / .1) 10%, hsla(0 0 95% / .5) 50%, hsla(0 0 95% / .1) 90%)',
      },
      blur: {
        xs: '2px',
      },
      colors: {
        border: "hsl(var(--border))",
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart1: "hsl(var(--chart-1))",
        chart2: "hsl(var(--chart-2))",
        chart3: "hsl(var(--chart-3))",
        chart4: "hsl(var(--chart-4))",
        chart5: "hsl(var(--chart-5))",
      },
      fontFamily: {
        sans: ['Archivo'],
        clash: ['Clash Display', 'sans-serif'],
        archivo: ['Archivo']
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "zoom": {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "floatAnimation": {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
        "reverseFloatAnimation": {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float": 'floatAnimation 3s ease-in-out infinite',
        "reverse-float": 'reverseFloatAnimation 2.5s ease-in-out infinite',
        "zoom": 'zoom 5s ease-in-out infinite',
      },
    },
  },
  corePlugins: {
    container: false
  },
  plugins: [require("tailwindcss-animate"), function ({ addUtilities }) {
    addUtilities({
      '.text-glow-1': {
        'text-shadow': '0 2px 25px hsla(var(--chart-1)/ 0.7)',
      },
      '.text-glow-2': {
        'text-shadow': '0 2px 25px hsla(var(--chart-2)/ 0.7)',
      },
      '.text-glow-3': {
        'text-shadow': '0 2px 25px hsla(var(--chart-3)/ 0.7)',
      },
      '.text-glow-4': {
        'text-shadow': '0 2px 25px hsla(var(--chart-4)/ 0.7)',
      },
      // Gradient border utilities
      '.border-gradient': {
        border: '1px solid transparent',
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'border-box',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(135deg, rgba(255, 255, 255, 0.4), transparent, rgba(255, 255, 255, 0.4))',
      },
      '.border-gradient-primary': {
        border: '1px solid transparent',
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'border-box',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(135deg, hsla(var(--primary) / 0.4), transparent, hsla(var(--primary) / 0.4))',
      },
      '.border-gradient-secondary': {
        border: '1px solid transparent',
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'border-box',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(135deg, hsla(var(--secondary) / 0.4), transparent, hsla(var(--secondary) / 0.4))',
      },
      '.border-gradient-destructive': {
        border: '1px solid transparent',
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'border-box',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(135deg, hsla(var(--destructive) / 0.4), transparent, hsla(var(--destructive) / 0.4))',
      },
      '.border-gradient-accent': {
        border: '1px solid transparent',
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'border-box',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(135deg, hsla(var(--accent) / 0.4), transparent, hsla(var(--accent) / 0.4))',
      },
      '.border-gradient-success': {
        border: '1px solid transparent',
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'border-box',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(135deg, rgba(34, 197, 94, 0.4), transparent, rgba(34, 197, 94, 0.4))',
      },
      '.border-gradient-warning': {
        border: '1px solid transparent',
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'border-box',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(135deg, rgba(234, 179, 8, 0.4), transparent, rgba(234, 179, 8, 0.4))',
      },
    }, ['responsive', 'hover']);
  }, function ({ addComponents }) {
    addComponents({
      '.container': {
          maxWidth: 'calc(100% - 4rem)',
          margin: 'auto',
          '@screen sm': {
            maxWidth: '500px',
          },
          '@screen md': {
            maxWidth: '672px',
          },
          '@screen lg': {
            maxWidth: '882px',
          },
          '@screen xl': {
            maxWidth: '1024px',
          },
        },
    })
  }],
}