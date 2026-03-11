import { apiSlice } from "./apiSlice";

export interface Payment {
  id: number;
  orderId: number;
  paymentMethod: string;
  transactionId: string | null;
  amount: number;
  currency: string;
  status: string;
  payhereStatus: number | null;
  payhereMessage: string | null;
  payhereReference: string | null;
  createdAt: string;
  order?: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export const paymentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPayments: builder.query<
      { success: boolean; payments: Payment[]; meta: any },
      { status?: string; page?: number; limit?: number; orderId?: number } | void
    >({
      query: (params) => ({
        url: "/payments",
        params: params || undefined,
      }),
      providesTags: ["Order"], // Re-using Order tag or could add Payment tag to apiSlice
    }),
    getAdminPaymentById: builder.query<
      { success: boolean; payment: Payment },
      number
    >({
      query: (id) => `/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const { useGetAdminPaymentsQuery, useGetAdminPaymentByIdQuery } =
  paymentSlice;
