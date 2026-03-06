import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IoCheckmarkCircle, IoCopyOutline, IoWarning } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { useGetOrderQuery } from "@/services/orderSlice";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get("id");
  const orderId = orderIdParam ? Number(orderIdParam) : null;

  const { data, isLoading, error } = useGetOrderQuery(orderId!, {
    skip: !orderId,
  });

  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    if (data?.success) {
      const timer = setTimeout(() => setConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const copyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId.toString()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!orderId) {
    return (
      <div
        style={{
          padding: "80px 0",
          textAlign: "center",
          background: "var(--bg-base)",
          minHeight: "80vh",
        }}
      >
        <div className="container">
          <IoWarning
            size={64}
            color="var(--error)"
            style={{ marginBottom: 20 }}
          />
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Invalid Order
          </h1>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            We couldn't find the order ID in the URL.
          </p>
          <Link
            to="/"
            style={{
              padding: "12px 24px",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          padding: "80px 0",
          textAlign: "center",
          background: "var(--bg-base)",
          minHeight: "80vh",
        }}
      >
        <div className="container text-center">
          <div
            className="shimmer"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              margin: "0 auto 20px",
            }}
          />
          <div
            className="shimmer"
            style={{ width: 200, height: 32, margin: "0 auto 10px" }}
          />
          <div
            className="shimmer"
            style={{ width: 300, height: 20, margin: "0 auto" }}
          />
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div
        style={{
          padding: "80px 0",
          textAlign: "center",
          background: "var(--bg-base)",
          minHeight: "80vh",
        }}
      >
        <div className="container">
          <IoWarning
            size={64}
            color="var(--error)"
            style={{ marginBottom: 20 }}
          />
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Order Not Found
          </h1>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            Something went wrong while fetching your order details.
          </p>
          <Link
            to="/account/orders"
            style={{
              padding: "12px 24px",
              background: "var(--primary)",
              color: "white",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Go to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const { order } = data;

  const STEPS = [
    { label: "Order Placed", time: "Just now", done: true },
    {
      label: "Processing",
      time: "Within 1 hour",
      done: order.status !== "pending",
    },
    {
      label: "Shipped",
      time: "1-2 Business Days",
      done: ["shipped", "delivered"].includes(order.status),
    },
    {
      label: "Delivered",
      time: "3-5 Business Days",
      done: order.status === "delivered",
    },
  ];

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
                #{order.id}
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
            {order.orderItems?.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  paddingBottom: i < order.orderItems!.length - 1 ? 14 : 0,
                  marginBottom: i < order.orderItems!.length - 1 ? 14 : 0,
                  borderBottom:
                    i < order.orderItems!.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                    }}
                  />
                )}
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
                  {item.variant && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginBottom: 2,
                      }}
                    >
                      {item.variant}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Qty: {item.quantity}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--primary)",
                  }}
                >
                  Rs. {(Number(item.price) * item.quantity).toLocaleString()}
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
                Rs. {Number(order.total).toLocaleString()}
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
                  {order.address ? (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {order.address.name}
                      <br />
                      {order.address.addressLine1}
                      {order.address.addressLine2 && (
                        <>
                          <br />
                          {order.address.addressLine2}
                        </>
                      )}
                      <br />
                      {order.address.city}
                      <br />
                      {order.address.phone}
                    </p>
                  ) : (
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      No address info.
                    </p>
                  )}
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
