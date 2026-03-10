import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  IoGridOutline,
  IoListOutline,
  IoFilterOutline,
  IoHeartOutline,
  IoHeart,
} from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";
import {
  FaAngleDown,
  FaAngleUp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { useGetProductsQuery, type Product } from "@/services/productSlice";
import { useGetCategoriesQuery } from "@/services/categorySlice";
import ProductCard from "@/components/ProductCard";
import console from "console";

/* ─── Constants ─────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { label: "Newest", value: "created_at" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
];

const AVAILABILITY_OPTIONS = [
  { label: "All", value: "" },
  { label: "In Stock", value: "in_stock" },
  { label: "Ships in 2-3 Days", value: "ships_2_3_days" },
  { label: "Pre Order", value: "pre_order" },
];

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  "Best Seller": { bg: "#FEF3C7", color: "#B45309" },
  New: { bg: "#ECFDF5", color: "#065F46" },
  "Top Rated": { bg: "#EFF6FF", color: "#1D4ED8" },
  Sale: { bg: "#FEF2F2", color: "#B91C1C" },
  Hot: { bg: "#FFF7ED", color: "#C2410C" },
};

const AVAILABILITY_LABELS: Record<string, { label: string; color: string }> = {
  in_stock: { label: "In Stock", color: "#059669" },
  ships_2_3_days: { label: "Ships in 2-3 Days", color: "#D97706" },
  pre_order: { label: "Pre Order", color: "#7C3AED" },
};

/* ─── Filter Accordion ───────────────────────────────────────── */
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

/* ─── Product Card ───────────────────────────────────────────── */
// const ProductCard = ({
//   product,
//   view,
// }: {
//   product: Product;
//   view: "grid" | "list";
// }) => {
//   const [wishlisted, setWishlisted] = useState(false);
//   const [added, setAdded] = useState(false);

//   const discount =
//     product.originalPrice && product.originalPrice > product.price
//       ? Math.round(
//           ((product.originalPrice - product.price) / product.originalPrice) *
//             100,
//         )
//       : null;

//   const badge = product.badge
//     ? (BADGE_COLORS[product.badge] ?? { bg: "#F1F5F9", color: "#475569" })
//     : null;
//   const avail = AVAILABILITY_LABELS[product.availability];

//   const handleCart = () => {
//     setAdded(true);
//     setTimeout(() => setAdded(false), 2000);
//   };

//   const img = (
//     <img
//       src={product.image || "https://via.placeholder.com/400x400?text=No+Image"}
//       alt={product.name}
//       style={{
//         width: "100%",
//         height: view === "list" ? 160 : 200,
//         objectFit: "cover",
//         transition: "transform 0.4s ease",
//         display: "block",
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
//       onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//     />
//   );

//   if (view === "list") {
//     return (
//       <div
//         className="card"
//         style={{ display: "flex", gap: 0, overflow: "hidden" }}
//       >
//         <Link
//           to={`/product/${product.id}`}
//           style={{
//             flexShrink: 0,
//             width: 200,
//             overflow: "hidden",
//             background: "#F8FAFC",
//           }}
//         >
//           {img}
//         </Link>
//         <div
//           style={{
//             flex: 1,
//             padding: "16px 20px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 display: "flex",
//                 gap: 8,
//                 marginBottom: 6,
//                 flexWrap: "wrap",
//               }}
//             >
//               {badge && (
//                 <span
//                   style={{
//                     ...badge,
//                     fontSize: 10,
//                     fontWeight: 700,
//                     padding: "2px 8px",
//                     borderRadius: "var(--radius-full)",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   {product.badge}
//                 </span>
//               )}
//               {avail && (
//                 <span
//                   style={{ fontSize: 10, color: avail.color, fontWeight: 600 }}
//                 >
//                   ● {avail.label}
//                 </span>
//               )}
//             </div>
//             <Link to={`/product/${product.id}`}>
//               <h3
//                 style={{
//                   fontSize: 15,
//                   fontWeight: 600,
//                   color: "var(--text-primary)",
//                   marginBottom: 6,
//                   lineHeight: 1.4,
//                 }}
//               >
//                 {product.name}
//               </h3>
//             </Link>
//             {product.category_name && (
//               <span
//                 style={{
//                   fontSize: 11,
//                   color: "var(--text-muted)",
//                   fontWeight: 500,
//                   textTransform: "uppercase",
//                 }}
//               >
//                 {product.category_name}
//               </span>
//             )}
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginTop: 12,
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
//               <span
//                 style={{
//                   fontSize: 20,
//                   fontWeight: 800,
//                   color: "var(--primary)",
//                 }}
//               >
//                 Rs. {product.price.toLocaleString()}
//               </span>
//               {product.originalPrice && (
//                 <span
//                   style={{
//                     fontSize: 13,
//                     color: "var(--text-muted)",
//                     textDecoration: "line-through",
//                   }}
//                 >
//                   Rs. {product.originalPrice.toLocaleString()}
//                 </span>
//               )}
//               {discount && (
//                 <span
//                   style={{
//                     background: "var(--error)",
//                     color: "white",
//                     fontSize: 11,
//                     fontWeight: 700,
//                     padding: "2px 7px",
//                     borderRadius: "var(--radius-sm)",
//                   }}
//                 >
//                   -{discount}%
//                 </span>
//               )}
//             </div>
//             <div style={{ display: "flex", gap: 8 }}>
//               <button
//                 onClick={() => setWishlisted(!wishlisted)}
//                 style={{
//                   width: 36,
//                   height: 36,
//                   borderRadius: "var(--radius-sm)",
//                   border: "1.5px solid var(--border)",
//                   background: "white",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 {wishlisted ? (
//                   <IoHeart color="#EF4444" size={16} />
//                 ) : (
//                   <IoHeartOutline size={16} color="var(--text-muted)" />
//                 )}
//               </button>
//               <button
//                 onClick={handleCart}
//                 style={{
//                   padding: "0 20px",
//                   height: 36,
//                   background: added ? "var(--accent)" : "var(--primary)",
//                   color: "white",
//                   borderRadius: "var(--radius-sm)",
//                   fontSize: 13,
//                   fontWeight: 600,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   border: "none",
//                   cursor: "pointer",
//                   transition: "var(--transition)",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 <HiOutlineShoppingCart size={15} />
//                 {added ? "Added ✓" : "Add to Cart"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="card"
//       style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
//     >
//       <div
//         style={{
//           position: "relative",
//           overflow: "hidden",
//           background: "#F8FAFC",
//         }}
//       >
//         <Link to={`/product/${product.id}`}>{img}</Link>
//         {discount && (
//           <div
//             style={{
//               position: "absolute",
//               top: 10,
//               left: 10,
//               background: "var(--error)",
//               color: "white",
//               fontSize: 11,
//               fontWeight: 700,
//               padding: "3px 7px",
//               borderRadius: "var(--radius-sm)",
//             }}
//           >
//             -{discount}%
//           </div>
//         )}
//         {badge && (
//           <div
//             style={{
//               position: "absolute",
//               top: 10,
//               right: 10,
//               ...badge,
//               fontSize: 10,
//               fontWeight: 700,
//               padding: "3px 7px",
//               borderRadius: "var(--radius-sm)",
//               textTransform: "uppercase",
//             }}
//           >
//             {product.badge}
//           </div>
//         )}
//         <button
//           onClick={() => setWishlisted(!wishlisted)}
//           style={{
//             position: "absolute",
//             bottom: 10,
//             right: 10,
//             width: 32,
//             height: 32,
//             borderRadius: "50%",
//             background: "white",
//             boxShadow: "var(--shadow-sm)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           {wishlisted ? (
//             <IoHeart color="#EF4444" size={14} />
//           ) : (
//             <IoHeartOutline size={14} color="var(--text-muted)" />
//           )}
//         </button>
//       </div>
//       <div
//         style={{
//           padding: 14,
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 4,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 10,
//               color: "var(--text-muted)",
//               fontWeight: 500,
//               textTransform: "uppercase",
//             }}
//           >
//             {product.category_name ?? ""}
//           </span>
//           {avail && (
//             <span style={{ fontSize: 9, color: avail.color, fontWeight: 600 }}>
//               ● {avail.label}
//             </span>
//           )}
//         </div>
//         <Link to={`/product/${product.id}`} style={{ flex: 1 }}>
//           <p
//             style={{
//               fontSize: 13,
//               fontWeight: 600,
//               color: "var(--text-primary)",
//               lineHeight: 1.45,
//               marginBottom: 8,
//               overflow: "hidden",
//               display: "-webkit-box",
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: "vertical",
//             }}
//           >
//             {product.name}
//           </p>
//         </Link>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "baseline",
//             gap: 6,
//             marginBottom: 12,
//           }}
//         >
//           <span
//             style={{ fontSize: 17, fontWeight: 800, color: "var(--primary)" }}
//           >
//             Rs. {product.price.toLocaleString()}
//           </span>
//           {product.originalPrice && (
//             <span
//               style={{
//                 fontSize: 12,
//                 color: "var(--text-muted)",
//                 textDecoration: "line-through",
//               }}
//             >
//               Rs. {product.originalPrice.toLocaleString()}
//             </span>
//           )}
//         </div>
//         <button
//           onClick={handleCart}
//           style={{
//             width: "100%",
//             padding: "9px",
//             background: added ? "var(--accent)" : "var(--primary)",
//             color: "white",
//             borderRadius: "var(--radius-sm)",
//             fontSize: 13,
//             fontWeight: 600,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 6,
//             transition: "var(--transition)",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           <HiOutlineShoppingCart size={15} />
//           {added ? "Added to Cart ✓" : "Add to Cart"}
//         </button>
//       </div>
//     </div>
//   );
// };

/* ─── Skeleton Card ──────────────────────────────────────────── */
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
    <div style={{ padding: 14 }}>
      {[80, 100, 60].map((w, i) => (
        <div
          key={i}
          style={{
            height: 12,
            background: "#f0f0f0",
            borderRadius: 6,
            marginBottom: 10,
            width: `${w}%`,
            animation: "shimmer 1.4s infinite",
          }}
        />
      ))}
    </div>
  </div>
);

