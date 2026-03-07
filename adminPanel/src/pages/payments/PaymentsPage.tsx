import { useState } from "react";
import { useGetAdminPaymentsQuery } from "@/services/paymentSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  MdReceipt,
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

const PaymentsPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { data, isLoading, isError } = useGetAdminPaymentsQuery({
    page,
    status: status || undefined,
  });

  const getStatusVariant = (
    status: string,
  ): "success" | "danger" | "warning" | "info" | "default" => {
    switch (status.toLowerCase()) {
      case "success":
        return "success";
      case "failed":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const payments = data?.payments ?? [];
  const pagination = data?.pagination;

  return (
    <DashboardLayout title="Payment History">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-64">
          <MdSearch size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-red-500">
            Failed to load payments.
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="px-6 py-3 text-left font-medium">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Customer</th>
                  <th className="px-6 py-3 text-left font-medium">Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Method</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                          <MdReceipt size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {payment.transactionId || `PAY-${payment.id}`}
                          </p>
                          <p className="text-xs text-gray-400">
                            Order #{payment.orderId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-gray-800">
                        {payment.order?.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.order?.user.email}
                      </p>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-gray-800">
                        {payment.currency}{" "}
                        {Number(payment.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 capitalize text-gray-600">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge
                        label={payment.status}
                        variant={getStatusVariant(payment.status)}
                      />
                    </td>
                    <td className="px-6 py-3.5 text-gray-400 text-xs">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-50">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MdChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {pagination.totalPages} · {pagination.total}{" "}
                  transactions
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MdChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default PaymentsPage;
