import { useState } from "react";
import { Link } from "react-router-dom";
import { IoHeart, IoHeartDislike, IoStarSharp } from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";

const WISHLIST_ITEMS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 34500,
    originalPrice: 48000,
    rating: 4.8,
    reviews: 2341,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
  },
  {
    id: 2,
    name: 'Samsung Galaxy Tab S9 Ultra 14.6"',
    price: 189000,
    originalPrice: 215000,
    rating: 4.7,
    reviews: 892,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    category: "Electronics",
  },
  {
    id: 4,
    name: "Nike Air Max 270 React",
    price: 18500,
    originalPrice: 24000,
    rating: 4.6,
    reviews: 1123,
    inStock: false,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Fashion",
  },
  {
    id: 7,
    name: "IKEA MALM Bed Frame Queen",
    price: 56000,
    originalPrice: 68000,
    rating: 4.5,
    reviews: 776,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1505693316919-1021ec6a9a07?w=400&h=400&fit=crop",
    category: "Home",
  },
  {
    id: 5,
    name: "Canon EOS R50 Mirrorless Camera",
    price: 135000,
    originalPrice: 149000,
    rating: 4.8,
    reviews: 543,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    category: "Electronics",
  },
  {
    id: 16,
    name: "Dyson V15 Detect Cordless Vacuum",
    price: 115000,
    originalPrice: 132000,
    rating: 4.9,
    reviews: 1023,
    inStock: false,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "Home",
  },
];

const WishlistPage = () => {
  const [items, setItems] = useState(WISHLIST_ITEMS);
  const [added, setAdded] = useState<number[]>([]);

  const remove = (id: number) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const handleAddToCart = (id: number) => {
    setAdded((prev) => [...prev, id]);
    setTimeout(() => setAdded((prev) => prev.filter((x) => x !== id)), 2000);
  };

  if (items.length === 0)
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
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          Save items you love to your wishlist and shop them later.
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
          Explore Products
        </Link>
      </div>
    );

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
            Wishlist
          </span>
        </div>

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
            <span
              style={{
                fontSize: 16,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              ({items.length} items)
            </span>
          </h1>
          <button
            onClick={() => setItems([])}
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
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {items.map((item) => {
            const disc = Math.round(
              ((item.originalPrice - item.price) / item.originalPrice) * 100,
            );
            const isAdded = added.includes(item.id);
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
                {/* Remove from Wishlist */}
                <button
                  onClick={() => remove(item.id)}
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
                  <IoHeart color="#EF4444" size={16} />
                </button>

                <Link
                  to={`/product/${item.id}`}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  <img
                    src={item.image}
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
                  />
                  {!item.inStock && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontWeight: 800,
                          fontSize: 14,
                          background: "rgba(0,0,0,0.5)",
                          padding: "6px 16px",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        Out of Stock
                      </span>
                    </div>
                  )}
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
                </Link>

                <div
                  style={{
                    padding: 16,
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
                    {item.category}
                  </span>
                  <Link to={`/product/${item.id}`} style={{ flex: 1 }}>
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
                      {item.name}
                    </p>
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 10,
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <IoStarSharp
                        key={s}
                        size={12}
                        color={
                          s <= Math.floor(item.rating) ? "#F59E0B" : "#E2E8F0"
                        }
                      />
                    ))}
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginLeft: 2,
                      }}
                    >
                      ({item.reviews.toLocaleString()})
                    </span>
                  </div>
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
                        fontSize: 11,
                        color: "var(--accent)",
                        fontWeight: 600,
                      }}
                    >
                      Save Rs.{" "}
                      {(item.originalPrice - item.price).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    disabled={!item.inStock}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: !item.inStock
                        ? "var(--bg-muted)"
                        : isAdded
                          ? "var(--accent)"
                          : "var(--primary)",
                      color: !item.inStock ? "var(--text-muted)" : "white",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 13,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "var(--transition)",
                      border: "none",
                      cursor: item.inStock ? "pointer" : "not-allowed",
                    }}
                  >
                    <HiOutlineShoppingCart size={15} />{" "}
                    {!item.inStock
                      ? "Out of Stock"
                      : isAdded
                        ? "Added to Cart ✓"
                        : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
