import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoHeartOutline, IoArrowBack } from "react-icons/io5";
import { TbTruckDelivery, TbShieldCheck } from "react-icons/tb";
import { HiOutlineTag } from "react-icons/hi";

const INITIAL_CART = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 34500,
    originalPrice: 48000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    variant: "Midnight Black",
  },
  {
    id: 3,
    name: "Apple AirPods Pro (2nd Gen)",
    price: 58000,
    originalPrice: 65000,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&h=200&fit=crop",
    variant: "White",
  },
  {
    id: 11,
    name: "Yoga Mat Premium Non-Slip 6mm",
    price: 3500,
    originalPrice: 5000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1601925228008-0f0f48e1c15c?w=200&h=200&fit=crop",
    variant: "Purple",
  },
];

const CartPage = () => {
  const [items, setItems] = useState(INITIAL_CART);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const updateQty = (id: number, delta: number) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    );
  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const originalTotal = items.reduce(
    (sum, i) => sum + i.originalPrice * i.qty,
    0,
  );
  const savings = originalTotal - subtotal;
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = subtotal >= 5000 ? 0 : 350;
  const total = subtotal - couponDiscount + deliveryFee;

  const handleCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try SAVE10");
      setCouponApplied(false);
    }
  };

  if (items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: 40,
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 24 }}>🛒</div>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Your cart is empty
        </h2>
        <p
          style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 28 }}
        >
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/shop"
          style={{
            padding: "12px 32px",
            background: "var(--primary)",
            color: "white",
            borderRadius: "var(--radius-sm)",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 0 60px", background: "var(--bg-base)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 28,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          <Link to="/" style={{ color: "var(--primary)" }}>
            Home
          </Link>{" "}
          <span>/</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            Shopping Cart
          </span>
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 28,
          }}
        >
          Shopping Cart{" "}
          <span
            style={{
              fontSize: 16,
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            ({items.reduce((s, i) => s + i.qty, 0)} items)
          </span>
        </h1>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}
        >
          {/* ── Cart Items ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Select All Bar */}
            <div
              className="card"
              style={{
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{
                    accentColor: "var(--primary)",
                    width: 15,
                    height: 15,
                  }}
                />{" "}
                Select All ({items.length} items)
              </label>
              <button
                onClick={() => setItems([])}
                style={{
                  fontSize: 12,
                  color: "var(--error)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <FaTrashAlt size={11} /> Remove All
              </button>
            </div>

            {items.map((item) => {
              const disc = Math.round(
                ((item.originalPrice - item.price) / item.originalPrice) * 100,
              );
              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: 16,
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{
                      accentColor: "var(--primary)",
                      width: 16,
                      height: 16,
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  />
                  <Link to={`/product/${item.id}`} style={{ flexShrink: 0 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item.id}`}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: 4,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.name}
                      </p>
                    </Link>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginBottom: 10,
                      }}
                    >
                      Variant: {item.variant}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "var(--primary)",
                          }}
                        >
                          Rs. {item.price.toLocaleString()}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            textDecoration: "line-through",
                          }}
                        >
                          Rs. {item.originalPrice.toLocaleString()}
                        </span>
                        <span
                          style={{
                            background: "var(--error)",
                            color: "white",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          -{disc}%
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            style={{
                              width: 30,
                              height: 30,
                              background: "var(--bg-muted)",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaMinus size={9} color="var(--text-muted)" />
                          </button>
                          <span
                            style={{
                              width: 36,
                              textAlign: "center",
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                          >
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            style={{
                              width: 30,
                              height: 30,
                              background: "var(--bg-muted)",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaPlus size={9} color="var(--text-muted)" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            width: 30,
                            height: 30,
                            background: "none",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IoHeartOutline size={14} color="var(--text-muted)" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            width: 30,
                            height: 30,
                            background: "none",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaTrashAlt size={12} color="var(--error)" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link
              to="/shop"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--primary)",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                padding: "8px 0",
              }}
            >
              <IoArrowBack size={16} /> Continue Shopping
            </Link>
          </div>

          {/* ── Order Summary ── */}
          <div style={{ position: "sticky", top: 100 }}>
            <div className="card" style={{ padding: 24, marginBottom: 12 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 20,
                }}
              >
                Order Summary
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>
                    Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)
                  </span>
                  <span
                    style={{ fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "var(--accent)",
                  }}
                >
                  <span>You save</span>
                  <span style={{ fontWeight: 600 }}>
                    -Rs. {savings.toLocaleString()}
                  </span>
                </div>
                {couponApplied && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      color: "var(--accent)",
                    }}
                  >
                    <span>Coupon (SAVE10)</span>
                    <span style={{ fontWeight: 600 }}>
                      -Rs. {couponDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>Delivery Fee</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color:
                        deliveryFee === 0
                          ? "var(--accent)"
                          : "var(--text-primary)",
                    }}
                  >
                    {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                <div style={{ height: 1, background: "var(--border)" }} />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: "var(--primary)",
                    }}
                  >
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Coupon */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <HiOutlineTag
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      size={15}
                      color="var(--text-muted)"
                    />
                    <input
                      value={coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="Coupon code"
                      style={{
                        width: "100%",
                        padding: "9px 10px 9px 32px",
                        border: `1.5px solid ${couponError ? "var(--error)" : "var(--border)"}`,
                        borderRadius: "var(--radius-sm)",
                        fontSize: 13,
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleCoupon}
                    style={{
                      padding: "0 16px",
                      background: "var(--primary)",
                      color: "white",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--error)",
                      marginTop: 6,
                    }}
                  >
                    {couponError}
                  </p>
                )}
                {couponApplied && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      marginTop: 6,
                      fontWeight: 600,
                    }}
                  >
                    ✓ Coupon applied! 10% off
                  </p>
                )}
              </div>

              <Link
                to="/checkout"
                style={{
                  display: "block",
                  width: "100%",
                  padding: 14,
                  background: "var(--primary)",
                  color: "white",
                  borderRadius: "var(--radius-sm)",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  marginBottom: 12,
                  transition: "var(--transition)",
                }}
              >
                Proceed to Checkout →
              </Link>
              <p
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                Taxes calculated at checkout
              </p>
            </div>

            <div className="card" style={{ padding: 16 }}>
              {[
                {
                  icon: <TbTruckDelivery size={18} color="var(--primary)" />,
                  text: "Free delivery on orders over Rs. 5,000",
                },
                {
                  icon: <TbShieldCheck size={18} color="var(--accent)" />,
                  text: "256-bit SSL encrypted checkout",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    marginBottom: i === 0 ? 12 : 0,
                  }}
                >
                  {item.icon}
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
