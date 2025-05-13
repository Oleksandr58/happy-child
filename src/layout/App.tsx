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
import { START_CALCULATION_DATE, STANDART_DATE_FORMAT } from "../helpers/date";
import { createIdFromAction } from "../helpers/calculate";
import { useState, useEffect } from "react";
import { actionsArrItem } from "../types/action";

export default function AccordionUsage() {
  const [checkboxMap, setCheckboxMap] = useState<Record<string, boolean>>({});
  const [actionsDates, setActionsDates] = useState<actionsArrItem[]>();

  const monthCount = dayjs().diff(
    dayjs("10.04.2025 12-35", "DD.MM.YYYY HH-mm"),
    "month"
  );
  const dayCount = dayjs().diff(
    dayjs(`'10${dayjs().format(".MM.YYYY")} 12-35`, "DD.MM.YYYY HH-mm"),
    "days"
  );
  const hoursCount = dayjs().diff(
    dayjs(`${dayjs().format("DD.MM.YYYY")} 12-35`, "DD.MM.YYYY HH-mm"),
    "hours"
  );

  useEffect(() => {
    const actions = getActionsForDates(
      START_CALCULATION_DATE,
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
    if (actions?.length) {
      setActionsDates(actions);
    }
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
            Дмитрико-день{" "}
            <div>
              ({`${monthCount} місяців ${dayCount} день ${hoursCount} годин`})
            </div>
          </Typography>

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
