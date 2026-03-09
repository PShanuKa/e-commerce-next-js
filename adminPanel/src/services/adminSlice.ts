import { apiSlice } from "./apiSlice";

export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  delivered_orders: number;
  total_customers: number;
  total_products: number;
  total_revenue: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
}

export const adminSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => "/admin/stats",
      providesTags: ["Order", "User", "Product"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = adminSlice;
