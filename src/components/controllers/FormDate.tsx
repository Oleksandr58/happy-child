import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/uk"; // Import Ukrainian locale
import { TextField } from "@mui/material"; // Import TextField for input rendering

// Set the global locale to Ukrainian
dayjs.locale("uk");

type Args<T extends FieldValues, TDate> = {
  name: Path<T>;
  control: Control<T>;
} & Omit<DatePickerProps<TDate>, "renderInput">; // Omit renderInput from DatePickerProps

function FormInput<T extends FieldValues, TDate>({
  control,
  name,
  ...rest
}: Args<T, TDate>) {
  return (
    // Pass locale to LocalizationProvider
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <DatePicker
              onChange={(date) => {
                onChange(date); // Ensure proper format is passed to react-hook-form
              }}
              value={value || null}
              sx={{ width: "100%" }}
              {...rest}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
}

export default FormInput;
