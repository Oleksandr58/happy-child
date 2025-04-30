import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../components/controllers/FormInput";
import FormCheckbox from "../components/controllers/FormCheckbox";
import { createRadio, updateRadio } from "../http";
import { useRadioContext } from "../store/radio";
import { useEffect, useState } from "react";
import { radio } from "../types/radio";
import { useAlertContext } from "../components/Alert/AlertProvider";
import FormAutocomplete from "../components/controllers/FormAutocomplete";
import { useOrganismContext } from "../store/organism";
import { useRadioTypeContext } from "../store/radioType";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import { Tooltip } from "@mui/material";
import { useCallback } from "react";

const defaultValue = {
  SN: "",
  idOnRadio: "",
  type: "",
  organism: "",
  isRegistered: true,
};

// Validation schema
const schema = yup.object().shape({
  SN: yup.string().required("Серійний номер обов'язковий"),
  idOnRadio: yup.string().required("Номер радіостанції обов'язковий"),
  type: yup.string().required("Модель радіостанції обов'язкова"),
  organism: yup.string(),
  isRegistered: yup.boolean(),
});

export default function Radio() {
  const [loading, setLoading] = useState(false);
  const { getRadios, radio, setRadioId, radios } = useRadioContext();
  const context = useModalContext();
  const { organisms } = useOrganismContext();
  const { radioTypes } = useRadioTypeContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.RADIO);
  const { addAlert } = useAlertContext();

  const { control, handleSubmit, setValue, reset } = useForm<radio>({
    resolver: yupResolver(schema),
  });

  const generateRadioNumber = useCallback(() => {
    const radioNumbers =
      radios?.data
        ?.filter((radio) => !radio?.isLost)
        .map((radio) => +radio.idOnRadio) || [];
    let number = 1;

    while (radioNumbers.includes(number)) {
      number++;
    }

    return number;
  }, [radios]);

  useEffect(() => {
    if (radio) {
      reset(radio);
    }
  }, [radio]);

  const onClose = () => {
    context.closeModal(MODAL_KEYS.RADIO);
    setRadioId(null);
    reset(defaultValue);
  };

  const onSubmit = async (data: radio) => {
    setLoading(true);
    if (radio?.id) {
      await updateRadio(radio.id, {
        ...data,
        isRegistered: Boolean(data.isRegistered),
        firmwares: [],
      });
      addAlert({
        message: "Організм успішно оновлено",
        type: "success",
      });
    } else {
      await createRadio({
        ...data,
        isRegistered: Boolean(data.isRegistered),
        firmwares: [],
      });
      addAlert({
        message: "Організм успішно створено",
        type: "success",
      });
    }
    onClose();
    await getRadios();
    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      label="Радіостанція"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={radio?.name}
    >
      <form autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput control={control} name="SN" label="Серійний номер" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput control={control} name="notes" label="Деталі" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput
            control={control}
            name="idOnRadio"
            label="Номер радіостанції"
            icon={
              <Tooltip title="Автогенерувати">
                <AutoModeIcon
                  onClick={() => {
                    const idOnRadio = generateRadioNumber();

                    setValue("idOnRadio", idOnRadio);
                  }}
                  sx={{ cursor: "pointer" }}
                />
              </Tooltip>
            }
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormAutocomplete
            control={control}
            name="type"
            label="Модель радіостанції"
            options={radioTypes?.data?.map((key) => ({
              id: key.id,
              label: key.type,
            }))}
          />
        </Box>
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
          {/* Key input */}
          <FormCheckbox
            control={control}
            name="isRegistered"
            label="На обліку"
          />
        </Box>
      </form>
    </Modal>
  );
}
