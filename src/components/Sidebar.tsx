import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Logo from "../components/Logo";
import RadioIcon from "@mui/icons-material/Radio";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useLocation } from "react-router-dom";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import React from "react";

const drawerWidth = 240;

const SIDEBAR_ITEMS = [
  {
    name: "Радіостанції",
    link: "/radio",
    icon: <RadioIcon />,
  },
  {
    name: "Моделі радіостанцій",
    link: "/radio-model",
    icon: <SendToMobileIcon />,
  },
  {
    name: "Організми",
    link: "/organizm",
    icon: <AccountTreeIcon />,
  },
  {
    name: "Канали",
    link: "/channel",
    icon: <ConnectWithoutContactIcon />,
  },
  {
    name: "Захист",
    link: "/keys",
    icon: <VpnKeyIcon />,

    subItems: [
      { name: "Симетричні ключі", link: "/keys" },
      { name: "Ключі RAS", link: "/ras" },
      { name: "TLS", link: "/tls" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openItems, setOpenItems] = React.useState({});

  const handleToggle = (name) => {
    setOpenItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
      open
    >
      <div>
        <Logo />
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 100px)",
            justifyContent: "space-between",
          }}
        >
          <List>
            {SIDEBAR_ITEMS.map((item) => (
              <div key={item.name}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      item.subItems
                        ? handleToggle(item.name)
                        : navigate(item.link);
                    }}
                    selected={pathname === item.link}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                    {item.subItems &&
                      (openItems[item.name] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      ))}
                  </ListItemButton>
                </ListItem>
                {item.subItems && (
                  <Collapse
                    in={
                      openItems[item.name] ||
                      item.subItems?.map(({ link }) => link).includes(pathname)
                    }
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem
                          key={subItem.name}
                          disablePadding
                          sx={{ pl: 4 }}
                          onClick={() => {
                            navigate(subItem.link);
                          }}
                        >
                          <ListItemButton selected={pathname === subItem.link}>
                            <ListItemText primary={subItem.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </div>
            ))}
          </List>

          <List sx={{ mt: "auto" }}>
            <ListItem
              key={"antennas"}
              disablePadding
              onClick={() => {
                navigate("/antennas");
              }}
            >
              <ListItemButton selected={pathname === "/antennas"}>
                <ListItemIcon>{<SettingsInputAntennaIcon />}</ListItemIcon>
                <ListItemText primary={"Антени"} />
              </ListItemButton>
            </ListItem>
            <ListItem
              key={"settings"}
              disablePadding
              onClick={() => {
                navigate("/settings");
              }}
            >
              <ListItemButton selected={pathname === "/settings"}>
                <ListItemIcon>{<SettingsSuggestIcon />}</ListItemIcon>
                <ListItemText primary={"Налаштування"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </div>
    </Drawer>
  );
}
