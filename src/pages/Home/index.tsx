import { useState } from "react";
import { Link } from "react-router-dom";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";
import { MdLocalOffer, MdVerified } from "react-icons/md";
import { TbTruckDelivery, TbShieldCheck } from "react-icons/tb";
import { RiRefundLine } from "react-icons/ri";
import { useGetProductsQuery, type Product } from "@/services/productSlice";
import ProductCard from "@/components/ProductCard";

/* ─── Data ─────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    icon: "💻",
    count: "12,450 items",
    bg: "#EFF6FF",
    color: "#2563EB",
  },
  {
    id: 2,
    name: "Fashion",
    icon: "👗",
    count: "8,230 items",
    bg: "#FDF4FF",
    color: "#9333EA",
  },
  {
    id: 3,
    name: "Home & Garden",
    icon: "🏡",
    count: "5,680 items",
    bg: "#F0FDF4",
    color: "#16A34A",
  },
  {
    id: 4,
    name: "Sports",
    icon: "⚽",
    count: "3,920 items",
    bg: "#FFF7ED",
    color: "#EA580C",
  },
  {
    id: 5,
    name: "Toys & Games",
    icon: "🎮",
    count: "2,150 items",
    bg: "#FFF1F2",
    color: "#E11D48",
  },
  {
    id: 6,
    name: "Beauty",
    icon: "💄",
    count: "4,760 items",
    bg: "#FFF8F0",
    color: "#D97706",
  },
  {
    id: 7,
    name: "Books",
    icon: "📚",
    count: "9,320 items",
    bg: "#F0F9FF",
    color: "#0284C7",
  },
  {
    id: 8,
    name: "Automotive",
    icon: "🚗",
    count: "1,890 items",
    bg: "#F9FAFB",
    color: "#374151",
  },
];

const HERO_SLIDES = [
  {
    subtitle: "🎧 Premium Audio",
    title: "Sound That Moves You",
    description: "Explore our collection of premium headphones and speakers",
    cta: "Shop Now",
    badge: "Up to 40% Off",
    gradient: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #7C3AED 100%)",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop",
  },
  {
    subtitle: "📱 Latest Tech",
    title: "Next-Gen Smartphones",
    description: "Power, performance, and style redefined",
    cta: "Explore",
    badge: "New Arrivals",
    gradient: "linear-gradient(135deg, #065F46 0%, #10B981 60%, #0284C7 100%)",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop",
  },
  {
    subtitle: "👟 Fashion Week",
    title: "Step Into Style",
    description: "Trending shoes and fashion at unbeatable prices",
    cta: "View Collection",
    badge: "Exclusive Deals",
    gradient: "linear-gradient(135deg, #7C2D12 0%, #EA580C 60%, #F59E0B 100%)",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop",
  },
];

const PROMO_BANNERS = [
  {
    title: "Electronics Festival",
    subtitle: "Up to 60% off top brands",
    bg: "linear-gradient(135deg, #1E3A8A, #7C3AED)",
    icon: "⚡",
  },
  {
    title: "Fashion Week Sale",
    subtitle: "New season styles from Rs. 999",
    bg: "linear-gradient(135deg, #BE185D, #EC4899)",
    icon: "✨",
  },
  {
    title: "Sports & Fitness",
    subtitle: "Gear up for 2025",
    bg: "linear-gradient(135deg, #065F46, #10B981)",
    icon: "🏆",
  },
];

const ProductSkeleton = () => (
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
      {[60, 90, 50].map((w, i) => (
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

/* ─── Main Page ─────────────────────────────────────── */
const HomePage = () => {
  const [heroSlide, setHeroSlide] = useState(0);
  const slide = HERO_SLIDES[heroSlide];

  // Fetch 8 newest products from API
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({ limit: 8, sort: "created_at" });
  const featuredProducts = productsData?.products ?? [];

  const nextSlide = () =>
    setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () =>
    setHeroSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );

  return (
    <div style={{ background: "var(--bg-base)" }}>
      {/* ────────────────── Hero Banner ────────────────── */}
      <section
        style={{
          background: slide.gradient,
          minHeight: 480,
          position: "relative",
          overflow: "hidden",
          transition: "background 0.5s ease",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            minHeight: 480,
            gap: 40,
          }}
        >
          <div
            style={{
              flex: 1,
              color: "white",
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {slide.subtitle}
            </span>
            <h1
              style={{
                fontSize: 48,
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 16,
                letterSpacing: "-1.5px",
              }}
            >
              {slide.title}
            </h1>
            <p
              style={{
                fontSize: 16,
                opacity: 0.85,
                marginBottom: 32,
                maxWidth: 440,
                lineHeight: 1.7,
              }}
            >
              {slide.description}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Link
                to="/products"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "white",
                  color: "#1E3A8A",
                  fontWeight: 700,
                  padding: "13px 28px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 14,
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform = "none")
                }
              >
                {slide.cta} <IoChevronForwardOutline size={16} />
              </Link>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(246,207,91,0.9)",
                  color: "#7C2D12",
                  fontWeight: 700,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                }}
              >
                <MdLocalOffer size={15} /> {slide.badge}
              </span>
            </div>
          </div>

          <div
            style={{
              flexShrink: 0,
              width: 420,
              height: 350,
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "var(--transition-slow)",
              }}
            />
          </div>
        </div>

        {/* Slide Controls */}
        <button
          onClick={prevSlide}
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.35)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.2)")
          }
        >
          <IoChevronBackOutline size={20} />
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.35)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.2)")
          }
        >
          <IoChevronForwardOutline size={20} />
        </button>

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
          }}
        >
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              style={{
                width: i === heroSlide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === heroSlide ? "white" : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
            />
          ))}
        </div>
      </section>

      {/* ────────────────── Trust Badges ────────────────── */}
      <section
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="container  grid md:grid-cols-2  lg:grid-cols-4 "
          style={{
            // display: "grid",
            // gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            // background: "var(--border)",
            borderTop: "1px solid var(--border)",
          }}
        >
          {[
            {
              icon: <TbTruckDelivery size={26} color="var(--primary)" />,
              title: "Free Delivery",
              sub: "On orders over Rs. 5,000",
            },
            {
              icon: <RiRefundLine size={26} color="var(--accent)" />,
              title: "Easy Returns",
              sub: "30-day return policy",
            },
            {
              icon: <TbShieldCheck size={26} color="#9333EA" />,
              title: "Secure Payments",
              sub: "256-bit SSL encryption",
            },
            {
              icon: <MdVerified size={26} color="var(--secondary)" />,
              title: "Genuine Products",
              sub: "100% authentic guarantee",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-surface)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────── Promo Banners ────────────────── */}
      <section style={{ padding: "32px 0" }}>
        <div
          className="container grid md:grid-cols-2  lg:grid-cols-3 "
          style={{
            // display: "grid",
            // gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {PROMO_BANNERS.map((b, i) => (
            <Link
              key={i}
              to="/products"
              style={{
                background: b.bg,
                borderRadius: "var(--radius-lg)",
                padding: "28px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "var(--transition)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: 36 }}>{b.icon}</div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "white",
                    marginBottom: 4,
                  }}
                >
                  {b.title}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                  {b.subtitle}
                </div>
              </div>
              <IoChevronForwardOutline
                size={18}
                color="rgba(255,255,255,0.7)"
                style={{ marginLeft: "auto" }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ────────────────── Categories ────────────────── */}
      <section style={{ padding: "12px 0 36px" }}>
        <div className="container">
          <div
            style={{
              display: "flex ",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h2
              className="md:text-[22px] text-[16px] font-bold text-[var(--text-primary)] relative pb-[10px] 
after:content-[''] after:absolute after:bottom-0 after:left-0 
after:w-[40px] after:h-[3px] after:bg-[var(--primary)] after:rounded-[2px] "
            >
              Shop by Category
            </h2>
            <Link
              to="/categories"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View All <IoChevronForwardOutline size={14} />
            </Link>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8"
            style={{
              // display: "grid ",
              // gridTemplateColumns: "repeat(8, 1fr)",
              gap: 12,
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.name.toLowerCase()}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px 12px",
                    textAlign: "center",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      cat.color;
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "var(--shadow-md)";
                    (e.currentTarget as HTMLElement).style.background = cat.bg;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--border)";
                    (e.currentTarget as HTMLElement).style.transform = "none";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--bg-surface)";
                  }}
                >
                  <div style={{ fontSize: 30, marginBottom: 8 }}>
                    {cat.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 3,
                    }}
                  >
                    {cat.name}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {cat.count}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── Featured Products ────────────────── */}
      <section style={{ padding: "12px 0 48px" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h2
              className="md:text-[22px] text-[16px] font-bold text-[var(--text-primary)] relative pb-[10px] 
after:content-[''] after:absolute after:bottom-0 after:left-0 
after:w-[40px] after:h-[3px] after:bg-[var(--primary)] after:rounded-[2px]"
            >
              Featured Products
            </h2>
            <Link
              to="/products"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View All Products <IoChevronForwardOutline size={14} />
            </Link>
          </div>

          {productsLoading ? (
            <div
              style={{
                // display: "grid",
                // gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
              }}
              className="grid md:grid-cols-3  lg:grid-cols-4 sm:grid-cols-2"
            >
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "var(--text-muted)",
              }}
            >
              No products available yet.
            </div>
          ) : (
            <div
              style={{
                // display: "grid",
                // gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
              }}
              className="grid md:grid-cols-3  lg:grid-cols-4 sm:grid-cols-2"
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────────────────── Newsletter ────────────────── */}
      <section
        style={{
          padding: "60px 0",
          background:
            "linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #7C3AED 100%)",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "white",
              marginBottom: 10,
            }}
          >
            Stay in the Loop 🔔
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              marginBottom: 32,
              fontSize: 15,
            }}
          >
            Subscribe for exclusive deals, new arrivals, and flash sales
          </p>
          <div
            style={{
              display: "flex",
              maxWidth: 480,
              margin: "0 auto",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(255,255,255,0.2)",
              overflow: "hidden",
            }}
          >
            <input
              className="input-field"
              type="email"
              placeholder="Enter your email address"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "white",
                paddingLeft: 20,
              }}
            />
            <button
              style={{
                padding: "12px 24px",
                background: "var(--secondary)",
                color: "white",
                fontWeight: 700,
                fontSize: 13,
                border: "none",
                cursor: "pointer",
                transition: "var(--transition)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--secondary-hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--secondary)")
              }
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
