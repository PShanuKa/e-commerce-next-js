import { apiSlice } from "./apiSlice";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  order_count: number;
}

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<
      { success: boolean; users: User[]; meta: any },
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/admin/users",
        params: params || undefined,
      }),
      providesTags: ["User"],
    }),
    createCustomer: builder.mutation<
      { success: boolean; user: Partial<User> },
      any
    >({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateCustomer: builder.mutation<
      { success: boolean; user: Partial<User> },
      { id: number; [key: string]: any }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getAdminUserById: builder.query<{ success: boolean; user: any }, number>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetAdminUserByIdQuery,
} = userSlice;
