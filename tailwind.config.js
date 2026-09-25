/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary_color: "#007B7B",
        enabled_state: "#A8C0C0",
        whiteBg: "#F4F7F6",
        blackBg: "#121818",
        light_color: "#F5F8F7",
        hotLight: "#F8F6F3",
        seconday: "#CC4500",
        icon_tint: "#4B5563",
      },
      fontFamily: {
        "open-sans": "open-sans",
        "open-sans-bold": "open-sans-bold",
        inter: "inter",
        "inter-bold": "inter-bold",
      },
    },
  },
  plugins: [],
};
