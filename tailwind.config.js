module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    fontFamily: {
      sans: ['IBMPlexSans', 'sans-serif'],
    },
  },
  plugins: [require('tailwindcss'), require('autoprefixer')],
  corePlugins: {
    appearance: false,
  },
};
