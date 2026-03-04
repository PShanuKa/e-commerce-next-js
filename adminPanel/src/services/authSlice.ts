import { apiSlice } from "@/services/apiSlice";
import type { AdminUser } from "@/features/authSlice";

interface LoginRequest {
  email: string;
  password: string;
}
interface LoginResponse {
  success: boolean;
  token: string;
  user: AdminUser;
}
interface MeResponse {
  success: boolean;
  user: AdminUser;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<LoginResponse, LoginRequest>({
      invalidatesTags: ["Auth"],
      query: (data) => ({ url: "auth/login", method: "POST", body: data }),
    }),
    getMe: builder.query<MeResponse, void>({
      providesTags: ["Auth"],
      query: () => ({ url: "auth/me", method: "GET" }),
    }),
  }),
});

export const { useAdminLoginMutation, useGetMeQuery } = authApiSlice;
