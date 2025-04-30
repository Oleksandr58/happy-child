import * as React from "react";
import { v4 } from "uuid";
import { Alert, AlertColor, Button, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Alert {
  message: string;
  type: AlertColor;
  time?: number;
  id?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ArgsContext {
  alerts: Alert[];
  addAlert: (alert: Alert, isInfinite?: boolean) => string;
}

const AlertContext = React.createContext<ArgsContext>({
  alerts: [],
  addAlert: (key) => key?.id ?? "",
});

interface Args {
  children: React.ReactElement;
}

function AlertProvider({ children }: Args) {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  const addAlert = (alert: Alert, isInfinite?: boolean) => {
    const id = v4();
    setAlerts([
      ...alerts,
      {
        ...alert,
        id,
      },
    ]);

    if (!isInfinite) {
      setTimeout(() => removeAlert(id), alert.time ?? 3000);
    }

    return id;
  };

  const removeAlert = (id?: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const value = { alerts, addAlert };

  return (
    <AlertContext.Provider value={value}>
      {alerts.map((alert, index) => (
        <Alert
          severity={alert.type}
          onClose={() => removeAlert(alert.id)}
          action={
            alert?.action ? (
              <Box
                sx={{ display: "flex", alignItems: "center", height: "100%" }}
              >
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    if (alert.id) {
                      alert.action?.onClick();
                      removeAlert(alert.id);
                    }
                  }}
                >
                  {alert.action.label}
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => removeAlert(alert.id)}
                  sx={{ minWidth: "36px" }}
                >
                  <CloseIcon />
                </Button>
              </Box>
            ) : null
          }
          sx={{
            position: "fixed",
            left: "50%",
            top: `${20 + 60 * index}px`,
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          {alert.message}
        </Alert>
      ))}
      {children}
    </AlertContext.Provider>
  );
}

function useAlertContext() {
  const context = React.useContext(AlertContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a AlertProvider");
  }

  return context;
}

export { AlertProvider, useAlertContext };
