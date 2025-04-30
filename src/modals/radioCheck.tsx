import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormCheckbox from "../components/controllers/FormCheckbox";
import { getRadioAll, createCheck } from "../http";
import { useRadioContext } from "../store/radio";
import { useState } from "react";
import { radioCheck } from "../types/radioCheck";
import { useAlertContext } from "../components/Alert/AlertProvider";

const defaultValue = {
  isSuccess: false,
};

// Validation schema
const schema = yup.object().shape({
  isSuccess: yup.boolean(),
});

export default function RadioCheck() {
  const [loading, setLoading] = useState(false);
  const { radio, setRadioId, getRadios } = useRadioContext();
  const context = useModalContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.RADIO_CHECK);
  const { addAlert } = useAlertContext();

  const { control, handleSubmit, reset } = useForm<radioCheck>({
    resolver: yupResolver(schema),
  });

  const onClose = () => {
    context.closeModal(MODAL_KEYS.RADIO_CHECK);
    setRadioId(null);
    reset(defaultValue);
  };

  const onSubmit = async (data: radioCheck) => {
    const dataModified = {
      radioId: radio.id,
      isSuccess: Boolean(data.isSuccess),
    };
    setLoading(true);
    await createCheck(dataModified);
    addAlert({
      message: "Радіостанція успішно оновлена",
      type: "success",
    });
    onClose();
    await getRadios();
    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      label="Перевірка радіостанції"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={radio?.SN}
    >
      <form autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Key input */}
          <FormCheckbox
            control={control}
            name="isSuccess"
            label="Успішно перевірено"
          />
        </Box>
      </form>
    </Modal>
  );
}
