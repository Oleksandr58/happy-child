import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./layout/App.tsx";
import "./index.css";
import theme from "./theme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { ukUA } from "@mui/material/locale";
import { AlertProvider } from "./components/Alert/AlertProvider";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={createTheme(theme, ukUA)}>
      <AlertProvider>
        <App></App>
      </AlertProvider>
      <CssBaseline />
    </ThemeProvider>
  </StrictMode>
);
