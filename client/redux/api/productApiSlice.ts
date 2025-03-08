import { Product } from "@/interface";
import { PRODUCT_URL } from "../constant";
import { apiSlice } from "./apiSlice";

interface ProductFilters {
  search?: string;
  category?: string;
  sortBy?: string;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<{ data: Product[] }, ProductFilters>({
      query: ({ search, category, sortBy, maxPrice, page = 1, limit = 10 }) => {
        const queryParams = new URLSearchParams();

        if (search) queryParams.append("search", search);
        if (category) queryParams.append("category", category);
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (maxPrice !== undefined) queryParams.append("maxPrice", maxPrice.toString());
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());

        return {
          url: `${PRODUCT_URL}?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),
    
    getProduct: builder.query<{ data: Product }, string>({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productApiSlice;
