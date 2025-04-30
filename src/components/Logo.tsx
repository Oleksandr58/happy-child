import { Box, Typography } from "@mui/material";

export default function AppLogo() {
  return (
    <Box sx={{ display: "flex", p: 2, gap: 2, alignItems: "center" }}>
      <img src="./logo.png" height={"40px"} />

      <Typography
        gutterBottom
        sx={{
          display: "block",
          fontWeight: "bold",
          fontSize: "18px",
          m: 0,
        }}
      >
        РадіоШивка
      </Typography>
    </Box>
  );
}
