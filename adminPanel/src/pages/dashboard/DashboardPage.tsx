import DashboardLayout from "@/components/layout/DashboardLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import KpiCard2 from "@/components/common/KpiCard2";

import {
  FaCartShopping,
  FaUserGroup,
  FaBoxOpen,
  FaMoneyBillTrendUp,
  FaClockRotateLeft,
  FaCircleCheck,
} from "react-icons/fa6";
import { TableOrder } from "../orders/OrdersPage";
import { useGetDashboardStatsQuery } from "@/services/adminSlice";

const SkeletonCard = () => (
  <div className="rounded-md p-5 bg-white shadow-sm animate-pulse">
    <div className="flex justify-between">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
        <div className="h-5 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-12 w-12 bg-gray-200 rounded-full" />
    </div>
    <div className="mt-3 flex gap-2">
      <div className="h-3 bg-gray-200 rounded w-8" />
      <div className="h-3 bg-gray-200 rounded w-28" />
    </div>
  </div>
);

const DashboardPage = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  const stats = data?.stats;

  return (
    <DashboardLayout title="Admin Dashboard Overview">
      <Breadcrumb title="Dashboard" path="Dashboard" />

      {isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          ⚠️ Dashboard stats load කිරීමට අපොහොසත් විය. නැවත refresh කරන්න.
        </div>
      )}

      {/* Row 1: Primary KPIs */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-5">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <KpiCard2
              className="bg-gradient-to-r from-[#F53B58] to-[#F55E38]"
              title="Total Revenue"
              discription="from all non-cancelled orders"
              value={stats?.total_revenue ?? 0}
              icon={<FaMoneyBillTrendUp size={16} />}
              prefix="Rs. "
              decimals={2}
            />
            <KpiCard2
              className="bg-gradient-to-r from-[#FB6840] to-[#FBAD40]"
              title="Total Orders"
              discription="all time orders"
              value={stats?.total_orders ?? 0}
              icon={<FaCartShopping size={16} />}
            />
            <KpiCard2
              className="bg-gradient-to-r from-[#2DCE8E] to-[#2ECECA]"
              title="Total Customers"
              discription="registered customers"
              value={stats?.total_customers ?? 0}
              icon={<FaUserGroup size={16} />}
            />
          </>
        )}
      </div>

      {/* Row 2: Secondary KPIs */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <KpiCard2
              className="bg-gradient-to-r from-[#6071E4] to-[#4255D4]"
              title="Active Products"
              discription="in-stock items"
              value={stats?.total_products ?? 0}
              icon={<FaBoxOpen size={16} />}
            />
            <KpiCard2
              className="bg-gradient-to-r from-[#F7B731] to-[#F0932B]"
              title="Pending Orders"
              discription="awaiting processing"
              value={stats?.pending_orders ?? 0}
              icon={<FaClockRotateLeft size={16} />}
            />
            <KpiCard2
              className="bg-gradient-to-r from-[#20BF6B] to-[#0FB9B1]"
              title="Delivered Orders"
              discription="successfully completed"
              value={stats?.delivered_orders ?? 0}
              icon={<FaCircleCheck size={16} />}
            />
          </>
        )}
      </div>

      <div className="mt-4">
        <TableOrder />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