/* ─── Main Page ──────────────────────────────────────────────── */
const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: catData } = useGetCategoriesQuery();
  const apiCategories = catData?.categories ?? [];

  // Filters synced to URL params
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") ?? "",
  );
  const [selectedAvailability, setSelectedAvailability] = useState(
    searchParams.get("availability") ?? "",
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") ?? "created_at",
  );
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilter, setShowFilter] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Sync URL param category on mount/change
  useEffect(() => {
    const cat = searchParams.get("category") ?? "";
    setSelectedCategory(cat);
    setPage(1);
  }, [searchParams]);

  const filters = {
    page,
    limit: 16,
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedAvailability && { availability: selectedAvailability }),
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(sortBy && {
      sort: sortBy as "price_asc" | "price_desc" | "created_at",
    }),
    ...(priceRange[1] < 500000 && { maxPrice: priceRange[1] }),
    ...(priceRange[0] > 0 && { minPrice: priceRange[0] }),
  };

  const { data, isLoading, isFetching } = useGetProductsQuery(filters);
  const products = data?.products ?? [];
  const meta = data?.meta;

  const handleCategoryChange = useCallback(
    (slug: string) => {
      setSelectedCategory(slug);
      setPage(1);
      const params = new URLSearchParams(searchParams);
      if (slug) params.set("category", slug);
      else params.delete("category");
      navigate(`/products?${params.toString()}`, { replace: true });
    },
    [searchParams, navigate],
  );

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
          {selectedCategory && (
            <>
              <span>/</span>
              <span
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {apiCategories.find((c) => c.slug === selectedCategory)?.name ??
                  selectedCategory}
              </span>
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {/* ── Sidebar Filters ── */}
          {showFilter && (
            <div style={{ width: 240, flexShrink: 0 }} className="hidden md:block">
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
                      setSelectedCategory("");
                      setSelectedAvailability("");
                      setPriceRange([0, 500000]);
                      setSearch("");
                      setPage(1);
                      navigate("/products");
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

                {/* Category */}
                <FilterSection title="Category">
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {[
                      {
                        slug: "",
                        name: "All",
                        product_count: meta?.total ?? 0,
                      },
                      ...apiCategories,
                    ].map((cat) => {
                      const isSelected = selectedCategory === cat.slug;


                      
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
                            onChange={() => handleCategoryChange(cat.slug)}
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
                            {cat.product_count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </FilterSection>

                {/* Availability */}
                <FilterSection title="Availability">
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {AVAILABILITY_OPTIONS.map((opt) => {
                      const isSelected = selectedAvailability === opt.value;
                      return (
                        <label
                          key={opt.value}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="radio"
                            name="availability"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedAvailability(opt.value);
                              setPage(1);
                            }}
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
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price Range (Rs.)">
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0] || ""}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      style={{
                        width: "50%",
                        padding: "6px 8px",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 12,
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1] === 500000 ? "" : priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          Number(e.target.value) || 500000,
                        ])
                      }
                      style={{
                        width: "50%",
                        padding: "6px 8px",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 12,
                      }}
                    />
                  </div>
                </FilterSection>
              </div>
            </div>
          )}

          {/* ── Main Content ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  <IoFilterOutline size={16} /> Filters
                </button>
                {/* Search */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "7px 12px",
                    background: "white",
                    width: 220,
                  }}
                >
                  <MdSearch size={17} color="var(--text-muted)" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      background: "transparent",
                      width: "100%",
                    }}
                  />
                </div>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {isFetching
                    ? "Loading..."
                    : meta
                      ? `${meta.total} products`
                      : ""}
                </span>
              </div>
               {showFilter && (
            <div style={{ width: "100%", flexShrink: 0 }} className="md:hidden" >
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
                      setSelectedCategory("");
                      setSelectedAvailability("");
                      setPriceRange([0, 500000]);
                      setSearch("");
                      setPage(1);
                      navigate("/products");
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

                {/* Category */}
                <FilterSection title="Category">
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {[
                      {
                        slug: "",
                        name: "All",
                        product_count: meta?.total ?? 0,
                      },
                      ...apiCategories,
                    ].map((cat) => {
                      const isSelected = selectedCategory === cat.slug;
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
                            onChange={() => handleCategoryChange(cat.slug)}
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
                            {cat.product_count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </FilterSection>

                {/* Availability */}
                <FilterSection title="Availability">
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {AVAILABILITY_OPTIONS.map((opt) => {
                      const isSelected = selectedAvailability === opt.value;
                      return (
                        <label
                          key={opt.value}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="radio"
                            name="availability"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedAvailability(opt.value);
                              setPage(1);
                            }}
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
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price Range (Rs.)">
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0] || ""}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      style={{
                        width: "50%",
                        padding: "6px 8px",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 12,
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1] === 500000 ? "" : priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          Number(e.target.value) || 500000,
                        ])
                      }
                      style={{
                        width: "50%",
                        padding: "6px 8px",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 12,
                      }}
                    />
                  </div>
                </FilterSection>
              </div>
            </div>
          )}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    padding: "8px 12px",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 13,
                    background: "white",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setView("grid")}
                  style={{
                    padding: 8,
                    border: `1.5px solid ${view === "grid" ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: "var(--radius-sm)",
                    background:
                      view === "grid"
                        ? "var(--primary-light, #EEF2FF)"
                        : "white",
                    color:
                      view === "grid" ? "var(--primary)" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  <IoGridOutline size={18} />
                </button>
                <button
                  onClick={() => setView("list")}
                  style={{
                    padding: 8,
                    border: `1.5px solid ${view === "list" ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: "var(--radius-sm)",
                    background:
                      view === "list"
                        ? "var(--primary-light, #EEF2FF)"
                        : "white",
                    color:
                      view === "list" ? "var(--primary)" : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  <IoListOutline size={18} />
                </button>
              </div>
            </div>

            {/* Category pills */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              {[{ slug: "", name: "All" }, ...apiCategories].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
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

            {/* Product Grid / List */}
            {isLoading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    view === "grid"
                      ? "repeat(auto-fill, minmax(220px, 1fr))"
                      : "1fr",
                  gap: 16,
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 8,
                  }}
                >
                  No products found
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  Try adjusting your filters or search term.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    view === "grid"
                      ? "repeat(auto-fill, minmax(220px, 1fr))"
                      : "1fr",
                  gap: 16,
                }}
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} view={view} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.pages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 40,
                }}
              >
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-sm)",
                    border: "1.5px solid var(--border)",
                    background: "white",
                    cursor: page <= 1 ? "not-allowed" : "pointer",
                    opacity: page <= 1 ? 0.4 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaChevronLeft size={12} />
                </button>
                {[...Array(Math.min(meta.pages, 7))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-sm)",
                        border: `1.5px solid ${page === p ? "var(--primary)" : "var(--border)"}`,
                        background: page === p ? "var(--primary)" : "white",
                        color: page === p ? "white" : "var(--text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  disabled={page >= meta.pages}
                  onClick={() => setPage(page + 1)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-sm)",
                    border: "1.5px solid var(--border)",
                    background: "white",
                    cursor: page >= meta.pages ? "not-allowed" : "pointer",
                    opacity: page >= meta.pages ? 0.4 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
    </div>
  );
};

export default ShopPage;
