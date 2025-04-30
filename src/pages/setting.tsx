import { useState } from "react";
import { Box, Button, Typography, Modal } from "@mui/material";
import { exportDB, importDB } from "../http";
import dayjs from "dayjs";

export default function Setting() {
  const [isModalOpen, setModalOpen] = useState(false); // Modal visibility state
  const [fileContent, setFileContent] = useState(null); // State to hold imported file data

  // Function to handle file upload and reading the JSON file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setFileContent(json);
          importDB(json);
          setModalOpen(false); // Close modal after importing the file
        } catch (err) {
          console.error("Error reading the file:", err);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: "block", mb: 5 }}>
        Налаштування
      </Typography>
      <Box sx={{ textAlign: "center", display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          onClick={async () => {
            const { data } = await exportDB();

            // Convert JSON object to string
            const jsonData = JSON.stringify(data, null, 2);

            // Create a blob from the JSON string
            const blob = new Blob([jsonData], { type: "application/json" });

            // Create a link element
            const link = document.createElement("a");

            // Set the download attribute with the filename
            link.download = `РадіоШивка ${dayjs().format("DD.MM.YYYY HH-mm")}.json`;

            // Create an object URL for the blob
            link.href = URL.createObjectURL(blob);

            // Programmatically click the link to trigger the download
            link.click();
          }}
          sx={{ mr: 2 }}
        >
          Експортувати
        </Button>

        <Button
          variant="contained"
          onClick={async () => {
            const { data } = await exportDB();
            const dataMap = {
              ...data,
              key: data.key.map((k) => ({ ...k, key: "mockKey" })),
              ras: data.ras.map((k) => ({ ...k, key: "mockKey" })),
              encryption: data.encryption.map((k) => ({
                ...k,
                key: "mockKey",
              })),
            };

            // Convert JSON object to string
            const jsonData = JSON.stringify(dataMap, null, 2);

            // Create a blob from the JSON string
            const blob = new Blob([jsonData], { type: "application/json" });

            // Create a link element
            const link = document.createElement("a");

            // Set the download attribute with the filename
            link.download = `РадіоШивка ${dayjs().format("DD.MM.YYYY HH-mm")}.json`;

            // Create an object URL for the blob
            link.href = URL.createObjectURL(blob);

            // Programmatically click the link to trigger the download
            link.click();
          }}
          sx={{ mr: 2 }}
        >
          Експортувати без ключів
        </Button>

        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Імпортувати
        </Button>
      </Box>

      {/* Modal for selecting JSON file */}
      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Імпортувати JSON файл
          </Typography>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ marginTop: "20px" }}
          />
          <Button
            variant="contained"
            onClick={() => setModalOpen(false)}
            sx={{ mt: 3 }}
          >
            Закрити
          </Button>
        </Box>
      </Modal>
    </>
  );
}
