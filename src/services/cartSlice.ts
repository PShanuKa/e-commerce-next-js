import { apiSlice } from "@/services/apiSlice";

export interface CartItem {
  id: number;
  quantity: number;
  variant?: string | null;
  product_id: number;
  name: string;
  price: number;
  original_price?: number | null;
  stock_qty: number;
  image?: string | null;
}

export interface CartResponse {
  success: boolean;
  items: CartItem[];
  total: string;
  count: number;
}

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      providesTags: ["Cart"],
      query: () => "cart",
    }),
    addToCart: builder.mutation<
      { success: boolean; message: string },
      { product_id: number; quantity?: number; variant?: string }
    >({
      invalidatesTags: ["Cart"],
      query: (body) => ({ url: "cart", method: "POST", body }),
    }),
    updateCartItem: builder.mutation<
      { success: boolean; message: string },
      { productId: number; quantity: number }
    >({
      invalidatesTags: ["Cart"],
      query: ({ productId, quantity }) => ({
        url: `cart/${productId}`,
        method: "PUT",
        body: { quantity },
      }),
    }),
    removeFromCart: builder.mutation<{ success: boolean }, number>({
      invalidatesTags: ["Cart"],
      query: (productId) => ({ url: `cart/${productId}`, method: "DELETE" }),
    }),
    clearCart: builder.mutation<{ success: boolean }, void>({
      invalidatesTags: ["Cart"],
      query: () => ({ url: "cart/clear", method: "DELETE" }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApiSlice;
