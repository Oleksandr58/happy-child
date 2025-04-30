import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Switch from "@mui/material/Switch";
import FormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import { Box, Typography } from "@mui/material";

type Args<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  labelStart?: string; // Left label
} & FormControlLabelProps;

function FormCheckbox<T extends FieldValues>({
  control,
  name,
  labelStart,
  label,
  ...rest
}: Args<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        return (
          <FormControlLabel
            control={
              <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
                {/* Left label */}
                {labelStart && (
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {labelStart}
                  </Typography>
                )}

                {/* Switch */}
                <Switch onChange={onChange} checked={value} />
              </Box>
            }
            label={label} // Empty because labels are manually handled
            {...rest}
          />
        );
      }}
    />
  );
}

export default FormCheckbox;
