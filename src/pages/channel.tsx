import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo } from "react";
import Registry from "../layout/Registry";
import { MODAL_KEYS, useModalContext } from "../modals";
import { useChannelContext } from "../store/channel";
import { useKeyContext } from "../store/key";
import { useRASContext } from "../store/RAS";
import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MRT_Localization_UK } from "material-react-table/locales/uk";
import { deleteChannel } from "../http";
import { useAlertContext } from "../components/Alert/AlertProvider";
import { channel } from "../types/channel";

export default function Channel() {
  const { getChannels, channels, setChannelId } = useChannelContext();
  const { getKeys, keys } = useKeyContext();
  const { getRass } = useRASContext();
  const { addAlert } = useAlertContext();

  useEffect(() => {
    getChannels();
    getKeys();
    getRass();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Назва",
        accessorKey: "name",
      },
      {
        header: "Опис",
        accessorKey: "notes",
      },
      {
        header: "Через ретранслятор",
        accessorKey: "isRepeater",
        accessorFn: (row: channel) => (row.isRepeater ? "Так" : "Ні"),
      },
      {
        header: "Прийомна частота",
        accessorKey: "RX",
      },
      {
        header: "Передаюча частота",
        accessorKey: "TX",
      },
      {
        header: "Ключ",
        accessorKey: "key",
        accessorFn: (row: channel) => row?.key?.name ?? "немає",
      },
      {
        header: "Ключ RAS",
        accessorKey: "ras",
        accessorFn: (row: channel) => row?.ras?.name ?? "немає",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: channels?.data || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: true, //turn off a feature
    enableRowActions: true,
    enableColumnResizing: true,
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <Box>
        <Button
          sx={{ justifyContent: "left", p: 1 }}
          variant="text"
          startIcon={<EditIcon />}
          fullWidth
          onClick={() => {
            setChannelId(row.original.id ?? null);
            modalContext.openModal(MODAL_KEYS.CHANNEL);
            closeMenu();
          }}
        >
          Редагувати
        </Button>
      </Box>,
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
                message: "Ви впевнені, що хочете видалити канал?",
                type: "warning",
                action: {
                  label: "Підтвердити",
                  onClick: async () => {
                    if (row.original.id) {
                      await deleteChannel(row.original.id);
                      addAlert({
                        message: "Канал успішно видалено",
                        type: "success",
                      });
                      getChannels();
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
      buttonLabel="Додати канал"
      onButtonClick={() => {
        modalContext.openModal(MODAL_KEYS.CHANNEL);
      }}
    >
      <>
        <MaterialReactTable table={table} />
      </>
    </Registry>
  );
}
