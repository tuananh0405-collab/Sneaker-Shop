import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice"; // This is your RTK query API slice (for global API calls)
import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import { wishlistApiSlice } from "./api/wishlistApiSlice"; // Import your wishlistApiSlice

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartReducer,
    // Add wishlistApiSlice reducer
    [wishlistApiSlice.reducerPath]: wishlistApiSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      wishlistApiSlice.middleware // Add wishlistApiSlice middleware here
    ),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
