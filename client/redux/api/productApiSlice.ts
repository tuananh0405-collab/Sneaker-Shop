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

interface ProductRecommend {
  userId: string;
  inputLimit?: number;
  recommendQuantity?: number;
}

interface ProductRecommendWithReason {
  userId?: string;
  inputLimit?: number;
  recommendQuantity?: number;
  description: string;
}

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<{ data: Product[] }, ProductFilters>({
      query: ({
        search,
        category,
        size,
        gender,
        color,
        minPrice,
        sortBy,
        maxPrice,
        page = 1,
        limit = 10,
      }) => {
        const queryParams = new URLSearchParams();

        if (search) queryParams.append("search", search);
        if (category) queryParams.append("category", category);
        if (size) queryParams.append("size", size.toString());
        if (gender) queryParams.append("gender", gender.toString());
        if (color) queryParams.append("color", color.toString());
        if (minPrice) queryParams.append("minPrice", minPrice.toString());
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (maxPrice !== undefined)
          queryParams.append("maxPrice", maxPrice.toString());
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());
        console.log("====================================");
        console.log(`${PRODUCT_URL}?${queryParams.toString()}`);
        console.log("====================================");
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

    getRecommendedProductsAuto: builder.query<
      { data: Product[] },
      ProductRecommend
    >({
      query: ({ userId, inputLimit = 50, recommendQuantity = 5 }) => ({
        url: `${PRODUCT_URL}/suggest-auto?userId=${userId}&inputLimit=${inputLimit}&recommendQuantity=${recommendQuantity}`,
        credentials: "include",
        method: "GET",
      }),
    }),
    getRecommendedProductsWithReason: builder.query<
      { data: Product[] },
      ProductRecommendWithReason
    >({
      query: ({
        userId,
        inputLimit = 50,
        recommendQuantity = 5,
        description,
      }) => ({
        url: `${PRODUCT_URL}/suggest-reason?userId=${userId}&inputLimit=${inputLimit}&recommendQuantity=${recommendQuantity}&description=${description}`,
        credentials: "include",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetRecommendedProductsAutoQuery,
  useLazyGetRecommendedProductsWithReasonQuery,
} = productApiSlice;
