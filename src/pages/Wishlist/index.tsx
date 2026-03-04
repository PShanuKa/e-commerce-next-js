import { useState } from "react";
import { Link } from "react-router-dom";
import { IoHeart, IoHeartDislike } from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { MdLogin } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistSlice";
import { useAddToCartMutation } from "@/services/cartSlice";

/* ─── Badge colors ──────────────────────────────────── */
const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  "Best Seller": { bg: "#FEF3C7", color: "#B45309" },
  New: { bg: "#ECFDF5", color: "#065F46" },
  "Top Rated": { bg: "#EFF6FF", color: "#1D4ED8" },
  Sale: { bg: "#FEF2F2", color: "#B91C1C" },
  Hot: { bg: "#FFF7ED", color: "#C2410C" },
};

/* ─── Skeleton ──────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="card" style={{ overflow: "hidden" }}>
    <div
      style={{
        height: 200,
        background:
          "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
    <div style={{ padding: 16 }}>
      {[60, 90, 50, 40].map((w, i) => (
        <div
          key={i}
          style={{
            height: 12,
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

/* ─── Wishlist Page ─────────────────────────────────── */
const WishlistPage = () => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { data, isLoading } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const [cartAdded, setCartAdded] = useState<number[]>([]);
  const [cartAdding, setCartAdding] = useState<number[]>([]);

  const items = data?.wishlist ?? [];

  const handleRemove = (productId: number) => removeFromWishlist(productId);

  const handleAddToCart = async (productId: number) => {
    setCartAdding((prev) => [...prev, productId]);
    try {
      await addToCart({ product_id: productId, quantity: 1 }).unwrap();
      setCartAdded((prev) => [...prev, productId]);
      setTimeout(
        () => setCartAdded((prev) => prev.filter((x) => x !== productId)),
        2000,
      );
    } finally {
      setCartAdding((prev) => prev.filter((x) => x !== productId));
    }
  };

  /* ── Not logged in ── */
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
          Please log in to view and manage your wishlist.
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
        <IoHeart size={64} color="#E2E8F0" style={{ marginBottom: 20 }} />
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Your wishlist is empty
        </h2>
        <p
          style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}
        >
          Save items you love to your wishlist and shop them later.
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
          Explore Products
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
            Wishlist
          </span>
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            My Wishlist{" "}
            {!isLoading && (
              <span
                style={{
                  fontSize: 16,
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
          {items.length > 0 && (
            <button
              onClick={() =>
                items.forEach((i) => removeFromWishlist(i.product_id))
              }
              style={{
                fontSize: 13,
                color: "var(--error)",
                background: "none",
                border: "1px solid #FECACA",
                borderRadius: "var(--radius-sm)",
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IoHeartDislike size={14} /> Clear All
            </button>
          )}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {/* Loading skeletons */}
          {isLoading && [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}

          {/* Real items */}
          {items.map((item) => {
            const disc =
              item.original_price && item.original_price > item.price
                ? Math.round(
                    ((item.original_price - item.price) / item.original_price) *
                      100,
                  )
                : null;
            const badgeStyle = item.badge
              ? (BADGE_COLORS[item.badge] ?? {
                  bg: "#F1F5F9",
                  color: "#475569",
                })
              : null;
            const isAdded = cartAdded.includes(item.product_id);
            const isAdding = cartAdding.includes(item.product_id);

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item.product_id)}
                  title="Remove from wishlist"
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <FaTrashAlt size={13} color="#EF4444" />
                </button>

                {/* Image */}
                <Link
                  to={`/product/${item.product_id}`}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/400x400?text=No+Image"
                    }
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.4s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.06)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/400x400?text=No+Image")
                    }
                  />
                  {/* Discount badge */}
                  {disc && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "var(--error)",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      -{disc}%
                    </div>
                  )}
                  {/* Label badge */}
                  {badgeStyle && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 10,
                        left: 10,
                        ...badgeStyle,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.badge}
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div
                  style={{
                    padding: 16,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Link to={`/product/${item.product_id}`} style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        lineHeight: 1.45,
                        marginBottom: 10,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.name}
                    </p>
                  </Link>

                  {/* Price */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: "var(--primary)",
                      }}
                    >
                      Rs. {Number(item.price).toLocaleString()}
                    </span>
                    {item.original_price && (
                      <>
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            textDecoration: "line-through",
                          }}
                        >
                          Rs. {Number(item.original_price).toLocaleString()}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--accent)",
                            fontWeight: 600,
                          }}
                        >
                          Save Rs.{" "}
                          {(
                            Number(item.original_price) - Number(item.price)
                          ).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleAddToCart(item.product_id)}
                      disabled={isAdding || isAdded}
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        background: isAdded
                          ? "var(--accent)"
                          : "var(--primary)",
                        color: "white",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 13,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        transition: "var(--transition)",
                        border: "none",
                        cursor: isAdding ? "not-allowed" : "pointer",
                      }}
                    >
                      <HiOutlineShoppingCart size={14} />
                      {isAdding
                        ? "Adding..."
                        : isAdded
                          ? "Added ✓"
                          : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => handleRemove(item.product_id)}
                      title="Remove"
                      style={{
                        width: 36,
                        height: 36,
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <IoHeart color="#EF4444" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue shopping */}
        {!isLoading && items.length > 0 && (
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link
              to="/products"
              style={{
                color: "var(--primary)",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
};

export default WishlistPage;
