import { useState } from "react";
import { Link } from "react-router-dom";
import { IoStarSharp } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { FaBoxOpen } from "react-icons/fa";
import { AccountLayout } from "../Account";

const STATUS_COLORS: Record<
  string,
  { bg: string; color: string; dot: string }
> = {
  Delivered: { bg: "#ECFDF5", color: "#059669", dot: "#10B981" },
  Processing: { bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  Shipped: { bg: "#FFF7ED", color: "#C2410C", dot: "#F97316" },
  Cancelled: { bg: "#FEF2F2", color: "#B91C1C", dot: "#EF4444" },
};

const ORDERS = [
  {
    id: "SLK-A1B2C3",
    date: "Mar 2, 2025",
    status: "Delivered",
    total: 150500,
    items: [
      {
        name: "Sony WH-1000XM5 Headphones",
        qty: 1,
        price: 34500,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      },
      {
        name: "Apple AirPods Pro (2nd Gen)",
        qty: 2,
        price: 58000,
        image:
          "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "SLK-D4E5F6",
    date: "Feb 20, 2025",
    status: "Delivered",
    total: 3500,
    items: [
      {
        name: "Yoga Mat Premium Non-Slip",
        qty: 1,
        price: 3500,
        image:
          "https://images.unsplash.com/photo-1601925228008-0f0f48e1c15c?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "SLK-G7H8I9",
    date: "Feb 5, 2025",
    status: "Delivered",
    total: 135000,
    items: [
      {
        name: "Canon EOS R50 Mirrorless Camera",
        qty: 1,
        price: 135000,
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop",
      },
    ],
  },
  {
    id: "SLK-J1K2L3",
    date: "Jan 18, 2025",
    status: "Cancelled",
    total: 22000,
    items: [
      {
        name: "Logitech MX Master 3S Mouse",
        qty: 1,
        price: 22000,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop",
      },
    ],
  },
];

const TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const OrdersPage = () => {
  const [tab, setTab] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<string[]>([]);

  const orders =
    tab === "All" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  return (
    <AccountLayout>
      <div className="card" style={{ padding: 24 }}>
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
            </button>
          ))}
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-muted)",
            }}
          >
            <FaBoxOpen size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              No {tab.toLowerCase()} orders
            </p>
            <Link
              to="/shop"
              style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13 }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map((order) => {
              const sc = STATUS_COLORS[order.status];
              const isOpen = expanded === order.id;
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
                  {/* Order Header */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "14px 20px",
                      cursor: "pointer",
                      background: isOpen ? "var(--bg-muted)" : "white",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 24,
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 12,
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
                          {order.id}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 12,
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
                          {order.date}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 12,
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
                          Rs. {order.total.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            marginBottom: 4,
                          }}
                        >
                          Status
                        </p>
                        <span
                          style={{
                            background: sc.bg,
                            color: sc.color,
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "3px 12px",
                            borderRadius: "var(--radius-full)",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            width: "fit-content",
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
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: 18, color: "var(--text-muted)" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expanded Details */}
                  {isOpen && (
                    <div
                      style={{
                        borderTop: "1px solid var(--border)",
                        padding: "16px 20px",
                        background: "white",
                      }}
                    >
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 14,
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom:
                              i < order.items.length - 1
                                ? "1px solid var(--border)"
                                : "none",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 54,
                              height: 54,
                              objectFit: "cover",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--border)",
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                marginBottom: 3,
                              }}
                            >
                              {item.name}
                            </p>
                            <p
                              style={{
                                fontSize: 12,
                                color: "var(--text-muted)",
                              }}
                            >
                              Qty: {item.qty} × Rs.{" "}
                              {item.price.toLocaleString()}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            {order.status === "Delivered" &&
                              !reviewed.includes(order.id) && (
                                <button
                                  onClick={() =>
                                    setReviewed((prev) => [...prev, order.id])
                                  }
                                  style={{
                                    fontSize: 12,
                                    color: "var(--primary)",
                                    background: "#EFF6FF",
                                    border: "1px solid #BFDBFE",
                                    borderRadius: "var(--radius-sm)",
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <IoStarSharp size={12} /> Rate
                                </button>
                              )}
                            {reviewed.includes(order.id) && (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--accent)",
                                  fontWeight: 700,
                                }}
                              >
                                ✓ Reviewed
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 12,
                          justifyContent: "flex-end",
                        }}
                      >
                        {order.status === "Delivered" && (
                          <button
                            style={{
                              fontSize: 12,
                              color: "var(--text-secondary)",
                              background: "white",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--radius-sm)",
                              padding: "8px 16px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <TbTruckDelivery size={13} /> Reorder
                          </button>
                        )}
                        <Link
                          to={`/product/1`}
                          style={{
                            fontSize: 12,
                            color: "var(--primary)",
                            background: "#EFF6FF",
                            border: "1px solid #BFDBFE",
                            borderRadius: "var(--radius-sm)",
                            padding: "8px 14px",
                            cursor: "pointer",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default OrdersPage;
