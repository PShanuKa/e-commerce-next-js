import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoAdd,
  IoClose,
  IoCheckmarkCircle,
  IoHome,
  IoStarSharp,
  IoTrash,
  IoPencil,
} from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { MdLocationOn } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { AccountLayout } from "@/pages/Account";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  type Address,
  type AddressBody,
} from "@/services/addressSlice";

/* ─── Sri Lanka districts ────────────────────────── */
const PROVINCES = [
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province",
];

/* ─── Empty form ─────────────────────────────────── */
const EMPTY_FORM: AddressBody = {
  name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  postal_code: "",
  province: "",
  is_default: false,
};

/* ─── Address Card ───────────────────────────────── */
const AddressCard = ({
  addr,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  addr: Address;
  onEdit: (a: Address) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}) => (
  <div
    className="card"
    style={{
      padding: 20,
      position: "relative",
      border: addr.isDefault
        ? "2px solid var(--primary)"
        : "1.5px solid var(--border)",
      transition: "var(--transition)",
    }}
  >
    {/* Default badge */}
    {addr.isDefault && (
      <span
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          background: "var(--primary)",
          color: "white",
          fontSize: 10,
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: "var(--radius-full)",
        }}
      >
        Default
      </span>
    )}

    {/* Icon + name */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: addr.isDefault ? "#EFF6FF" : "var(--bg-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IoHome
          size={18}
          color={addr.isDefault ? "var(--primary)" : "var(--text-muted)"}
        />
      </div>
      <div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {addr.name}
        </p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
          {addr.phone}
        </p>
      </div>
    </div>

    {/* Address lines */}
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 6,
        marginBottom: 14,
      }}
    >
      <MdLocationOn
        size={14}
        color="var(--text-muted)"
        style={{ marginTop: 2, flexShrink: 0 }}
      />
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {addr.addressLine1}
        {addr.addressLine2 && <>, {addr.addressLine2}</>}
        <br />
        {addr.city}
        {addr.postalCode && ` - ${addr.postalCode}`}
        {addr.province && <>, {addr.province}</>}
      </p>
    </div>

    {/* Actions */}
    <div style={{ display: "flex", gap: 8 }}>
      {!addr.isDefault && (
        <button
          onClick={() => onSetDefault(addr.id)}
          style={{
            flex: 1,
            padding: "7px 12px",
            background: "var(--bg-muted)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <IoStarSharp size={12} /> Set Default
        </button>
      )}
      <button
        onClick={() => onEdit(addr)}
        style={{
          padding: "7px 14px",
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: "var(--radius-sm)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          color: "var(--primary)",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <IoPencil size={12} /> Edit
      </button>
      <button
        onClick={() => onDelete(addr.id)}
        style={{
          padding: "7px 14px",
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: "var(--radius-sm)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          color: "var(--error)",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <IoTrash size={12} /> Delete
      </button>
    </div>
  </div>
);

/* ─── Address Form Modal ─────────────────────────── */
const AddressFormModal = ({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial?: Address | null;
  onClose: () => void;
  onSave: (data: AddressBody) => void;
  saving: boolean;
}) => {
  const [form, setForm] = useState<AddressBody>(
    initial
      ? {
          name: initial.name,
          phone: initial.phone,
          address_line1: initial.addressLine1,
          address_line2: initial.addressLine2 ?? "",
          city: initial.city,
          postal_code: initial.postalCode ?? "",
          province: initial.province ?? "",
          is_default: initial.isDefault,
        }
      : EMPTY_FORM,
  );

  const set = (k: keyof AddressBody, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    color: "var(--text-primary)",
    boxSizing: "border-box",
    background: "var(--bg-card)",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "var(--radius-md)",
          width: "100%",
          maxWidth: 580,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            {initial ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <IoClose size={20} color="var(--text-muted)" />
          </button>
        </div>

        {/* Form */}
        <div
          style={{
            padding: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          {/* Name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              Full Name *
            </label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Kasun Perera"
            />
          </div>
          {/* Phone */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              Phone *
            </label>
            <input
              style={inputStyle}
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+94 77 123 4567"
            />
          </div>
          {/* Address Line 1 */}
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              Address Line 1 *
            </label>
            <input
              style={inputStyle}
              value={form.address_line1}
              onChange={(e) => set("address_line1", e.target.value)}
              placeholder="No. 123, Galle Road"
            />
          </div>
          {/* Address Line 2 */}
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              Address Line 2 (optional)
            </label>
            <input
              style={inputStyle}
              value={form.address_line2}
              onChange={(e) => set("address_line2", e.target.value)}
              placeholder="Apartment, suite, floor…"
            />
          </div>
          {/* City */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              City *
            </label>
            <input
              style={inputStyle}
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Colombo"
            />
          </div>
          {/* Postal Code */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              Postal Code
            </label>
            <input
              style={inputStyle}
              value={form.postal_code}
              onChange={(e) => set("postal_code", e.target.value)}
              placeholder="00300"
            />
          </div>
          {/* Province */}
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              Province
            </label>
            <select
              style={{ ...inputStyle }}
              value={form.province}
              onChange={(e) => set("province", e.target.value)}
            >
              <option value="">Select province…</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          {/* Default checkbox */}
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 13,
                color: "var(--text-secondary)",
              }}
            >
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => set("is_default", e.target.checked)}
                style={{ accentColor: "var(--primary)", width: 16, height: 16 }}
              />
              Set as default address
            </label>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "white",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={
              saving ||
              !form.name ||
              !form.phone ||
              !form.address_line1 ||
              !form.city
            }
            style={{
              padding: "10px 24px",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-sm)",
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.75 : 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {saving ? (
              "Saving…"
            ) : (
              <>
                <IoCheckmarkCircle size={16} />{" "}
                {initial ? "Update Address" : "Save Address"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Addresses Page
═══════════════════════════════════════════════════ */
const AddressesPage = () => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { data, isLoading } = useGetAddressesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const addresses = data?.addresses ?? [];

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Address | null>(null);
  const [saveError, setSaveError] = useState("");

  const openAdd = () => {
    setEditTarget(null);
    setSaveError("");
    setModal("add");
  };
  const openEdit = (a: Address) => {
    setEditTarget(a);
    setSaveError("");
    setModal("edit");
  };
  const closeModal = () => setModal(null);

  const handleSave = async (form: AddressBody) => {
    setSaveError("");
    try {
      if (modal === "edit" && editTarget) {
        await updateAddress({ id: editTarget.id, ...form }).unwrap();
      } else {
        await addAddress(form).unwrap();
      }
      closeModal();
    } catch {
      setSaveError("Failed to save address. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    await deleteAddress(id);
  };

  if (!isAuthenticated) {
    return (
      <AccountLayout>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            gap: 16,
          }}
        >
          <div style={{ fontSize: 48 }}>🔒</div>
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>
            Please{" "}
            <Link to="/login" style={{ color: "var(--primary)" }}>
              login
            </Link>{" "}
            to manage addresses.
          </p>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="card" style={{ padding: 24 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              My Addresses
            </h2>
            {!isLoading && (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  margin: "2px 0 0",
                }}
              >
                {addresses.length}{" "}
                {addresses.length === 1 ? "address" : "addresses"} saved
              </p>
            )}
          </div>
          <button
            onClick={openAdd}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            <IoAdd size={16} /> Add Address
          </button>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: 160,
                  background:
                    "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
                  borderRadius: "var(--radius-md)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && addresses.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <TbTruckDelivery
              size={52}
              color="#CBD5E1"
              style={{ marginBottom: 16 }}
            />
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              No addresses yet
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 20,
              }}
            >
              Add a delivery address to speed up checkout
            </p>
            <button
              onClick={openAdd}
              style={{
                padding: "10px 24px",
                background: "var(--primary)",
                color: "white",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Add First Address
            </button>
          </div>
        )}

        {/* Address Grid */}
        {!isLoading && addresses.length > 0 && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                addr={addr}
                onEdit={openEdit}
                onDelete={handleDelete}
                onSetDefault={(id) => setDefaultAddress(id)}
              />
            ))}
          </div>
        )}

        {saveError && (
          <p style={{ color: "var(--error)", fontSize: 13, marginTop: 12 }}>
            {saveError}
          </p>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <AddressFormModal
          initial={editTarget}
          onClose={closeModal}
          onSave={handleSave}
          saving={adding || updating}
        />
      )}

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </AccountLayout>
  );
};

export default AddressesPage;
