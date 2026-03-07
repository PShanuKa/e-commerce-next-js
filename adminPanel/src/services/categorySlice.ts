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

interface SingleResponse {
  success: boolean;
  category: Category;
}
interface CreateBody {
  name: string;
  image_url?: string;
}
interface UpdateBody {
  name?: string;
  image_url?: string;
}

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCategories: builder.query<
      { success: boolean; categories: Category[]; meta: any },
      { page?: number; limit?: number } | void
    >({
      providesTags: ["Category"],
      query: (params) => ({
        url: "categories/admin/all",
        params: params || undefined,
      }),
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
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
} = categoryApiSlice;
