import { Link } from "react-router-dom";
import { FaTag } from "react-icons/fa";

const AuthDefault = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #1E3A8A 0%, #2563EB 40%, #7C3AED 100%)",
      }}
      

    >
      {/* Left Panel — Branding */}
      <div
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 40px",
          position: "relative",
          overflow: "hidden",
        }}
        className="hidden  md:flex"
      >
        {/* Decorative circles */}
        {[180, 280, 380].map((size, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        <Link
          to="/"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <FaTag color="white" size={28} />
          </div>
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            Sellora
          </span>
        </Link>

        <h1
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: 360,
            marginBottom: 20,
          }}
        >
          Shop Smart, Live Better
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            maxWidth: 300,
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          Discover thousands of products at unbeatable prices. Your favorite
          brands, all in one place.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 30,
            marginTop: 48,
            padding: "24px 32px",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {[
            { value: "50K+", label: "Products" },
            { value: "2M+", label: "Customers" },
            { value: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "white" }}>
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "var(--bg-surface)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "50px 44px",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthDefault;
