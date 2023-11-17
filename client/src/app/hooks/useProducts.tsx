import { useEffect } from "react";
import { productSelectors, fetchProductsAsync, fetchFiltersAsync } from "../../features/catalog/catalogSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

export default function useProducts() {
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, filtersLoaded, brands, types, metaData } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  // Fetch products
  useEffect(() => {
    if (!productsLoaded) {
      dispatch(fetchProductsAsync());
    }
  }, [productsLoaded, dispatch]);

  // Fetch filters
  useEffect(() => {
    if (!filtersLoaded) {
      dispatch(fetchFiltersAsync());
    }
  }, [filtersLoaded, dispatch]);

  return {
    products,
    productsLoaded,
    filtersLoaded,
    brands,
    types,
    metaData 
  }
}