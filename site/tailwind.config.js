import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.gren"],
  theme: {
    extend: {
      colors: {
        "baba-ganoush": "#f2b98c",
        bellini: "#f0c8ae",
        bisque: "#fde5c6",
        burrito: "#edd3c3",
        buttercream: "#f2decd",
        "chewing-gum": "#ecadaa",
        "cold-lips": "#3959af4",
        "dreamy-candy-forest": "#b28de2",
        empress: "#7e7173",
        "french-porcelain": "#f9f6f4",
        "girl-power": "#d9a3d7",
        iridescent: "#3a6255",
        "larb-gai": "#dcc6a6",
        lichen: "#9cc5a9",
        medlar: "#d6dac0",
        "morning-snow": "#f3f4ec",
        "neon-violet": "#64517d",
        "paradise-island": "#63b199",
        "perfume-cloud": "#e6cdcf",
        perrywinkle: "#878ef0",
        "pink-glitter": "#fde3d7",
        saturn: "#fbe5bc",
        "silver-bird": "#fbf5f0",
        "trail-dust": "#cec6aa",
        tuxedo: "#403f42",
        "wondrous-wisteria": "#a3a9f3",
        "young-apricot": "#fed2b2",
      },
      fontFamily: {
        display: ["Gabarito", "Assistant", ...defaultTheme.fontFamily.sans],
        sans: ["Assistant", ...defaultTheme.fontFamily.sans],
        serif: [
          ["Playfair", ...defaultTheme.fontFamily.serif],
          {
            fontVariationSettings: '"opsz" 42, "wdth" 88',
            letterSpacing: "-0.025em",
          },
        ],
      },
    },
  },
  plugins: [],
};
