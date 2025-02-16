import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import productReducer from "./features/product/productSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer
  },
});

// Define RootState and AppDispatch for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

