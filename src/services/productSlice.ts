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
  image?: string | null; // first image (from list endpoint)
  images?: string[]; // all images (from single product endpoint)
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

interface CreateProductBody {
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  stock_qty: number;
  category_id?: number;
  brand?: string;
  badge?: string;
  availability?: string;
  images?: string[];
}

interface UpdateProductBody extends Partial<CreateProductBody> {
  id: number;
  is_active?: boolean;
}

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getProducts: builder.query<ProductListResponse, ProductFilters>({
      providesTags: ["Product"],
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== "" && v !== null)
            params.set(k, String(v));
        });
        return `products?${params.toString()}`;
      },
    }),
    getProduct: builder.query<{ success: boolean; product: Product }, number>({
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
      query: (id) => `products/${id}`,
    }),
    // Admin
    getAdminProducts: builder.query<ProductListResponse, ProductFilters>({
      providesTags: ["Product"],
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== "" && v !== null)
            params.set(k, String(v));
        });
        return `products/admin/all?${params.toString()}`;
      },
    }),
    createProduct: builder.mutation<
      { success: boolean; product: Product },
      CreateProductBody
    >({
      invalidatesTags: ["Product"],
      query: (data) => ({ url: "products", method: "POST", body: data }),
    }),
    updateProduct: builder.mutation<
      { success: boolean; product: Product },
      UpdateProductBody
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
  useGetProductsQuery,
  useGetProductQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
