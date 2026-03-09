import { useState } from "react";
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
  type Product,
} from "@/services/productSlice";
import { useGetAdminCategoriesQuery } from "@/services/categorySlice";
import DashboardLayout from "@/components/layout/DashboardLayout";

import Badge from "@/components/ui/Badge";
import Button from "@/components/common/Button";
import { MdAdd, MdSearch } from "react-icons/md";
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
import { Link } from "react-router-dom";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import Breadcrumb from "@/components/common/Breadcrumb";
import Pagination from "@/components/common/Pagination";
import { CiFilter } from "react-icons/ci";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AVAILABILITY_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "ships_2_3_days", label: "Ships in 2-3 Days" },
  { value: "pre_order", label: "Pre Order" },
];

const AVAIL_VARIANT: Record<string, "success" | "warning" | "info"> = {
  in_stock: "success",
  ships_2_3_days: "warning",
  pre_order: "info",
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ProductsPage = () => {
  const [globalError, setGlobalError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState({
    isOpen: false,
    productId: null as number | null,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [filter, setFilter] = useState({
    status: "",
    category: "",
    search: "",
  });

  const { data, isLoading } = useGetAdminProductsQuery({
    page: pagination.page,
    limit: pagination.limit,
    search: filter.search,
    category: filter.category,
    // Add status filter if backend supports it, or just use category/search
  });
  const { data: catData } = useGetAdminCategoriesQuery();
  const [remove] = useDeleteProductMutation();

  const products = data?.products ?? [];
  const meta = data?.meta;
  const categories = (catData?.categories ?? []).filter((c) => !c.isDeleted);

  const handlePageChange = (newPage: number) => {
    setPagination((p) => ({ ...p, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((p) => ({ ...p, limit: newLimit, page: 1 }));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to deactivate this product?"))
      return;
    try {
      await remove(id).unwrap();
    } catch {
      setGlobalError("Failed to deactivate product.");
    }
  };

  return (
    <DashboardLayout title="Products">
      <DeleteProduct
        isOpen={isDeleteOpen.isOpen}
        productId={isDeleteOpen.productId}
        onClose={() => setIsDeleteOpen({ isOpen: false, productId: null })}
      />
      <Breadcrumb title="Products Management" path="Products " />
      {/* Top bar */}

      <TableWrap>
        <TableWrapHeader title="Products" description="Manage your products">
          <Link to="/products/add">
            <Button variant="outline" size="sm">
              Add Product
            </Button>
          </Link>
        </TableWrapHeader>
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
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
                className="w-full h-[30px] border border-(--border-color-secondary) rounded-(--border-rounded-primary) px-4 text-[12px] text-(--table-body-font-color) outline-none  "
              />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="h-[30px] w-10 border border-(--border-color-secondary) rounded-(--border-rounded-primary) text-[12px] flex items-center justify-center hover:bg-secondary transition-all duration-200"
              >
                <CiFilter
                  size={16}
                  className={`text-(--table-body-font-color) transition-transform duration-300 `}
                />
              </button>
            </div>
          </div>
        </TableWrapBody>
        <TableWrapBody>
          <div
            className={`w-full border-t  border-(--border-color-primary) px-4 transition-all duration-300 ease-in-out overflow-hidden ${
              isFilterOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="h-16 flex items-center gap-3">
              <p className="text-[12px] text-(--table-body-font-color) font-light ">
                Filter:
              </p>

              {/* Category Filter */}
              <div className="flex items-center gap-2  ">
                <Select
                  value={filter.category}
                  onValueChange={(value) =>
                    setFilter({ ...filter, category: value })
                  }
                >
                  <SelectTrigger
                    size="sm"
                    className="h-[30px] w-[180px] text-[12px] border-gray-200 rounded-(--border-rounded-primary)"
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Select
                  value={filter.status}
                  onValueChange={(value) =>
                    setFilter({ ...filter, status: value })
                  }
                >
                  <SelectTrigger
                    size="sm"
                    className="h-[30px] w-[180px]  text-[12px] border-gray-200 rounded-(--border-rounded-primary)"
                  >
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filter Button */}
              <button
                onClick={() =>
                  setFilter({ status: "", category: "", search: "" })
                }
                className="cursor-pointer h-[30px] px-4 text-[12px] text-(--Primary) underline border-gray-200) rounded-(--border-rounded-primary)"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </TableWrapBody>

        <TableWrapBody>
          <Table>
            <TableHeaderRow>
              <TableHeaderCell>Product</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell>Stock</TableHeaderCell>
              <TableHeaderCell>Availability</TableHeaderCell>
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
              ) : products.length === 0 ? (
                <TableBodyRow>
                  <TableBodyCell
                    colSpan={7}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    No products found.
                  </TableBodyCell>
                </TableBodyRow>
              ) : (
                products.map((p) => (
                  <TableBodyRow key={p.id}>
                    <TableBodyCell className="py-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-(--border-color-secondary)"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            IMG
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1 max-w-[200px]">
                            {p.name}
                          </p>
                          {p.badge && (
                            <span className="text-[10px] text-(--Primary) font-medium">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableBodyCell>
                    <TableBodyCell>{p.category_name ?? "—"}</TableBodyCell>
                    <TableBodyCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          Rs. {p.price.toLocaleString()}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            Rs. {p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </TableBodyCell>
                    <TableBodyCell>{p.stockQty}</TableBodyCell>
                    <TableBodyCell>
                      <Badge
                        label={
                          AVAILABILITY_OPTIONS.find(
                            (o) => o.value === p.availability,
                          )?.label ?? p.availability
                        }
                        variant={AVAIL_VARIANT[p.availability] ?? "info"}
                      />
                    </TableBodyCell>
                    <TableBodyCell>
                      <Badge
                        label={p.isActive ? "Active" : "Inactive"}
                        variant={p.isActive ? "success" : "danger"}
                      />
                    </TableBodyCell>
                    <TableBodyCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/products/${p.id}`}>
                          <button
                            className="p-1.5 hover:bg-(--Primary)/10 rounded transition-colors"
                            title="View Details"
                          >
                            <FiEye size={18} className="text-(--Primary)" />
                          </button>
                        </Link>

                        <Link to={`/products/${p.id}/edit`}>
                          <button
                            className="p-1.5 hover:bg-(--Primary)/10 rounded transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={16} className="text-(--Primary)" />
                          </button>
                        </Link>
                        <button
                          className="p-1.5 hover:bg-(--Danger)/10 rounded transition-colors"
                          onClick={() =>
                            setIsDeleteOpen({ isOpen: true, productId: p.id })
                          }
                          title="Delete"
                        >
                          <FiTrash2 size={16} className="text-(--Danger)" />
                        </button>
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

      {globalError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          ⚠️ {globalError}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProductsPage;

export const DeleteProduct = ({
  isOpen,
  onClose,
  productId,
}: {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
}) => {
  const [remove, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (!productId) return;
    try {
      await remove(productId).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            <p className="text-(--Danger) text-xs font-medium">
              This action cannot be undone. This will permanently deactivate the
              product and remove it from the active store listings.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="p-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={isLoading}
          >
            Delete Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
