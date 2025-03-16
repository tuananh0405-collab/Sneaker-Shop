import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant"; // Import your base URL
import { WISHLIST_URL } from "../constant"; // Ensure you have the correct wishlist endpoint
import AsyncStorage from "@react-native-async-storage/async-storage";

export const wishlistApiSlice = createApi({
  reducerPath: "wishlistApi", // Ensure to name the reducer appropriately
  baseQuery: async (args, api, extraOptions) => {
    // Retrieve token from AsyncStorage or a secure storage method
    const userInfo = await AsyncStorage.getItem("userInfo");
    if (!userInfo) {
      throw new Error("No user information found"); // Handling case if user is not logged in
    }

    const { accessToken } = JSON.parse(userInfo); // Assuming the token is in `userInfo`

    // Proceed with the fetchBaseQuery
    return fetchBaseQuery({
      baseUrl: BASE_URL,
      credentials: "include",
      prepareHeaders: (headers) => {
        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`); // Set token in the Authorization header
        }
        return headers;
      },
    })(args, api, extraOptions);
  },
  endpoints: (builder) => ({
    // Fetch the user's wishlist
    getWishlist: builder.query({
      query: (email) => ({  // Receive the email dynamically here
        url: `${WISHLIST_URL}/${email}`, // Use the correct URL for fetching the wishlist
      }),
    }),
    // Add product to wishlist
    addToWishList: builder.mutation({
      query: (data) => ({
        url: `${WISHLIST_URL}/add`, // Ensure the correct URL for adding to wishlist
        method: "POST",
        body: data,
      }),
    }),
    // Remove product from wishlist
    removeFromWishList: builder.mutation({
      query: (data) => ({
        url: `${WISHLIST_URL}/remove`, // Correct URL for removing from the wishlist
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

// Export the generated hooks
export const {
  useGetWishlistQuery,
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
} = wishlistApiSlice;
