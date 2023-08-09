import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#D7CEE6",
          200: "#C5BCD9",
          300: "#B4A9CD",
          400: "#A296C0",
          500: "#9183B3",
          600: "#8071A7",
          700: "#6F5E9A",
          800: "#5D4B8D",
          900: "#4C3881",
          1000: "#3B2674",
          DEFAULT: "#3B2674" // 1000
        },
        success: {
          100: "#F1FBFF",
          200: "#D7F2FF",
          300: "#B3E6FF",
          400: "#89D9FF",
          500: "#5FCBFF",
          600: "#35BBFC",
          700: "#19A5EC",
          800: "#0092DB",
          900: "#0084C7",
          1000: "#0077B3"
        },
        error: {
          100: "#FFE7EF",
          200: "#FFD0DF",
          300: "#FFB3CB",
          400: "#F38AAB",
          500: "#E7648E",
          600: "#DB4272",
          700: "#BE1D50",
          800: "#A10033",
          900: "#91002D",
          1000: "#800028"
        },
      },
      fontFamily: {
          'sans': ['noto-sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
