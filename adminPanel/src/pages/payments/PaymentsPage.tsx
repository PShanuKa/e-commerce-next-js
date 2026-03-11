import { useState } from "react";
import { useGetAdminPaymentsQuery } from "@/services/paymentSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/common/Breadcrumb";
import TableWrap, {
  TableWrapBody,
  TableWrapFooter,
  TableWrapHeader,
} from "@/components/common/TableWrap";
import {
  Table,
  TableBody,
  TableBodyCell,
  TableBodyRow,
  TableHeaderCell,
  TableHeaderRow,
} from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import { FiDollarSign, FiSearch, FiFilter } from "react-icons/fi";

const PaymentsPage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetAdminPaymentsQuery({
    page: pagination.page,
    limit: pagination.limit,
    status: status || undefined,
  });

  const payments = data?.payments ?? [];
  const meta = data?.meta;

  const handlePageChange = (newPage: number) => {
    setPagination((p) => ({ ...p, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((p) => ({ ...p, limit: newLimit, page: 1 }));
  };

  return (
    <DashboardLayout title="Payments">
      <Breadcrumb title="Payments History" path="Payments" />

      <TableWrap>
        <TableWrapHeader
          title="Payments"
          description="Track and manage all transactions"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border  border-gray-200 rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-(--Primary)/20 focus-within:border-(--Primary) transition-all">
              <FiSearch size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search Transaction ID..."
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-50 border  border-gray-200 rounded-lg px-3 py-1.5 transition-all">
              <FiFilter size={16} className="text-gray-400" />
              <select
                className="bg-transparent border-none outline-none text-sm text-gray-700 cursor-pointer"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </TableWrapHeader>

        <TableWrapBody>
          <Table>
            <TableHeaderRow>
              <TableHeaderCell>Transaction ID</TableHeaderCell>
              <TableHeaderCell>Order ID</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Method</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
            <TableBody>
              {isLoading ? (
                <TableBodyRow>
                  <TableBodyCell colSpan={7} className="py-16 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-(--Primary) border-t-transparent rounded-full animate-spin" />
                    </div>
                  </TableBodyCell>
                </TableBodyRow>
              ) : payments.length === 0 ? (
                <TableBodyRow>
                  <TableBodyCell
                    colSpan={7}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    No payments found.
                  </TableBodyCell>
                </TableBodyRow>
              ) : (
                payments.map((pay) => (
                  <TableBodyRow key={pay.id}>
                    <TableBodyCell className="font-mono text-xs text-gray-500">
                      {pay.transactionId || "INTERNAL-" + pay.id}
                    </TableBodyCell>
                    <TableBodyCell className="font-semibold text-(--Primary)">
                      #{pay.orderId}
                    </TableBodyCell>
                    <TableBodyCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-sm">
                          {pay.order?.user.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {pay.order?.user.email}
                        </span>
                      </div>
                    </TableBodyCell>
                    <TableBodyCell>
                      <span className="font-bold text-gray-900">
                        {pay.currency} {Number(pay.amount).toFixed(2)}
                      </span>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Badge
                        label={pay.paymentMethod.toUpperCase()}
                        variant="secondary"
                        className="text-[10px] font-bold"
                      />
                    </TableBodyCell>
                    <TableBodyCell className="text-xs text-gray-500">
                      {new Date(pay.createdAt).toLocaleString()}
                    </TableBodyCell>
                    <TableBodyCell>
                      <Badge
                        label={pay.status.toUpperCase()}
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
        </TableWrapBody>

        <TableWrapFooter>
          <Pagination
            currentPage={pagination.page}
            totalPages={meta?.pages || 1}
            limit={pagination.limit}
            total={meta?.total || 0}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </TableWrapFooter>
      </TableWrap>
    </DashboardLayout>
  );
};

export default PaymentsPage;
