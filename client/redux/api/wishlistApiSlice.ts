import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant";
import { WISHLIST_URL } from "../constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const wishlistApiSlice = createApi({
  reducerPath: "wishlistApi",
  baseQuery: async (args, api, extraOptions) => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    if (!userInfo) {
      throw new Error("No user information found");
    }

    const { accessToken } = JSON.parse(userInfo);

    return fetchBaseQuery({
      baseUrl: BASE_URL,
      credentials: "include",
      prepareHeaders: (headers) => {
        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return headers;
      },
    })(args, api, extraOptions);
  },
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: (email) => ({
        url: `${WISHLIST_URL}/${email}`,
      }),
    }),
    addToWishList: builder.mutation({
      query: (data) => ({
        url: `${WISHLIST_URL}/add`,
        method: "POST",
        body: data,
      }),
    }),
    removeFromWishList: builder.mutation({
      query: ({ productId, email }) => ({
        url: `${WISHLIST_URL}/remove/${productId}/${email}`, // Use URL parameters
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
} = wishlistApiSlice;