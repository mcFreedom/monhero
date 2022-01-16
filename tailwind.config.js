module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        min1: "-1",
        0: 0,
        10: "10",
      },
      minWidth: {
        0: "0",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        full: "100%",
      },
      maxWidth: {
        1240: "1240px",
        500: "500px",
        138: "138px",
      },
      minHeight: {
        "1/4": "25vh",
        50: "50vh",
      },
      maxHeight: {
        0: "0px",
        1240: "1240px",
        500: "500px",
        138: "138px",
        initial: "initial",
      },
      height: {
        initial: "initial",
        100: "100%",
        6: "1.5rem",
        10: "2.5rem",
        20: "5rem",
        full: "100vh",
      },
    },
  },
  variants: {},
  plugins: [],
  media: false,
}
