import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "@/services/categorySlice";

// Fallback gradient backgrounds for categories without images
const GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-700",
  "from-indigo-500 to-blue-700",
  "from-green-500 to-emerald-700",
  "from-red-500 to-rose-700",
];

const CategoriesPage = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery();
  const categories = data?.categories ?? [];

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "var(--font-sans, system-ui)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Shop by Category
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
          Explore our wide range of product categories
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 200,
                borderRadius: 16,
                background:
                  "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s infinite",
              }}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          style={{
            padding: "40px 24px",
            textAlign: "center",
            color: "var(--error)",
            background: "#FEF2F2",
            borderRadius: 12,
          }}
        >
          ⚠️ Failed to load categories. Please refresh the page.
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && (
        <>
          {categories.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "60px 0",
              }}
            >
              No categories found.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              {categories.map((cat, index) => {
                const gradient = GRADIENTS[index % GRADIENTS.length];
                return (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div
                      style={{
                        borderRadius: 16,
                        overflow: "hidden",
                        height: 200,
                        position: "relative",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(-4px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 8px 28px rgba(0,0,0,0.16)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 2px 12px rgba(0,0,0,0.08)";
                      }}
                    >
                      {/* Background — image or gradient */}
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            inset: 0,
                          }}
                        />
                      ) : (
                        <div
                          className={`bg-gradient-to-br ${gradient}`}
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: `linear-gradient(135deg, var(--grad-start, #7c3aed), var(--grad-end, #4f46e5))`,
                          }}
                        />
                      )}

                      {/* Dark overlay */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%)",
                        }}
                      />

                      {/* Text */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "16px 18px",
                        }}
                      >
                        <h3
                          style={{
                            color: "white",
                            fontWeight: 700,
                            fontSize: 17,
                            marginBottom: 3,
                            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                          }}
                        >
                          {cat.name}
                        </h3>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {cat.product_count}{" "}
                          {cat.product_count === 1 ? "product" : "products"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default CategoriesPage;
