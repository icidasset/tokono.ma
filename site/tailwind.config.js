import defaultTheme from "tailwindcss/defaultTheme"


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./views/**/*.gren"
  ],
  theme: {
    extend: {
      colors: {
        babaGanoush: "#f2b98c",
        bellini: "#f0c8ae",
        burrito: "#edd3c3",
        chewingGum: "#ecadaa",
        dreamyCandyForest: "#b28de2",
        girlPower: "#d9a3d7",
        iridescent: "#3a6255",
        larbGai: "#dcc6a6",
        lichen: "#9cc5a9",
        medlar: "#d6dac0",
        morningSnow: "#f3f4ec",
        neonViolet: "#64517d",
        paradiseIsland: "#63b199",
        trailDust: "#cec6aa",
      },
      fontFamily: {
        sans: ["Gabarito", ...defaultTheme.fontFamily.sans],
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
