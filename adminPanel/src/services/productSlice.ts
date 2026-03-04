import { apiSlice } from "@/services/apiSlice";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  stockQty: number;
  categoryId?: number | null;
  category_name?: string | null;
  category_slug?: string | null;
  brand?: string | null;
  badge?: string | null;
  availability: "in_stock" | "ships_2_3_days" | "pre_order";
  isActive: boolean;
  image?: string | null;
  createdAt: string;
}

export interface ProductMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
export interface ProductListResponse {
  success: boolean;
  products: Product[];
  meta: ProductMeta;
}
export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: "price_asc" | "price_desc" | "created_at";
  minPrice?: number;
  maxPrice?: number;
  availability?: string;
}

interface CreateBody {
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  stock_qty: number;
  category_id?: number | null;
  brand?: string;
  badge?: string;
  availability?: string;
  images?: string[];
}
interface UpdateBody extends Partial<CreateBody> {
  id: number;
  is_active?: boolean;
}

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query<ProductListResponse, ProductFilters>({
      providesTags: ["Product"],
      query: (filters) => {
        const p = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
          if (v != null && v !== "") p.set(k, String(v));
        });
        return `products/admin/all?${p.toString()}`;
      },
    }),
    createProduct: builder.mutation<
      { success: boolean; product: Product },
      CreateBody
    >({
      invalidatesTags: ["Product"],
      query: (data) => ({ url: "products", method: "POST", body: data }),
    }),
    updateProduct: builder.mutation<
      { success: boolean; product: Product },
      UpdateBody
    >({
      invalidatesTags: ["Product"],
      query: ({ id, ...data }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation<{ success: boolean }, number>({
      invalidatesTags: ["Product"],
      query: (id) => ({ url: `products/${id}`, method: "DELETE" }),
    }),
  }),
});

export const {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
