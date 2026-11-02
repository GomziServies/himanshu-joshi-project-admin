/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Same temple palette as the website: carved stone, brass, marigold, sindoor, ivory
      colors: {
        sanctum: {
          DEFAULT: '#170D08',
          800: '#22130C',
          700: '#2F1B11',
          600: '#43271A',
        },
        brass: {
          200: '#F3E3B3',
          300: '#E7CC85',
          400: '#D9B45E',
          500: '#C49A3E',
          600: '#A07A2B',
          700: '#7A5B1E',
        },
        marigold: {
          400: '#F7A928',
          500: '#EE8F12',
          600: '#D27408',
        },
        sindoor: {
          500: '#B3261E',
          600: '#8F1C16',
          700: '#5E110D',
        },
        leaf: {
          100: '#E9F0DC',
          700: '#3F5A22',
        },
        ivory: {
          50: '#FDF9F0',
          100: '#F8F0E0',
          200: '#EFE2CA',
        },
        ink: {
          DEFAULT: '#2A1A12',
          muted: '#6B5444',
        },
      },
      borderColor: {
        DEFAULT: '#EFE2CA',
      },
      fontFamily: {
        deva: ['"Tiro Devanagari Sanskrit"', 'Georgia', 'serif'],
        title: ['Marcellus', '"Tiro Devanagari Sanskrit"', 'Georgia', 'serif'],
        sans: ['Mukta', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
