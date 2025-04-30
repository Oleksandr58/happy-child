import { Typography, Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface Args {
  isSuccess?: boolean;
}

const StatusLabel = ({ isSuccess }: Args) => {
  return (
    <Box
      sx={{
        height: "24px",
        color: isSuccess ? "green" : "red",
      }}
    >
      <Typography variant="body1">
        {isSuccess ? (
          <CheckCircleOutlineIcon color={"success"} />
        ) : (
          <HighlightOffIcon color="error" />
        )}
      </Typography>
    </Box>
  );
};

export default StatusLabel;
