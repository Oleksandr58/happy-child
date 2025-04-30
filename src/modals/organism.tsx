import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../components/controllers/FormInput";
import FormCheckbox from "../components/controllers/FormCheckbox";
import { createOrganism, updateOrganism } from "../http";
import { useOrganismContext } from "../store/organism";
import { useEffect, useState } from "react";
import { organism } from "../types/organism";
import { useAlertContext } from "../components/Alert/AlertProvider";

const defaultValue = { name: "", inBattalion: true };

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Назва організму обов'язкова"),
  inBattalion: yup.boolean(),
});

export default function Organism() {
  const [loading, setLoading] = useState(false);
  const { getOrganisms, organism, setOrganismId } = useOrganismContext();
  const context = useModalContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.ORGANISM);
  const { addAlert } = useAlertContext();

  const { control, handleSubmit, reset } = useForm<organism>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (organism) {
      reset(organism);
    }
  }, [organism]);

  const onClose = () => {
    context.closeModal(MODAL_KEYS.ORGANISM);
    setOrganismId(null);
    reset(defaultValue);
  };

  const onSubmit = async (data: organism) => {
    const dataModified = { ...data, inBattalion: Boolean(data.inBattalion) };
    setLoading(true);
    if (organism?.id) {
      await updateOrganism(organism.id, dataModified);
      addAlert({
        message: "Організм успішно оновлено",
        type: "success",
      });
    } else {
      await createOrganism(dataModified);
      addAlert({
        message: "Організм успішно створено",
        type: "success",
      });
    }
    onClose();
    await getOrganisms();
    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      label="Організм"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={organism?.name}
    >
      <form autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Name input */}
          <FormInput control={control} name="name" label="Назва організму" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Key input */}
          <FormCheckbox
            control={control}
            name="inBattalion"
            label="В межах батальйону"
          />
        </Box>
      </form>
    </Modal>
  );
}
