/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        mobile: { max: "767px" },      // < 768px
        tablet: "768px",               // >= 768px
        desktop: "992px",              // >= 992px
        wide: "1200px",                // >= 1200px
      },

      animation: {
        "event-auto": "eventModal 2.5s ease-in-out forwards",
        "event-choice": "eventChoice 0.3s ease-out forwards",
      },

      keyframes: {
        eventModal: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.95)" },
          "15%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "85%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-10px) scale(0.95)" },
        },

        eventChoice: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        cardShake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "50%": { transform: "translateX(2px)" },
          "75%": { transform: "translateX(-2px)" },
        },
      },
      animation: {
        "card-shake": "cardShake 0.3s ease-in-out",
      },


      colors: {
        game: {
          bg:        "#2F241B",
          panel:     "#3B3026",
          back:      "#DEC290",
          modal:     "#2A1E15",
          board:     "#C7AC7D",
          highlight: "#B38956",
          accent:    "#6B8AA6",
          olive:     "#878763",

          text: {
            main:      "#2A1E15",
            board:     "#F5EBD7",
            secondary: "#8B7355",
            soft:      "#A08060",
            title:     "#DEC290",
            inverse:   "#F5EBD7",
          },

          success: "#0BEAA3",
          danger:  "#A30BEA",
        },
      },

      fontFamily: {
        title: ["Cinzel", "serif"],
        body: ["Quintessential", "serif"],
        mono: ["Roboto Mono", "monospace"],
      },

      fontSize: {
        title: "32px",
        subtitle: "24px",
        paragraph: ["14px", { lineHeight: "1.5" }],
        button: "16px",
      },
    },
  },
  plugins: [],
}
