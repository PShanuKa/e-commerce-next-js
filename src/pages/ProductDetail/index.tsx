import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  IoStarSharp,
  IoHeartOutline,
  IoHeart,
  IoShareSocialOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { TbTruckDelivery, TbRefresh } from "react-icons/tb";
import { FaMinus, FaPlus } from "react-icons/fa";

const PRODUCTS: Record<
  string,
  {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    category: string;
    badge: string;
    image: string;
    images: string[];
    description: string;
    specs: { label: string; value: string }[];
    inStock: boolean;
    brand: string;
  }
> = {
  "1": {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: 34500,
    originalPrice: 48000,
    rating: 4.8,
    reviews: 2341,
    category: "Electronics",
    badge: "Best Seller",
    brand: "Sony",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
    ],
    description:
      "Industry-leading noise canceling with Dual Noise Sensor Technology. Next-level music with Sony's proprietary Integrated Processor V1. Up to 30-hour battery life with quick charging (3 min charge for 3 hours of playback).",
    specs: [
      { label: "Driver Unit", value: "30mm" },
      { label: "Frequency Response", value: "4Hz-40,000Hz" },
      { label: "Battery Life", value: "30 hours" },
      { label: "Charging Time", value: "3.5 hours" },
      { label: "Connectivity", value: "Bluetooth 5.2" },
      { label: "Weight", value: "250g" },
      { label: "Color", value: "Midnight Black / Platinum Silver" },
      { label: "Microphone", value: "5 microphones" },
    ],
    inStock: true,
  },
};

const REVIEWS = [
  {
    id: 1,
    user: "Kasun P.",
    rating: 5,
    date: "Feb 15, 2025",
    verified: true,
    comment:
      "Absolutely amazing sound quality! The noise cancellation is top-notch, blocking out everything from office chatter to airplane noise. Battery lasts forever too.",
  },
  {
    id: 2,
    user: "Nimali S.",
    rating: 4,
    date: "Feb 10, 2025",
    verified: true,
    comment:
      "Great headphones overall. Very comfortable for long sessions. The call quality could be slightly better but sound quality for music is excellent.",
  },
  {
    id: 3,
    user: "Tharaka M.",
    rating: 5,
    date: "Jan 28, 2025",
    verified: true,
    comment:
      "Worth every rupee! I use these daily for work from home calls and music. The ANC is phenomenal. Highly recommend!",
  },
  {
    id: 4,
    user: "Ishara R.",
    rating: 4,
    date: "Jan 20, 2025",
    verified: false,
    comment:
      "Solid product. Build quality is premium and the companion app has many useful features. Takes a bit to get used to the touch controls.",
  },
];

