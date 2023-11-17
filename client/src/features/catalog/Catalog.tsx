import { Grid, Paper } from "@mui/material";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import useProducts from "../../app/hooks/useProducts";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to high" },
];

function Catalog() {
  const { products, brands, types, filtersLoaded, metaData } = useProducts();
  const { productParams } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            options={sortOptions}
            selectedValue={productParams.orderBy}
            onChange={(e) => dispatch(setProductParams({ orderBy: e.target.value, pageNumber: 1 }))}
          />
        </Paper>

        <Paper>
          <CheckboxButtons
            items={brands}
            checked={productParams.brands}
            onChange={(items: string[]) => dispatch(setProductParams({ brands: items, pageNumber: 1 }))}
          />
        </Paper>

        <Paper>
          <CheckboxButtons
            items={types}
            checked={productParams.types}
            onChange={(items: string[]) => dispatch(setProductParams({ types: items, pageNumber: 1 }))}
          />
        </Paper>
      </Grid>

      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>

      {/*  */}
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2 }}>
        {metaData &&
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) => dispatch(setProductParams({ pageNumber: page }))}
          />
        }
      </Grid>
    </Grid>
  );
}

export default Catalog;