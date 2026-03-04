import { Link } from "react-router-dom";
import { IoSearchOutline, IoHomeOutline } from "react-icons/io5";

const NotFound = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "70vh",
      padding: 40,
      background: "var(--bg-base)",
      textAlign: "center",
    }}
  >
    <div style={{ position: "relative", marginBottom: 32 }}>
      <div
        style={{
          fontSize: 140,
          fontWeight: 900,
          color: "#E2E8F0",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        404
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 52,
        }}
      >
        🔍
      </div>
    </div>
    <h1
      style={{
        fontSize: 28,
        fontWeight: 900,
        color: "var(--text-primary)",
        marginBottom: 10,
      }}
    >
      Page Not Found
    </h1>
    <p
      style={{
        fontSize: 15,
        color: "var(--text-muted)",
        maxWidth: 380,
        lineHeight: 1.7,
        marginBottom: 32,
      }}
    >
      Oops! The page you're looking for doesn't exist. It may have been moved or
      deleted.
    </p>
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 28px",
          background: "var(--primary)",
          color: "white",
          borderRadius: "var(--radius-sm)",
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        <IoHomeOutline size={17} /> Go Home
      </Link>
      <Link
        to="/products"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 28px",
          background: "white",
          border: "1.5px solid var(--border)",
          color: "var(--text-primary)",
          borderRadius: "var(--radius-sm)",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        <IoSearchOutline size={17} /> Browse Products
      </Link>
    </div>
    <div style={{ marginTop: 48 }}>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          marginBottom: 14,
          fontWeight: 600,
        }}
      >
        Popular Pages
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { to: "/", label: "Home" },
          { to: "/products", label: "Shop" },
          { to: "/cart", label: "Cart" },
          { to: "/account", label: "My Account" },
          { to: "/contact", label: "Contact" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              fontSize: 13,
              color: "var(--primary)",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default NotFound;
