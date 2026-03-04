import { apiSlice } from "@/services/apiSlice";

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  parentId?: number | null;
  isDeleted: boolean;
  createdAt: string;
  product_count: number;
}

interface ListResponse {
  success: boolean;
  categories: Category[];
}
interface SingleResponse {
  success: boolean;
  category: Category;
}
interface CreateBody {
  name: string;
  image_url?: string;
  parent_id?: number;
}
interface UpdateBody {
  name?: string;
  image_url?: string;
  parent_id?: number;
}

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getCategories: builder.query<ListResponse, void>({
      providesTags: ["Category"],
      query: () => "categories",
    }),
    getCategoryBySlug: builder.query<SingleResponse, string>({
      providesTags: (_r, _e, slug) => [{ type: "Category", id: slug }],
      query: (slug) => `categories/${slug}`,
    }),
    // Admin
    getAdminCategories: builder.query<ListResponse, void>({
      providesTags: ["Category"],
      query: () => "categories/admin/all",
    }),
    createCategory: builder.mutation<SingleResponse, CreateBody>({
      invalidatesTags: ["Category"],
      query: (data) => ({ url: "categories", method: "POST", body: data }),
    }),
    updateCategory: builder.mutation<
      SingleResponse,
      { id: number } & UpdateBody
    >({
      invalidatesTags: ["Category"],
      query: ({ id, ...data }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCategory: builder.mutation<{ success: boolean }, number>({
      invalidatesTags: ["Category"],
      query: (id) => ({ url: `categories/${id}`, method: "DELETE" }),
    }),
    restoreCategory: builder.mutation<SingleResponse, number>({
      invalidatesTags: ["Category"],
      query: (id) => ({ url: `categories/${id}/restore`, method: "PATCH" }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
} = categoryApiSlice;
