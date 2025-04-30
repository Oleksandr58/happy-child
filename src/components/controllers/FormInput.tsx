import { Control, Controller, FieldValues, Path } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import { ReactElement } from "react";

type Args<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  icon?: ReactElement;
  formatter: (val: string) => string;
} & TextFieldProps;

function FormInput<T extends FieldValues>({
  control,
  name,
  formatter,
  icon,
  ...rest
}: Args<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        return (
          <TextField
            onChange={(e) => {
              const val = e.target.value;
              const valFormatted = formatter ? formatter(val) : val;

              onChange(valFormatted);
            }}
            autoFocus={true}
            onBlur={onBlur}
            value={value ? value : ""}
            error={!!error} // Shows error state on the input
            helperText={error ? error.message : null} // Shows error message
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">{icon}</InputAdornment>
              ),
            }}
            {...rest}
          />
        );
      }}
    />
  );
}

export default FormInput;
