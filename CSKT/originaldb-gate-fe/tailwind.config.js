/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0074D6",
        primary02: "#005299",
        red: "#FF3C2B",
        redLight: "#F9E7E5",
        orange: "#D17A00",
        background: "#d0e3f4",
        grayColor: "#fafafa",
        secondary: '#ecf4fe',
        tertiary: '#CFE3FC',
        quaternary : '#CFE3FC',
        success: '#52C41A',
        successLight: '#f6ffed'

      },
      boxShadow: {
        '#0': 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
        '#1': 'rgba(149, 157, 165, 0.2) 0px 7px 29px 0px',
        '#6': 'rgba(149, 157, 165, 0.2) 0px 2px 8px 0px',
        '#9': 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
      },
      backgroundImage: (theme) => ({
        'primary-gradient': `linear-gradient(34deg, ${theme.colors.primary} 30%, rgba(0,91,170,1) 53%, rgba(0,158,219,1) 75%)`
      }),
      screens: {
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }
  
        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }
        'desktopHD' : '1366px',
        // => @media (min-width: 1366px) { ... }
      },
      borderRadius: {
        primary: '10px'
      },
      aspectRatio: {
        '4/3': '4/3'
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
  important: true,
}

