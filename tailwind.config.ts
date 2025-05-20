import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-inverted': 'var(--color-text-inverted)',
        brand: 'var(--color-brand-primary)',
        'brand-hover': 'var(--hover-brand-primary)'
      },
      fontFamily: {
        golos_text: ["var(--font-golos_text)", "sans-serif"]
      }
    },
  },
  plugins: [],
} satisfies Config;
