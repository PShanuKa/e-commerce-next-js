import {
  MdAttachMoney,
  MdShoppingCart,
  MdPeople,
  MdInventory2,
} from "react-icons/md";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

// ── Mock recent orders ────────────────────────────────────────────────────────
const recentOrders = [
  {
    id: "#ORD-1042",
    customer: "Kasun Perera",
    amount: "LKR 4,500",
    status: "Delivered",
    date: "Mar 3, 2025",
  },
  {
    id: "#ORD-1041",
    customer: "Nimali Silva",
    amount: "LKR 12,800",
    status: "Processing",
    date: "Mar 3, 2025",
  },
  {
    id: "#ORD-1040",
    customer: "Dilshan Fernando",
    amount: "LKR 2,250",
    status: "Pending",
    date: "Mar 2, 2025",
  },
  {
    id: "#ORD-1039",
    customer: "Ayesha Mendis",
    amount: "LKR 8,700",
    status: "Delivered",
    date: "Mar 2, 2025",
  },
  {
    id: "#ORD-1038",
    customer: "Ruwan Jayasinghe",
    amount: "LKR 1,600",
    status: "Cancelled",
    date: "Mar 1, 2025",
  },
];

const statusVariant: Record<string, "success" | "warning" | "danger" | "info"> =
  {
    Delivered: "success",
    Processing: "info",
    Pending: "warning",
    Cancelled: "danger",
  };

// ── Top products ──────────────────────────────────────────────────────────────
const topProducts = [
  { name: "iPhone 15 Pro Case", sales: 142, revenue: "LKR 142,000" },
  { name: "USB-C Hub 7-in-1", sales: 98, revenue: "LKR 88,200" },
  { name: "Wireless Earbuds Pro", sales: 87, revenue: "LKR 261,000" },
  { name: "Laptop Stand Aluminum", sales: 64, revenue: "LKR 64,000" },
];

const DashboardPage = () => (
  <DashboardLayout title="Dashboard">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      <StatCard
        label="Total Revenue"
        value="LKR 2.4M"
        change="+12.5% vs last month"
        changeType="up"
        icon={<MdAttachMoney size={22} className="text-indigo-600" />}
        iconBg="bg-indigo-100"
      />
      <StatCard
        label="Total Orders"
        value="1,042"
        change="+8.2% vs last month"
        changeType="up"
        icon={<MdShoppingCart size={22} className="text-emerald-600" />}
        iconBg="bg-emerald-100"
      />
      <StatCard
        label="Customers"
        value="3,280"
        change="+5.1% vs last month"
        changeType="up"
        icon={<MdPeople size={22} className="text-amber-600" />}
        iconBg="bg-amber-100"
      />
      <StatCard
        label="Products"
        value="248"
        change="4 low stock"
        changeType="down"
        icon={<MdInventory2 size={22} className="text-red-500" />}
        iconBg="bg-red-100"
      />
    </div>

    {/* Main grid */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Recent Orders */}
      <Card className="xl:col-span-2">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Recent Orders</h2>
          <a
            href="/orders"
            className="text-xs text-indigo-600 hover:underline font-medium"
          >
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-6 py-3 text-left font-medium">Order</th>
                <th className="px-6 py-3 text-left font-medium">Customer</th>
                <th className="px-6 py-3 text-left font-medium">Amount</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-3.5 font-mono text-indigo-600 font-medium text-xs">
                    {order.id}
                  </td>
                  <td className="px-6 py-3.5 text-gray-700">
                    {order.customer}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-gray-800">
                    {order.amount}
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge
                      label={order.status}
                      variant={statusVariant[order.status]}
                    />
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 text-xs">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top Products */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Top Products</h2>
        </div>
        <div className="px-6 py-2 divide-y divide-gray-50">
          {topProducts.map((p, i) => (
            <div
              key={p.name}
              className="py-3.5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm text-gray-700 font-medium leading-tight">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400">{p.sales} sold</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-600 shrink-0">
                {p.revenue}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </DashboardLayout>
);

export default DashboardPage;
