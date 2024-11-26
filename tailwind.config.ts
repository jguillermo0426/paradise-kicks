import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '576px',
      'tablet': '768px',
      'md': '960px',
      'lg': '1024px',
      'desktop': '1440px'
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
export default config;
