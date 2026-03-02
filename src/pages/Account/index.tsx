import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  IoPerson,
  IoSettings,
  IoHeart,
  IoShieldCheckmark,
  IoLogOut,
  IoMenuOutline,
} from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { TbTruckDelivery } from "react-icons/tb";

const NAV_LINKS = [
  {
    path: "/account",
    label: "Profile",
    icon: <IoPerson size={17} />,
    exact: true,
  },
  {
    path: "/account/orders",
    label: "My Orders",
    icon: <HiOutlineShoppingBag size={17} />,
  },
  { path: "/wishlist", label: "Wishlist", icon: <IoHeart size={17} /> },
  {
    path: "/account/addresses",
    label: "Addresses",
    icon: <TbTruckDelivery size={17} />,
  },
  {
    path: "/account/security",
    label: "Security",
    icon: <IoShieldCheckmark size={17} />,
  },
  {
    path: "/account/settings",
    label: "Settings",
    icon: <IoSettings size={17} />,
  },
];

export const AccountLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
            My Account
          </span>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}
        >
          {/* ── Sidebar ── */}
          <div>
            <div className="card" style={{ padding: 20, marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "16px 0 20px",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--primary), #7C3AED)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 28,
                    fontWeight: 900,
                    marginBottom: 12,
                  }}
                >
                  K
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 2,
                  }}
                >
                  Kasun Perera
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  kasun@example.com
                </p>
                <span
                  style={{
                    marginTop: 8,
                    fontSize: 10,
                    fontWeight: 700,
                    background: "#FEF3C7",
                    color: "#B45309",
                    padding: "3px 10px",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  Gold Member
                </span>
              </div>
              <div
                style={{
                  height: 1,
                  background: "var(--border)",
                  marginBottom: 12,
                }}
              />
              <nav>
                {NAV_LINKS.map((link) => {
                  const active = link.exact
                    ? location.pathname === link.path
                    : location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: "var(--radius-sm)",
                        marginBottom: 2,
                        background: active ? "#EFF6FF" : "transparent",
                        color: active
                          ? "var(--primary)"
                          : "var(--text-secondary)",
                        fontWeight: active ? 700 : 500,
                        fontSize: 13,
                        textDecoration: "none",
                        transition: "var(--transition)",
                      }}
                    >
                      {link.icon} {link.label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => navigate("/")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--error)",
                    fontWeight: 500,
                    fontSize: 13,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    marginTop: 8,
                  }}
                >
                  <IoLogOut size={17} /> Sign Out
                </button>
              </nav>
            </div>
          </div>
          {/* ── Content ── */}
          <div>{children ?? <Outlet />}</div>
        </div>
      </div>
    </div>
  );
};

/* ─── Profile Page ───────────────────────────────── */
const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({
    label,
    value,
    type = "text",
  }: {
    label: string;
    value: string;
    type?: string;
  }) => (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-muted)",
          marginBottom: 5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {editing ? (
        <input
          type={type}
          defaultValue={value}
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "1.5px solid var(--primary)",
            borderRadius: "var(--radius-sm)",
            fontSize: 14,
            color: "var(--text-primary)",
            boxSizing: "border-box",
          }}
        />
      ) : (
        <p
          style={{
            fontSize: 14,
            color: "var(--text-primary)",
            fontWeight: 500,
            padding: "10px 0",
          }}
        >
          {value}
        </p>
      )}
    </div>
  );

  return (
    <AccountLayout>
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            Personal Information
          </h2>
          {saved && (
            <span
              style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700 }}
            >
              ✓ Changes saved!
            </span>
          )}
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: "8px 20px",
                background: "var(--primary)",
                color: "white",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit Profile
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: "8px 16px",
                  background: "white",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "8px 20px",
                  background: "var(--accent)",
                  color: "white",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          <Field label="First Name" value="Kasun" />
          <Field label="Last Name" value="Perera" />
          <Field label="Email Address" value="kasun@example.com" type="email" />
          <Field label="Phone Number" value="+94 77 123 4567" type="tel" />
          <Field label="Date of Birth" value="15 March 1993" type="date" />
          <Field label="Gender" value="Male" />
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Total Orders", value: "24", icon: "🛒" },
          { label: "Wishlist Items", value: "6", icon: "❤️" },
          { label: "Total Spent", value: "Rs. 284K", icon: "💰" },
        ].map((stat, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: 20, textAlign: "center" }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{stat.icon}</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "var(--primary)",
                marginBottom: 2,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ padding: 24 }}>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          Recent Orders
        </h3>
        {[
          {
            id: "SLK-ABC123",
            items: "Sony Headphones, AirPods Pro",
            date: "Mar 2, 2025",
            total: "Rs. 150,500",
            status: "Delivered",
          },
          {
            id: "SLK-DEF456",
            items: "Yoga Mat Premium",
            date: "Feb 20, 2025",
            total: "Rs. 3,500",
            status: "Delivered",
          },
          {
            id: "SLK-GHI789",
            items: "Canon EOS R50",
            date: "Feb 5, 2025",
            total: "Rs. 135,000",
            status: "Delivered",
          },
        ].map((order, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: i < 2 ? "1px solid var(--border)" : "none",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 3,
                }}
              >
                {order.id}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {order.items}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                {order.date}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--primary)",
                  marginBottom: 4,
                }}
              >
                {order.total}
              </p>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: "#ECFDF5",
                  color: "#059669",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                }}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
        <Link
          to="/account/orders"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 16,
            fontSize: 13,
            color: "var(--primary)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          View All Orders →
        </Link>
      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
