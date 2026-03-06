import { useState } from "react";
import {
  useGetAdminUsersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  type User,
} from "@/services/userSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { MdAdd, MdEdit, MdSearch, MdPerson } from "react-icons/md";

// ── User Modal ────────────────────────────────────────────────────────────────
interface ModalProps {
  initial?: Partial<User>;
  onClose: () => void;
  onSave: (data: Record<string, any>) => void;
  saving: boolean;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "customer",
  isActive: true,
};

const UserModal = ({ initial, onClose, onSave, saving }: ModalProps) => {
  const [form, setForm] = useState({
    ...emptyForm,
    ...(initial
      ? {
          name: initial.name ?? "",
          email: initial.email ?? "",
          phone: initial.phone ?? "",
          role: initial.role ?? "customer",
          isActive: initial.isActive ?? true,
        }
      : {}),
  });
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and Email are required.");
      return;
    }
    if (!initial?.id && !form.password) {
      setError("Password is required for new users.");
      return;
    }
    setError("");

    const payload: any = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone || null,
      role: form.role,
      isActive: form.isActive,
    };

    if (!initial?.id) payload.password = form.password;

    onSave(payload);
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 my-8">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          {initial?.id ? "Edit User" : "New Customer"}
        </h2>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            ⚠️ {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {field("Full Name *", "name", "text", "e.g. John Doe")}
          {field("Email Address *", "email", "email", "john@example.com")}
          {field("Phone Number", "phone", "text", "e.g. 0771234567")}

          {!initial?.id &&
            field("Password *", "password", "password", "Minimum 6 characters")}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
              className="accent-indigo-600"
            />
            Active Account
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            {initial?.id ? "Save Changes" : "Create User"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const CustomersPage = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [globalError, setGlobalError] = useState("");

  const { data, isLoading } = useGetAdminUsersQuery();
  const [create, { isLoading: creating }] = useCreateCustomerMutation();
  const [update, { isLoading: updating }] = useUpdateCustomerMutation();

  const users = (data?.users ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async (formData: any) => {
    try {
      setGlobalError("");
      if (editUser) {
        await update({ id: editUser.id, ...formData }).unwrap();
      } else {
        await create(formData).unwrap();
      }
      setShowModal(false);
      setEditUser(null);
    } catch (err: any) {
      setGlobalError(err?.data?.error || "An error occurred.");
    }
  };

  return (
    <DashboardLayout title="Customers">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-72">
          <MdSearch size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
          />
        </div>
        <Button
          onClick={() => {
            setEditUser(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2"
        >
          <MdAdd size={18} /> New Customer
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
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="px-6 py-3 text-left font-medium">User</th>
                  <th className="px-6 py-3 text-left font-medium">Role</th>
                  <th className="px-6 py-3 text-left font-medium">Phone</th>
                  <th className="px-6 py-3 text-left font-medium">Orders</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <MdPerson size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge
                        label={u.role.toUpperCase()}
                        variant={u.role === "admin" ? "warning" : "default"}
                      />
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 font-mono text-xs">
                      {u.phone || "—"}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-gray-700">
                      {u.order_count}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge
                        label={u.isActive ? "Active" : "Inactive"}
                        variant={u.isActive ? "success" : "danger"}
                      />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditUser(u);
                          setShowModal(true);
                        }}
                      >
                        <MdEdit size={16} /> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showModal && (
        <UserModal
          initial={editUser ?? undefined}
          onClose={() => {
            setShowModal(false);
            setEditUser(null);
          }}
          onSave={handleSave}
          saving={creating || updating}
        />
      )}
    </DashboardLayout>
  );
};

export default CustomersPage;
