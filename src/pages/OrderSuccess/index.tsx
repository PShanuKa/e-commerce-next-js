import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoCheckmarkCircle, IoCopyOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";

const ORDER_ID = "SLK-" + Math.random().toString(36).toUpperCase().slice(2, 9);

const ORDER_ITEMS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Headphones",
    price: 34500,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    name: "Apple AirPods Pro (2nd Gen)",
    price: 58000,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=80&h=80&fit=crop",
  },
];

const STEPS = [
  { label: "Order Placed", time: "Just now", done: true },
  { label: "Processing", time: "Within 1 hour", done: false },
  { label: "Shipped", time: "1-2 Business Days", done: false },
  { label: "Delivered", time: "3-5 Business Days", done: false },
];

const OrderSuccess = () => {
  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    setTimeout(() => setConfetti(false), 4000);
  }, []);

  const copyOrderId = () => {
    navigator.clipboard.writeText(ORDER_ID).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        padding: "40px 0 80px",
        background: "var(--bg-base)",
        minHeight: "80vh",
      }}
    >
      <div className="container">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {/* Success Banner */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 36,
              padding: "48px 32px",
              background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid #6EE7B7",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {confetti && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 8,
                      height: 8,
                      borderRadius: i % 2 === 0 ? "50%" : "0",
                      background: [
                        "#F59E0B",
                        "#3B82F6",
                        "#EF4444",
                        "#8B5CF6",
                        "#10B981",
                      ][i % 5],
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random(),
                      animation: `fadeIn ${Math.random() * 2 + 1}s ease infinite alternate`,
                    }}
                  />
                ))}
              </div>
            )}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#D1FAE5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <IoCheckmarkCircle size={52} color="#059669" />
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#065F46",
                marginBottom: 8,
              }}
            >
              Order Placed! 🎉
            </h1>
            <p style={{ fontSize: 15, color: "#047857", marginBottom: 20 }}>
              Thank you! Your order has been successfully placed and is being
              processed.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                background: "white",
                borderRadius: "var(--radius-sm)",
                padding: "12px 20px",
                border: "1px solid #6EE7B7",
                width: "fit-content",
                margin: "0 auto",
              }}
            >
              <span style={{ fontSize: 13, color: "#064E3B" }}>Order ID: </span>
              <strong
                style={{
                  fontSize: 14,
                  color: "#059669",
                  fontFamily: "monospace",
                }}
              >
                {ORDER_ID}
              </strong>
              <button
                onClick={copyOrderId}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: copied ? "#059669" : "#6B7280",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IoCopyOutline size={15} />
              </button>
              {copied && (
                <span
                  style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}
                >
                  Copied!
                </span>
              )}
            </div>
          </div>

          {/* Order Tracking */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 24,
              }}
            >
              📦 Order Tracking
            </h3>
            <div style={{ position: "relative", paddingLeft: 28 }}>
              <div
                style={{
                  position: "absolute",
                  left: 11,
                  top: 12,
                  bottom: 12,
                  width: 2,
                  background: "var(--border)",
                }}
              />
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    marginBottom: i < STEPS.length - 1 ? 28 : 0,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: -22,
                      top: 0,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: step.done
                        ? "var(--accent)"
                        : "var(--bg-muted)",
                      border: `2px solid ${step.done ? "var(--accent)" : "var(--border)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {step.done ? (
                      <IoCheckmarkCircle size={16} color="white" />
                    ) : (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "var(--border)",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: step.done ? 700 : 500,
                        color: step.done
                          ? "var(--text-primary)"
                          : "var(--text-muted)",
                      }}
                    >
                      {step.label}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Order Items
            </h3>
            {ORDER_ITEMS.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  paddingBottom: i < ORDER_ITEMS.length - 1 ? 14 : 0,
                  marginBottom: i < ORDER_ITEMS.length - 1 ? 14 : 0,
                  borderBottom:
                    i < ORDER_ITEMS.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 56,
                    height: 56,
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
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Qty: {item.qty}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--primary)",
                  }}
                >
                  Rs. {(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "16px 0",
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
                Total Paid
              </span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: "var(--primary)",
                }}
              >
                Rs.{" "}
                {ORDER_ITEMS.reduce(
                  (s, i) => s + i.price * i.qty,
                  0,
                ).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Info Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div className="card" style={{ padding: 16 }}>
              <div
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
              >
                <TbTruckDelivery
                  size={20}
                  color="var(--primary)"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 3,
                    }}
                  >
                    Delivery Address
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    Kasun Perera
                    <br />
                    123 Galle Rd, Colombo 03
                    <br />
                    +94 77 123 4567
                  </p>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>📧</span>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 3,
                    }}
                  >
                    Confirmation Email
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    A confirmation email has been sent to your registered email
                    address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              to="/account/orders"
              style={{
                flex: 1,
                padding: "13px",
                background: "white",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                textAlign: "center",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
                textDecoration: "none",
              }}
            >
              View My Orders
            </Link>
            <Link
              to="/products"
              style={{
                flex: 1,
                padding: "13px",
                background: "var(--primary)",
                color: "white",
                borderRadius: "var(--radius-sm)",
                textAlign: "center",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default OrderSuccess;
