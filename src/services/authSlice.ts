import { apiSlice } from "@/services/apiSlice";

// ─── Request Types ────────────────────────────────────────────────────────────

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// ─── Slice ────────────────────────────────────────────────────────────────────

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<unknown, LoginRequest>({
      invalidatesTags: ["Auth"],
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation<unknown, RegisterRequest>({
      invalidatesTags: ["Auth"],
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query<unknown, void>({
      providesTags: ["Auth"],
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
    }),
    
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } =
  authSlice;
