import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import { IoSearch, IoHeartOutline, IoLocationOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FaAngleDown, FaTag } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { MdOutlineLocalShipping } from "react-icons/md";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Orders", path: "/account/orders" },
  // { label: "Hot Deals", path: "/products" },
  // { label: "Electronics", path: "/products" },
  // { label: "Fashion", path: "/products" },
  // { label: "About Us", path: "/about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: scrolled ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transition: "var(--transition-slow)",
      }}
    >
      {/* ── Top Bar ── */}
      <div style={{ background: "var(--text-primary)", padding: "6px 0" }}>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span
              style={{
                color: "#94A3B8",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <FiPhone size={12} /> +94 11 234 5678
            </span>
            <span
              style={{
                color: "#94A3B8",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <IoLocationOutline size={12} /> Colombo, Sri Lanka
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                color: "#94A3B8",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <MdOutlineLocalShipping size={13} /> Free shipping on orders over
              Rs. 5000
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "14px 20px",
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  background:
                    "linear-gradient(135deg, var(--primary), #7C3AED)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTag color="white" size={16} />
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.5px",
                }}
              >
                ShopLK
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div
            style={{
              flex: 1,
              maxWidth: 680,
              display: "flex",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              border: searchFocused
                ? "2px solid var(--primary)"
                : "2px solid var(--border)",
              boxShadow: searchFocused
                ? "0 0 0 4px rgba(37,99,235,0.1)"
                : "none",
              transition: "var(--transition)",
            }}
          >
            <select
              style={{
                padding: "0 14px",
                background: "var(--bg-muted)",
                border: "none",
                borderRight: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
              <option>Sports</option>
            </select>
            <input
              className="input-field"
              type="text"
              placeholder="Search for products, brands, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: 0,
                padding: "10px 16px",
                fontSize: 14,
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/search?q=${query}`)
              }
            />
            <button
              onClick={() => navigate(`/search?q=${query}`)}
              style={{
                padding: "0 18px",
                background: "var(--primary)",
                color: "white",
                border: "none",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--primary)")
              }
            >
              <IoSearch size={18} />
            </button>
          </div>

          {/* Right Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginLeft: "auto",
            }}
          >
            <Link
              to="/wishlist"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--primary-light)";
                (e.currentTarget as HTMLElement).style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-secondary)";
              }}
            >
              <IoHeartOutline size={22} />
              <span style={{ fontSize: 11, fontWeight: 500 }}>Wishlist</span>
            </Link>

            <Link
              to="/account"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
                transition: "var(--transition)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--primary-light)";
                (e.currentTarget as HTMLElement).style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-secondary)";
              }}
            >
              <AiOutlineUser size={22} />
              <span style={{ fontSize: 11, fontWeight: 500 }}>Account</span>
            </Link>

            <Link
              to="/cart"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                background: "var(--primary)",
                color: "white",
                borderRadius: "var(--radius-sm)",
                transition: "var(--transition)",
                fontWeight: 600,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--primary-hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "var(--primary)")
              }
            >
              <div style={{ position: "relative" }}>
                <GrCart size={20} />
                <span
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    background: "var(--secondary)",
                    color: "white",
                    borderRadius: "50%",
                    width: 17,
                    height: 17,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  0
                </span>
              </div>
              <div>
                <div style={{ fontSize: 10, opacity: 0.8, lineHeight: 1 }}>
                  My Cart
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.2 }}>Rs. 0.00</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Category Nav Bar ── */}
      <div style={{ background: "var(--primary)" }}>
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* All Departments */}
          {/* <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 0,
              borderRight: "1px solid rgba(255,255,255,0.15)",
              minWidth: 200,
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.12)")
            }
          >
            <HiOutlineMenuAlt2 size={18} />
            All Departments
            <FaAngleDown size={12} style={{ marginLeft: "auto" }} />
          </button> */}

          {/* Nav Links */}
          <nav style={{ display: "flex", alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                style={{
                  padding: "12px 16px",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "var(--transition)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "white";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(255,255,255,0.9)";
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right promo */}
          <div
            style={{
              padding: "8px 20px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--secondary)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            🔥 Today's Hot Deals
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
