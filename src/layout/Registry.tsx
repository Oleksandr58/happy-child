import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ReactElement } from "react";

interface Args {
  children: ReactElement;
  buttonLabel: string;
  onButtonClick: () => void;
}

export default function Registry({
  children,
  buttonLabel,
  onButtonClick,
}: Args) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
        <Button variant="contained" onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      </Box>
      {children}
    </Box>
  );
}
