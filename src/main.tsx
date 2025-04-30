import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./layout/App.tsx";
import "./index.css";
import theme from "./theme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  Radio,
  Organizm,
  TLS,
  RAS,
  Keys,
  Channel,
  RadioType,
  Antenna,
  Setting,
} from "./pages";
import Modals, { ModalProvider } from "./modals";
import { TLSProvider } from "./store/TLS";
import { RASProvider } from "./store/RAS";
import { KeyProvider } from "./store/key";
import { RadioTypeProvider } from "./store/radioType";
import { OrganismProvider } from "./store/organism";
import { ChannelProvider } from "./store/channel";
import { RadioProvider } from "./store/radio";
import { ukUA } from "@mui/material/locale";
import { AlertProvider } from "./components/Alert/AlertProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={createTheme(theme, ukUA)}>
      <AlertProvider>
        <Router>
          <ModalProvider>
            <App>
              <KeyProvider>
                <ChannelProvider>
                  <OrganismProvider>
                    <RadioTypeProvider>
                      <TLSProvider>
                        <RASProvider>
                          <RadioProvider>
                            <>
                              <Routes>
                                <Route path="/radio" element={<Radio />} />
                                <Route
                                  path="/radio-model"
                                  element={<RadioType />}
                                />
                                <Route
                                  path="/organizm"
                                  element={<Organizm />}
                                />
                                <Route path="/channel" element={<Channel />} />
                                <Route path="/keys" element={<Keys />} />
                                <Route path="/ras" element={<RAS />} />
                                <Route path="/tls" element={<TLS />} />
                                <Route path="/antennas" element={<Antenna />} />
                                <Route path="/settings" element={<Setting />} />
                              </Routes>

                              <Modals />
                            </>
                          </RadioProvider>
                        </RASProvider>
                      </TLSProvider>
                    </RadioTypeProvider>
                  </OrganismProvider>
                </ChannelProvider>
              </KeyProvider>
            </App>
          </ModalProvider>
        </Router>
      </AlertProvider>
      <CssBaseline />
    </ThemeProvider>
  </StrictMode>
);
