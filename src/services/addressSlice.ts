import { apiSlice } from "@/services/apiSlice";

/* ─── Types ──────────────────────────────────────── */
export interface Address {
  id: number;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  postalCode?: string | null;
  province?: string | null;
  isDefault: boolean;
  createdAt?: string;
}

export interface AddressesResponse {
  success: boolean;
  addresses: Address[];
}

export interface AddressResponse {
  success: boolean;
  address: Address;
}

export interface AddressBody {
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code?: string;
  province?: string;
  is_default?: boolean;
}

/* ─── RTK Slice ──────────────────────────────────── */
export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressesResponse, void>({
      providesTags: ["Address"],
      query: () => "addresses",
    }),
    addAddress: builder.mutation<AddressResponse, AddressBody>({
      invalidatesTags: ["Address"],
      query: (body) => ({ url: "addresses", method: "POST", body }),
    }),
    updateAddress: builder.mutation<
      AddressResponse,
      { id: number } & Partial<AddressBody>
    >({
      invalidatesTags: ["Address"],
      query: ({ id, ...body }) => ({
        url: `addresses/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteAddress: builder.mutation<{ success: boolean }, number>({
      invalidatesTags: ["Address"],
      query: (id) => ({ url: `addresses/${id}`, method: "DELETE" }),
    }),
    setDefaultAddress: builder.mutation<AddressResponse, number>({
      invalidatesTags: ["Address"],
      query: (id) => ({ url: `addresses/${id}/default`, method: "PUT" }),
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApiSlice;
