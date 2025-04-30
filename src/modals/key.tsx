import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../components/controllers/FormInput";
import { createKey, updateKey } from "../http";
import { useKeyContext } from "../store/key";
import { useEffect, useState } from "react";
import { key } from "../types/Key";
import { useAlertContext } from "../components/Alert/AlertProvider";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import { Tooltip } from "@mui/material";

const defaultValue = { keyId: "", name: "", key: "" };

// Validation schema
const schema = yup.object().shape({
  keyId: yup.string().required("Id обов'язкове"),
  name: yup.string().required("Ім'я обов'язкове"),
  key: yup.string().required("Ключ обов'язковий"),
});

async function generateAES256Key() {
  // Generate a random 256-bit (32-byte) AES key
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-CBC", // Use "AES-CBC" or "AES-GCM" based on the actual requirement
      length: 256, // AES-256, so 256 bits
    },
    true, // Whether the key can be extracted
    ["encrypt", "decrypt"] // Key usages
  );

  // Export the key to raw format (ArrayBuffer)
  const exportedKey = await window.crypto.subtle.exportKey("raw", key);

  // Convert ArrayBuffer to uppercase hex
  const keyArray = new Uint8Array(exportedKey);
  const hexKey = Array.from(keyArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return hexKey;
}

export default function Key() {
  const [loading, setLoading] = useState(false);
  const { getKeys, key, setKeyId } = useKeyContext();
  const context = useModalContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.KEY);
  const { addAlert } = useAlertContext();

  const { control, handleSubmit, reset, setValue } = useForm<key>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (key) {
      reset(key);
    }
  }, [key]);

  const onClose = () => {
    context.closeModal(MODAL_KEYS.KEY);
    setKeyId(null);
    reset(defaultValue);
  };

  const onSubmit = async (data: key) => {
    setLoading(true);
    if (key?.id) {
      await updateKey(key.id, data);
      addAlert({
        message: "Ключ успішно оновлено",
        type: "success",
      });
    } else {
      await createKey(data);
      addAlert({
        message: "Ключ успішно створено",
        type: "success",
      });
    }
    onClose();
    await getKeys();
    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      label="Ключ"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={key?.name}
    >
      <form autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Name input */}
          <FormInput control={control} name="keyId" label="Id" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Name input */}
          <FormInput control={control} name="name" label="Ім'я" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput
            control={control}
            name="key"
            label="Ключ"
            icon={
              <Tooltip title="Автогенерувати">
                <AutoModeIcon
                  onClick={async () => {
                    const key = await generateAES256Key();
                    setValue("key", key);
                  }}
                  sx={{ cursor: "pointer" }}
                />
              </Tooltip>
            }
          />
        </Box>
      </form>
    </Modal>
  );
}
