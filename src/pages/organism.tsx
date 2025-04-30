import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo } from "react";
import Registry from "../layout/Registry";
import { MODAL_KEYS, useModalContext } from "../modals";
import { useOrganismContext } from "../store/organism";
import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MRT_Localization_UK } from "material-react-table/locales/uk";
import { deleteOrganism } from "../http";
import { useAlertContext } from "../components/Alert/AlertProvider";
import { organism } from "../types/organism";

export default function Organism() {
  const { getOrganisms, organisms, setOrganismId } = useOrganismContext();
  const { addAlert } = useAlertContext();
  useEffect(() => {
    getOrganisms();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Назва організму",
        accessorKey: "name",
      },
      {
        header: "В межах батальйону",
        accessorKey: "inBattalion",
        accessorFn: (row: organism) => (row.inBattalion ? "Так" : "Ні"),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: organisms?.data || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: true, //turn off a feature
    enableRowActions: true,
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <Box>
        <Button
          sx={{ justifyContent: "left", p: 1 }}
          variant="text"
          startIcon={<EditIcon />}
          fullWidth
          onClick={() => {
            setOrganismId(row.original.id ?? null);
            modalContext.openModal(MODAL_KEYS.ORGANISM);
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
                message: "Ви впевнені, що хочете видалити організм?",
                type: "warning",
                action: {
                  label: "Підтвердити",
                  onClick: async () => {
                    if (row.original.id) {
                      await deleteOrganism(row.original.id);
                      addAlert({
                        message: "Організм успішно видалено",
                        type: "success",
                      });
                      getOrganisms();
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
      buttonLabel="Додати організм"
      onButtonClick={() => {
        modalContext.openModal(MODAL_KEYS.ORGANISM);
      }}
    >
      <>
        <MaterialReactTable table={table} />
      </>
    </Registry>
  );
}
