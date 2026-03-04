import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  IoStarSharp,
  IoHeartOutline,
  IoHeart,
  IoGridOutline,
  IoListOutline,
  IoFilterOutline,
} from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useGetCategoriesQuery } from "@/services/categorySlice";

/* ─── Mock Data ─────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 34500,
    originalPrice: 48000,
    rating: 4.8,
    reviews: 2341,
    category: "Electronics",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: 'Samsung Galaxy Tab S9 Ultra 14.6"',
    price: 189000,
    originalPrice: 215000,
    rating: 4.7,
    reviews: 892,
    category: "Electronics",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Apple AirPods Pro (2nd Gen)",
    price: 58000,
    originalPrice: 65000,
    rating: 4.9,
    reviews: 5432,
    category: "Electronics",
    badge: "Top Rated",
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Nike Air Max 270 React",
    price: 18500,
    originalPrice: 24000,
    rating: 4.6,
    reviews: 1123,
    category: "Fashion",
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Canon EOS R50 Mirrorless Camera",
    price: 135000,
    originalPrice: 149000,
    rating: 4.8,
    reviews: 543,
    category: "Electronics",
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Logitech MX Master 3S Mouse",
    price: 22000,
    originalPrice: 27500,
    rating: 4.9,
    reviews: 3210,
    category: "Electronics",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "IKEA MALM Bed Frame Queen",
    price: 56000,
    originalPrice: 68000,
    rating: 4.5,
    reviews: 776,
    category: "Home",
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1505693316919-1021ec6a9a07?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    name: "Adidas Ultraboost 23 Running Shoes",
    price: 23000,
    originalPrice: 31000,
    rating: 4.7,
    reviews: 1890,
    category: "Fashion",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
  },
  {
    id: 9,
    name: "Philips Air Fryer XXL 7.3L",
    price: 28500,
    originalPrice: 35000,
    rating: 4.6,
    reviews: 987,
    category: "Home",
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
  },
  {
    id: 10,
    name: "Kindle Paperwhite (16GB)",
    price: 19500,
    originalPrice: 22000,
    rating: 4.8,
    reviews: 4102,
    category: "Electronics",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=400&h=400&fit=crop",
  },
  {
    id: 11,
    name: "Yoga Mat Premium Non-Slip 6mm",
    price: 3500,
    originalPrice: 5000,
    rating: 4.5,
    reviews: 2231,
    category: "Sports",
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1601925228008-0f0f48e1c15c?w=400&h=400&fit=crop",
  },
  {
    id: 12,
    name: "LEVI'S 512 Slim Taper Jeans",
    price: 8500,
    originalPrice: 12000,
    rating: 4.4,
    reviews: 654,
    category: "Fashion",
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
  },
  {
    id: 13,
    name: "JBL Charge 5 Bluetooth Speaker",
    price: 26000,
    originalPrice: 31500,
    rating: 4.7,
    reviews: 1456,
    category: "Electronics",
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
  },
  {
    id: 14,
    name: "Instant Pot Duo 7-in-1 6QT",
    price: 18900,
    originalPrice: 24000,
    rating: 4.8,
    reviews: 3876,
    category: "Home",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
  },
  {
    id: 15,
    name: "Under Armour HOVR Phantom Running",
    price: 16500,
    originalPrice: 21000,
    rating: 4.5,
    reviews: 891,
    category: "Sports",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: 16,
    name: "Dyson V15 Detect Cordless Vacuum",
    price: 115000,
    originalPrice: 132000,
    rating: 4.9,
    reviews: 1023,
    category: "Home",
    badge: "Top Rated",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  "Best Seller": { bg: "#FEF3C7", color: "#B45309" },
  New: { bg: "#ECFDF5", color: "#065F46" },
  "Top Rated": { bg: "#EFF6FF", color: "#1D4ED8" },
  Sale: { bg: "#FEF2F2", color: "#B91C1C" },
  Hot: { bg: "#FFF7ED", color: "#C2410C" },
};

/* ─── Sub Components ─────────────────────────────── */
const StarRating = ({ rating }: { rating: number }) => (
  <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <IoStarSharp
        key={s}
        size={12}
        color={s <= Math.floor(rating) ? "#F59E0B" : "#E2E8F0"}
      />
    ))}
  </div>
);

