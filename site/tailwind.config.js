import defaultTheme from "tailwindcss/defaultTheme"


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./views/**/*.gren"
  ],
  theme: {
    extend: {
      colors: {
        "baba-ganoush": "#f2b98c",
        "bellini": "#f0c8ae",
        "burrito": "#edd3c3",
        "chewing-gum": "#ecadaa",
        "dreamy-candy-forest": "#b28de2",
        "girl-power": "#d9a3d7",
        "iridescent": "#3a6255",
        "larb-gai": "#dcc6a6",
        "lichen": "#9cc5a9",
        "medlar": "#d6dac0",
        "morning-snow": "#f3f4ec",
        "neon-violet": "#64517d",
        "paradise-island": "#63b199",
        "trail-dust": "#cec6aa",
      },
      fontFamily: {
        display: ["Gabarito", "Assistant", ...defaultTheme.fontFamily.sans],
        sans: ["Assistant", ...defaultTheme.fontFamily.sans],
        serif: [
          ["Playfair", ...defaultTheme.fontFamily.serif],
          {
            fontVariationSettings: '"opsz" 42, "wdth" 88',
            letterSpacing: "-0.025em"
          }
        ]
      }
    },
  },
  plugins: [],
}
