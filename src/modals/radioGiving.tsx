import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormAutocomplete from "../components/controllers/FormAutocomplete";
import { updateRadio, createRadioGiving } from "../http";
import FormInput from "../components/controllers/FormInput";
import { useRadioContext } from "../store/radio";
import { useState } from "react";
import { radioGiving } from "../types/radioGiving";
import { useAlertContext } from "../components/Alert/AlertProvider";
import { useOrganismContext } from "../store/organism";

const defaultValue = {
  organism: null,
  fullName: null,
  callSign: null,
  rank: null,
};

// Validation schema
const schema = yup.object().shape({
  organism: yup.string().required(),
  fullName: yup.string().required(),
  callSign: yup.string().required(),
  rank: yup.string().required(),
});

export default function RadioGiving() {
  const [loading, setLoading] = useState(false);
  const { radio, setRadioId, getRadios } = useRadioContext();
  const context = useModalContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.RADIO_GIVING);
  const { addAlert } = useAlertContext();
  const { organisms } = useOrganismContext();

  const { control, handleSubmit, reset } = useForm<radioGiving>({
    resolver: yupResolver(schema),
  });

  const onClose = () => {
    context.closeModal(MODAL_KEYS.RADIO_GIVING);
    setRadioId(null);
    reset(defaultValue);
  };

  const onSubmit = async (data: radioGiving) => {
    const dataModified = {
      radioId: radio.id,
      ...data,
    };
    setLoading(true);
    await updateRadio(radio.id, {
      ...radio,
      firmwares: radio?.firmwares?.map(({ id }) => id) || [],
      checks: radio?.checks || [],
      organism: data.organism,
    });
    await createRadioGiving(dataModified);
    addAlert({
      message: "Радіостанція успішно видана",
      type: "success",
    });
    onClose();
    await getRadios();
    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      label="Видати радіостанцію"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={radio?.SN}
    >
      <form autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormAutocomplete
            control={control}
            name="organism"
            label="Організм"
            options={organisms?.data?.map((key) => ({
              id: key.id,
              label: key.name,
            }))}
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput control={control} name="rank" label="Звання" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput control={control} name="fullName" label="ПІБ" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput control={control} name="callSign" label="Позивний" />
        </Box>
      </form>
    </Modal>
  );
}
