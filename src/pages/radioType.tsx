import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo } from "react";
import Registry from "../layout/Registry";
import { MODAL_KEYS, useModalContext } from "../modals";
import { useRadioTypeContext } from "../store/radioType";
import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MRT_Localization_UK } from "material-react-table/locales/uk";
import { deleteRadioType } from "../http";
import { useAlertContext } from "../components/Alert/AlertProvider";
import { radioType } from "../types/radioType";

export default function RadioType() {
  const { getRadioTypes, radioTypes, setRadioTypeId } = useRadioTypeContext();
  const { addAlert } = useAlertContext();
  useEffect(() => {
    getRadioTypes();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Модель радіостанції",
        accessorKey: "type",
      },
      {
        header: "З екраном",
        accessorKey: "isWithScreen",
        accessorFn: (row: radioType) => (row.isWithScreen ? "Так" : "Ні"),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: radioTypes?.data || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
            setRadioTypeId(row.original.id ?? null);
            modalContext.openModal(MODAL_KEYS.RADIO_TYPES);
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
                message: "Ви впевнені, що хочете видалити модель радіостанції?",
                type: "warning",
                action: {
                  label: "Підтвердити",
                  onClick: async () => {
                    if (row.original.id) {
                      await deleteRadioType(row.original.id);
                      addAlert({
                        message: "Модель радіостанції успішно видалено",
                        type: "success",
                      });
                      getRadioTypes();
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
      buttonLabel="Додати модель радіостанції"
      onButtonClick={() => {
        modalContext.openModal(MODAL_KEYS.RADIO_TYPES);
      }}
    >
      <>
        <MaterialReactTable table={table} />
      </>
    </Registry>
  );
}
