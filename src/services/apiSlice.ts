import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  // Send the JWT token from Redux state (or localStorage fallback) as a Bearer token
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.token || localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Auth", "Category", "Product", "Cart"],
  endpoints: () => ({}),
});
