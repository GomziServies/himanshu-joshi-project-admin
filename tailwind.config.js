/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        temple: {
          dark: '#5C3A21',
          darkHover: '#4A2E1A',
          medium: '#8B5A2B',
          sandalwood: '#8B5A2B',
          ochre: '#A0522D',
          gold: '#C59B27',
          cream: '#FDFBF7',
          surface: '#FFFFFF',
          border: '#E8DFD8',
          text: '#2D1E12',
          muted: '#7A6658',
          success: '#2E6F40',
          successBg: '#EDF7EE',
          warning: '#B45309',
          warningBg: '#FEF3C7',
          danger: '#9E2A2B',
          dangerBg: '#FDF2F2',
        },
        admin: {
          dark: '#2E1C14',
          primary: '#5C3A21',
          secondary: '#8B5A2B',
          accent: '#A0522D',
          gold: '#C59B27',
          tan: '#8D6E63',
          muted: '#7A6658',
          border: '#E8DFD8',
          hover: '#F5EFEB',
          cream: '#FDFBF7',
          surface: '#FFFFFF',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif']
      },
      boxShadow: {
        temple: '0 4px 20px -2px rgba(92, 58, 33, 0.08), 0 2px 6px -1px rgba(92, 58, 33, 0.04)',
        brown: '0 4px 20px -2px rgba(62, 39, 35, 0.12), 0 2px 6px -1px rgba(62, 39, 35, 0.08)',
      }
    },
  },
  plugins: [],
}
