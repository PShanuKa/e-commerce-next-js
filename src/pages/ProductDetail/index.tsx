import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  IoHeartOutline,
  IoHeart,
  IoShareSocialOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircle,
  IoChevronBackOutline,
} from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { TbTruckDelivery, TbRefresh } from "react-icons/tb";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  useGetProductQuery,
  useGetProductsQuery,
} from "@/services/productSlice";
import { useAddToCartMutation } from "@/services/cartSlice";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

/* ─── Availability labels ──────────────────────────── */
const AVAIL: Record<string, { label: string; color: string }> = {
  in_stock: { label: "In Stock", color: "var(--accent)" },
  ships_2_3_days: { label: "Ships in 2–3 Days", color: "#D97706" },
  pre_order: { label: "Pre Order", color: "#7C3AED" },
};

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  "Best Seller": { bg: "#FEF3C7", color: "#B45309" },
  New: { bg: "#ECFDF5", color: "#065F46" },
  "Top Rated": { bg: "#EFF6FF", color: "#1D4ED8" },
  Sale: { bg: "#FEF2F2", color: "#B91C1C" },
  Hot: { bg: "#FFF7ED", color: "#C2410C" },
};

/* ─── Image Placeholder ─────────────────────────────── */
const PLACEHOLDER = "https://via.placeholder.com/600x600?text=No+Image";

/* ─── Skeleton ──────────────────────────────────────── */
const Skeleton = () => (
  <div style={{ padding: "28px 0 60px", background: "var(--bg-base)" }}>
    <div className="container">
      <div
        style={{ display: "grid", gridTemplateColumns: "520px 1fr", gap: 36 }}
      >
        {/* image skeleton */}
        <div>
          <div
            style={{
              height: 420,
              borderRadius: "var(--radius-lg)",
              background:
                "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.4s infinite",
              marginBottom: 12,
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "var(--radius-sm)",
                  background: "#f0f0f0",
                  animation: "shimmer 1.4s infinite",
                }}
              />
            ))}
          </div>
        </div>
        {/* info skeleton */}
        <div style={{ paddingTop: 8 }}>
          {[40, 80, 60, 50, 90, 70].map((w, i) => (
            <div
              key={i}
              style={{
                height: i === 2 ? 36 : 16,
                background: "#f0f0f0",
                borderRadius: 6,
                marginBottom: 18,
                width: `${w}%`,
                animation: "shimmer 1.4s infinite",
              }}
            />
          ))}
        </div>
      </div>
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

