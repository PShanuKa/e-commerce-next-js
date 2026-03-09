import Breadcrumb from "@/components/common/Breadcrumb";
import FormWrap, {
  FormWrapBody,
  FormWrapHeader,
} from "@/components/common/FormWrap";
import Input, {
  Select,
  Textarea,
  ImageUpload,
} from "@/components/common/Input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/common/Button";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "@/services/productSlice";
import { useGetAdminCategoriesQuery } from "@/services/categorySlice";

const AVAILABILITY_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "ships_2_3_days", label: "Ships in 2-3 Days" },
  { value: "pre_order", label: "Pre Order" },
];

const BADGE_OPTIONS = [
  { label: "None", value: "" },
  { label: "Best Seller", value: "Best Seller" },
  { label: "New", value: "New" },
  { label: "Top Rated", value: "Top Rated" },
  { label: "Sale", value: "Sale" },
  { label: "Hot", value: "Hot" },
];

const ProductSingle = ({
  type = "add",
}: {
  type?: "add" | "view" | "edit";
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: catData, isLoading: isLoadingCats } =
    useGetAdminCategoriesQuery();
  const { data: productData, isFetching } = useGetProductQuery(id!, {
    skip: type === "add" || !id,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isLoading = isFetching;
  const isView = type === "view";

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    brand: "",
    availability: "in_stock",
    badge: "",
    description: "",
    price: "",
    original_price: "",
    stock_qty: "0",
    image: null as File | string | null,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if ((type === "edit" || type === "view") && productData?.product) {
      const p = productData.product;
      setFormData({
        name: p.name,
        category_id: String(p.categoryId ?? ""),
        brand: p.brand ?? "",
        availability: p.availability,
        badge: p.badge ?? "",
        description: p.description ?? "",
        price: String(p.price),
        original_price: String(p.originalPrice ?? ""),
        stock_qty: String(p.stockQty),
        image: p.images?.[0] ?? null,
        is_active: p.isActive,
      });
    }
  }, [productData, type]);

  const categories = (catData?.categories ?? [])
    .filter((c) => !c.isDeleted)
    .map((c) => ({ label: c.name, value: String(c.id) }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name])
      setErrors((prev) => {
        const newE = { ...prev };
        delete newE[name];
        return newE;
      });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async () => {
    try {
      const payload: any = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        original_price: formData.original_price
          ? Number(formData.original_price)
          : undefined,
        stock_qty: Number(formData.stock_qty),
        category_id: Number(formData.category_id),
        brand: formData.brand,
        badge: formData.badge || undefined,
        availability: formData.availability,
        is_active: formData.is_active,
      };

      if (typeof formData.image === "string") {
        payload.images = [formData.image];
      }

      if (type === "edit" && id) {
        await updateProduct({ id: Number(id), ...payload }).unwrap();
        navigate(`/products/${id}`);
      } else {
        const res = await createProduct(payload).unwrap();
        navigate(`/products/${res?.product?.id}`);
      }
    } catch (err: any) {
      console.error("Failed to save product:", err);
      if (err.data?.details) {
        setErrors(err.data.details);
      } else {
        setErrors({
          submit:
            err.data?.message ||
            err.data?.error ||
            "Failed to save product. Please try again.",
        });
      }
    }
  };

  return (
    <DashboardLayout title="Products">
      <Breadcrumb
        title={
          type === "view"
            ? "View Product"
            : type === "edit"
              ? "Edit Product"
              : "Add Product"
        }
        path="Products"
      />

      {/* View Mode Banner */}
      {isView && (
        <div className="flex items-center justify-between my-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-sm">👁️</span>
            <p className="text-sm text-blue-700 font-medium">
              You are in <strong>View Mode</strong>. Fields are read-only.
            </p>
          </div>
          <button
            onClick={() => navigate(`/products/${id}/edit`)}
            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md transition-colors"
          >
            ✏️ Edit Product
          </button>
        </div>
      )}

      {/* Product Information */}
      <FormWrap>
        <FormWrapHeader title="Product Information" />

        <FormWrapBody isLoading={isLoading}>
          <Input
            name="name"
            label="Product Name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            errorMessage={errors.name}
            required
            disabled={isView}
          />
          <Select
            label="Category"
            placeholder="Select category"
            value={formData.category_id}
            options={categories}
            onChange={(val) => handleSelectChange("category_id", val)}
            errorMessage={errors.category_id}
            required
            disabled={isView || isLoadingCats}
          />
          <Input
            name="brand"
            label="Brand"
            placeholder="Enter brand name"
            value={formData.brand}
            onChange={handleChange}
            disabled={isView}
          />
          <Select
            label="Availability"
            placeholder="Select availability"
            options={AVAILABILITY_OPTIONS}
            value={formData.availability}
            onChange={(val) => handleSelectChange("availability", val)}
            disabled={isView}
          />
          <Select
            label="Badge"
            placeholder="Select badge"
            options={BADGE_OPTIONS}
            value={formData.badge}
            onChange={(val) => handleSelectChange("badge", val)}
            disabled={isView}
          />
          <div className="items-end sm:col-span-2 col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              disabled={isView}
            />
            <ImageUpload
              label="Product Image"
              value={formData.image}
              onChange={handleImageChange}
              disabled={isView}
            />
          </div>
        </FormWrapBody>
      </FormWrap>

      {/* Pricing & Inventory */}
      <FormWrap>
        <FormWrapHeader title="Pricing & Inventory" />

        <FormWrapBody isLoading={isLoading}>
          <Input
            type="number"
            name="original_price"
            label="Original Price (Rs)"
            placeholder="0.00"
            value={formData.original_price}
            onChange={handleChange}
            disabled={isView}
          />
          <Input
            type="number"
            name="price"
            label="Price (Rs)"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            errorMessage={errors.price}
            required
            disabled={isView}
          />
          <Input
            type="number"
            name="stock_qty"
            label="Stock Quantity"
            placeholder="0"
            value={formData.stock_qty}
            onChange={handleChange}
            errorMessage={errors.stock_qty}
            required
            disabled={isView}
          />
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              disabled={isView}
              className="accent-(--Primary) disabled:cursor-not-allowed"
            />
            <label
              htmlFor="is_active"
              className="text-[12px] text-(--table-body-font-color) cursor-pointer font-medium"
            >
              Active - Visible on Storefront
            </label>
          </div>
        </FormWrapBody>
      </FormWrap>

      {errors.submit && (
        <p className="text-sm text-red-500 mt-2">{errors.submit}</p>
      )}

      {/* Action Buttons - hidden in view mode */}
      {!isView && (
        <div className="flex items-center justify-end gap-2 mt-5">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate("/products")}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            loading={isCreating || isUpdating}
          >
            {type === "edit" ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      )}

      {/* Back button - only in view mode */}
      {isView && (
        <div className="flex items-center justify-end gap-2 mt-5">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate("/products")}
          >
            ← Back to Products
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProductSingle;
