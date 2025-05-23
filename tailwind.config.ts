import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-color": "var(--brand-color)",
        "btn-red": "var(--btn-red)",
        "action-btn": "var(--action-btn-color)",
        "even-color": "var(--even-bg-color)",
        "odd-color": "var(--odd-bg-color)",
      },
      container: {
        center: true,
      },
      screens: {
        "772px": "772",
      },
      backgroundImage: {
        "wave-image": "url('@/assets/wave.svg')", // Adjust the path as per your project structure
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    darkTheme: "light", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
export default config;
