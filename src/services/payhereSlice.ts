import { apiSlice } from "./apiSlice";

export interface PayHereParams {
  sandbox: boolean;
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  hash: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export const payhereApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initPayHere: builder.mutation<
      { success: boolean; paymentParams: PayHereParams },
      { order_id: number }
    >({
      query: (body) => ({
        url: "payhere/init",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useInitPayHereMutation } = payhereApiSlice;
