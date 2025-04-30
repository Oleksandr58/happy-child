import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#332167",
    },
    secondary: {
      main: "#ba131a",
    },
    error: {
      main: "#ba131a",
    },
    text: {
      primary: "#322067", // Default text color
      secondary: "#000000", // Secondary text color
      disabled: "#765715", // Disabled text color
    },
  },
});

export default theme;
