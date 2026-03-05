import { Link } from "react-router-dom";
import {
  IoRocketOutline,
  IoPeopleOutline,
  IoLeafOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

const TEAM = [
  {
    name: "Saman Jayawardena",
    role: "CEO & Founder",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Nimali Perera",
    role: "Chief Technology Officer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Kasun Silva",
    role: "Head of Operations",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  },
  {
    name: "Dilani Fernando",
    role: "Head of Design",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
  },
];

const MILESTONES = [
  {
    year: "2018",
    title: "Founded in Colombo",
    desc: "ShopLK started as a small electronics retailer with a vision to bring quality products online.",
  },
  {
    year: "2019",
    title: "100K Customers",
    desc: "Reached our first major milestone with 100,000 registered users.",
  },
  {
    year: "2021",
    title: "Expanded Nationwide",
    desc: "Delivery network expanded to cover all 25 districts across Sri Lanka.",
  },
  {
    year: "2023",
    title: "2M+ Orders",
    desc: "Achieved over 2 million successful orders and growing.",
  },
];

const AboutPage = () => (
  <div style={{ padding: "0 0 60px", background: "var(--bg-base)" }}>
    {/* Hero */}
    <div
      style={{
        background: "linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)",
        color: "white",
        padding: "80px 0",
        textAlign: "center",
        marginBottom: 60,
      }}
    >
      <div className="container">
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            opacity: 0.8,
            marginBottom: 12,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          About ShopLK
        </div>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 900,
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          Sri Lanka's Most Trusted
          <br />
          Online Shopping Destination
        </h1>
        <p
          style={{
            fontSize: 17,
            opacity: 0.85,
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Founded in 2018, ShopLK has been committed to delivering quality
          products at competitive prices to customers across Sri Lanka.
        </p>
      </div>
    </div>

    <div className="container">
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 60,
        }}
      >
        {[
          { value: "2M+", label: "Happy Customers", icon: "😊" },
          { value: "50K+", label: "Products Listed", icon: "📦" },
          { value: "25", label: "Districts Served", icon: "🗺️" },
          { value: "4.9★", label: "Average Rating", icon: "⭐" },
        ].map((stat, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: 28, textAlign: "center" }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "var(--primary)",
                marginBottom: 4,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission & Values */}
      <div style={{ marginBottom: 60 }}>
        <h2
          className="md:text-[22px] text-[16px] font-bold text-[var(--text-primary)] relative pb-[10px] 
after:content-[''] after:absolute after:bottom-0 after:left-0 
after:w-[40px] after:h-[3px] after:bg-[var(--primary)] after:rounded-[2px] "
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          Our Values
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {[
            {
              icon: <IoRocketOutline size={28} color="var(--primary)" />,
              title: "Innovation First",
              desc: "We constantly evolve our platform, logistics, and services to stay ahead and make shopping easier for you.",
            },
            {
              icon: <IoPeopleOutline size={28} color="var(--secondary)" />,
              title: "Community Driven",
              desc: "Every decision we make is driven by our community. Customer feedback shapes our roadmap.",
            },
            {
              icon: <IoLeafOutline size={28} color="var(--accent)" />,
              title: "Sustainability",
              desc: "We are committed to eco-friendly packaging and reducing our carbon footprint in every delivery.",
            },
            {
              icon: <IoShieldCheckmarkOutline size={28} color="#9333EA" />,
              title: "Trust & Safety",
              desc: "Verified sellers, genuine products, and secure payments protect every transaction on ShopLK.",
            },
          ].map((val, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: 28, display: "flex", gap: 20 }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {val.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 8,
                  }}
                >
                  {val.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {val.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: 60 }}>
        <h2
          className="md:text-[22px] text-[16px] font-bold text-[var(--text-primary)] relative pb-[10px] 
after:content-[''] after:absolute after:bottom-0 after:left-0 
after:w-[40px] after:h-[3px] after:bg-[var(--primary)] after:rounded-[2px]"
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          Our Journey
        </h2>
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 2,
              background: "var(--border)",
              transform: "translateX(-50%)",
            }}
          />
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 40,
                marginBottom: 36,
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
              }}
            >
              <div
                style={{ width: "44%", ...(i % 2 !== 0 ? { order: 1 } : {}) }}
              >
                <div className="card" style={{ padding: 20 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--primary)",
                      letterSpacing: 1,
                    }}
                  >
                    {m.year}
                  </span>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: "6px 0 6px",
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {m.desc}
                  </p>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  transform: "translateX(-50%)",
                  top: `${i * 120 + 12}px`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ marginBottom: 60 }}>
        <h2
          className="md:text-[22px] text-[16px] font-bold text-[var(--text-primary)] relative pb-[10px] 
after:content-[''] after:absolute after:bottom-0 after:left-0 
after:w-[40px] after:h-[3px] after:bg-[var(--primary)] after:rounded-[2px]"
          style={{ textAlign: "center", marginBottom: 8 }}
        >
          Meet the Team
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 14,
            marginBottom: 36,
          }}
        >
          The people behind Sri Lanka's favourite shopping platform
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {TEAM.map((member, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: 24, textAlign: "center" }}
            >
              <img
                src={member.image}
                alt={member.name}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid var(--border)",
                  marginBottom: 12,
                  display: "block",
                  margin: "0 auto 14px",
                }}
              />
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                {member.name}
              </h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--primary), #7C3AED)",
          borderRadius: "var(--radius-xl)",
          padding: 52,
          textAlign: "center",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
          Ready to Start Shopping?
        </h2>
        <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 28 }}>
          Join millions of happy shoppers and discover amazing deals every day.
        </p>
        <Link
          to="/products"
          style={{
            padding: "14px 40px",
            background: "white",
            color: "var(--primary)",
            borderRadius: "var(--radius-sm)",
            fontWeight: 800,
            fontSize: 15,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Shop Now →
        </Link>
      </div>
    </div>
  </div>
);

export default AboutPage;
