// const merchantSchema = z.object({
//   name: z.string().min(1, { message: "Merchant name is required" }),
//   category: z.string().min(1, { message: "Category is required" }),
//   personName: z.string(),
//   personNumber: z.string().regex(/^(?:\+94|94|0)?7[0-9]{8}$/, {
//     message: "Invalid Sri Lankan mobile number",
//   }),
//   discountPercentage: z
//     .number()
//     .min(0, { message: "Discount percentage must be greater than 0" })
//     .max(100, { message: "Discount percentage must be less than 100" }),
//   commissionPercentage: z
//     .number()
//     .min(0, { message: "Commission percentage must be greater than 0" })
//     .max(100, { message: "Commission percentage must be less than 100" }),
// });

import Breadcrumb from "@/components/common/Breadcrumb";
import FormWrap, {
  FormWrapBody,
  FormWrapHeader,
} from "@/components/common/FormWrap";
import Input, {  Select, Textarea }  from "@/components/common/Input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/common/Button";

import { useState } from "react";
import { useParams } from "react-router-dom";

const ProductSingle = ({
  type = "add",
}: {
  type?: "add" | "view" | "edit";
}) => {
  const { id } = useParams();

  // Fetch merchant data if viewing or editing

  // Fetch metrics card data for this merchant

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    personName: "",
    personNumber: "",
    logo: "",
    discountPercentage: 0,
    commissionPercentage: 0,
    status: "true",
  });

  // Populate form data when merchant data is loaded

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
        path="Merchant"
      />

      <FormWrap>
        <FormWrapHeader title="Merchant Information" />

        <FormWrapBody>
           <Input
            type="text"
            name="name"
            label="Merchant Name"
            placeholder="Enter merchant name"
            value={formData.name}
            required
          />
          <Select
            label="Category"
            placeholder="Select category"
            value={formData.category || ""}
            required
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />
          <Select
            label="Brand"
            placeholder="Select brand"
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
            value={formData.status}
          />
            <Select
            label="Availability"
            placeholder="Select availability"
            options={[
              { label: "Available", value: "true" },
              { label: "Not Available", value: "false" },
            ]}
            value={formData.status}
          />
           <Select
            label="Badge"
            placeholder="Select badge"
            options={[
              { label: "Available", value: "true" },
              { label: "Not Available", value: "false" },
            ]}
            value={formData.status}
          />
          <div className="items-end sm:col-span-2 col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              type="textarea"
              name="description"
              label="Description"
              placeholder="Enter description"

            />
           
          </div>
        </FormWrapBody>
      </FormWrap>

      <FormWrap>
        <FormWrapHeader title="Price Information" />

        <FormWrapBody>
         
          <Input
            type="text"
            name="name"
            label="Orginal Price (Rs)"
            placeholder="Enter merchant name"
            value={formData.name}
            required
          />
          <Input
            type="text"
            name="name"
            label="Price (Rs)"
            placeholder="Enter merchant name"
            value={formData.name}
            required
          />
         
          
        </FormWrapBody>
      </FormWrap>

       <FormWrap>
        <FormWrapHeader title="Stock" />

        <FormWrapBody>
         
          <Input
            type="text"
            name="Stock Qyt"
            label="Stock Qyt"
            placeholder="Enter merchant name"
            value={formData.name}
            required
          />
          
         
          
        </FormWrapBody>
      </FormWrap>

      <div className="flex items-center justify-end gap-2 mt-5">
        <Button variant="outline" size="md">
          Cancel
        </Button>
        <Button variant="primary" size="md">
          Add
        </Button>
      </div>

     
    </DashboardLayout>
  );
};

export default ProductSingle;
