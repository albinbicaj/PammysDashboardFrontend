// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        grow: 'grow 1s infinite',
        shrink: 'shrink 1s infinite',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        fadeUp: 'fadeUp 0.3s ease-out forwards',
        fadeInBg: 'fadeInBg 0.3s ease-out forwards',
      },
      keyframes: {
        grow: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shrink: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.9)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(1rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInBg: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },

      screens: {
        sm: '640px', // Small screens
        md: '768px', // Medium screens
        lg: '1024px', // Large screens
        xl: '1280px', // Extra-large screens
        order: '1500px',
      },
      colors: {
        // todo tailwind
        primary: {
          DEFAULT: '#ffcc66',
          50: '#ffedba',
          disabled: '#ffeed4',
          dark: '#f1c163',
          overlay: '#EDBE5F',
        },
        accent: {
          DEFAULT: '#ffcc66',
          50: '#ffedba',
          disabled: '#ffeed4',
          dark: '#f1c163',
          overlay: '#EDBE5F',
        },
        // accent: '#ffcc66',
        // 'accent-50': '#ffeed4',
        secondary: '#f2f2f2',
        disabled: '#d3d3d3',
        success: '#bbe5b3',
        danger: '#d93517',
        seashell: '#f0f0f0',
        platinum: '#e3e3e3',
        white: '#ffffff',
      },
      backgroundImage: {
        bgImage: 'url("/images/background.webp")',
        mobileBgImage: 'url("/images/mobile-background.webp")',
      },
      backgroundColor: {
        button: '#ffc55b',
      },
      fontSize: {
        xs12: '12px',
        xs18: '18px',
      },
      fontWeight: {
        600: 600,
      },
      width: {
        sidebar: '240px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};
