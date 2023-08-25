import { TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";

export default function ProductSearch() {
  const { productParams } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);

  const debouncedSearch = (event: any) => {
    clearTimeout(timeoutId);
    setTimeoutId(
      setTimeout(() => {
        dispatch(setProductParams({ searchTerm: event.target.value }))
      }, 500)
    );
  }

  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      value={searchTerm || ''}
      onChange={(event: any) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event);
      }}
    />
  );
}