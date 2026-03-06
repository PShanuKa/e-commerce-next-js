import { apiSlice } from "./apiSlice";

export interface Address {
  id: number;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string | null;
  province: string | null;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  variant: string | null;
}

export interface Order {
  id: number;
  userId: number;
  customer_name: string;
  customer_email: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  deliveryFee: number;
  couponDiscount: number;
  paymentMethod: string;
  createdAt: string;
  item_count: number;
  user?: { name: string; email: string; phone: string | null };
  address?: Address;
  orderItems?: OrderItem[];
}

export const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<
      { success: boolean; orders: Order[] },
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/admin/orders",
        params: params || undefined,
      }),
      providesTags: ["Order"],
    }),
    getAdminOrderById: builder.query<
      { success: boolean; order: Order },
      number
    >({
      query: (id) => `/admin/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: builder.mutation<
      { success: boolean; order: Partial<Order> },
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Order",
        { type: "Order", id },
      ],
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = orderSlice;
