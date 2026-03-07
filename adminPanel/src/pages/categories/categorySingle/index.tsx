import Breadcrumb from "@/components/common/Breadcrumb";
import FormWrap, {
  FormWrapBody,
  FormWrapHeader,
} from "@/components/common/FormWrap";
import Input, { ImageUpload } from "@/components/common/Input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/common/Button";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useGetAdminCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/services/categorySlice";

const CategorySingle = ({ type = "add" }: { type?: "add" | "edit" }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: catData } = useGetAdminCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "" as string | File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (type === "edit" && id && catData?.categories) {
      const category = catData.categories.find((c) => c.id === Number(id));
      if (category) {
        setFormData({
          name: category.name,
          imageUrl: category.imageUrl || "",
        });
      }
    }
  }, [catData, type, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name])
      setErrors((prev) => {
        const newE = { ...prev };
        delete newE[name];
        return newE;
      });
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, imageUrl: file }));
  };

  const handleSubmit = async () => {
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload: any = {
        name: formData.name,
      };

      if (typeof formData.imageUrl === "string") {
        payload.image_url = formData.imageUrl;
      } else if (formData.imageUrl instanceof File) {
        // In a real app, upload to S3/Cloudinary and get URL.
        // Payload currently expects image_url string for create/update.
        // payload.image_url = "uploaded_url";
      }

      if (type === "edit" && id) {
        await updateCategory({ id: Number(id), ...payload }).unwrap();
      } else {
        await createCategory(payload).unwrap();
      }
      navigate("/categories");
    } catch (err) {
      console.error("Failed to save category:", err);
      setErrors({ submit: "Failed to save category. Please try again." });
    }
  };

  return (
    <DashboardLayout title="Categories">
      <Breadcrumb
        title={type === "edit" ? "Edit Category" : "Add Category"}
        path="Categories"
      />

      <FormWrap>
        <FormWrapHeader title="Category Information" />

        <FormWrapBody>
          <Input
            name="name"
            label="Category Name"
            placeholder="Enter category name"
            value={formData.name}
            onChange={handleChange}
            errorMessage={errors.name}
            required
          />
          <div className="sm:col-span-2">
            <ImageUpload
              label="Category Image"
              value={formData.imageUrl}
              onChange={handleImageChange}
            />
          </div>
        </FormWrapBody>
      </FormWrap>

      {errors.submit && (
        <p className="text-sm text-red-500 mt-2">{errors.submit}</p>
      )}

      <div className="flex items-center justify-end gap-2 mt-5">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate("/categories")}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          loading={isCreating || isUpdating}
        >
          {type === "edit" ? "Save Changes" : "Add Category"}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default CategorySingle;
