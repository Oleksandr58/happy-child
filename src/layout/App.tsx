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
import START_CALCULATION_DATE from "../data/startCalculationDate";
import "./App.css";
import { act } from "react";

export default function AccordionUsage() {
  const actionsDates = getActionsForDates(
    START_CALCULATION_DATE,
    dayjs().add(10, "day").format("DD.MM.YYYY")
  );

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
            Дмитрико-день
          </Typography>

          {actionsDates?.map((actionsDate) => (
            <Accordion
              key={actionsDate.date}
              sx={{ width: "100%", backgroundColor: "unset" }}
              defaultExpanded={actionsDate.date.isSame(dayjs(), "day")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={actionsDate.date}
                id={actionsDate.date}
              >
                <Typography component="span" fontWeight="bold" fontSize="18px">
                  {actionsDate.date.format("DD.MM.YYYY")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  {actionsDate.actions.map((action) => (
                    <FormControlLabel
                      control={<Checkbox />}
                      label={action.name}
                      checked={action.isChecked}
                      onChange={(a) => {
                        console.log(
                          "a",
                          a.target.checked,
                          `${actionsDate.date.format("DD.MM.YYYY")}-${action.id}`
                        );

                        saveAction(
                          `${actionsDate.date.format("DD.MM.YYYY")}-${action.id}`,
                          a.target.checked
                        );
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
