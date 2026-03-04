import { apiSlice } from "@/services/apiSlice";


export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      invalidatesTags: ["Auth"],
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      invalidatesTags: ["Auth"],
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query({
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