const RELATED = [
  {
    id: 3,
    name: "Apple AirPods Pro (2nd Gen)",
    price: 58000,
    originalPrice: 65000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Logitech MX Master 3S Mouse",
    price: 22000,
    originalPrice: 27500,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
  },
  {
    id: 13,
    name: "JBL Charge 5 Bluetooth Speaker",
    price: 26000,
    originalPrice: 31500,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
  },
  {
    id: 10,
    name: "Kindle Paperwhite (16GB)",
    price: 19500,
    originalPrice: 22000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=300&h=300&fit=crop",
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS[id ?? "1"] ?? PRODUCTS["1"];

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

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
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={{ color: "var(--primary)" }}>
            Home
          </Link>{" "}
          <span>/</span>
          <Link to="/shop" style={{ color: "var(--primary)" }}>
            Shop
          </Link>{" "}
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
            {product.name}
          </span>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 36,
            marginBottom: 48,
          }}
        >
          {/* ── Image Gallery ── */}
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
                src={product.images[activeImage]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: 420,
                  objectFit: "cover",
                  display: "block",
                }}
              />
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
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {product.images.map((img, i) => (
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
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ── */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span className="badge badge-primary">{product.badge}</span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {product.category} by{" "}
                <strong style={{ color: "var(--text-primary)", marginLeft: 4 }}>
                  {product.brand}
                </strong>
              </span>
            </div>

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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <IoStarSharp
                    key={s}
                    size={16}
                    color={
                      s <= Math.floor(product.rating) ? "#F59E0B" : "#E2E8F0"
                    }
                  />
                ))}
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {product.rating}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--primary)",
                  cursor: "pointer",
                }}
              >
                ({product.reviews.toLocaleString()} reviews)
              </span>
              <span
                style={{ width: 1, height: 16, background: "var(--border)" }}
              />
              {product.inStock ? (
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--accent)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <IoCheckmarkCircle /> In Stock
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--error)",
                    fontWeight: 600,
                  }}
                >
                  Out of Stock
                </span>
              )}
            </div>

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
              <span
                style={{
                  fontSize: 18,
                  color: "var(--text-muted)",
                  textDecoration: "line-through",
                }}
              >
                Rs. {product.originalPrice.toLocaleString()}
              </span>
              <span
                style={{ fontSize: 14, color: "var(--error)", fontWeight: 700 }}
              >
                Save Rs.{" "}
                {(product.originalPrice - product.price).toLocaleString()}
              </span>
            </div>

            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              {product.description}
            </p>

            {/* Quantity & Actions */}
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

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <button
                onClick={handleAddToCart}
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
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
              >
                <HiOutlineShoppingCart size={18} />{" "}
                {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
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
                onClick={() => setWishlisted(!wishlisted)}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--border)",
                  background: wishlisted ? "#FEF2F2" : "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
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
                  title: "2 Year Warranty",
                  sub: "Manufacturer warranty",
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

        {/* ── Tabs ── */}
        <div className="card" style={{ marginBottom: 40, overflow: "hidden" }}>
          <div
            style={{ display: "flex", borderBottom: "1px solid var(--border)" }}
          >
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "14px 28px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color:
                    activeTab === tab ? "var(--primary)" : "var(--text-muted)",
                  borderBottom: `2px solid ${activeTab === tab ? "var(--primary)" : "transparent"}`,
                  transition: "var(--transition)",
                  textTransform: "capitalize",
                }}
              >
                {tab} {tab === "reviews" && `(${REVIEWS.length})`}
              </button>
            ))}
          </div>
          <div style={{ padding: 28 }}>
            {activeTab === "description" && (
              <div>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  {product.description}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                  }}
                >
                  Experience the next level of silence with Sony's Dual Noise
                  Sensor Technology featuring two microphones on each ear cup.
                  The Integrated Processor V1 achieves even more precise noise
                  canceling. Meanwhile, with 30-hour battery life and quick
                  charging capability, your music keeps going even when you're
                  on the move.
                </p>
              </div>
            )}
            {activeTab === "specs" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 40px",
                }}
              >
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {spec.label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-primary)",
                        fontWeight: 600,
                      }}
                    >
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: 40,
                    marginBottom: 32,
                    padding: 24,
                    background: "var(--bg-muted)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 56,
                        fontWeight: 900,
                        color: "var(--primary)",
                        lineHeight: 1,
                      }}
                    >
                      {product.rating}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "6px 0",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((s) => (
                        <IoStarSharp
                          key={s}
                          size={16}
                          color={
                            s <= Math.floor(product.rating)
                              ? "#F59E0B"
                              : "#E2E8F0"
                          }
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {product.reviews.toLocaleString()} reviews
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct =
                        star === 5
                          ? 65
                          : star === 4
                            ? 22
                            : star === 3
                              ? 9
                              : star === 2
                                ? 3
                                : 1;
                      return (
                        <div
                          key={star}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                              width: 8,
                            }}
                          >
                            {star}
                          </span>
                          <IoStarSharp size={12} color="#F59E0B" />
                          <div
                            style={{
                              flex: 1,
                              height: 8,
                              background: "var(--border)",
                              borderRadius: 4,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: "#F59E0B",
                                borderRadius: 4,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                              width: 28,
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {REVIEWS.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        padding: "20px 0",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, var(--primary), #7C3AED)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {r.user[0]}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {r.user}
                            </div>
                            {r.verified && (
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "var(--accent)",
                                  fontWeight: 600,
                                }}
                              >
                                ✓ Verified Purchase
                              </div>
                            )}
                          </div>
                        </div>
                        <span
                          style={{ fontSize: 12, color: "var(--text-muted)" }}
                        >
                          {r.date}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <IoStarSharp
                            key={s}
                            size={13}
                            color={s <= r.rating ? "#F59E0B" : "#E2E8F0"}
                          />
                        ))}
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                        }}
                      >
                        {r.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        <div>
          <h2 className="section-heading" style={{ marginBottom: 20 }}>
            You May Also Like
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            {RELATED.map((p) => {
              const disc = Math.round(
                ((p.originalPrice - p.price) / p.originalPrice) * 100,
              );
              return (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card" style={{ overflow: "hidden" }}>
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          transition: "transform 0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.06)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
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
                    </div>
                    <div style={{ padding: 12 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: 6,
                          lineHeight: 1.4,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {p.name}
                      </p>
                      <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <IoStarSharp
                            key={s}
                            size={11}
                            color={
                              s <= Math.floor(p.rating) ? "#F59E0B" : "#E2E8F0"
                            }
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: "var(--primary)",
                          }}
                        >
                          Rs. {p.price.toLocaleString()}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            textDecoration: "line-through",
                          }}
                        >
                          Rs. {p.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
