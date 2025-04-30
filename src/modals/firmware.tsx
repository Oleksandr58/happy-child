import Modal from "../components/Modal";
import { useModalContext } from "./ModalContext";
import MODAL_KEYS from "./const";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../components/controllers/FormInput";
import FormCheckbox from "../components/controllers/FormCheckbox";
import FormDate from "../components/controllers/FormDate";
import { createFirmware } from "../http";
import { useEffect, useState, useMemo } from "react";
import { firmware } from "../types/firmware";
import { useAlertContext } from "../components/Alert/AlertProvider";
import { useRadioContext } from "../store/radio";
import FormAutocomplete from "../components/controllers/FormAutocomplete";
import { useChannelContext } from "../store/channel";
import { useTLSContext } from "../store/TLS";
import dayjs from "dayjs";

const defaultValue = {
  firmwareId: "",
  isChild: false,
  isMain: false,
  isScan: false,
  firmwareVersion: "",
  lastFirmware: dayjs(),
  radio: undefined,
  encryption: undefined,
  channels: [],
  isCacheFirmware: false,
};

// Validation schema
const schema = yup.object().shape({
  firmwareId: yup.string().required("Id прошивки обов'язкова"),
  isChild: yup.boolean(),
  isMain: yup.boolean(),
  isScan: yup.boolean(),
  firmwareVersion: yup.string().required("Id прошивки обов'язкова"),
  lastFirmware: yup.date(),
  channels: yup.array(),
  isCacheFirmware: yup.boolean(),
});

export default function Firmware() {
  const [loading, setLoading] = useState(false);
  const {
    radio,
    getRadios,
    setRadioId,
    isRewriteFirmware,
    setIsRewriteFirmware,
    storeFirmwareCache,
    firmwareCache,
  } = useRadioContext();
  const { channels } = useChannelContext();
  const { tlss } = useTLSContext();

  const context = useModalContext();
  const isOpen = context.openedModalsKeys.includes(MODAL_KEYS.FIRMWARE);
  const { addAlert } = useAlertContext();

  const { control, handleSubmit, reset } = useForm<firmware>({
    resolver: yupResolver(schema),
  });

  const channelOptions = useMemo(
    () =>
      channels?.data?.length
        ? channels.data.map((channel) => ({
            id: channel.id,
            label: channel.name,
          }))
        : [],
    [channels]
  );

  useEffect(() => {
    if ((radio?.firmwares && isRewriteFirmware) || firmwareCache) {
      const firmware = radio?.firmwares?.[radio?.firmwares?.length - 1];
      let resetObj = { lastFirmware: dayjs(), isCacheFirmware: false };

      if (firmware) {
        const channels =
          firmware?.channels?.map((channel) => {
            return channelOptions.find(
              (channelOption) => channelOption.id === channel.id
            );
          }) || [];

        resetObj = {
          ...resetObj,
          isChild: Boolean(firmware.isChild),
          isMain: Boolean(firmware.isMain),
          isScan: Boolean(firmware.isScan),
          firmwareVersion: firmware.firmwareVersion,
          firmwareId: firmware.firmwareId,
          encryption: firmware.encryption?.id,
          channels,
        };
      }

      if (firmwareCache) {
        const channels =
          firmwareCache?.channels?.map((channel) => {
            return channelOptions.find(
              (channelOption) => channelOption.id === channel.id
            );
          }) || [];

        resetObj = {
          ...resetObj,
          isChild: Boolean(firmwareCache?.isChild),
          isMain: Boolean(firmwareCache?.isMain),
          isScan: Boolean(firmwareCache?.isScan),
          encryption: firmwareCache.encryption?.id,
          channels,
        };
      }

      if (resetObj) {
        reset(resetObj);
      } // reset(radio?.firmwares[radio?.firmwares.length - 1]);
    } else {
      reset(defaultValue);
    }
  }, [radio, channelOptions, firmwareCache]);

  const onClose = () => {
    context.closeModal(MODAL_KEYS.FIRMWARE);
    setRadioId(null);
    setIsRewriteFirmware(false);
    reset(defaultValue);
  };

  const onSubmit = async (data: firmware) => {
    const { isCacheFirmware, ...restData } = data;
    const dataTransformed = {
      ...restData,
      isChild: Boolean(data.isChild),
      isMain: Boolean(data.isMain),
      isScan: Boolean(data.isScan),
      radio: radio.id,
      channels: data?.channels
        ? data.channels.map((channel) => channel.id)
        : [],
    };
    setLoading(true);

    const response = await createFirmware({
      ...dataTransformed,
      updates: [],
    });

    if (isCacheFirmware) {
      storeFirmwareCache(response.data.data.id);
    }
    addAlert({
      message: "Радіостанцію успішно прошито",
      type: "success",
    });
    onClose();
    setLoading(false);
    getRadios();
  };

  return (
    <Modal
      open={isOpen}
      label="Прошивка"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      id={radio?.SN}
    >
      <form autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput
            control={control}
            name="firmwareId"
            label="Id в прошивці"
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormCheckbox
            control={control}
            name="isChild"
            label="Дочірня радіостанція"
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormCheckbox
            control={control}
            name="isMain"
            label="Головна радіостанція"
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormCheckbox
            control={control}
            name="isScan"
            label="Включене сканування"
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormInput
            control={control}
            name="firmwareVersion"
            label="Версія прошивки"
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormDate
            control={control}
            name="lastFirmware"
            label="Дата прошивки"
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormAutocomplete
            control={control}
            name="channels"
            label="Канали"
            multiple
            getOptionLabel={(option) => option.label}
            options={
              channels?.data?.length
                ? channels.data.map((channel) => ({
                    id: channel.id,
                    label: channel.name,
                  }))
                : []
            }
          />
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormAutocomplete
            control={control}
            name="encryption"
            label="TLS"
            getOptionLabel={(option) => option.label}
            options={
              tlss?.data?.length
                ? tlss.data.map((tls) => ({
                    id: tls.id,
                    label: tls.name,
                  }))
                : []
            }
          />
        </Box>

        <Divider />
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          {/* Key input */}
          <FormCheckbox
            control={control}
            name="isCacheFirmware"
            label="Зберегти прошивку"
          />
        </Box>
      </form>
    </Modal>
  );
}
