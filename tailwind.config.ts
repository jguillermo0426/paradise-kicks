/** @type {import('postcss-load-config').Config} */
//import type { Config } from "tailwindcss";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      'mobile': '393px',
      'sm': '576px',
      'tablet': '768px',
      'md': '960px',
      'lg': '1024px',
      'desktop': '1440px',
      '3xl': '1920px'
    },
    colors: {
      'brand-primary': '#38BDBA',
      'black': '#1C1C1C',
      'dark-gray': '#474747',
      'off-white': '#EDEDED',
      'white': '#FFFFFF',
      'warning': '#FBC02D',
      'error': '#E53835',
      'success': '#2E7D31',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

