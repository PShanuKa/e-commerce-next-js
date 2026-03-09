import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdminOrdersQuery } from "@/services/orderSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import { FiEye } from "react-icons/fi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CiFilter } from "react-icons/ci";

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
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const OrdersPage = () => {
  return (
    <DashboardLayout title="Orders">
      <Breadcrumb title="Orders Management" path="Orders" />
      <TableOrder />
    </DashboardLayout>
  );
};

export default OrdersPage;

export const TableOrder = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [filter, setFilter] = useState({
    status: "all",
    search: "",
  });

  const { data, isLoading } = useGetAdminOrdersQuery({
    status: filter.status === "all" ? undefined : filter.status,
    search: filter.search || undefined,
    page: pagination.page,
    limit: pagination.limit,
  });

  const orders = data?.orders ?? [];
  const meta = data?.meta;

  const handlePageChange = (newPage: number) => {
    setPagination((p) => ({ ...p, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((p) => ({ ...p, limit: newLimit, page: 1 }));
  };
  return (
    <TableWrap>
      <TableWrapHeader title="Orders" description="Manage customer orders" />

      <TableWrapBody>
        <div className="w-full border-t border-(--border-color-primary) px-4">
          <div className="h-16 flex items-center justify-between w-1/4 gap-2">
            <p className="text-[12px] text-(--table-body-font-color) font-light">
              Search:
            </p>
            <input
              type="text"
              placeholder="Search"
              value={filter.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full h-[30px] border border-(--border-color-secondary) rounded-(--border-rounded-primary) px-4 text-[12px] text-(--table-body-font-color) outline-none"
            />
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="h-[30px] w-10 border border-(--border-color-secondary) rounded-(--border-rounded-primary) text-[12px] flex items-center justify-center hover:bg-secondary transition-all duration-200"
            >
              <CiFilter size={16} className="text-(--table-body-font-color)" />
            </button>
          </div>
        </div>
      </TableWrapBody>

      <TableWrapBody>
        <div
          className={`w-full border-t border-(--border-color-primary) px-4 transition-all duration-300 ease-in-out overflow-hidden ${
            isFilterOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="h-16 flex items-center gap-3">
            <p className="text-[12px] text-(--table-body-font-color) font-light">
              Filter:
            </p>
            <div className="flex items-center gap-2">
              <Select
                value={filter.status}
                onValueChange={(value) => {
                  setFilter({ ...filter, status: value });
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="h-[30px] w-[180px] text-[12px]  border-gray-200 rounded-(--border-rounded-primary)"
                >
                  <SelectValue placeholder="Select Status" />
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

            <button
              onClick={() => {
                setFilter({ status: "all", search: "" });
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="cursor-pointer h-[30px] px-4 text-[12px] text-(--Primary) underline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </TableWrapBody>

      <TableWrapBody>
        <Table>
          <TableHeaderRow>
            <TableHeaderCell>Order ID</TableHeaderCell>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Total</TableHeaderCell>
            <TableHeaderCell>Items</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-center">ACTION</TableHeaderCell>
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
            ) : orders.length === 0 ? (
              <TableBodyRow>
                <TableBodyCell
                  colSpan={7}
                  className="py-16 text-center text-sm text-gray-400"
                >
                  No orders found.
                </TableBodyCell>
              </TableBodyRow>
            ) : (
              orders.map((order) => (
                <TableBodyRow key={order.id}>
                  <TableBodyCell className="font-semibold text-(--Primary)">
                    #{order.id}
                  </TableBodyCell>
                  <TableBodyCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {order.customer_name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {order.customer_email}
                      </span>
                    </div>
                  </TableBodyCell>
                  <TableBodyCell className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableBodyCell>
                  <TableBodyCell className="font-semibold">
                    Rs. {Number(order.total).toLocaleString()}
                  </TableBodyCell>
                  <TableBodyCell>{order.item_count} items</TableBodyCell>
                  <TableBodyCell>
                    <Badge
                      label={order.status.toUpperCase()}
                      variant={STATUS_VARIANTS[order.status] ?? "default"}
                    />
                  </TableBodyCell>
                  <TableBodyCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/orders/${order.id}`}>
                        <button
                          className="p-1.5 hover:bg-(--Primary)/10 rounded transition-colors"
                          title="View Details"
                        >
                          <FiEye size={18} className="text-(--Primary)" />
                        </button>
                      </Link>
                    </div>
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
  );
};
