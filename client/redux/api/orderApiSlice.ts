import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "../constant";

interface Order {
  _id: string;
  user: string;
  orderItems: {
    product: string;
    name: string;
    image: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
  }[];
  address: {
    _id: string;
    user: string;
    fullName: string;
    phone: string;
    location: string;
    city: string;
    country: string;
    isDefault: boolean;
  };
  paymentMethod: string;
  totalPrice: number;
  coupon: string;
  priceAfterDiscount: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  status: string;
}

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<{ data: { orders: Order[] } }, void>({
      query: () => ({ url: `${ORDER_URL}`, credentials: "include" }),
    }),
    getOrdersByUserId: builder.query<{ data: { orders: Order[] } }, string>({
      query: (userId) => ({
        url: `${ORDER_URL}/user/${userId}`,
        credentials: "include",
      }),
    }),
    getOrderById: builder.query<{ data: Order }, string>({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}`,
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery, useGetOrdersByUserIdQuery } = orderApiSlice;
