import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "../components/Sidebar";
import { getRadioAll } from "../http";
import { ReactElement } from "react";
import "./App.css";

const drawerWidth = 240;

interface Args {
  children: ReactElement;
}

export default function ResponsiveDrawer({ children }: Args) {
  getRadioAll();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Sidebar />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>{children}</Box>
        <Box sx={{ fontSize: "12px" }}>
          <Box sx={{ mb: 1 }}>
            For people: designed and developed by 3 mechanized batallion 100
            mechanized brigade
          </Box>

          <Box>
            For counterintelligence: it happens by itself. We don't understand
            how
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
