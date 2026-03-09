import Breadcrumb from "@/components/common/Breadcrumb";
import FormWrap, {
  FormWrapBody,
  FormWrapHeader,
} from "@/components/common/FormWrap";
import Input, { Select } from "@/components/common/Input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/common/Button";
import Badge from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableBodyCell,
  TableBodyRow,
  TableHeaderCell,
  TableHeaderRow,
} from "@/components/common/Table";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useCreateCustomerMutation,
  useGetAdminUserByIdQuery,
  useUpdateCustomerMutation,
} from "@/services/userSlice";
import { FiEye, FiMapPin, FiPackage } from "react-icons/fi";

const ROLE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

const STATUS_VARIANTS: Record<string, any> = {
  pending: "default",
  processing: "info",
  shipped: "warning",
  delivered: "success",
  cancelled: "danger",
};

const CustomerSingle = ({
  type = "add",
}: {
  type?: "add" | "view" | "edit";
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: userResponse } = useGetAdminUserByIdQuery(Number(id), {
    skip: type === "add" || !id,
  });

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
    if ((type === "edit" || type === "view") && userResponse?.user) {
      const user = userResponse.user;
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        password: "",
        isActive: user.isActive,
      });
    }
  }, [userResponse, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "view") return;
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
    if (type === "view") return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
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
    } catch (err: any) {
      console.error("Failed to save customer:", err);
      setErrors({
        submit:
          err?.data?.error || "Failed to save customer. Please try again.",
      });
    }
  };

  const user = userResponse?.user;

  return (
    <DashboardLayout title="Customers">
      <Breadcrumb
        title={
          type === "view"
            ? "Customer Details"
            : type === "edit"
              ? "Edit Customer"
              : "Add Customer"
        }
        path="Customers"
      />

      <div className="grid  gap-3">
        <div className=" space-y-6">
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
                disabled={type === "view"}
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
                disabled={type === "view"}
              />
              <Input
                name="phone"
                label="Phone Number"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                disabled={type === "view"}
              />
              <Select
                label="Role"
                placeholder="Select role"
                options={ROLE_OPTIONS}
                value={formData.role}
                onChange={(val) => handleSelectChange("role", val)}
                disabled={type === "view"}
              />
            </FormWrapBody>
          </FormWrap>

          {type === "view" && user && (
            <>
              <FormWrap>
                <FormWrapHeader title="Address Book" />
                <FormWrapBody>
                  {user.addresses?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                      {user.addresses.map((addr: any) => (
                        <div
                          key={addr.id}
                          className="border border-(--border-color-secondary) rounded-lg p-4 bg-gray-50/50"
                        >
                          <p className="font-semibold text-sm mb-1">
                            {addr.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                          </p>
                          <p className="text-xs text-gray-500">
                            {addr.city}, {addr.province} {addr.postalCode}
                          </p>
                          <p className="text-[10px] text-(--Primary) mt-2 font-medium">
                            {addr.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 col-span-2 text-center py-4">
                      No addresses saved yet.
                    </p>
                  )}
                </FormWrapBody>
              </FormWrap>

            
            </>
          )}
        </div>


        

        <div className="space-y-6">
          <FormWrap>
            <FormWrapHeader title="Account Settings" />
            <FormWrapBody className="grid-cols-1 sm:grid-cols-1 lg:grid-cols-1">
              <div className="flex items-center gap-2 mb-4">
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
                  disabled={type === "view"}
                />
                <label
                  htmlFor="isActive"
                  className="text-[12px] text-(--table-body-font-color) cursor-pointer font-medium"
                >
                  Active Account
                </label>
              </div>

              {type !== "view" && (
                <Input
                  name="password"
                  label={
                    type === "edit" ? "Update Password (Optional)" : "Password"
                  }
                  type="password"
                  placeholder={
                    type === "edit" ? "Leave blank to keep" : "Enter password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  errorMessage={errors.password}
                  required={type === "add"}
                />
              )}

              {type === "view" && user && (
                <div className="pt-4 border-t border-(--border-color-secondary) space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Customer ID</span>
                    <span className="font-semibold text-(--Primary)">
                      #{id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Joined Date</span>
                    <span className="text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Total Orders</span>
                    <Badge
                      label={String(user.orders?.length || 0)}
                      variant="info"
                    />
                  </div>
                </div>
              )}
            </FormWrapBody>
          </FormWrap>

        
          
        </div>

<div >
        <div className="flex justify-end">
            {type === "view" ? (
            <Button
              variant="primary"
              className=""
              size="md"
              onClick={() => navigate(`/customers/${id}/edit`)}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex  gap-2">
              {errors.submit && (
                <p className="text-xs text-red-500 mb-2">{errors.submit}</p>
              )}
              <Button
                variant="outline"
                className=""
                size="md"
                onClick={() => navigate("/customers")}
              >
                Back to List
              </Button>
              <Button
                variant="primary"
                className=""
                size="md"
                onClick={handleSubmit}
                loading={isCreating || isUpdating}
              >
                {type === "edit" ? "Save Changes" : "Create Customer"}
              </Button>
            </div>
          )}
        </div>
        </div>

        
        
      </div>
      {type === "view" && user && (

       <FormWrap className="mt-5">
                <FormWrapHeader title="Order History" />
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeaderRow>
                      <TableHeaderCell>Order ID</TableHeaderCell>
                      <TableHeaderCell>Date</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Total</TableHeaderCell>
                      <TableHeaderCell className="text-center">
                        View
                      </TableHeaderCell>
                    </TableHeaderRow>
                    <TableBody>
                      {user.orders?.length > 0 ? (
                        user.orders.map((order: any) => (
                          <TableBodyRow key={order.id}>
                            <TableBodyCell className="font-medium">
                              #{order.id}
                            </TableBodyCell>
                            <TableBodyCell className="text-xs">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableBodyCell>
                            <TableBodyCell>
                              <Badge
                                label={order.status.toUpperCase()}
                                variant={STATUS_VARIANTS[order.status]}
                              />
                            </TableBodyCell>
                            <TableBodyCell className="font-semibold text-xs">
                              Rs. {Number(order.total).toLocaleString()}
                            </TableBodyCell>
                            <TableBodyCell className="text-center">
                              <Link
                                to={`/orders/${order.id}`}
                                className="text-(--Primary) hover:underline flex justify-center"
                              >
                                <FiEye size={16} />
                              </Link>
                            </TableBodyCell>
                          </TableBodyRow>
                        ))
                      ) : (
                        <TableBodyRow>
                          <TableBodyCell
                            colSpan={5}
                            className="text-center py-8 text-gray-400 text-sm"
                          >
                            No orders found.
                          </TableBodyCell>
                        </TableBodyRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </FormWrap>
      )}

    </DashboardLayout>
  );
};

export default CustomerSingle;
