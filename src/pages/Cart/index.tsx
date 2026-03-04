import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoHeartOutline, IoArrowBack } from "react-icons/io5";
import { TbTruckDelivery, TbShieldCheck } from "react-icons/tb";
import { HiOutlineTag } from "react-icons/hi";
import { MdLogin } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "@/services/cartSlice";

/* ─── Skeleton ─────────────────────────────────────── */
const SkeletonItem = () => (
  <div className="card" style={{ padding: 16, display: "flex", gap: 16 }}>
    <div
      style={{
        width: 90,
        height: 90,
        borderRadius: "var(--radius-sm)",
        background:
          "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        flexShrink: 0,
      }}
    />
    <div style={{ flex: 1 }}>
      {[80, 50, 60].map((w, i) => (
        <div
          key={i}
          style={{
            height: 13,
            background: "#f0f0f0",
            borderRadius: 4,
            marginBottom: 10,
            width: `${w}%`,
            animation: "shimmer 1.4s infinite",
          }}
        />
      ))}
    </div>
  </div>
);

/* ─── Cart Page ─────────────────────────────────────── */
const CartPage = () => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { data, isLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const items = data?.items ?? [];

  const handleQty = (productId: number, qty: number) => {
    if (qty < 1) return;
    updateItem({ productId, quantity: qty });
  };
  const handleRemove = (productId: number) => removeItem(productId);
  const handleClearAll = () => clearCart();

  const handleCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try SAVE10");
      setCouponApplied(false);
    }
  };

  const subtotal = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const originalTotal = items.reduce(
    (s, i) => s + (Number(i.original_price) || Number(i.price)) * i.quantity,
    0,
  );
  const savings = originalTotal - subtotal;
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = subtotal >= 5000 ? 0 : 350;
  const total = subtotal - couponDiscount + deliveryFee;

  /* ── Not Logged In ── */
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: 40,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 20 }}>🔒</div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Login Required
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            marginBottom: 28,
            maxWidth: 320,
          }}
        >
          Please log in to view your cart and start shopping.
        </p>
        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 32px",
            background: "var(--primary)",
            color: "white",
            borderRadius: "var(--radius-sm)",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          <MdLogin size={18} /> Login
        </Link>
      </div>
    );
  }

  /* ── Empty ── */
  if (!isLoading && items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: 40,
          textAlign: "center",
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
          to="/products"
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
        {/* Breadcrumb */}
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
            ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </span>
        </h1>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}
        >
          {/* ── Items ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Toolbar */}
            {!isLoading && (
              <div
                className="card"
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
                <button
                  onClick={handleClearAll}
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
            )}

            {/* Loading skeletons */}
            {isLoading && [1, 2, 3].map((i) => <SkeletonItem key={i} />)}

            {/* Cart items */}
            {items.map((item) => {
              const disc =
                item.original_price && item.original_price > item.price
                  ? Math.round(
                      ((item.original_price - item.price) /
                        item.original_price) *
                        100,
                    )
                  : null;
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
                  <Link
                    to={`/product/${item.product_id}`}
                    style={{ flexShrink: 0 }}
                  >
                    <img
                      src={
                        item.image || "https://via.placeholder.com/90x90?text=?"
                      }
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
                    <Link to={`/product/${item.product_id}`}>
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
                    {item.variant && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginBottom: 10,
                        }}
                      >
                        Variant: {item.variant}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Price */}
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
                          Rs. {Number(item.price).toLocaleString()}
                        </span>
                        {item.original_price && (
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                              textDecoration: "line-through",
                            }}
                          >
                            Rs. {Number(item.original_price).toLocaleString()}
                          </span>
                        )}
                        {disc && (
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
                        )}
                      </div>
                      {/* Controls */}
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
                            onClick={() =>
                              handleQty(item.product_id, item.quantity - 1)
                            }
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
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQty(item.product_id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock_qty}
                            style={{
                              width: 30,
                              height: 30,
                              background: "var(--bg-muted)",
                              border: "none",
                              cursor:
                                item.quantity >= item.stock_qty
                                  ? "not-allowed"
                                  : "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity:
                                item.quantity >= item.stock_qty ? 0.4 : 1,
                            }}
                          >
                            <FaPlus size={9} color="var(--text-muted)" />
                          </button>
                        </div>
                        <button
                          title="Move to Wishlist"
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
                          onClick={() => handleRemove(item.product_id)}
                          title="Remove"
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
                    {/* Row total */}
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginTop: 6,
                      }}
                    >
                      Subtotal:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        Rs.{" "}
                        {(Number(item.price) * item.quantity).toLocaleString()}
                      </strong>
                    </p>
                  </div>
                </div>
              );
            })}

            <Link
              to="/products"
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
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span
                    style={{ fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                {savings > 0 && (
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
                )}
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
                        boxSizing: "border-box",
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
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
};

export default CartPage;
