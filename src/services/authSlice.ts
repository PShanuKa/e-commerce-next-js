import { apiSlice } from "@/services/apiSlice";
import type { AuthUser } from "@/features/authSlice";

/* ─── Types ──────────────────────────────────────── */
export interface MeResponse {
  success: boolean;
  user: AuthUser;
}

export interface UpdateMeBody {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  token: string;
  password: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

/* ─── RTK endpoints ──────────────────────────────── */
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      invalidatesTags: ["Auth"],
      query: (data) => ({ url: "auth/login", method: "POST", body: data }),
    }),
    register: builder.mutation({
      invalidatesTags: ["Auth"],
      query: (data) => ({ url: "auth/register", method: "POST", body: data }),
    }),
    getMe: builder.query<MeResponse, void>({
      providesTags: ["Auth"],
      query: () => "auth/me",
    }),
    updateMe: builder.mutation<MeResponse, UpdateMeBody>({
      invalidatesTags: ["Auth"],
      query: (body) => ({ url: "auth/me", method: "PUT", body }),
    }),
    changePassword: builder.mutation<
      { success: boolean; message: string },
      ChangePasswordBody
    >({
      query: (body) => ({ url: "auth/me/password", method: "PUT", body }),
    }),
    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordBody>({
      query: (body) => ({
        url: "auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<MessageResponse, ResetPasswordBody>({
      query: (body) => ({
        url: "auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
