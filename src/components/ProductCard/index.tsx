import { useState } from "react";
import { Link } from "react-router-dom";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useAddToCartMutation } from "@/services/cartSlice";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistSlice";
import type { Product } from "@/services/productSlice";

/* ─── Badge & Availability lookup ──────────────── */
const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  "Best Seller": { bg: "#FEF3C7", color: "#B45309" },
  New: { bg: "#ECFDF5", color: "#065F46" },
  "Top Rated": { bg: "#EFF6FF", color: "#1D4ED8" },
  Sale: { bg: "#FEF2F2", color: "#B91C1C" },
  Hot: { bg: "#FFF7ED", color: "#C2410C" },
};

const AVAIL_LABELS: Record<string, { label: string; color: string }> = {
  in_stock: { label: "In Stock", color: "#059669" },
  ships_2_3_days: { label: "Ships in 2-3 Days", color: "#D97706" },
  pre_order: { label: "Pre Order", color: "#7C3AED" },
};

const PLACEHOLDER = "https://via.placeholder.com/400x400?text=No+Image";

/* ─── Props ─────────────────────────────────────── */
export interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
}

/* ─── Component ─────────────────────────────────── */
const ProductCard = ({ product, view = "grid" }: ProductCardProps) => {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  /* ── Derived values ── */
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;
  const badge = product.badge
    ? (BADGE_COLORS[product.badge] ?? { bg: "#F1F5F9", color: "#475569" })
    : null;

  const isOutOfStock = product.stockQty <= 0;
  const avail = isOutOfStock
    ? { label: "Out of Stock", color: "#EF4444" }
    : AVAIL_LABELS[product.availability];
  const imgHeight = view === "list" ? 160 : 200;

  /* ── Handlers ── */
  const handleAddToCart = async () => {
    if (!isAuthenticated) return;
    try {
      await addToCart({ product_id: product.id, quantity: 1 }).unwrap();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      if (wishlisted) await removeFromWishlist(product.id);
      else await addToWishlist(product.id);
      setWishlisted(!wishlisted);
    } catch {
      /* ignore */
    }
  };

  /* ── Shared image block ── */
  const imageBlock = (
    <img
      src={product.image || PLACEHOLDER}
      alt={product.name}
      style={{
        width: "100%",
        height: imgHeight,
        objectFit: "cover",
        transition: "transform 0.4s ease",
        display: "block",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
    />
  );

  /* ══════════════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════════════ */
  if (view === "list") {
    return (
      <div
        className="card"
        style={{ display: "flex", gap: 0, overflow: "hidden" }}
      >
        {/* Image */}
        <Link
          to={`/product/${product.id}`}
          style={{
            flexShrink: 0,
            width: 200,
            overflow: "hidden",
            background: "#F8FAFC",
            display: "block",
          }}
        >
          {imageBlock}
        </Link>

        {/* Info */}
        <div
          style={{
            flex: 1,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* Badges row */}
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 6,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {badge && (
                <span
                  style={{
                    ...badge,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    textTransform: "uppercase",
                  }}
                >
                  {product.badge}
                </span>
              )}
              {avail && (
                <span
                  style={{ fontSize: 10, color: avail.color, fontWeight: 600 }}
                >
                  ● {avail.label}
                </span>
              )}
            </div>

            {/* Name */}
            <Link to={`/product/${product.id}`}>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                  lineHeight: 1.4,
                }}
              >
                {product.name}
              </h3>
            </Link>

            {/* Category */}
            {product.category_name && (
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                {product.category_name}
              </span>
            )}
          </div>

          {/* Pricing + Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--primary)",
                }}
              >
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    textDecoration: "line-through",
                  }}
                >
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount && (
                <span
                  style={{
                    background: "var(--error)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  -{discount}%
                </span>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                title={
                  isAuthenticated
                    ? wishlisted
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                    : "Login to wishlist"
                }
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--border)",
                  background: wishlisted ? "#FEF2F2" : "white",
                  cursor: isAuthenticated ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {wishlisted ? (
                  <IoHeart color="#EF4444" size={16} />
                ) : (
                  <IoHeartOutline size={16} color="var(--text-muted)" />
                )}
              </button>
              {/* Cart */}
              <button
                onClick={handleAddToCart}
                disabled={
                  adding || addedToCart || !isAuthenticated || isOutOfStock
                }
                style={{
                  padding: "0 20px",
                  height: 36,
                  background: addedToCart ? "var(--accent)" : "var(--primary)",
                  color: "white",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  cursor:
                    adding || !isAuthenticated ? "not-allowed" : "pointer",
                  transition: "var(--transition)",
                  whiteSpace: "nowrap",
                  opacity: !isAuthenticated ? 0.7 : 1,
                }}
              >
                <HiOutlineShoppingCart size={15} />
                {adding
                  ? "Adding..."
                  : addedToCart
                    ? "Added ✓"
                    : isAuthenticated
                      ? isOutOfStock
                        ? "Out of Stock"
                        : "Add to Cart"
                      : "Login to Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     GRID VIEW (default)
  ══════════════════════════════════════════════════ */
  return (
    <div
      className="card"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      {/* Image section */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#F8FAFC",
        }}
      >
        <Link to={`/product/${product.id}`}>{imageBlock}</Link>

        {/* Discount chip — top left */}
        {discount && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "var(--error)",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 7px",
              borderRadius: "var(--radius-sm)",
            }}
          >
            -{discount}%
          </div>
        )}

        {/* Badge chip — top right */}
        {badge && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              ...badge,
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 7px",
              borderRadius: "var(--radius-sm)",
              textTransform: "uppercase",
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Wishlist heart — bottom right */}
        <button
          onClick={handleWishlist}
          title={
            isAuthenticated
              ? wishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"
              : "Login to wishlist"
          }
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: wishlisted ? "#FEF2F2" : "white",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: isAuthenticated ? "pointer" : "not-allowed",
            transition: "var(--transition)",
          }}
        >
          {wishlisted ? (
            <IoHeart size={14} color="#EF4444" />
          ) : (
            <IoHeartOutline size={14} color="var(--text-muted)" />
          )}
        </button>
      </div>

      {/* Info section */}
      <div
        style={{
          padding: 14,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Category + Availability row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            {product.category_name ?? ""}
          </span>
          {avail && (
            <span
              style={{
                fontSize: 9,
                color: avail.color,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              ● {avail.label}
            </span>
          )}
        </div>

        {/* Product name */}
        <Link to={`/product/${product.id}`} style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.45,
              marginBottom: 8,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name}
          </p>
        </Link>

        {/* Price row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 12,
          }}
        >
          <span
            style={{ fontSize: 17, fontWeight: 800, color: "var(--primary)" }}
          >
            Rs. {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                textDecoration: "line-through",
              }}
            >
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={adding || addedToCart || !isAuthenticated || isOutOfStock}
          style={{
            width: "100%",
            padding: "9px",
            background: addedToCart ? "var(--accent)" : "var(--primary)",
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
            cursor: adding || !isAuthenticated ? "not-allowed" : "pointer",
            opacity: !isAuthenticated ? 0.7 : 1,
          }}
        >
          <HiOutlineShoppingCart size={15} />
          {adding
            ? "Adding..."
            : addedToCart
              ? "Added ✓"
              : isAuthenticated
                ? isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"
                : "Login to Add"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
