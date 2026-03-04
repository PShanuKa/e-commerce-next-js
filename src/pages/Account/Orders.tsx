import { useState } from "react";
import { Link } from "react-router-dom";
import { IoStarSharp, IoClose } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { FaBoxOpen } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { AccountLayout } from "@/pages/Account";
import {
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
  type Order,
} from "@/services/orderSlice";

/* ─── Status config ─────────────────────────────── */
const STATUS_STYLE: Record<
  string,
  { bg: string; color: string; dot: string; label: string }
> = {
  pending: {
    bg: "#FFF7ED",
    color: "#C2410C",
    dot: "#F97316",
    label: "Pending",
  },
  processing: {
    bg: "#EFF6FF",
    color: "#1D4ED8",
    dot: "#3B82F6",
    label: "Processing",
  },
  shipped: {
    bg: "#F0FDF4",
    color: "#15803D",
    dot: "#22C55E",
    label: "Shipped",
  },
  delivered: {
    bg: "#ECFDF5",
    color: "#059669",
    dot: "#10B981",
    label: "Delivered",
  },
  cancelled: {
    bg: "#FEF2F2",
    color: "#B91C1C",
    dot: "#EF4444",
    label: "Cancelled",
  },
};

const getStyle = (status: string) =>
  STATUS_STYLE[status.toLowerCase()] ?? {
    bg: "#F3F4F6",
    color: "#6B7280",
    dot: "#9CA3AF",
    label: status,
  };

const TABS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

