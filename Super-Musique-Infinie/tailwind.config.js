module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{html,ts}",
    "./src/**/*.{html,ts}",
    "./src/app/app.component.html",
    "./src/app/components/navbar/navbar.component.html",
    "./src/app/components/home/home.component.html",
    "./src/app/components/PageNotFound/PageNotFound.component.html",
    "./src/app/components/artist-card/artist-card.component.html",
    "./src/app/components/chansons/chansons.component.html",
    "./src/app/components/chanson-card/chanson-card.component.html",
    "./src/app/components/audio-player/audio-player.component.html",
    "./src/app/components/albums/albums.component.html",
    "./src/app/components/concerts/concerts/concerts.component.html",
    "./src/app/components/concert-card/concert-card.component.html",

    "./src/index.html",
    "./node_modules/flowbite/dist/flowbite.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter"],
        roboto: ['"Roboto Mono"'],
        poppins: ["Poppins"],
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar-hide")],
};
