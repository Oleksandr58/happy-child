import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import Registry from "../layout/Registry";
import { MODAL_KEYS, useModalContext } from "../modals";
import { useRadioContext } from "../store/radio";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Divider,
  ButtonGroup,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CableIcon from "@mui/icons-material/Cable";
import DeleteIcon from "@mui/icons-material/Delete";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import SettingsInputCompositeIcon from "@mui/icons-material/SettingsInputComposite";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MRT_Localization_UK } from "material-react-table/locales/uk";
import { deleteRadio, deleteRadioGiving, updateRadio } from "../http";
import { useAlertContext } from "../components/Alert/AlertProvider";
import { radio } from "../types/radio";
import { useOrganismContext } from "../store/organism";
import { useRadioTypeContext } from "../store/radioType";
import { useChannelContext } from "../store/channel";
import { useTLSContext } from "../store/TLS";
import dayjs from "dayjs";
import ExpandedBlocks from "../components/ExpandedBlocks";
import StatusLabel from "../components/StatusLabel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";

const FILTERS = {
  ALL: "ALL",
  GIVEN: "GIVEN",
  REGISTERED: "REGISTERED",
  LOST: "LOST",
};

export default function Radio() {
  const {
    getRadios,
    radios,
    setRadioId,
    setIsRewriteFirmware,
    storeFirmwareCache,
  } = useRadioContext();
  const { getOrganisms } = useOrganismContext();
  const { getRadioTypes } = useRadioTypeContext();
  const { getChannels } = useChannelContext();
  const { getTlss } = useTLSContext();
  const { addAlert } = useAlertContext();
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const rowSelection = selectedId
    ? {
        [selectedId]: true,
      }
    : {};
  const selectedRadio = radios?.data?.find((radio) => radio.id === selectedId);
  const getResourses = () => {
    getRadios();
    getOrganisms();
    getRadioTypes();
    getChannels();
    getTlss();
  };

  useEffect(() => {
    getResourses();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Серійний номер",
        accessorKey: "SN",
      },
      {
        header: "Деталі",
        accessorKey: "notes",
      },
      {
        header: "Номер радіостанції",
        accessorKey: "idOnRadio",
      },
      {
        header: "Організм",
        accessorKey: "organism",
        accessorFn: (row: radio) => row.organism.name,
      },
      {
        header: "Модель радіостанції",
        accessorKey: "type",
        accessorFn: (row: radio) => row.type.type,
      },
      {
        header: "На обліку",
        accessorKey: "isRegistered",
        accessorFn: (row: radio) => (row.isRegistered ? "Так" : "Ні"),
      },
      {
        header: "ID прошивки",
        accessorKey: "firmwareId",
        accessorFn: (row: radio) =>
          row.firmwares?.[row.firmwares.length - 1]?.firmwareId,
      },
      {
        header: "Видана",
        accessorKey: "persons",
        accessorFn: (row: radio) =>
          row?.persons?.length
            ? `${row.persons[0].rank} ${row.persons[0].fullName} - ${row.persons[0].callSign}  від ${dayjs(row?.persons?.[0].createdAt).format("DD.MM.YYYY")}`
            : "Не видана",
      },
      {
        header: "Загублена",
        accessorKey: "isLost",
        accessorFn: (row: radio) => (row.isLost ? "Так" : "Ні"),
      },
    ],
    []
  );

  const radiosFiltered = useMemo(() => {
    const radiosMapped = radios?.data || [];

    if (filter === FILTERS.GIVEN) {
      return radiosMapped.filter((radio) => Boolean(radio?.persons?.length));
    } else if (filter === FILTERS.LOST) {
      return radiosMapped.filter((radio) => Boolean(radio?.isLost));
    } else if (filter === FILTERS.REGISTERED) {
      return radiosMapped.filter((radio) => Boolean(radio?.isRegistered));
    }

    return radiosMapped;
  }, [radios, filter]);

  const table = useMaterialReactTable({
    columns,
    data: radiosFiltered, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: true, //turn off a feature
    enableRowActions: true,
    enableColumnResizing: true,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        setSelectedId(
          !selectedId || selectedId !== row.original.id ? row.original.id : null
        );
      }, //import this helper function from material-react-table
      sx: { cursor: "pointer" },
    }),
    getRowId: (originalRow) => originalRow.id,
    state: {
      rowSelection,
    },
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <Box>
        <Button
          sx={{ justifyContent: "left", p: 1 }}
          variant="text"
          startIcon={<CheckCircleOutlineIcon />}
          fullWidth
          onClick={() => {
            setIsRewriteFirmware(true);
            setRadioId(row.original.id ?? null);
            modalContext.openModal(MODAL_KEYS.RADIO_CHECK);
            closeMenu();
          }}
        >
          Перевірити
        </Button>
      </Box>,
      <Box>
        <Button
          sx={{ justifyContent: "left", p: 1 }}
          variant="text"
          startIcon={<VolunteerActivismIcon />}
          fullWidth
          onClick={async () => {
            if (row.original?.persons?.length) {
              addAlert(
                {
                  message: "Ви впевнені, що хочете здати радіостанцію?",
                  type: "warning",
                  action: {
                    label: "Підтвердити",
                    onClick: async () => {
                      await deleteRadioGiving(row.original?.persons?.[0]?.id);
                      addAlert({
                        message: "Радіостанція успішно здана",
                        type: "success",
                      });
                      getResourses();
                    },
                  },
                },
                true
              );
            } else {
              setRadioId(row.original.id ?? null);
              modalContext.openModal(MODAL_KEYS.RADIO_GIVING);
            }
            closeMenu();
          }}
        >
          {row.original?.persons?.length ? "Здати" : "Видати"}
        </Button>
      </Box>,
      row?.original?.firmwares?.length ? null : (
        <Box>
          <Button
            sx={{ justifyContent: "left", p: 1 }}
            variant="text"
            startIcon={<CableIcon />}
            fullWidth
            onClick={() => {
              setRadioId(row.original.id ?? null);
              modalContext.openModal(MODAL_KEYS.FIRMWARE);
              closeMenu();
            }}
          >
            Прошити
          </Button>
        </Box>
      ),
      row?.original?.firmwares?.length ? (
        <Box>
          <Button
            sx={{ justifyContent: "left", p: 1 }}
            variant="text"
            startIcon={<SettingsInputCompositeIcon />}
            fullWidth
            onClick={() => {
              setIsRewriteFirmware(true);
              setRadioId(row.original.id ?? null);
              modalContext.openModal(MODAL_KEYS.FIRMWARE);
              closeMenu();
            }}
          >
            Перешити
          </Button>
        </Box>
      ) : null,
      <Box>
        <Button
          sx={{ justifyContent: "left", p: 1 }}
          variant="text"
          startIcon={<EditIcon />}
          fullWidth
          onClick={() => {
            setRadioId(row.original.id ?? null);
            modalContext.openModal(MODAL_KEYS.RADIO);
            closeMenu();
          }}
        >
          Редагувати
        </Button>
      </Box>,
      row.original.isLost ? null : (
        <Box>
          <Button
            sx={{ justifyContent: "left", p: 1 }}
            variant="text"
            startIcon={<DoNotDisturbIcon />}
            fullWidth
            onClick={() => {
              closeMenu();
              addAlert(
                {
                  message: "Ви впевнені, що радіостанція загублена?",
                  type: "warning",
                  action: {
                    label: "Підтвердити",
                    onClick: async () => {
                      if (row.original.id) {
                        await updateRadio(row.original.id, {
                          ...row.original,
                          organism: row.original?.organism?.id,
                          type: row.original?.type?.id,
                          isLost: true,
                        });
                        addAlert({
                          message: "Радіостанція успішно відмічена загубленою",
                          type: "success",
                        });
                        getRadios();
                      }
                    },
                  },
                },
                true
              );
            }}
          >
            Загубити
          </Button>
        </Box>
      ),
      <Box>
        <Button
          sx={{ justifyContent: "left", p: 1 }}
          variant="text"
          startIcon={<DeleteIcon />}
          fullWidth
          onClick={() => {
            closeMenu();
            addAlert(
              {
                message: "Ви впевнені, що хочете видалити радіостанцію?",
                type: "warning",
                action: {
                  label: "Підтвердити",
                  onClick: async () => {
                    if (row.original.id) {
                      await deleteRadio(row.original.id);
                      addAlert({
                        message: "Радіостанція успішно видалено",
                        type: "success",
                      });
                      getRadios();
                    }
                  },
                },
              },
              true
            );
          }}
        >
          Видалити
        </Button>
      </Box>,
    ],
    localization: MRT_Localization_UK,
  });

  const modalContext = useModalContext();

  return (
    <Registry
      buttonLabel="Додати радіостанцію"
      onButtonClick={() => {
        modalContext.openModal(MODAL_KEYS.RADIO);
      }}
    >
      <>
        <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
          <Button
            variant={filter === FILTERS.ALL ? "contained" : "outlined"}
            onClick={() => setFilter(FILTERS.ALL)}
          >
            Всі
          </Button>
          <Button
            variant={filter === FILTERS.GIVEN ? "contained" : "outlined"}
            onClick={() => setFilter(FILTERS.GIVEN)}
          >
            Видані
          </Button>
          <Button
            variant={filter === FILTERS.REGISTERED ? "contained" : "outlined"}
            onClick={() => setFilter(FILTERS.REGISTERED)}
          >
            Обліковані
          </Button>
          <Button
            variant={filter === FILTERS.LOST ? "contained" : "outlined"}
            onClick={() => setFilter(FILTERS.LOST)}
          >
            Загублені
          </Button>
        </ButtonGroup>
        <MaterialReactTable table={table} />
        <Drawer
          open={Boolean(selectedId)}
          anchor="right"
          onClose={() => setSelectedId(null)}
        >
          <Box sx={{ minWidth: "500px", p: 2, overflowY: "auto" }}>
            <Typography
              gutterBottom
              sx={{
                display: "block",
                mb: 2,
                fontWeight: "bold",
                textDecoration: "underline",
                fontSize: "18px",
              }}
            >
              Загальні дані
            </Typography>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Box sx={{ fontWeight: "bold", mr: 1 }}>Номер:</Box>
              {selectedRadio?.idOnRadio}
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Box sx={{ fontWeight: "bold", mr: 1 }}>Організм:</Box>
              {selectedRadio?.organism?.name}
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Box sx={{ fontWeight: "bold", mr: 1 }}>SN:</Box>
              {selectedRadio?.SN}
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Box sx={{ fontWeight: "bold", mr: 1 }}>Модель:</Box>
              {selectedRadio?.type?.type}
            </Box>
            <Box sx={{ display: "flex", mb: 1 }}>
              <Box sx={{ fontWeight: "bold", mr: 1 }}>На обліку:</Box>
              {selectedRadio?.isRegistered ? "Так" : "Ні"}
            </Box>
            <Box sx={{ display: "flex", mb: 3 }}>
              <Box sx={{ fontWeight: "bold", mr: 1 }}>Видана:</Box>
              {selectedRadio?.persons?.length
                ? `${selectedRadio?.persons?.[0]?.rank} ${selectedRadio?.persons?.[0].fullName} - ${selectedRadio?.persons?.[0].callSign} від ${dayjs(selectedRadio?.persons?.[0].createdAt).format("DD.MM.YYYY")}`
                : "Не видана"}
            </Box>

            <Typography
              gutterBottom
              sx={{
                display: "block",
                mb: 1,
                fontWeight: "bold",
                textDecoration: "underline",
                fontSize: "18px",
              }}
            >
              {selectedRadio?.firmwares?.length
                ? "Прошивки"
                : "Радіостанція не прошита"}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <ExpandedBlocks
                blocks={selectedRadio?.firmwares
                  ?.sort((a, b) => {
                    return (
                      dayjs(b.lastFirmware).unix() -
                      dayjs(a.lastFirmware).unix()
                    );
                  })
                  ?.map((firmware, index) => (
                    <Box sx={{ position: "relative" }}>
                      <IconButton
                        sx={{ position: "absolute", top: 0, right: "16px" }}
                        title="Копіювати прошивку"
                        onClick={() => {
                          storeFirmwareCache(firmware.id);
                        }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                      <Box sx={{ display: "flex", mb: 1 }}>
                        <Box sx={{ fontWeight: "bold", mr: 1 }}>ID:</Box>
                        {firmware.firmwareId}
                      </Box>
                      <Box sx={{ display: "flex", mb: 1 }}>
                        <Box sx={{ fontWeight: "bold", mr: 1 }}>Дочірня:</Box>
                        {firmware.isChild ? "Так" : "Ні"}
                      </Box>
                      <Box sx={{ display: "flex", mb: 1 }}>
                        <Box sx={{ fontWeight: "bold", mr: 1 }}>Головна:</Box>
                        {firmware.isMain ? "Так" : "Ні"}
                      </Box>
                      <Box sx={{ display: "flex", mb: 1 }}>
                        <Box sx={{ fontWeight: "bold", mr: 1 }}>
                          Сканування:
                        </Box>
                        {firmware.isScan ? "Так" : "Ні"}
                      </Box>
                      <Box sx={{ display: "flex", mb: 1 }}>
                        <Box sx={{ fontWeight: "bold", mr: 1 }}>
                          Версія codeplug:
                        </Box>
                        {firmware.firmwareVersion}
                      </Box>
                      <Box sx={{ display: "flex", mb: 1 }}>
                        <Box sx={{ fontWeight: "bold", mr: 1 }}>
                          Дата прошивки:
                        </Box>
                        {dayjs(firmware.lastFirmware).format("DD MMMM YYYY")}
                      </Box>
                      <Box sx={{ display: "flex", mb: 1 }}>
                        <Box sx={{ fontWeight: "bold", mr: 1 }}>Канали:</Box>
                        <Box sx={{ display: "block" }}>
                          {firmware.channels.map((channel, index) => (
                            <Box sx={{ mb: 1 }}>
                              {index + 1}. {channel.name}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", mb: 1 }}>
                        <Box sx={{ fontWeight: "bold", mr: 1 }}>TLS:</Box>
                        {firmware?.encryption?.name || "Відсутній"}
                      </Box>

                      {selectedRadio.firmwares.length > index + 1 && (
                        <Divider sx={{ mb: 2 }} />
                      )}
                    </Box>
                  ))}
              />
            </Box>

            <Typography
              gutterBottom
              sx={{
                display: "block",
                mb: 1,
                fontWeight: "bold",
                textDecoration: "underline",
                fontSize: "18px",
              }}
            >
              {selectedRadio?.checks?.length
                ? "Перевірки радіостанції"
                : "Радіостанція не була перевірена"}
            </Typography>
            <ExpandedBlocks
              blocks={selectedRadio?.checks?.map((check, index) => (
                <>
                  <Box sx={{ display: "flex", mb: 1, alignItems: "center" }}>
                    <Box sx={{ fontWeight: "bold", mr: 1 }}>
                      {dayjs(check.createdAt).format("DD.MM.YYYY H:mm")}:
                    </Box>
                    <StatusLabel isSuccess={check.isSuccess} />
                  </Box>
                </>
              ))}
            />
          </Box>
        </Drawer>
      </>
    </Registry>
  );
}
