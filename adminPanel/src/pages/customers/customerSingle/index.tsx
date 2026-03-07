import Breadcrumb from "@/components/common/Breadcrumb";
import FormWrap, {
  FormWrapBody,
  FormWrapHeader,
} from "@/components/common/FormWrap";
import Input, { Select } from "@/components/common/Input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/common/Button";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCreateCustomerMutation,
  useGetAdminUsersQuery,
  useUpdateCustomerMutation,
} from "@/services/userSlice";

const ROLE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

const CustomerSingle = ({ type = "add" }: { type?: "add" | "edit" }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: userData } = useGetAdminUsersQuery();

  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (type === "edit" && id && userData?.users) {
      const user = userData.users.find((u) => u.id === Number(id));
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          role: user.role,
          password: "", // Don't populate password on edit
          isActive: user.isActive,
        });
      }
    }
  }, [userData, type, id]);

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (type === "add" && !formData.password)
      newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        isActive: formData.isActive,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (type === "edit" && id) {
        await updateCustomer({ id: Number(id), ...payload }).unwrap();
      } else {
        await createCustomer(payload).unwrap();
      }
      navigate("/customers");
    } catch (err) {
      console.error("Failed to save customer:", err);
      setErrors({ submit: "Failed to save customer. Please try again." });
    }
  };

  return (
    <DashboardLayout title="Customers">
      <Breadcrumb
        title={type === "edit" ? "Edit Customer" : "Add Customer"}
        path="Customers"
      />

      <FormWrap>
        <FormWrapHeader title="Customer Information" />

        <FormWrapBody>
          <Input
            name="name"
            label="Full Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            errorMessage={errors.name}
            required
          />
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            errorMessage={errors.email}
            required
          />
          <Input
            name="phone"
            label="Phone Number"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
          <Select
            label="Role"
            placeholder="Select role"
            options={ROLE_OPTIONS}
            value={formData.role}
            onChange={(val) => handleSelectChange("role", val)}
          />
          <Input
            name="password"
            label={type === "edit" ? "New Password (Optional)" : "Password"}
            type="password"
            placeholder={
              type === "edit" ? "Leave blank to keep current" : "Enter password"
            }
            value={formData.password}
            onChange={handleChange}
            errorMessage={errors.password}
            required={type === "add"}
          />
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              className="accent-(--Primary)"
            />
            <label
              htmlFor="isActive"
              className="text-[12px] text-(--table-body-font-color) cursor-pointer font-medium"
            >
              Active Account
            </label>
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
          onClick={() => navigate("/customers")}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          loading={isCreating || isUpdating}
        >
          {type === "edit" ? "Save Changes" : "Add Customer"}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default CustomerSingle;
