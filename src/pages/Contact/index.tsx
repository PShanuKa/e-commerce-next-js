import { useState } from "react";
import {
  IoMail,
  IoCallOutline,
  IoLocationOutline,
  IoLogoWhatsapp,
} from "react-icons/io5";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const FAQ = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days. Deliveries are available island-wide across all 25 districts.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day hassle-free return policy. Items must be unused and in original packaging. Refunds are processed within 5-7 business days.",
  },
  {
    q: "Are all products genuine?",
    a: "Yes! All products on Sellora are 100% genuine. We verify every seller and offer a quality guarantee on all purchases.",
  },
  {
    q: "How do I track my order?",
    a: "You can track your order in real-time from the My Orders section in your account dashboard, or via the tracking link in your confirmation email.",
  },
  {
    q: "Do you offer cash on delivery?",
    a: "Yes, we offer Cash on Delivery (COD) for all orders island-wide. We also accept credit/debit cards and bank transfers.",
  },
];

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ padding: "0 0 60px", background: "var(--bg-base)" }}>
      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1E3A5F 0%, var(--primary) 100%)",
          color: "white",
          padding: "60px 0",
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 12 }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: 15, opacity: 0.85 }}>
            We're here to help. Our team responds within 24 hours on business
            days.
          </p>
        </div>
      </div>

      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: 32,
            marginBottom: 56,
          }}
        >
          {/* ── Contact Info ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                icon: <IoCallOutline size={22} color="var(--primary)" />,
                title: "Phone",
                lines: ["+94 11 234 5678", "+94 77 987 6543"],
                sub: "Mon - Fri, 8am - 10pm",
              },
              {
                icon: <IoMail size={22} color="var(--secondary)" />,
                title: "Email",
                lines: ["support@Sellora.lk", "business@Sellora.lk"],
                sub: "We reply within 24 hours",
              },
              {
                icon: <IoLogoWhatsapp size={22} color="#25D366" />,
                title: "WhatsApp",
                lines: ["+94 77 123 4567"],
                sub: "Quick support via WhatsApp",
              },
              {
                icon: <IoLocationOutline size={22} color="#9333EA" />,
                title: "Head Office",
                lines: ["No. 123, Galle Road,", "Colombo 03, Sri Lanka"],
                sub: "Mon - Fri, 9am - 5pm",
              },
            ].map((info, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: 20,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {info.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {info.title}
                  </h3>
                  {info.lines.map((l) => (
                    <p
                      key={l}
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        marginBottom: 1,
                      }}
                    >
                      {l}
                    </p>
                  ))}
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {info.sub}
                  </p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="card" style={{ padding: 20 }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 14,
                }}
              >
                Follow Us
              </h3>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  {
                    icon: <FaFacebook size={18} />,
                    color: "#1877F2",
                    label: "Facebook",
                  },
                  {
                    icon: <FaInstagram size={18} />,
                    color: "#E1306C",
                    label: "Instagram",
                  },
                  {
                    icon: <FaTwitter size={18} />,
                    color: "#1DA1F2",
                    label: "Twitter",
                  },
                ].map((s) => (
                  <button
                    key={s.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "8px 14px",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      background: "white",
                      color: s.color,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        s.color;
                      (e.currentTarget as HTMLElement).style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "white";
                      (e.currentTarget as HTMLElement).style.color = s.color;
                    }}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Contact Form ── */}
          <div className="card" style={{ padding: 32 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: 10,
                  }}
                >
                  Message Sent!
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    marginBottom: 24,
                  }}
                >
                  Thank you for reaching out. Our team will get back to you
                  within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  style={{
                    padding: "11px 28px",
                    background: "var(--primary)",
                    color: "white",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    fontSize: 14,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: 24,
                  }}
                >
                  Send Us a Message
                </h2>
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    {(["name", "email"] as const).map((field) => (
                      <div key={field}>
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
                          {field === "name" ? "Full Name" : "Email Address"} *
                        </label>
                        <input
                          className="input-field"
                          type={field === "email" ? "email" : "text"}
                          placeholder={
                            field === "name"
                              ? "Kasun Perera"
                              : "kasun@example.com"
                          }
                          value={form[field]}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, [field]: e.target.value }))
                          }
                          required
                        />
                      </div>
                    ))}
                  </div>
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
                      Subject *
                    </label>
                    <select
                      className="input-field"
                      value={form.subject}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, subject: e.target.value }))
                      }
                      required
                      style={{ cursor: "pointer" }}
                    >
                      <option value="">Select a subject</option>
                      <option>Order Issue</option>
                      <option>Return / Refund</option>
                      <option>Product Inquiry</option>
                      <option>Seller Inquiry</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>
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
                      Message *
                    </label>
                    <textarea
                      className="input-field"
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="Please describe your issue or question in detail..."
                      rows={5}
                      required
                      style={{
                        resize: "vertical",
                        minHeight: 120,
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "13px",
                      background: loading ? "#93C5FD" : "var(--primary)",
                      color: "white",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 15,
                      fontWeight: 700,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {loading ? (
                      <>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTop: "2px solid white",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />{" "}
                        Sending...
                      </>
                    ) : (
                      "Send Message →"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2
            className="md:text-[22px] text-[16px] font-bold text-[var(--text-primary)] relative pb-[10px] 
after:content-[''] after:absolute after:bottom-0 after:left-0 
after:w-[40px] after:h-[3px] after:bg-[var(--primary)] after:rounded-[2px]"
            style={{ marginBottom: 8, textAlign: "center" }}
          >
            Frequently Asked Questions
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            Quick answers to common questions
          </p>
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {FAQ.map((faq, i) => (
              <div key={i} className="card" style={{ overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      color: "var(--text-muted)",
                      flexShrink: 0,
                      marginLeft: 16,
                      transition: "transform 0.2s",
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 18px" }}>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                      }}
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ContactPage;
