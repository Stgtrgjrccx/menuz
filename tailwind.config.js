/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#E85D04',
          700: '#C84B00',
          800: '#9A3412',
          900: '#7C2D12',
        },
        ivory: {
          50: '#FDFBF7',
          100: '#F8F5EE',
          200: '#EFE9DE',
          300: '#E2D9C8',
        },
        charcoal: {
          700: '#3F3B39',
          800: '#292524',
          900: '#1C1917',
        },
        dietary: {
          veg: '#16A34A',
          nonveg: '#DC2626',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(28, 25, 23, 0.05)',
        'float': '0 8px 30px rgba(28, 25, 23, 0.12)',
      }
    },
  },
  plugins: [],
}
