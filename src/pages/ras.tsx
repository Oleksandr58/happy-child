import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo } from "react";
import Registry from "../layout/Registry";
import { MODAL_KEYS, useModalContext } from "../modals";
import { useRASContext } from "../store/RAS";
import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MRT_Localization_UK } from "material-react-table/locales/uk";
import { deleteRAS } from "../http";
import { useAlertContext } from "../components/Alert/AlertProvider";

export default function RAS() {
  const { getRass, rass, setRasId } = useRASContext();
  const { addAlert } = useAlertContext();

  useEffect(() => {
    getRass();
  }, []);

  const columns = useMemo(
    () => [
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
    data: rass?.data || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: true, //turn off a feature
    enableRowActions: true,
    enableColumnResizing: true,
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <Box key="edit" onClick={() => console.info("Edit")}>
        <Button
          sx={{ justifyContent: "left", p: 1 }}
          variant="text"
          startIcon={<EditIcon />}
          fullWidth
          onClick={() => {
            setRasId(row.original.id ?? null);
            modalContext.openModal(MODAL_KEYS.RAS);
            closeMenu();
          }}
        >
          Редагувати
        </Button>
      </Box>,
      <Box key="delete">
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
                      await deleteRAS(row.original.id);
                      addAlert({
                        message: "RAS успішно видалено",
                        type: "success",
                      });
                      getRass();
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
      buttonLabel="Додати RAS"
      onButtonClick={() => {
        modalContext.openModal(MODAL_KEYS.RAS);
      }}
    >
      <>
        <MaterialReactTable table={table} />
      </>
    </Registry>
  );
}
