import { useState } from "react";
import { useGetAdminUsersQuery } from "@/services/userSlice";
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
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiPlus,
  FiEdit,
  FiEye,
} from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CustomersPage = () => {
  const navigate = useNavigate();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [filter, setFilter] = useState({
    search: "",
    role: "",
    isActive: "",
  });

  const { data, isLoading } = useGetAdminUsersQuery({
    page: pagination.page,
    limit: pagination.limit,
    search: filter.search || undefined,
    role: filter.role || undefined,
    isActive: filter.isActive || undefined,
  });

  const users = data?.users ?? [];
  const meta = data?.meta;

  const handlePageChange = (newPage: number) => {
    setPagination((p) => ({ ...p, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((p) => ({ ...p, limit: newLimit, page: 1 }));
  };

  const clearFilters = () => {
    setFilter({ search: "", role: "", isActive: "" });
    setPagination((p) => ({ ...p, page: 1 }));
  };

  return (
    <DashboardLayout title="Customers">
      <Breadcrumb title="Customers Management" path="Customers" />

      <TableWrap>
        <TableWrapHeader
          title="Customers"
          description="View and manage your registered customers"
        >
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate("/customers/add")}
          >
            <FiPlus size={16} /> New Customer
          </Button>
        </TableWrapHeader>

        {/* Search Bar Row */}
        <TableWrapBody>
          <div className="w-full border-t border-(--border-color-primary) px-4">
            <div className="h-16 flex items-center justify-between w-1/4 gap-2">
              <p className="text-[12px] text-(--table-body-font-color) font-light">
                Search:
              </p>
              <input
                type="text"
                placeholder="Name, email or phone..."
                value={filter.search}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, search: e.target.value }))
                }
                className="w-full h-[30px] border border-(--border-color-secondary) rounded-(--border-rounded-primary) px-4 text-[12px] text-(--table-body-font-color) outline-none"
              />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="h-[30px] w-10 border border-(--border-color-secondary) rounded-(--border-rounded-primary) text-[12px] flex items-center justify-center hover:bg-secondary transition-all duration-200"
              >
                <CiFilter
                  size={16}
                  className="text-(--table-body-font-color) transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </TableWrapBody>

        {/* Filter Drawer */}
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

              {/* Role Filter */}
              <Select
                value={filter.role}
                onValueChange={(val) => setFilter((f) => ({ ...f, role: val }))}
              >
                <SelectTrigger
                  size="sm"
                  className="h-[30px] w-[180px] text-[12px] border-gray-200 rounded-(--border-rounded-primary)"
                >
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={filter.isActive}
                onValueChange={(val) =>
                  setFilter((f) => ({ ...f, isActive: val }))
                }
              >
                <SelectTrigger
                  size="sm"
                  className="h-[30px] w-[180px] text-[12px] border-gray-200 rounded-(--border-rounded-primary)"
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Button */}
              <button
                onClick={clearFilters}
                className="cursor-pointer h-[30px] px-4 text-[12px] text-(--Primary) underline rounded-(--border-rounded-primary)"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </TableWrapBody>

        <TableWrapBody>
          <Table>
            <TableHeaderRow>
              <TableHeaderCell>Customer ID</TableHeaderCell>
              <TableHeaderCell>Customer Info</TableHeaderCell>
              <TableHeaderCell>Contact Details</TableHeaderCell>
              <TableHeaderCell>Joined Date</TableHeaderCell>
              <TableHeaderCell>Orders</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell className="text-center">Action</TableHeaderCell>
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
              ) : users.length === 0 ? (
                <TableBodyRow>
                  <TableBodyCell
                    colSpan={7}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    No customers found.
                  </TableBodyCell>
                </TableBodyRow>
              ) : (
                users.map((user) => (
                  <TableBodyRow key={user.id}>
                    <TableBodyCell className="font-semibold text-(--Primary)">
                      #{user.id}
                    </TableBodyCell>
                    <TableBodyCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>
                    </TableBodyCell>
                    <TableBodyCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <FiMail size={12} className="text-(--Primary)" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                            <FiPhone size={11} />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableBodyCell>
                    <TableBodyCell>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FiCalendar size={12} />
                        <span>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableBodyCell>
                    <TableBodyCell>
                      <span className="font-semibold bg-(--Primary)/5 text-(--Primary) px-3 py-1 rounded-full text-xs border border-(--Primary)/10">
                        {user.order_count} Orders
                      </span>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Badge
                        label={user.isActive ? "ACTIVE" : "INACTIVE"}
                        variant={user.isActive ? "success" : "danger"}
                      />
                    </TableBodyCell>
                    <TableBodyCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/customers/${user.id}`}>
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded text-(--Primary) transition-colors"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                        </Link>
                        <Link to={`/customers/${user.id}/edit`}>
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                            title="Edit"
                          >
                            <FiEdit size={16} />
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
    </DashboardLayout>
  );
};

export default CustomersPage;
