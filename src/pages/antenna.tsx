import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FormInput from "../components/controllers/FormInput";
import FormCheckbox from "../components/controllers/FormCheckbox";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// Validation schema
const schema = yup.object().shape({
  frequency: yup
    .number()
    .required("Частота обовязкове поле")
    .min(136, "Мінімальна частота - 136")
    .max(174, "Максимальна частота - 174"),
  isDirected: yup.boolean(),
});

const getLambda = (freq: number): number => 30000 / freq;
const getA = (freq: number, isDirected?: boolean) => {
  const koef = isDirected ? 0.25 : 0.375;

  return koef * getLambda(freq);
};
const getB = (freq: number) => 0.625 * getLambda(freq);

export default function Antenna() {
  const { control, handleSubmit } = useForm<channel>({
    resolver: yupResolver(schema),
  });
  const [A, setA] = useState();
  const [B, setB] = useState();

  const onSumbit = (data) => {
    const A = getA(data.frequency, data?.isDirected).toFixed(2);
    const B = getB(data.frequency).toFixed(2);

    setA(A);
    setB(B);

    console.log("A", A, "B", B);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ display: "block", mb: 5 }}>
        Розрахунок налаштування антени Horwin (136-174 МГц)
      </Typography>

      <Box sx={{ maxWidth: "500px", margin: "auto" }}>
        <Box component="section" sx={{ display: "flex", mt: 2, mb: 2 }}>
          <FormInput
            control={control}
            name="frequency"
            label="Частота"
            type="number"
          />
          <Box sx={{ mt: 2, ml: 1 }}>МГц</Box>
        </Box>
        <Box component="section" sx={{ mt: 2, mb: 2 }}>
          <FormCheckbox
            control={control}
            name="isDirected"
            label="Направлена"
            labelStart="Кругова"
          />
        </Box>

        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit(onSumbit)}
          sx={{ minWidth: "36px" }}
        >
          Обрахувати
        </Button>
      </Box>

      {A && B ? (
        <Box sx={{ textAlign: "center", position: "relative", mt: 2 }}>
          <Box
            sx={{
              position: "absolute",
              top: "100px",
              left: "50%",
              transform: "translateX(calc(-100% + 15px))",
            }}
          >
            {A}см
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "230px",
              left: "50%",
              transform: "translateX(calc(-100% + 15px)) rotate(90deg)",
            }}
          >
            {B}см
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "95px",
              left: "50%",
              transform: "translateX(60px) rotate(90deg)",
            }}
          >
            Мін. {(B / 2).toFixed(2)}см
          </Box>
          <img src="./antennaHorwin.jpg" />
        </Box>
      ) : null}
    </>
  );
}