/* ─── Helpers ───────────────────────────────────── */
const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* ─── Order Detail Modal ────────────────────────── */
const OrderDetailModal = ({
  orderId,
  onClose,
}: {
  orderId: number;
  onClose: () => void;
}) => {
  const { data, isLoading } = useGetOrderQuery(orderId);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [cancelError, setCancelError] = useState("");
  const order = data?.order;

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelError("");
    try {
      await cancelOrder(orderId).unwrap();
      onClose();
    } catch {
      setCancelError("Cannot cancel this order.");
    }
  };

  const sc = order ? getStyle(order.status) : null;

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
          maxWidth: 560,
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
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Order #{order?.id}
            </h3>
            {order && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  margin: "2px 0 0",
                }}
              >
                {fmt(order.createdAt)}
              </p>
            )}
          </div>
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

        {isLoading && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            Loading…
          </div>
        )}

        {order && sc && (
          <div style={{ padding: 24 }}>
            {/* Status */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  background: sc.bg,
                  color: sc.color,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 14px",
                  borderRadius: "var(--radius-full)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: sc.dot,
                    display: "inline-block",
                  }}
                />
                {sc.label}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {order.paymentMethod.toUpperCase()}
              </span>
            </div>

            {/* Items */}
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Items
            </p>
            <div style={{ marginBottom: 20 }}>
              {order.orderItems.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      i < order.orderItems.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        background: "var(--bg-muted)",
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                      }}
                    >
                      📦
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {item.name}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Qty: {item.quantity} × Rs.{" "}
                      {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--primary)",
                    }}
                  >
                    Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery address */}
            {order.address && (
              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Delivery Address
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: 14,
                    background: "var(--bg-muted)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <MdLocationOn
                    size={16}
                    color="var(--text-muted)"
                    style={{ marginTop: 1, flexShrink: 0 }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {order.address.name} · {order.address.phone}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {order.address.addressLine1}
                      {order.address.addressLine2 &&
                        `, ${order.address.addressLine2}`}
                      , {order.address.city}
                      {order.address.postalCode &&
                        ` - ${order.address.postalCode}`}
                      {order.address.province && `, ${order.address.province}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Totals */}
            <div
              style={{
                background: "var(--bg-muted)",
                borderRadius: "var(--radius-sm)",
                padding: 16,
              }}
            >
              {[
                [
                  "Subtotal",
                  `Rs. ${(order.total - order.deliveryFee + order.couponDiscount).toLocaleString()}`,
                ],
                ...(order.deliveryFee > 0
                  ? [["Delivery", `Rs. ${order.deliveryFee.toLocaleString()}`]]
                  : [["Delivery", "FREE"]]),
                ...(order.couponDiscount > 0
                  ? [
                      [
                        "Discount",
                        `- Rs. ${order.couponDiscount.toLocaleString()}`,
                      ],
                    ]
                  : []),
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  <span>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
              <div
                style={{
                  height: 1,
                  background: "var(--border)",
                  margin: "10px 0",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: "var(--primary)",
                  }}
                >
                  Rs. {order.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            {cancelError && (
              <p style={{ color: "var(--error)", fontSize: 12, marginTop: 10 }}>
                {cancelError}
              </p>
            )}
            {["pending", "processing"].includes(order.status) && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: "10px",
                  background: "#FEF2F2",
                  color: "var(--error)",
                  border: "1px solid #FECACA",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: cancelling ? "not-allowed" : "pointer",
                  opacity: cancelling ? 0.7 : 1,
                }}
              >
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Orders Page
═══════════════════════════════════════════════════ */
const OrdersPage = () => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { data, isLoading } = useGetMyOrdersQuery(undefined, {
    skip: !isAuthenticated,
  });
  const orders = data?.orders ?? [];

  const [tab, setTab] = useState("All");
  const [detailId, setDetailId] = useState<number | null>(null);

  const filtered =
    tab === "All"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === tab.toLowerCase());

  return (
    <AccountLayout>
      <div className="card" style={{ padding: 24 }}>
        {/* Header */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 20,
          }}
        >
          My Orders
        </h2>

        {/* Tab Filter */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            borderBottom: "1px solid var(--border)",
            paddingBottom: 0,
            overflowX: "auto",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: tab === t ? "var(--primary)" : "var(--text-muted)",
                borderBottom: `2px solid ${tab === t ? "var(--primary)" : "transparent"}`,
                transition: "var(--transition)",
                whiteSpace: "nowrap",
              }}
            >
              {t}
              {t === "All" && orders.length > 0 && (
                <span
                  style={{
                    marginLeft: 5,
                    fontSize: 11,
                    background: "var(--primary)",
                    color: "white",
                    padding: "1px 6px",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 72,
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

        {/* Not authenticated */}
        {!isAuthenticated && !isLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              color: "var(--text-muted)",
            }}
          >
            <FaBoxOpen size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 15, fontWeight: 600 }}>
              Please{" "}
              <Link to="/login" style={{ color: "var(--primary)" }}>
                login
              </Link>{" "}
              to view orders
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && isAuthenticated && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-muted)",
            }}
          >
            <FaBoxOpen size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              {tab === "All"
                ? "No orders yet"
                : `No ${tab.toLowerCase()} orders`}
            </p>
            {tab === "All" && (
              <Link
                to="/products"
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Browse Products
              </Link>
            )}
          </div>
        )}

        {/* Orders list */}
        {!isLoading && filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((order) => {
              const sc = getStyle(order.status);
              return (
                <div
                  key={order.id}
                  style={{
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    transition: "var(--transition)",
                  }}
                >
                  {/* Row */}
                  <div
                    onClick={() => setDetailId(order.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "14px 20px",
                      cursor: "pointer",
                      background: "white",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 24,
                        alignItems: "center",
                        flex: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Order ID */}
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginBottom: 2,
                          }}
                        >
                          Order ID
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            fontFamily: "monospace",
                          }}
                        >
                          #{order.id}
                        </p>
                      </div>
                      {/* Date */}
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginBottom: 2,
                          }}
                        >
                          Date
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {fmt(order.createdAt)}
                        </p>
                      </div>
                      {/* Items */}
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginBottom: 2,
                          }}
                        >
                          Items
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {order.item_count ?? order.orderItems?.length ?? "—"}{" "}
                          item{(order.item_count ?? 1) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {/* Total */}
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginBottom: 2,
                          }}
                        >
                          Total
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--primary)",
                          }}
                        >
                          Rs. {Number(order.total).toLocaleString()}
                        </p>
                      </div>
                      {/* Status */}
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "3px 12px",
                          borderRadius: "var(--radius-full)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: sc.dot,
                            display: "inline-block",
                          }}
                        />
                        {sc.label}
                      </span>
                    </div>
                    {/* Arrow */}
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        marginLeft: 8,
                      }}
                    >
                      View →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {detailId !== null && (
        <OrderDetailModal
          orderId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </AccountLayout>
  );
};

export default OrdersPage;
