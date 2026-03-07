import { useState } from "react";
import {
  useGetAdminCategoriesQuery,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
  type Category,
} from "@/services/categorySlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import { FiEdit, FiTrash2, FiRefreshCw, FiPlus } from "react-icons/fi";
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
import Button from "@/components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    categoryId: number | null;
  }>({
    isOpen: false,
    categoryId: null,
  });

  const { data, isLoading } = useGetAdminCategoriesQuery({
    page: pagination.page,
    limit: pagination.limit,
  });

  const [restoreCategory] = useRestoreCategoryMutation();

  const categories = data?.categories ?? [];
  const meta = data?.meta;

  const handlePageChange = (newPage: number) => {
    setPagination((p) => ({ ...p, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((p) => ({ ...p, limit: newLimit, page: 1 }));
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreCategory(id).unwrap();
    } catch (err) {
      console.error("Failed to restore:", err);
    }
  };

  return (
    <DashboardLayout title="Categories">
      <DeleteCategoryDialog
        isOpen={deleteDialog.isOpen}
        categoryId={deleteDialog.categoryId}
        onClose={() => setDeleteDialog({ isOpen: false, categoryId: null })}
      />
      <Breadcrumb title="Categories Management" path="Categories" />

      <TableWrap>
        <TableWrapHeader
          title="Categories"
          description="Organize your products into categories"
        >
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate("/categories/add")}
          >
            <FiPlus size={16} /> New Category
          </Button>
        </TableWrapHeader>

        <TableWrapBody>
          <Table>
            <TableHeaderRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Slug</TableHeaderCell>
              <TableHeaderCell>Products</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell className="text-center">Action</TableHeaderCell>
            </TableHeaderRow>
            <TableBody>
              {isLoading ? (
                <TableBodyRow>
                  <TableBodyCell colSpan={6} className="py-16 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-(--Primary) border-t-transparent rounded-full animate-spin" />
                    </div>
                  </TableBodyCell>
                </TableBodyRow>
              ) : categories.length === 0 ? (
                <TableBodyRow>
                  <TableBodyCell
                    colSpan={6}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    No categories found.
                  </TableBodyCell>
                </TableBodyRow>
              ) : (
                categories.map((cat) => (
                  <TableBodyRow key={cat.id}>
                    <TableBodyCell className="font-semibold text-(--Primary)">
                      #{cat.id}
                    </TableBodyCell>
                    <TableBodyCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {cat.imageUrl ? (
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-300 text-[10px]">
                              IMG
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          {cat.name}
                        </span>
                      </div>
                    </TableBodyCell>
                    <TableBodyCell className="text-xs text-gray-400 font-mono">
                      {cat.slug}
                    </TableBodyCell>
                    <TableBodyCell>
                      <span className="text-sm text-gray-600">
                        {cat.product_count} products
                      </span>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Badge
                        label={cat.isDeleted ? "DELETED" : "ACTIVE"}
                        variant={cat.isDeleted ? "danger" : "success"}
                      />
                    </TableBodyCell>
                    <TableBodyCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/categories/${cat.id}`}>
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                        </Link>
                        {cat.isDeleted ? (
                          <button
                            onClick={() => handleRestore(cat.id)}
                            className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600 transition-colors"
                            title="Restore"
                          >
                            <FiRefreshCw size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                categoryId: cat.id,
                              })
                            }
                            className="p-1.5 hover:bg-red-50 rounded text-red-600 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
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

export default CategoriesPage;

const DeleteCategoryDialog = ({
  isOpen,
  onClose,
  categoryId,
}: {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number | null;
}) => {
  const [remove, { isLoading }] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    if (!categoryId) return;
    try {
      await remove(categoryId).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            <p className="text-(--Danger) text-xs font-medium">
              Are you sure you want to deactivate this category? It will no
              longer be visible to customers until restored.
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
            Delete Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
