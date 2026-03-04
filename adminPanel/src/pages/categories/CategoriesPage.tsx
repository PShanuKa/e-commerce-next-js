import { useState } from "react";
import {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
  type Category,
} from "@/services/categorySlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  MdAdd,
  MdEdit,
  MdDeleteOutline,
  MdRestoreFromTrash,
  MdSearch,
} from "react-icons/md";

// ── Category Modal ────────────────────────────────────────────────────────────
interface ModalProps {
  initial?: { id?: number; name: string; image_url: string };
  onClose: () => void;
  onSave: (data: { name: string; image_url: string }) => void;
  saving: boolean;
}

const CategoryModal = ({ initial, onClose, onSave, saving }: ModalProps) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    onSave({ name: name.trim(), image_url: imageUrl.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          {initial?.id ? "Edit Category" : "New Category"}
        </h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            ⚠️ {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Electronics"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-2 h-20 w-full object-cover rounded-lg border border-gray-100"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            {initial?.id ? "Save Changes" : "Create Category"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
const ConfirmModal = ({
  category,
  onClose,
  onConfirm,
  loading,
}: {
  category: Category;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <MdDeleteOutline size={28} className="text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Category?</h2>
      <p className="text-sm text-gray-500 mb-6">
        <strong className="text-gray-700">"{category.name}"</strong> will be
        soft-deleted and hidden from the storefront. You can restore it later.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={onConfirm}
          loading={loading}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const CategoriesPage = () => {
  const { data, isLoading, isError } = useGetAdminCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();
  const [restoreCategory, { isLoading: restoring }] =
    useRestoreCategoryMutation();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [globalError, setGlobalError] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  const categories = (data?.categories ?? []).filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchDeleted = showDeleted ? true : !c.isDeleted;
    return matchSearch && matchDeleted;
  });

  const handleSave = async (formData: { name: string; image_url: string }) => {
    try {
      setGlobalError("");
      if (editCat) {
        await updateCategory({ id: editCat.id, ...formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      setShowModal(false);
      setEditCat(null);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setGlobalError(e?.data?.message || "An error occurred.");
    }
  };

  const handleDelete = async () => {
    if (!deleteCat) return;
    try {
      await deleteCategory(deleteCat.id).unwrap();
      setDeleteCat(null);
    } catch {
      setGlobalError("Failed to delete category.");
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreCategory(id).unwrap();
    } catch {
      setGlobalError("Failed to restore category.");
    }
  };

  return (
    <DashboardLayout title="Categories">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-56">
            <MdSearch size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
            />
          </div>
          {/* Show deleted toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="accent-indigo-600"
            />
            Show deleted
          </label>
        </div>

        <Button
          onClick={() => {
            setEditCat(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2"
        >
          <MdAdd size={18} /> New Category
        </Button>
      </div>

      {/* Global error */}
      {globalError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          ⚠️ {globalError}
        </div>
      )}

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-red-500">
            Failed to load categories.
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            {search
              ? "No categories match your search."
              : "No categories found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="px-6 py-3 text-left font-medium">Category</th>
                  <th className="px-6 py-3 text-left font-medium">Slug</th>
                  <th className="px-6 py-3 text-left font-medium">Products</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className={`hover:bg-gray-50/50 transition-colors ${cat.isDeleted ? "opacity-50" : ""}`}
                  >
                    {/* Name + image */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-9 h-9 rounded-lg object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-indigo-600">
                              {cat.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-800">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-gray-500">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">
                      {cat.product_count}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge
                        label={cat.isDeleted ? "Deleted" : "Active"}
                        variant={cat.isDeleted ? "danger" : "success"}
                      />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {cat.isDeleted ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(cat.id)}
                            loading={restoring}
                            className="text-emerald-600"
                          >
                            <MdRestoreFromTrash size={16} /> Restore
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditCat(cat);
                                setShowModal(true);
                              }}
                            >
                              <MdEdit size={16} /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => setDeleteCat(cat)}
                            >
                              <MdDeleteOutline size={16} /> Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create / Edit Modal */}
      {showModal && (
        <CategoryModal
          initial={
            editCat
              ? {
                  id: editCat.id,
                  name: editCat.name,
                  image_url: editCat.imageUrl ?? "",
                }
              : undefined
          }
          onClose={() => {
            setShowModal(false);
            setEditCat(null);
          }}
          onSave={handleSave}
          saving={creating || updating}
        />
      )}

      {/* Delete Confirm */}
      {deleteCat && (
        <ConfirmModal
          category={deleteCat}
          onClose={() => setDeleteCat(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </DashboardLayout>
  );
};

export default CategoriesPage;
