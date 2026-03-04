import { apiSlice } from "@/services/apiSlice";

export interface WishlistItem {
  id: number;
  created_at: string;
  product_id: number;
  name: string;
  price: number;
  original_price?: number | null;
  badge?: string | null;
  image?: string | null;
}

export interface WishlistResponse {
  success: boolean;
  wishlist: WishlistItem[];
}

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistResponse, void>({
      providesTags: ["Wishlist"],
      query: () => "wishlist",
    }),
    addToWishlist: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      invalidatesTags: ["Wishlist"],
      query: (productId) => ({ url: `wishlist/${productId}`, method: "POST" }),
    }),
    removeFromWishlist: builder.mutation<{ success: boolean }, number>({
      invalidatesTags: ["Wishlist"],
      query: (productId) => ({
        url: `wishlist/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;
