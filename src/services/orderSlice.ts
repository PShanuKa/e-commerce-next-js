import { apiSlice } from "@/services/apiSlice";

/* ─── Types ──────────────────────────────────────── */
export interface PlaceOrderBody {
  address_id?: number;
  payment_method: "cod" | "card" | "bank";
  coupon_discount?: number;
  notes?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  variant?: string | null;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  deliveryFee: number;
  couponDiscount: number;
  paymentMethod: string;
  notes?: string | null;
  createdAt: string;
  item_count?: number;
  orderItems: OrderItem[];
  address?: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    postalCode?: string | null;
    province?: string | null;
  } | null;
}

export interface PlaceOrderResponse {
  success: boolean;
  message: string;
  order: Order;
}

/* ─── RTK Slice ──────────────────────────────────── */
export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation<PlaceOrderResponse, PlaceOrderBody>({
      invalidatesTags: ["Cart"],
      query: (body) => ({ url: "orders", method: "POST", body }),
    }),
    getMyOrders: builder.query<{ success: boolean; orders: Order[] }, void>({
      providesTags: ["Order"],
      query: () => "orders",
    }),
    getOrder: builder.query<{ success: boolean; order: Order }, number>({
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
      query: (id) => `orders/${id}`,
    }),
    cancelOrder: builder.mutation<{ success: boolean }, number>({
      invalidatesTags: ["Order"],
      query: (id) => ({ url: `orders/${id}/cancel`, method: "PUT" }),
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
} = orderApiSlice;
