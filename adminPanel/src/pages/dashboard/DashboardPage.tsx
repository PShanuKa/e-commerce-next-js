import DashboardLayout from "@/components/layout/DashboardLayout";
import Breadcrumb from "@/components/common/Breadcrumb";



import KpiCard2 from "@/components/common/KpiCard2";


import {
  FaCartShopping,
  FaUserGroup,
  FaBoxOpen,
  FaMoneyBillTrendUp,

} from "react-icons/fa6";
import { TableOrder } from "../orders/OrdersPage";

const dummyStats = {
  revenue: { total: "Rs. 450,000", change: "+12.5%", value: 450000 },
  orders: { total: 125, change: "+5.2%", value: 125 },
  customers: { total: 1240, change: "+18%", value: 1240 },
  activeProducts: { total: 45, change: "Stable", value: 45 },
  avgOrderValue: { total: "Rs. 3,600", value: 3600 },
  abandonedCarts: { total: 18, value: 18 },
  pendingOrders: { total: 7, value: 7 },
  refunds: { total: 2, value: 2 },
};



const DashboardPage = () => (
  <DashboardLayout title="Admin Dashboard Overview">
    <Breadcrumb title="Dashboard" path="Dashboard" />

    {/* Row 1: Primary Financial & Sales KPIs */}
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-5">
      <KpiCard2
        className="bg-gradient-to-r from-[#F53B58] to-[#F55E38]"
        title="Total Revenue"
        discription="Past 30 days"
        value={dummyStats.revenue.total}
        icon={<FaMoneyBillTrendUp size={16} />}
      />
      <KpiCard2
        className="bg-gradient-to-r from-[#FB6840] to-[#FBAD40]"
        title="Total Orders"
        discription="Past 30 days"
        value={dummyStats.orders.total}
        icon={<FaCartShopping size={16} />}
      />
      <KpiCard2
        className="bg-gradient-to-r from-[#2DCE8E] to-[#2ECECA]"
        title="Total Customers"
        discription="Active users"
        value={dummyStats.customers.total}
        icon={<FaUserGroup size={16} />}
      />
      <KpiCard2
        className="bg-gradient-to-r from-[#6071E4] to-[#4255D4]"
        title="Active Products"
        discription="In-stock items"
        value={dummyStats.activeProducts.total}
        icon={<FaBoxOpen size={16} />}
      />
    </div>

    <div className="mt-4">
      <TableOrder />
    </div>

  </DashboardLayout>
);
export default DashboardPage;

