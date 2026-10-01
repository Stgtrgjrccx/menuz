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
          400: '#D4C8B2',
          500: '#BAA98C',
        },
        charcoal: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#3F3B39',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        dietary: {
          veg: '#16A34A',
          nonveg: '#DC2626',
        },
        // ClickHouse Phosphor Terminal Tokens (Adapted to Electric Saffron)
        void: '#151515',
        carbon: '#1f1f1c',
        graphite: '#282828',
        'slate-dark': '#343434',
        iron: '#3a3a3a',
        steel: '#414141',
        smoke: '#a0a0a0',
        fog: '#bcbcbb',
        bone: '#dfdfdf',
        paper: '#e5e7eb',
        phosphor: {
          saffron: '#FFA000',
          gold: '#FFB800',
          glow: '#FFC107',
          ink: '#1A1300',
          amber: '#4D3800',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['Inconsolata', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(28, 25, 23, 0.05)',
        'float': '0 8px 30px rgba(28, 25, 23, 0.12)',
        'phosphor-cta': 'rgba(0, 0, 0, 0.2) 0px 10px 15px -3px, rgba(255, 160, 0, 0.25) 0px 4px 20px -2px',
        'card-inset': 'rgba(0, 0, 0, 0.06) 0px 4px 4px 0px, rgba(0, 0, 0, 0.2) 0px 4px 25px 0px inset',
      }
    },
  },
  plugins: [],
}
