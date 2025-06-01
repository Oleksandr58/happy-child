import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { getActionsForDates } from "../helpers/calculate";
import { saveAction } from "../helpers/store";
import dayjs from "dayjs";
import {
  START_CALCULATION_DATE,
  STANDART_DATE_FORMAT,
  resultBirthDate,
} from "../helpers/date";
import { createIdFromAction } from "../helpers/calculate";
import { useState, useEffect, useCallback } from "react";
import { actionsArrItem } from "../types/action";

export default function AccordionUsage() {
  const [checkboxMap, setCheckboxMap] = useState<Record<string, boolean>>({});
  const [actionsDates, setActionsDates] = useState<actionsArrItem[]>();
  const [showAllDates, setShowAllDates] = useState(false);

  const getActions = useCallback(() => {
    const actions = getActionsForDates(
      showAllDates
        ? dayjs(START_CALCULATION_DATE, STANDART_DATE_FORMAT).format(
            STANDART_DATE_FORMAT
          )
        : dayjs().add(-1, "day").format(STANDART_DATE_FORMAT),
      dayjs().add(10, "day").format(STANDART_DATE_FORMAT)
    );
    const checkboxMapStart = actions.reduce(
      (acc: Record<string, boolean>, act) => {
        act.actions.forEach((action) => {
          acc[action.id] = action.isChecked;
        });

        return acc;
      },
      {}
    );

    setCheckboxMap(checkboxMapStart);
    setShowAllDates(!showAllDates);
    if (actions?.length) {
      setActionsDates(actions);
    }
  }, [showAllDates]);

  useEffect(() => {
    getActions();
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          width: "100vw",
          height: "100vh",
          maxWidth: "800px",
          gap: "12px",
          background: "url(./logoBg.jpg) no-repeat",
          backgroundSize: "cover",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            overflowY: "scroll",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            minHeight: "100vh",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            margin="16px"
            textAlign="center"
          >
            Дмитрико-день <div>({resultBirthDate})</div>
          </Typography>

          <Button
            onClick={() => getActions()}
            sx={{ m: 1 }}
            variant="contained"
            size="small"
          >
            {showAllDates ? "Показати" : "Сховати"} всі дати
          </Button>

          {actionsDates?.map((actionsDate) => (
            <Accordion
              key={actionsDate.date.format(STANDART_DATE_FORMAT)}
              sx={{ width: "100%", backgroundColor: "unset" }}
              defaultExpanded={actionsDate.date.isSame(dayjs(), "day")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={actionsDate.date.format(STANDART_DATE_FORMAT)}
                id={actionsDate.date.format(STANDART_DATE_FORMAT)}
              >
                <Typography component="span" fontWeight="bold" fontSize="18px">
                  {actionsDate.date.format(STANDART_DATE_FORMAT)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  {actionsDate.actions.map((action) => (
                    <FormControlLabel
                      key={createIdFromAction(actionsDate.date, action)}
                      control={<Checkbox />}
                      label={action.name}
                      checked={checkboxMap?.[action.id]}
                      onChange={(e) => {
                        const isChecked = (e.target as HTMLInputElement)
                          .checked;

                        saveAction(action.id, isChecked);
                        setCheckboxMap({
                          ...checkboxMap,
                          [action.id]: isChecked,
                        });
                      }}
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
