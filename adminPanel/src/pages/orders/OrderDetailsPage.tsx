import { useParams, Link } from "react-router-dom";
import {
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  type OrderItem,
} from "@/services/orderSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  MdChevronLeft,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdAccessTime,
  MdPayment,
} from "react-icons/md";

const STATUS_VARIANTS: Record<
  string,
  "default" | "warning" | "info" | "success" | "danger"
> = {
  pending: "default",
  processing: "info",
  shipped: "warning",
  delivered: "success",
  cancelled: "danger",
};

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetAdminOrderByIdQuery(Number(id));
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  if (isLoading) {
    return (
      <DashboardLayout title="Order Details">
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data?.success || !data.order) {
    return (
      <DashboardLayout title="Order Details">
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">Failed to load order details.</p>
          <Link to="/orders">
            <Button variant="secondary">Back to Orders</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { order } = data;

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({ id: order.id, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <DashboardLayout title={`Order #${order.id}`}>
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <MdChevronLeft size={20} />
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="font-bold text-gray-800">
                Order Items ({order.orderItems?.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {order.orderItems?.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="px-6 py-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.variant || "No variant"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      Rs. {Number(item.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50/50 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>
                  Rs.{" "}
                  {Number(
                    order.total - order.deliveryFee + order.couponDiscount,
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span>Rs. {Number(order.deliveryFee).toLocaleString()}</span>
              </div>
              {Number(order.couponDiscount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount</span>
                  <span>
                    - Rs. {Number(order.couponDiscount).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-indigo-600">
                  Rs. {Number(order.total).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <MdLocationOn className="text-indigo-500" size={20} />
              <h3 className="font-bold text-gray-800">Shipping Address</h3>
            </div>
            {order.address ? (
              <div className="px-6 py-5 space-y-3">
                <div>
                  <p className="font-bold text-gray-800 text-lg">
                    {order.address.name}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MdPhone size={16} />
                    <span className="text-sm">{order.address.phone}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine2 && (
                    <p>{order.address.addressLine2}</p>
                  )}
                  <p>
                    {order.address.city}, {order.address.postalCode}
                  </p>
                  <p>{order.address.province}</p>
                </div>
              </div>
            ) : (
              <div className="px-6 py-5 text-gray-500 italic text-sm">
                No shipping address provided.
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Order Status
                </label>
                <div className="flex items-center justify-between gap-4">
                  <Badge
                    label={order.status.toUpperCase()}
                    variant={STATUS_VARIANTS[order.status] ?? "default"}
                  />
                  <select
                    value={order.status}
                    disabled={isUpdating}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MdAccessTime size={18} />
                    <span>Ordered On</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MdPayment size={18} />
                    <span>Payment</span>
                  </div>
                  <span className="font-medium text-gray-800 uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Customer Card */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <h3 className="font-bold text-gray-800">Customer Info</h3>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                  {order.user?.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 truncate">
                    {order.user?.name}
                  </p>
                  <p className="text-gray-500 truncate">{order.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MdEmail className="shrink-0" size={16} />
                <span className="truncate">{order.user?.email}</span>
              </div>
              {order.user?.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MdPhone className="shrink-0" size={16} />
                  <span>{order.user.phone}</span>
                </div>
              )}
              <Link to={`/customers`} className="block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-indigo-600 border border-indigo-100 mt-2"
                >
                  View Customer History
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailsPage;
