import { useState } from "react";
import {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  type Product,
} from "@/services/productSlice";
import { useGetAdminCategoriesQuery } from "@/services/categorySlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  MdAdd,
  MdEdit,
  MdDeleteOutline,
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

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

// ── Product Modal ─────────────────────────────────────────────────────────────
interface ModalProps {
  initial?: Partial<Product>;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
  categories: { id: number; name: string; slug: string }[];
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  original_price: "",
  stock_qty: "0",
  brand: "",
  badge: "",
  image: "",
  category_id: "",
  availability: "in_stock",
  is_active: true,
};

const ProductModal = ({
  initial,
  onClose,
  onSave,
  saving,
  categories,
}: ModalProps) => {
  const [form, setForm] = useState({
    ...emptyForm,
    ...(initial
      ? {
          name: initial.name ?? "",
          description: initial.description ?? "",
          price: String(initial.price ?? ""),
          original_price: String(initial.originalPrice ?? ""),
          stock_qty: String(initial.stockQty ?? 0),
          brand: initial.brand ?? "",
          badge: initial.badge ?? "",
          image: initial.image ?? "",
          category_id: String(initial.categoryId ?? ""),
          availability: initial.availability ?? "in_stock",
        }
      : {}),
  });
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!form.price) {
      setError("Price is required.");
      return;
    }
    setError("");
    onSave({
      name: form.name.trim(),
      description: form.description || undefined,
      price: Number(form.price),
      original_price: form.original_price
        ? Number(form.original_price)
        : undefined,
      stock_qty: Number(form.stock_qty) || 0,
      category_id: form.category_id ? Number(form.category_id) : null,
      brand: form.brand || undefined,
      badge: form.badge || undefined,
      availability: form.availability,
      images: form.image ? [form.image] : undefined,
      is_active: form.is_active,
    });
  };

  const field = (
    label: string,
    key: keyof typeof form,
    type = "text",
    placeholder = "",
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={String(form[key])}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 my-8">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          {initial?.id ? "Edit Product" : "New Product"}
        </h2>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            ⚠️ {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            {field("Product Name *", "name", "text", "e.g. Sony WH-1000XM5")}
          </div>
          {field("Price (Rs.) *", "price", "number", "0")}
          {field("Original Price (Rs.)", "original_price", "number", "0")}
          {field("Stock Qty", "stock_qty", "number", "0")}
          {field("Brand", "brand", "text", "e.g. Sony")}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, category_id: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">— No Category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={form.availability}
              onChange={(e) =>
                setForm((f) => ({ ...f, availability: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              {AVAILABILITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Badge
            </label>
            <select
              value={form.badge}
              onChange={(e) =>
                setForm((f) => ({ ...f, badge: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">— None —</option>
              {["Best Seller", "New", "Top Rated", "Sale", "Hot"].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div className="sm:col-span-2">
            {field("Image URL", "image", "url", "https://...")}
          </div>
          {form.image && (
            <div className="sm:col-span-2">
              <img
                src={form.image}
                alt="Preview"
                className="h-28 object-cover rounded-lg border border-gray-100"
              />
            </div>
          )}

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              placeholder="Product description..."
            />
          </div>

          {/* Active toggle (edit only) */}
          {initial?.id && (
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active as unknown as boolean}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_active: e.target.checked }))
                }
                className="accent-indigo-600"
              />
              Active (visible on storefront)
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            {initial?.id ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Modal ──────────────────────────────────────────────────────────────
const ConfirmModal = ({
  product,
  onClose,
  onConfirm,
  loading,
}: {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <MdDeleteOutline size={28} className="text-red-500" />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">
        Deactivate Product?
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        "<strong className="text-gray-700">{product.name}</strong>" will be
        hidden from the storefront.
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
          Deactivate
        </Button>
      </div>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [globalError, setGlobalError] = useState("");

  const { data, isLoading } = useGetAdminProductsQuery({
    page,
    limit: 20,
    search,
  });
  const { data: catData } = useGetAdminCategoriesQuery();
  const [create, { isLoading: creating }] = useCreateProductMutation();
  const [update, { isLoading: updating }] = useUpdateProductMutation();
  const [remove, { isLoading: deleting }] = useDeleteProductMutation();

  const products = data?.products ?? [];
  const meta = data?.meta;
  const categories = (catData?.categories ?? []).filter((c) => !c.isDeleted);

  const handleSave = async (formData: Record<string, unknown>) => {
    try {
      setGlobalError("");
      if (editProduct) {
        await update({ id: editProduct.id, ...formData } as Parameters<
          typeof update
        >[0]).unwrap();
      } else {
        await create(formData as Parameters<typeof create>[0]).unwrap();
      }
      setShowModal(false);
      setEditProduct(null);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setGlobalError(e?.data?.message || "An error occurred.");
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      await remove(deleteProduct.id).unwrap();
      setDeleteProduct(null);
    } catch {
      setGlobalError("Failed to deactivate product.");
    }
  };

  return (
    <DashboardLayout title="Products">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-64">
          <MdSearch size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
          />
        </div>
        <Button
          onClick={() => {
            setEditProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2"
        >
          <MdAdd size={18} /> New Product
        </Button>
      </div>

      {globalError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          ⚠️ {globalError}
        </div>
      )}

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="px-6 py-3 text-left font-medium">Product</th>
                  <th className="px-6 py-3 text-left font-medium">Category</th>
                  <th className="px-6 py-3 text-left font-medium">Price</th>
                  <th className="px-6 py-3 text-left font-medium">Stock</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-gray-50/50 transition-colors ${!p.isActive ? "opacity-50" : ""}`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                            ?
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 max-w-[180px] truncate">
                            {p.name}
                          </p>
                          {p.badge && (
                            <span className="text-xs text-indigo-500 font-medium">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 text-xs">
                      {p.category_name ?? "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <div>
                        <span className="font-semibold text-gray-800">
                          Rs. {p.price.toLocaleString()}
                        </span>
                        {p.originalPrice && (
                          <span className="block text-xs text-gray-400 line-through">
                            Rs. {p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{p.stockQty}</td>
                    <td className="px-6 py-3.5">
                      <Badge
                        label={
                          AVAILABILITY_OPTIONS.find(
                            (o) => o.value === p.availability,
                          )?.label ?? p.availability
                        }
                        variant={AVAIL_VARIANT[p.availability] ?? "default"}
                      />
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge
                        label={p.isActive ? "Active" : "Inactive"}
                        variant={p.isActive ? "success" : "danger"}
                      />
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditProduct(p);
                            setShowModal(true);
                          }}
                        >
                          <MdEdit size={16} /> Edit
                        </Button>
                        {p.isActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => setDeleteProduct(p)}
                          >
                            <MdDeleteOutline size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {meta && meta.pages > 1 && (
              <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-50">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MdChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {meta.pages} · {meta.total} products
                </span>
                <button
                  disabled={page >= meta.pages}
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

      {showModal && (
        <ProductModal
          initial={editProduct ?? undefined}
          onClose={() => {
            setShowModal(false);
            setEditProduct(null);
          }}
          onSave={handleSave}
          saving={creating || updating}
          categories={categories}
        />
      )}
      {deleteProduct && (
        <ConfirmModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </DashboardLayout>
  );
};

export default ProductsPage;
