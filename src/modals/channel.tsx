import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../components/controllers/FormInput";
import FormCheckbox from "../components/controllers/FormCheckbox";
import FormAutocomplete from "../components/controllers/FormAutocomplete";
import { createChannel, updateChannel } from "../http";
import { useChannelContext } from "../store/channel";
import { useKeyContext } from "../store/key";
import { useRASContext } from "../store/RAS";
import { useEffect, useState } from "react";
import { channel } from "../types/channel";
import { useAlertContext } from "../components/Alert/AlertProvider";

const defaultValue = {
  name: "",
  isRepeater: false,
  RX: 134,
  TX: 134,
  key: undefined,
  notes: "",
};

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Назва організму обов'язкова"),
  notes: yup.string(),
  isRepeater: yup.boolean(),
  RX: yup.number().required(),
  TX: yup.number().required(),
  key: yup.string().required(),
});

export default function Channel() {
  const [loading, setLoading] = useState(false);
  const { getChannels, channel, setChannelId } = useChannelContext();
  const { keys } = useKeyContext();
  const { rass } = useRASContext();
  const context = useModalContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.CHANNEL);
  const { addAlert } = useAlertContext();

  const { control, handleSubmit, watch, reset } = useForm<channel>({
    resolver: yupResolver(schema),
  });

  const watchIsRepeater = watch("isRepeater");

  useEffect(() => {
    if (channel) {
      reset(channel);
    }
  }, [channel]);

  const onClose = () => {
    context.closeModal(MODAL_KEYS.CHANNEL);
    setChannelId(null);
    reset(defaultValue);
  };

  const onSubmit = async (data: channel) => {
    const dataModified = { ...data, isRepeater: Boolean(data.isRepeater) };
    setLoading(true);
    if (channel?.id) {
      await updateChannel(channel.id, dataModified);
      addAlert({
        message: "Канал успішно оновлено",
        type: "success",
      });
    } else {
      await createChannel(dataModified);
      addAlert({
        message: "Канал успішно створено",
        type: "success",
      });
    }
    onClose();
    await getChannels();
    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      label="Канал"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={channel?.name}
    >
      <form autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput control={control} name="name" label="Назва каналу" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput control={control} name="notes" label="Опис каналу" />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Key input */}
          <FormCheckbox
            control={control}
            name="isRepeater"
            label="Через ретранслятор"
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput
            control={control}
            name="RX"
            label="Прийомна частота"
            formatter={(val: string): string => {
              return val.split(",").join(".");
            }}
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput
            control={control}
            name="TX"
            label="Передаюча частота"
            formatter={(val: string): string => {
              return val.split(",").join(".");
            }}
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormAutocomplete
            control={control}
            name="key"
            label="Ключ"
            options={keys?.data?.map((key) => ({
              id: key.id,
              label: key.name,
            }))}
          />
        </Box>
        {watchIsRepeater && (
          <Box component="section" sx={{ mt: 2, mb: 2 }}>
            <FormAutocomplete
              control={control}
              name="ras"
              label="Ключ RAS"
              options={rass?.data?.map((key) => ({
                id: key.id,
                label: key.name,
              }))}
            />
          </Box>
        )}
      </form>
    </Modal>
  );
}
