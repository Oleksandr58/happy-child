import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo } from "react";
import Registry from "../layout/Registry";
import { MODAL_KEYS, useModalContext } from "../modals";
import { useKeyContext } from "../store/key";
import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MRT_Localization_UK } from "material-react-table/locales/uk";
import { deleteKey } from "../http";
import { useAlertContext } from "../components/Alert/AlertProvider";

export default function Keys() {
  const { getKeys, keys, setKeyId } = useKeyContext();
  const { addAlert } = useAlertContext();

  useEffect(() => {
    getKeys();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Id",
        accessorKey: "keyId",
      },
      {
        header: "Ім'я",
        accessorKey: "name",
      },
      {
        header: "Ключ",
        accessorKey: "key", //alternate way to access data if processing logic is needed
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: keys?.data || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
            setKeyId(row.original.id ?? null);
            modalContext.openModal(MODAL_KEYS.KEY);
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
                message: "Ви впевнені, що хочете видалити ключ?",
                type: "warning",
                action: {
                  label: "Підтвердити",
                  onClick: async () => {
                    if (row.original.id) {
                      await deleteKey(row.original.id);
                      addAlert({
                        message: "Ключ успішно видалено",
                        type: "success",
                      });
                      getKeys();
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
      buttonLabel="Додати ключ"
      onButtonClick={() => {
        modalContext.openModal(MODAL_KEYS.KEY);
      }}
    >
      <>
        <MaterialReactTable table={table} />
      </>
    </Registry>
  );
}
