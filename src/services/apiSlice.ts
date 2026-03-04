import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  //   prepareHeaders: (headers, api) => {
  //     const state = api.getState();
  //     const accessToken = state.auth?.accessToken || localStorage.getItem("accessToken");

  //     if (accessToken) {
  //       headers.set("Authorization", `Bearer ${accessToken}`);
  //     }
  //     return headers;
  //   },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Auth"],
  endpoints: () => ({}),
});
