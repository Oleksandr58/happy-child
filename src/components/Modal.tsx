import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { ReactElement } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  maxHeight: "100vh",
  overflow: "auto",
  boxShadow: 24,
  p: 4,
};

interface Args {
  children: ReactElement;
  label: string;
  id?: string;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function TLS({
  children,
  label,
  id,
  loading,
  open,
  onClose,
  onSubmit,
}: Args) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6" gutterBottom sx={{ display: "block" }}>
              {label} {id ? `(${id})` : ""}
            </Typography>
            <Box sx={{ mb: 2 }}>{children}</Box>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button variant="text" onClick={onClose} sx={{ mr: 1 }}>
                Відмінити
              </Button>
              <Button variant="contained" onClick={onSubmit}>
                Зберегти
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
