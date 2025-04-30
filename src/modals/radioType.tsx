import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../components/controllers/FormInput";
import FormCheckbox from "../components/controllers/FormCheckbox";
import { createRadioType, updateRadioType } from "../http";
import { useRadioTypeContext } from "../store/radioType";
import { useEffect, useState } from "react";
import { radioType } from "../types/radioType";
import { useAlertContext } from "../components/Alert/AlertProvider";

const defaultValue = { type: "", isWithScreen: false };

// Validation schema
const schema = yup.object().shape({
  type: yup.string().required("Модель радіостанції обов'язкова"),
  isWithScreen: yup.boolean(),
});

export default function RadioType() {
  const [loading, setLoading] = useState(false);
  const { getRadioTypes, radioType, setRadioTypeId } = useRadioTypeContext();
  const context = useModalContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.RADIO_TYPES);
  const { addAlert } = useAlertContext();

  const { control, handleSubmit, reset } = useForm<radioType>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (radioType) {
      reset(radioType);
    }
  }, [radioType]);

  const onClose = () => {
    context.closeModal(MODAL_KEYS.RADIO_TYPES);
    setRadioTypeId(null);
    reset(defaultValue);
  };

  const onSubmit = async (data: radioType) => {
    const dataModified = { ...data, isWithScreen: Boolean(data.isWithScreen) };
    setLoading(true);
    if (radioType?.id) {
      await updateRadioType(radioType.id, dataModified);
      addAlert({
        message: "Модель радіостанції успішно оновлено",
        type: "success",
      });
    } else {
      await createRadioType(dataModified);
      addAlert({
        message: "Модель радіостанції успішно створено",
        type: "success",
      });
    }
    onClose();
    await getRadioTypes();
    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      label="Модель радіостанції"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={radioType?.type}
    >
      <form autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Name input */}
          <FormInput
            control={control}
            name="type"
            label="Модель радіостанції"
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Key input */}
          <FormCheckbox
            control={control}
            name="isWithScreen"
            label="З екраном"
          />
        </Box>
      </form>
    </Modal>
  );
}
