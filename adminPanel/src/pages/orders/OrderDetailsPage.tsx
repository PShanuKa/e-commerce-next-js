import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  type OrderItem,
} from "@/services/orderSlice";
import { useGetAdminPaymentsQuery } from "@/services/paymentSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdAccessTime,
  MdPayment,
  MdHistory,
} from "react-icons/md";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiArrowLeft } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableBodyCell,
  TableBodyRow,
  TableHeaderCell,
  TableHeaderRow,
} from "@/components/common/Table";

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
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAdminOrderByIdQuery(Number(id));
  const { data: paymentsData, isLoading: paymentsLoading } =
    useGetAdminPaymentsQuery({ orderId: Number(id) });
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const orderPayments = paymentsData?.payments || [];

  if (isLoading) {
    return (
      <DashboardLayout title="Order Details">
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-(--Primary) border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data?.success || !data.order) {
    return (
      <DashboardLayout title="Order Details">
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">Failed to load order details.</p>
          <Button onClick={() => navigate("/orders")} variant="secondary">
            Back to Orders
          </Button>
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
      <Breadcrumb title={`Order #${order.id}`} path="Orders " />

      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-sm text-(--font-color-secondary) hover:text-(--Primary) transition-all"
        >
          <FiArrowLeft size={16} />
          Back to Orders
        </button>

        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-(--font-color-secondary)">
            Status:
          </p>
          <Select
            value={order.status}
            disabled={isUpdating}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px] h-[35px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-(--border-color-primary) overflow-hidden">
            <div className="px-6 py-4 border-b border-(--border-color-primary) bg-gray-50/30">
              <h3 className="font-semibold text-(--font-color-primary)">
                Order Items ({order.orderItems?.length})
              </h3>
            </div>
            <div className="divide-y divide-(--border-color-primary)">
              {order.orderItems?.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="px-6 py-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-md bg-white border border-(--border-color-secondary) p-1 overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <span className="text-gray-400 text-[10px]">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-(--font-color-primary) text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-(--font-color-secondary)">
                      {item.variant || "Standard Edition"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-(--font-color-primary) text-sm">
                      Rs. {Number(item.price).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-(--font-color-secondary)">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 bg-gray-50/20 border-t border-(--border-color-primary) space-y-3">
              <div className="flex justify-between text-sm text-(--font-color-secondary)">
                <span>Subtotal</span>
                <span>
                  Rs.{" "}
                  {Number(
                    order.total - order.deliveryFee + order.couponDiscount,
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-(--font-color-secondary)">
                <span>Delivery Fee</span>
                <span>Rs. {Number(order.deliveryFee).toLocaleString()}</span>
              </div>
              {Number(order.couponDiscount) > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>Coupon Discount</span>
                  <span>
                    - Rs. {Number(order.couponDiscount).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-(--font-color-primary) pt-3 border-t border-(--border-color-primary)">
                <span>Total Amount</span>
                <span className="text-(--Primary)">
                  Rs. {Number(order.total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-(--border-color-primary)">
            <div className="px-6 py-4 border-b border-(--border-color-primary) flex items-center gap-2">
              <MdLocationOn className="text-(--Primary)" size={18} />
              <h3 className="font-semibold text-(--font-color-primary)">
                Shipping Address
              </h3>
            </div>
            {order.address ? (
              <div className="px-6 py-5 text-sm">
                <p className="font-bold text-(--font-color-primary) mb-2">
                  {order.address.name}
                </p>
                <div className="space-y-1 text-(--font-color-secondary)">
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine2 && (
                    <p>{order.address.addressLine2}</p>
                  )}
                  <p>
                    {order.address.city}, {order.address.postalCode}
                  </p>
                  <p>{order.address.province}</p>
                  <p className="flex items-center gap-2 mt-2 font-medium text-(--font-color-primary)">
                    <MdPhone size={14} />
                    {order.address.phone}
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-6 py-5 text-gray-400 italic text-sm">
                No shipping address provided.
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-(--border-color-primary) overflow-hidden max-w-full overflow-x-auto">
            <div className="px-6 py-4 border-b border-(--border-color-primary) bg-gray-50/30 flex items-center gap-2">
              <MdHistory className="text-(--Primary)" size={18} />
              <h3 className="font-semibold text-(--font-color-primary)">
                Payment Transactions
              </h3>
            </div>
            <Table>
              <TableHeaderRow>
                <TableHeaderCell className="text-[10px] uppercase">
                  ID
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] uppercase">
                  Method
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] uppercase">
                  Amount
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] uppercase">
                  Date
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] uppercase text-right">
                  Status
                </TableHeaderCell>
              </TableHeaderRow>
              <TableBody>
                {paymentsLoading ? (
                  <TableBodyRow>
                    <TableBodyCell colSpan={5} className="py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-(--Primary) border-t-transparent rounded-full animate-spin" />
                      </div>
                    </TableBodyCell>
                  </TableBodyRow>
                ) : orderPayments.length === 0 ? (
                  <TableBodyRow>
                    <TableBodyCell
                      colSpan={5}
                      className="py-8 text-center text-xs text-gray-400"
                    >
                      No payments recorded for this order.
                    </TableBodyCell>
                  </TableBodyRow>
                ) : (
                  orderPayments.map((pay: any) => (
                    <TableBodyRow key={pay.id}>
                      <TableBodyCell className="font-mono text-[10px] text-gray-500">
                        {pay.transactionId || "INTERNAL-" + pay.id}
                      </TableBodyCell>
                      <TableBodyCell>
                        <Badge
                          label={pay.paymentMethod.toUpperCase()}
                          variant="info"
                          className="text-[9px] font-bold"
                        />
                      </TableBodyCell>
                      <TableBodyCell className="text-xs font-semibold">
                        {pay.currency} {Number(pay.amount).toFixed(2)}
                      </TableBodyCell>
                      <TableBodyCell className="text-[10px] text-gray-400">
                        {new Date(pay.createdAt).toLocaleString()}
                      </TableBodyCell>
                      <TableBodyCell className="text-right">
                        <Badge
                          label={pay.status.toUpperCase()}
                          className="text-[9px]"
                          variant={
                            pay.status === "success"
                              ? "success"
                              : pay.status === "pending"
                                ? "warning"
                                : "danger"
                          }
                        />
                      </TableBodyCell>
                    </TableBodyRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-(--border-color-primary) p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              General Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-(--font-color-secondary)">
                  <MdAccessTime size={16} />
                  <span>Ordered Date</span>
                </div>
                <span className="font-medium text-(--font-color-primary)">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-(--font-color-secondary)">
                  <MdPayment size={16} />
                  <span>Payment Info</span>
                </div>
                <span className="font-medium text-(--font-color-primary) uppercase">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-(--font-color-secondary)">
                  <MdHistory size={16} />
                  <span>Payment Status</span>
                </div>
                <span
                  className={`font-bold ${
                    orderPayments.some((p: any) => p.status === "success")
                      ? "text-green-600"
                      : orderPayments.some((p: any) => p.status === "pending")
                        ? "text-orange-500"
                        : "text-red-500"
                  }`}
                >
                  {orderPayments.some((p: any) => p.status === "success")
                    ? "Paid"
                    : orderPayments.some((p: any) => p.status === "pending")
                      ? "Pending"
                      : "Unpaid"}
                </span>
              </div>
              <div className="pt-2">
                <Badge
                  label={order.status.toUpperCase()}
                  variant={STATUS_VARIANTS[order.status] ?? "default"}
                  className="w-full justify-center py-1 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-(--border-color-primary) p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Customer Details
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-(--Primary)/10 flex items-center justify-center text-(--Primary) font-bold shrink-0">
                {order.user?.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-(--font-color-primary) text-sm truncate">
                  {order.user?.name}
                </p>
                <p className="text-xs text-(--font-color-secondary) truncate">
                  {order.user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-(--border-color-primary)">
              <div className="flex items-center gap-2 text-xs text-(--font-color-secondary)">
                <MdEmail size={14} className="shrink-0" />
                <span className="truncate">{order.user?.email}</span>
              </div>
              {order.user?.phone && (
                <div className="flex items-center gap-2 text-xs text-(--font-color-secondary)">
                  <MdPhone size={14} className="shrink-0" />
                  <span>{order.user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailsPage;
