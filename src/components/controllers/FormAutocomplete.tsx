import { Control, Controller, FieldValues, Path } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";

type Args<T extends FieldValues, TOption> = Omit<
  AutocompleteProps<TOption, boolean, boolean, boolean>,
  "renderInput"
> & {
  name: Path<T>;
  control: Control<T>;
  label?: string;
};

function FormAutocomplete<T extends FieldValues, TOption>({
  control,
  name,
  label,
  options,
  ...rest
}: Args<T, TOption>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = rest.multiple
          ? value || []
          : options?.find((option) => option?.id === value) || null;
        const selectedOptionIds = rest.multiple
          ? selectedOption.map((option) => option.id)
          : [];

        return (
          <Autocomplete
            onChange={(_val, data) => {
              if (rest.multiple) {
                onChange(data || []);
              } else {
                onChange(data?.id || null);
              }
            }}
            disablePortal
            value={selectedOption}
            options={
              rest.multiple
                ? options.filter(
                    (option) => !selectedOptionIds.includes(option.id)
                  )
                : options
            }
            fullWidth
            {...rest}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={label}
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              );
            }}
          />
        );
      }}
    />
  );
}

export default FormAutocomplete;