const ProductCard = ({
  product,
  view,
}: {
  product: (typeof PRODUCTS)[0];
  view: "grid" | "list";
}) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  const badge = BADGE_COLORS[product.badge] ?? {
    bg: "#F1F5F9",
    color: "#475569",
  };

  const handleCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (view === "list") {
    return (
      <div
        className="card"
        style={{ display: "flex", gap: 0, overflow: "hidden" }}
      >
        <Link
          to={`/product/${product.id}`}
          style={{
            flexShrink: 0,
            width: 200,
            overflow: "hidden",
            background: "#F8FAFC",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: 160,
              objectFit: "cover",
              transition: "transform 0.3s",
              display: "block",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>
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
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
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
              <span
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                {product.category}
              </span>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                  lineHeight: 1.4,
                }}
              >
                {product.name}
              </h3>
            </Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 10,
              }}
            >
              <StarRating rating={product.rating} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {product.rating} ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  textDecoration: "line-through",
                }}
              >
                Rs. {product.originalPrice.toLocaleString()}
              </span>
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
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--border)",
                  background: "white",
                  cursor: "pointer",
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
              <button
                onClick={handleCart}
                style={{
                  padding: "0 20px",
                  height: 36,
                  background: added ? "var(--accent)" : "var(--primary)",
                  color: "white",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  whiteSpace: "nowrap",
                }}
              >
                <HiOutlineShoppingCart size={15} />{" "}
                {added ? "Added ✓" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#F8FAFC",
        }}
      >
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.08)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>
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
        <button
          onClick={() => setWishlisted(!wishlisted)}
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "white",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          {wishlisted ? (
            <IoHeart color="#EF4444" size={14} />
          ) : (
            <IoHeartOutline size={14} color="var(--text-muted)" />
          )}
        </button>
      </div>
      <div
        style={{
          padding: 14,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            marginBottom: 4,
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          {product.category}
        </span>
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <StarRating rating={product.rating} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            ({product.reviews.toLocaleString()})
          </span>
        </div>
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
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              textDecoration: "line-through",
            }}
          >
            Rs. {product.originalPrice.toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleCart}
          style={{
            width: "100%",
            padding: "9px",
            background: added ? "var(--accent)" : "var(--primary)",
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
            cursor: "pointer",
          }}
        >
          <HiOutlineShoppingCart size={15} />{" "}
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

