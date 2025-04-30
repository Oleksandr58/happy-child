import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../components/controllers/FormInput";
import { createRAS, updateRAS } from "../http";
import { useRASContext } from "../store/RAS";
import { useEffect, useState } from "react";
import { ras } from "../types/ras";
import { useAlertContext } from "../components/Alert/AlertProvider";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import { Tooltip } from "@mui/material";

function generate40BitKey(length = 20) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    key += charset[randomIndex];
  }

  return key;
}

const defaultValue = { keyId: "", name: "", key: "" };

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Ім'я обов'язкове"),
  key: yup.string().required("Ключ обов'язковий"),
});

export default function RAS() {
  const [loading, setLoading] = useState(false);
  const { getRass, ras, setRasId } = useRASContext();
  const context = useModalContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.RAS);
  const { addAlert } = useAlertContext();

  const { control, handleSubmit, setValue, reset } = useForm<ras>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (ras) {
      reset(ras);
    }
  }, [ras]);

  const onClose = () => {
    context.closeModal(MODAL_KEYS.RAS);
    setRasId(null);
    reset(defaultValue);
  };

  const onSubmit = async (data: ras) => {
    setLoading(true);
    if (ras?.id) {
      await updateRAS(ras.id, data);
      addAlert({
        message: "RAS успішно оновлено",
        type: "success",
      });
    } else {
      await createRAS(data);
      addAlert({
        message: "RAS успішно створено",
        type: "success",
      });
    }
    onClose();
    await getRass();
    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      label="RAS ключ"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={ras?.name}
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
                  onClick={() => {
                    const key = generate40BitKey();
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
