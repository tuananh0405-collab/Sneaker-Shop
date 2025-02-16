import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../interface"; // Import interface Product

interface ProductState {
  products: Product[];
  productDetails: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const response = await fetch("http://192.168.57.105:5501/api/v1/product");
    const data: Product[] = await response.json();
    console.log("====================================");
    console.log(data);
    console.log("====================================");
    return data;
  }
);

// Fetch product details
export const fetchProductDetails = createAsyncThunk<Product, string>(
    'products/fetchProductDetails',
    async (productId: string) => {
      const response = await fetch(`http://192.168.57.105:5501/api/v1/product/${productId}`);
      const data = await response.json();
      return data;
    }
  );

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load products";
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load product details';
      });
  },
});

export default productSlice.reducer;
