import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  items: string[];
}

export default function AppSelectList(props: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: '' });

  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={field.value}
        label={props.label}
        onChange={field.onChange}
      >
        {props.items.map((item, index) => {
          return (
            // Using indices as key when mapping is considered an antipattern
            <MenuItem key={index} value={item}>{item}</MenuItem>
          )
        })}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  )
}