/* ─── Filter Accordion ───────────────────────────── */
const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        paddingBottom: 16,
        marginBottom: 16,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 0",
          marginBottom: open ? 12 : 0,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          {title}
        </span>
        {open ? (
          <FaAngleUp size={12} color="var(--text-muted)" />
        ) : (
          <FaAngleDown size={12} color="var(--text-muted)" />
        )}
      </button>
      {open && children}
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────── */
const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const { data: catData } = useGetCategoriesQuery();

  // Build category list from API: "All" + API slugs
  const apiCategories = catData?.categories ?? [];

  // Initialize selected category from URL param ?category=slug
  const urlCategory = searchParams.get("category") ?? "all";
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);

  // When API loads, keep URL param selection in sync
  useEffect(() => {
    const param = searchParams.get("category") ?? "all";
    setSelectedCategory(param);
  }, [searchParams]);

  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [showFilter, setShowFilter] = useState(true);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    // Match by category slug or name (case-insensitive), "all" shows everything
    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.category.toLowerCase().replace(/\s+/g, "-") ===
            selectedCategory.toLowerCase(),
      );
    }
    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "reviews") list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [selectedCategory, sortBy, priceRange]);

  return (
    <div style={{ padding: "28px 0 60px", background: "var(--bg-base)" }}>
      <div className="container">
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          <Link to="/" style={{ color: "var(--primary)" }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
            Shop
          </span>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {/* ── Sidebar Filters ── */}
          {showFilter && (
            <div style={{ width: 240, flexShrink: 0 }}>
              <div className="card" style={{ padding: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    Filters
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setPriceRange([0, 200000]);
                    }}
                    style={{
                      fontSize: 12,
                      color: "var(--primary)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Clear All
                  </button>
                </div>

                <FilterSection title="Category">
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {/* All */}
                    {[
                      {
                        slug: "all",
                        name: "All",
                        product_count: PRODUCTS.length,
                      },
                      ...apiCategories,
                    ].map((cat) => {
                      const isAll = cat.slug === "all";
                      const isSelected = selectedCategory === cat.slug;
                      // For "All" show total; for API cats, show their backend product_count
                      return (
                        <label
                          key={cat.slug}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="radio"
                            name="category"
                            checked={isSelected}
                            onChange={() => setSelectedCategory(cat.slug)}
                            style={{
                              accentColor: "var(--primary)",
                              width: 15,
                              height: 15,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              color: "var(--text-secondary)",
                              fontWeight: isSelected ? 600 : 400,
                            }}
                          >
                            {cat.name}
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: 11,
                              color: "var(--text-muted)",
                            }}
                          >
                            {isAll ? PRODUCTS.length : cat.product_count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </FilterSection>

                <FilterSection title="Price Range">
                  <div style={{ padding: "0 4px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{ fontSize: 12, color: "var(--text-muted)" }}
                      >
                        Rs. {priceRange[0].toLocaleString()}
                      </span>
                      <span
                        style={{ fontSize: 12, color: "var(--text-muted)" }}
                      >
                        Rs. {priceRange[1].toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={200000}
                      step={1000}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], +e.target.value])
                      }
                      style={{ width: "100%", accentColor: "var(--primary)" }}
                    />
                  </div>
                </FilterSection>

                <FilterSection title="Rating">
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {[5, 4, 3].map((r) => (
                      <label
                        key={r}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          style={{
                            accentColor: "var(--primary)",
                            width: 14,
                            height: 14,
                          }}
                        />
                        <div style={{ display: "flex", gap: 2 }}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <IoStarSharp
                              key={i}
                              size={12}
                              color={i < r ? "#F59E0B" : "#E2E8F0"}
                            />
                          ))}
                        </div>
                        <span
                          style={{ fontSize: 12, color: "var(--text-muted)" }}
                        >
                          & up
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Availability">
                  {["In Stock", "Ships in 2-3 Days", "Pre-Order"].map((opt) => (
                    <label
                      key={opt}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        marginBottom: 8,
                      }}
                    >
                      <input
                        type="checkbox"
                        defaultChecked={opt === "In Stock"}
                        style={{
                          accentColor: "var(--primary)",
                          width: 14,
                          height: 14,
                        }}
                      />
                      <span
                        style={{ fontSize: 13, color: "var(--text-secondary)" }}
                      >
                        {opt}
                      </span>
                    </label>
                  ))}
                </FilterSection>
              </div>
            </div>
          )}

          {/* ── Product Grid ── */}
          <div style={{ flex: 1 }}>
            {/* Toolbar */}
            <div
              className="card"
              style={{
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "var(--bg-muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  <IoFilterOutline size={15} /> {showFilter ? "Hide" : "Show"}{" "}
                  Filters
                </button>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>
                    {filtered.length}
                  </strong>{" "}
                  products found
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 13,
                      color: "var(--text-primary)",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() => setView("grid")}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      background: view === "grid" ? "var(--primary)" : "white",
                      color: view === "grid" ? "white" : "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <IoGridOutline size={15} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      background: view === "list" ? "var(--primary)" : "white",
                      color: view === "list" ? "white" : "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <IoListOutline size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              {[{ slug: "all", name: "All" }, ...apiCategories].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "var(--radius-full)",
                    border: `1.5px solid ${selectedCategory === cat.slug ? "var(--primary)" : "var(--border)"}`,
                    background:
                      selectedCategory === cat.slug
                        ? "var(--primary)"
                        : "white",
                    color:
                      selectedCategory === cat.slug
                        ? "white"
                        : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  color: "var(--text-muted)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>
                  No products found
                </h3>
                <p style={{ fontSize: 14 }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div
                style={
                  view === "grid"
                    ? {
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 16,
                      }
                    : { display: "flex", flexDirection: "column", gap: 12 }
                }
              >
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} view={view} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