/* ─── Related Product Card ───────────────────────────── */
const RelatedCard = ({
  product,
}: {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number | null;
    image?: string | null;
    category_name?: string | null;
  };
}) => (
  <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
    <div
      className="card"
      style={{ overflow: "hidden", transition: "var(--transition)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-4px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <img
        src={product.image || PLACEHOLDER}
        alt={product.name}
        style={{
          width: "100%",
          height: 160,
          objectFit: "cover",
          display: "block",
        }}
      />
      <div style={{ padding: "12px 14px" }}>
        <p
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            fontWeight: 500,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {product.category_name}
        </p>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.4,
            marginBottom: 8,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{ fontSize: 16, fontWeight: 800, color: "var(--primary)" }}
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
      </div>
    </div>
  </Link>
);

/* ─── Main Page ──────────────────────────────────────── */
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);

  const { data, isLoading, isError } = useGetProductQuery(Number(id));
  const product = data?.product;

  // Fetch 4 related products from same category
  const { data: relatedData } = useGetProductsQuery(
    { limit: 5, category: product?.category_slug ?? "" },
    { skip: !product?.category_slug },
  );
  const related = (relatedData?.products ?? [])
    .filter((p) => p.id !== product?.id)
    .slice(0, 4);

  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleCart = async () => {
    if (!isAuthenticated || !product) return;
    try {
      await addToCart({ product_id: product.id, quantity: qty }).unwrap();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch {
      // silently fail
    }
  };

  if (isLoading) return <Skeleton />;

  if (isError || !product) {
    return (
      <div
        style={{
          padding: "80px 0",
          textAlign: "center",
          background: "var(--bg-base)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Product Not Found
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
          This product may have been removed or doesn't exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 28px",
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.image || PLACEHOLDER];
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
  const avail = AVAIL[product.availability] ?? AVAIL["in_stock"];

  return (
    <div style={{ padding: "28px 0 60px", background: "var(--bg-base)" }}>
      <div className="container">
        {/* ── Breadcrumb ── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 28,
            fontSize: 13,
            color: "var(--text-muted)",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={{ color: "var(--primary)" }}>
            Home
          </Link>{" "}
          <span>/</span>
          <Link to="/products" style={{ color: "var(--primary)" }}>
            Shop
          </Link>{" "}
          <span>/</span>
          {product.category_name && (
            <>
              <Link
                to={`/products?category=${product.category_slug}`}
                style={{ color: "var(--primary)" }}
              >
                {product.category_name}
              </Link>{" "}
              <span>/</span>
            </>
          )}
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
            {product.name}
          </span>
        </div>

        {/* ── Main Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 36,
            marginBottom: 48,
          }}
        >
          {/* Image Gallery */}
          <div style={{ width: 520 }}>
            <div
              style={{
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--border)",
                marginBottom: 12,
                position: "relative",
              }}
            >
              <img
                src={Array.isArray(images) ? images[activeImage] : images}
                alt={product.name}
                style={{
                  width: "100%",
                  height: 420,
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />
              {discount && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "var(--error)",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  -{discount}%
                </div>
              )}
              {badge && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    ...badge,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "var(--radius-sm)",
                    textTransform: "uppercase",
                  }}
                >
                  {product.badge}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {Array.isArray(images) && images.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: 80,
                      height: 80,
                      border: `2px solid ${activeImage === i ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      cursor: "pointer",
                      padding: 0,
                      background: "none",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Meta */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {badge && (
                <span
                  style={{
                    ...badge,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "var(--radius-full)",
                    textTransform: "uppercase",
                  }}
                >
                  {product.badge}
                </span>
              )}
              {product.category_name && (
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {product.category_name}
                  {product.brand ? ` · ` : ""}
                  {product.brand && (
                    <strong style={{ color: "var(--text-primary)" }}>
                      {product.brand}
                    </strong>
                  )}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.3,
                marginBottom: 14,
              }}
            >
              {product.name}
            </h1>

            {/* Availability */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: avail.color,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <IoCheckmarkCircle size={15} /> {avail.label}
              </span>
              {product.stockQty > 0 && (
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  · {product.stockQty} units left
                </span>
              )}
            </div>

            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 20,
                padding: "16px 0",
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "var(--primary)",
                }}
              >
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span
                    style={{
                      fontSize: 18,
                      color: "var(--text-muted)",
                      textDecoration: "line-through",
                    }}
                  >
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                  {discount && (
                    <span
                      style={{
                        fontSize: 14,
                        color: "var(--error)",
                        fontWeight: 700,
                      }}
                    >
                      Save Rs.{" "}
                      {(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: 24,
                }}
              >
                {product.description}
              </p>
            )}

            {/* Quantity */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Qty:
              </span>
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
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{
                    width: 36,
                    height: 40,
                    background: "var(--bg-muted)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <FaMinus size={10} />
                </button>
                <span
                  style={{
                    width: 48,
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{
                    width: 36,
                    height: 40,
                    background: "var(--bg-muted)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <FaPlus size={10} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              <button
                onClick={handleCart}
                disabled={addingToCart || addedToCart || !isAuthenticated}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: addedToCart ? "var(--accent)" : "var(--primary)",
                  color: "white",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 15,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  border: "none",
                  cursor:
                    addingToCart || !isAuthenticated
                      ? "not-allowed"
                      : "pointer",
                  transition: "var(--transition)",
                  opacity: !isAuthenticated ? 0.7 : 1,
                }}
              >
                <HiOutlineShoppingCart size={18} />{" "}
                {addingToCart
                  ? "Adding..."
                  : addedToCart
                    ? "Added to Cart ✓"
                    : isAuthenticated
                      ? "Add to Cart"
                      : "Login to Add"}
              </button>
              <Link
                to="/checkout"
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "var(--secondary)",
                  color: "white",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 15,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  textDecoration: "none",
                  transition: "var(--transition)",
                }}
              >
                Buy Now
              </Link>
              <button
                onClick={async () => {
                  if (!isAuthenticated || !product) return;
                  if (wishlisted) {
                    await removeFromWishlist(product.id);
                  } else {
                    await addToWishlist(product.id);
                  }
                  setWishlisted(!wishlisted);
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--border)",
                  background: wishlisted ? "#FEF2F2" : "white",
                  cursor: isAuthenticated ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: !isAuthenticated ? 0.6 : 1,
                }}
                title={
                  isAuthenticated
                    ? wishlisted
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                    : "Login to wishlist"
                }
              >
                {wishlisted ? (
                  <IoHeart color="#EF4444" size={20} />
                ) : (
                  <IoHeartOutline size={20} color="var(--text-muted)" />
                )}
              </button>
              <button
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--border)",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IoShareSocialOutline size={18} color="var(--text-muted)" />
              </button>
            </div>

            {/* Guarantees */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
              {[
                {
                  icon: <TbTruckDelivery size={20} color="var(--primary)" />,
                  title: "Free Delivery",
                  sub: "Orders over Rs. 5,000",
                },
                {
                  icon: <TbRefresh size={20} color="var(--accent)" />,
                  title: "30-Day Returns",
                  sub: "Hassle-free returns",
                },
                {
                  icon: <IoShieldCheckmarkOutline size={20} color="#9333EA" />,
                  title: "Genuine Product",
                  sub: "100% authentic",
                },
              ].map((g, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: 14,
                    background: "var(--bg-muted)",
                    borderRadius: "var(--radius-md)",
                    textAlign: "center",
                  }}
                >
                  {g.icon}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {g.title}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {g.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Description Tab ── */}
        {product.description && (
          <div className="card" style={{ marginBottom: 40, padding: 28 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Product Description
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.8,
              }}
            >
              {product.description}
            </p>
          </div>
        )}

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2
                className="md:text-[22px] text-[16px] font-bold text-[var(--text-primary)] relative pb-[10px] 
after:content-[''] after:absolute after:bottom-0 after:left-0 
after:w-[40px] after:h-[3px] after:bg-[var(--primary)] after:rounded-[2px]"
              >
                Related Products
              </h2>
              <Link
                to={`/products?category=${product.category_slug}`}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                View All →
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
              }}
            >
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Back button */}
        <div style={{ marginTop: 40 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <IoChevronBackOutline size={16} /> Back
          </button>
        </div>
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
};

export default ProductDetail;
