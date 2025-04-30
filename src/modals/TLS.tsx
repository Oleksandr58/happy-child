import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../components/controllers/FormInput";
import { createTLS, updateTLS } from "../http";
import { useTLSContext } from "../store/TLS";
import { useEffect, useState } from "react";
import { tls } from "../types/tls";
import { useAlertContext } from "../components/Alert/AlertProvider";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import { Tooltip } from "@mui/material";

const defaultValue = { keyId: "", name: "", key: "" };

async function generateTLSPSK(length = 32) {
  // Generate a random TLS-PSK of specified byte length (default: 32 bytes for 256 bits)
  const key = await window.crypto.getRandomValues(new Uint8Array(length));

  // Convert the key to hexadecimal format
  const hexKey = Array.from(key)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return hexKey;
}

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Ім'я обов'язкове"),
  key: yup.string().required("Ключ обов'язковий"),
});

export default function TLS() {
  const [loading, setLoading] = useState(false);
  const { getTlss, tls, setTlsId } = useTLSContext();
  const context = useModalContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.TLS);
  const { addAlert } = useAlertContext();

  const { control, handleSubmit, setValue, reset } = useForm<tls>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (tls) {
      reset(tls);
    }
  }, [tls]);

  const onClose = () => {
    context.closeModal(MODAL_KEYS.TLS);
    setTlsId(null);
    reset(defaultValue);
  };

  const onSubmit = async (data: tls) => {
    setLoading(true);
    if (tls?.id) {
      await updateTLS(tls.id, data);
      addAlert({
        message: "TLS успішно оновлено",
        type: "success",
      });
    } else {
      await createTLS(data);
      addAlert({
        message: "TLS успішно створено",
        type: "success",
      });
    }
    onClose();
    await getTlss();
    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      label="TLS ключ"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={tls?.name}
    >
      <form autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Name input */}
          <FormInput control={control} name="name" label="Ім'я" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Key input */}
          <FormInput
            control={control}
            name="key"
            label="Ключ"
            icon={
              <Tooltip title="Автогенерувати">
                <AutoModeIcon
                  onClick={async () => {
                    const key = await generateTLSPSK();
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
