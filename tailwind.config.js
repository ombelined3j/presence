/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fond: '#F6F1EA',
        surface: '#FBF8F3',
        encre: '#2F3324',
        sable: '#E4D3A6',
        lilas: '#C3B4F2',
        vert: '#506662',
        sos: '#FF6B2C',
      },
      fontFamily: {
        titre: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        texte: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        mini: ['15px', '1.45'],
        corps: ['17px', '1.55'],
        carte: ['20px', '1.3'],
        titre: ['31px', '1.15'],
        hero: ['44px', '1.05'],
      },
      borderRadius: {
        carte: '24px',
        ecran: '36px',
      },
    },
  },
  plugins: [],
};
