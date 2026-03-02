import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCheckmarkCircle, IoLockClosed } from "react-icons/io5";
import { FaCreditCard, FaMobileAlt, FaUniversity } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

const STEPS = ["Shipping", "Payment", "Review"];

const SAVED_ADDRESSES = [
  {
    id: 1,
    name: "Kasun Perera",
    address: "123 Galle Rd, Colombo 03",
    phone: "+94 77 123 4567",
    isDefault: true,
  },
  {
    id: 2,
    name: "Kasun Perera",
    address: "45 Kandy Rd, Kadawatha",
    phone: "+94 77 987 6543",
    isDefault: false,
  },
];

const ORDER_ITEMS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Headphones",
    price: 34500,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    name: "Apple AirPods Pro (2nd Gen)",
    price: 58000,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=80&h=80&fit=crop",
  },
  {
    id: 11,
    name: "Yoga Mat Premium",
    price: 3500,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1601925228008-0f0f48e1c15c?w=80&h=80&fit=crop",
  },
];

const Input = ({
  label,
  placeholder,
  type = "text",
  required = false,
  half = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  half?: boolean;
}) => (
  <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--text-primary)",
        marginBottom: 5,
      }}
    >
      {label}
      {required && " *"}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "10px 14px",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        fontSize: 13,
        color: "var(--text-primary)",
        background: "white",
        boxSizing: "border-box",
      }}
      required={required}
    />
  </div>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [payMethod, setPayMethod] = useState<"card" | "cod" | "bank">("card");
  const [newAddress, setNewAddress] = useState(false);

  const subtotal = ORDER_ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal >= 5000 ? 0 : 350;
  const total = subtotal + delivery;

  const handlePlaceOrder = () => navigate("/order-success");

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
          }}
        >
          <Link to="/" style={{ color: "var(--primary)" }}>
            Home
          </Link>{" "}
          <span>/</span>
          <Link to="/cart" style={{ color: "var(--primary)" }}>
            Cart
          </Link>{" "}
          <span>/</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            Checkout
          </span>
        </div>

        {/* Step Progress */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 36,
            gap: 0,
          }}
        >
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={() => i < step && setStep(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: i < step ? "pointer" : "default",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background:
                      i <= step ? "var(--primary)" : "var(--bg-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${i <= step ? "var(--primary)" : "var(--border)"}`,
                    transition: "var(--transition)",
                  }}
                >
                  {i < step ? (
                    <IoCheckmarkCircle size={20} color="white" />
                  ) : (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: i <= step ? "white" : "var(--text-muted)",
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: i <= step ? "var(--primary)" : "var(--text-muted)",
                  }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: 80,
                    height: 2,
                    background: i < step ? "var(--primary)" : "var(--border)",
                    margin: "0 12px",
                    transition: "var(--transition)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}
        >
          {/* ── Main Panel ── */}
          <div>
            {/* STEP 0: Shipping */}
            {step === 0 && (
              <div>
                <div className="card" style={{ padding: 24, marginBottom: 16 }}>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 20,
                    }}
                  >
                    Delivery Address
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    {SAVED_ADDRESSES.map((addr) => (
                      <label
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        style={{
                          display: "flex",
                          gap: 12,
                          padding: 16,
                          border: `1.5px solid ${selectedAddress === addr.id ? "var(--primary)" : "var(--border)"}`,
                          borderRadius: "var(--radius-md)",
                          cursor: "pointer",
                          background:
                            selectedAddress === addr.id ? "#EFF6FF" : "white",
                          transition: "var(--transition)",
                        }}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          style={{
                            accentColor: "var(--primary)",
                            width: 15,
                            height: 15,
                            marginTop: 2,
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                              marginBottom: 4,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--text-primary)",
                              }}
                            >
                              {addr.name}
                            </span>
                            {addr.isDefault && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  background: "var(--primary)",
                                  color: "white",
                                  padding: "2px 7px",
                                  borderRadius: "var(--radius-full)",
                                }}
                              >
                                Default
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--text-secondary)",
                              marginBottom: 2,
                            }}
                          >
                            {addr.address}
                          </p>
                          <p
                            style={{ fontSize: 12, color: "var(--text-muted)" }}
                          >
                            {addr.phone}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setNewAddress(!newAddress)}
                    style={{
                      fontSize: 13,
                      color: "var(--primary)",
                      background: "none",
                      border: "1.5px dashed var(--primary)",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 16px",
                      cursor: "pointer",
                      fontWeight: 600,
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    + Add New Address
                  </button>
                  {newAddress && (
                    <div
                      style={{
                        marginTop: 20,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <Input
                        label="Full Name"
                        placeholder="Kasun Perera"
                        required
                        half
                      />
                      <Input
                        label="Phone"
                        placeholder="+94 77 123 4567"
                        type="tel"
                        required
                        half
                      />
                      <Input
                        label="Address Line 1"
                        placeholder="No. 123, Galle Road"
                        required
                      />
                      <Input
                        label="Address Line 2"
                        placeholder="Apartment, suite (optional)"
                      />
                      <Input label="City" placeholder="Colombo" required half />
                      <Input
                        label="Postal Code"
                        placeholder="00300"
                        required
                        half
                      />
                      <Input
                        label="Province"
                        placeholder="Western Province"
                        required
                        half
                      />
                    </div>
                  )}
                </div>

                <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 16,
                    }}
                  >
                    Delivery Method
                  </h3>
                  {[
                    {
                      id: "standard",
                      label: "Standard Delivery (3-5 days)",
                      price: subtotal >= 5000 ? "FREE" : "Rs. 350",
                      icon: (
                        <TbTruckDelivery size={20} color="var(--primary)" />
                      ),
                    },
                    {
                      id: "express",
                      label: "Express Delivery (1-2 days)",
                      price: "Rs. 750",
                      icon: (
                        <TbTruckDelivery size={20} color="var(--secondary)" />
                      ),
                    },
                  ].map((opt, i) => (
                    <label
                      key={opt.id}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        padding: 14,
                        border: `1.5px solid ${i === 0 ? "var(--primary)" : "var(--border)"}`,
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        marginBottom: i === 0 ? 10 : 0,
                        background: i === 0 ? "#EFF6FF" : "white",
                      }}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        defaultChecked={i === 0}
                        style={{ accentColor: "var(--primary)" }}
                      />
                      {opt.icon}
                      <span
                        style={{
                          flex: 1,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {opt.label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color:
                            i === 0 && subtotal >= 5000
                              ? "var(--accent)"
                              : "var(--text-primary)",
                        }}
                      >
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => setStep(1)}
                  style={{
                    width: "100%",
                    padding: 14,
                    background: "var(--primary)",
                    color: "white",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 1: Payment */}
            {step === 1 && (
              <div>
                <div className="card" style={{ padding: 24, marginBottom: 16 }}>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 20,
                    }}
                  >
                    Payment Method
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 24,
                    }}
                  >
                    {[
                      {
                        id: "card" as const,
                        label: "Credit / Debit Card",
                        icon: <FaCreditCard size={20} color="#1D4ED8" />,
                        sub: "Visa, Mastercard, Amex",
                      },
                      {
                        id: "cod" as const,
                        label: "Cash on Delivery",
                        icon: <span style={{ fontSize: 20 }}>💵</span>,
                        sub: "Pay when you receive",
                      },
                      {
                        id: "bank" as const,
                        label: "Bank Transfer",
                        icon: <FaUniversity size={18} color="#059669" />,
                        sub: "Direct bank deposit",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        onClick={() => setPayMethod(opt.id)}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                          padding: 16,
                          border: `1.5px solid ${payMethod === opt.id ? "var(--primary)" : "var(--border)"}`,
                          borderRadius: "var(--radius-md)",
                          cursor: "pointer",
                          background:
                            payMethod === opt.id ? "#EFF6FF" : "white",
                          transition: "var(--transition)",
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={payMethod === opt.id}
                          onChange={() => setPayMethod(opt.id)}
                          style={{ accentColor: "var(--primary)" }}
                        />
                        {opt.icon}
                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "var(--text-primary)",
                            }}
                          >
                            {opt.label}
                          </div>
                          <div
                            style={{ fontSize: 12, color: "var(--text-muted)" }}
                          >
                            {opt.sub}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {payMethod === "card" && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        padding: 20,
                        background: "var(--bg-muted)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <div style={{ gridColumn: "span 2" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            marginBottom: 5,
                          }}
                        >
                          Card Number *
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            style={{
                              width: "100%",
                              padding: "10px 40px 10px 14px",
                              border: "1.5px solid var(--border)",
                              borderRadius: "var(--radius-sm)",
                              fontSize: 13,
                              boxSizing: "border-box",
                            }}
                          />
                          <FaCreditCard
                            style={{
                              position: "absolute",
                              right: 12,
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                            size={16}
                            color="var(--text-muted)"
                          />
                        </div>
                      </div>
                      <Input
                        label="Cardholder Name"
                        placeholder="Kasun Perera"
                        required
                        half
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                          gridColumn: "span 1",
                        }}
                      >
                        <Input
                          label="Expiry"
                          placeholder="MM / YY"
                          required
                          half
                        />
                        <Input
                          label="CVV"
                          placeholder="•••"
                          type="password"
                          required
                          half
                        />
                      </div>
                      <label
                        style={{
                          gridColumn: "span 2",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                          fontSize: 13,
                          color: "var(--text-secondary)",
                        }}
                      >
                        <input
                          type="checkbox"
                          style={{ accentColor: "var(--primary)" }}
                        />{" "}
                        Save card for future payments
                      </label>
                    </div>
                  )}

                  {payMethod === "cod" && (
                    <div
                      style={{
                        padding: 16,
                        background: "#FFF7ED",
                        border: "1px solid #FED7AA",
                        borderRadius: "var(--radius-md)",
                        fontSize: 13,
                        color: "#92400E",
                        lineHeight: 1.6,
                      }}
                    >
                      💵 You will pay{" "}
                      <strong>Rs. {total.toLocaleString()}</strong> in cash when
                      your order is delivered. Please have the exact amount
                      ready.
                    </div>
                  )}

                  {payMethod === "bank" && (
                    <div
                      style={{
                        padding: 16,
                        background: "var(--bg-muted)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          marginBottom: 10,
                        }}
                      >
                        Bank Transfer Details:
                      </p>
                      {[
                        ["Bank", "Commercial Bank of Ceylon"],
                        ["Account Name", "ShopLK (Pvt) Ltd"],
                        ["Account No.", "1234567890"],
                        ["Branch", "Colombo Branch"],
                      ].map(([l, v]) => (
                        <div
                          key={l}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 13,
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ color: "var(--text-muted)" }}>
                            {l}:
                          </span>
                          <span
                            style={{
                              fontWeight: 600,
                              color: "var(--text-primary)",
                            }}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setStep(0)}
                    style={{
                      padding: "13px 24px",
                      background: "white",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      color: "var(--text-primary)",
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      flex: 1,
                      padding: 13,
                      background: "var(--primary)",
                      color: "white",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 15,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Review */}
            {step === 2 && (
              <div>
                <div className="card" style={{ padding: 24, marginBottom: 16 }}>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 16,
                    }}
                  >
                    Review Your Order
                  </h3>
                  {ORDER_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: 14,
                        padding: "14px 0",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border)",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            marginBottom: 4,
                          }}
                        >
                          {item.name}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          Qty: {item.qty}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "var(--primary)",
                        }}
                      >
                        Rs. {(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ padding: 24, marginBottom: 16 }}>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 12,
                    }}
                  >
                    Delivery to
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {
                      SAVED_ADDRESSES.find((a) => a.id === selectedAddress)
                        ?.name
                    }{" "}
                    ·{" "}
                    {
                      SAVED_ADDRESSES.find((a) => a.id === selectedAddress)
                        ?.address
                    }{" "}
                    ·{" "}
                    {
                      SAVED_ADDRESSES.find((a) => a.id === selectedAddress)
                        ?.phone
                    }
                  </p>
                </div>

                <div className="card" style={{ padding: 24, marginBottom: 16 }}>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 12,
                    }}
                  >
                    Payment
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {payMethod === "card"
                      ? "Credit / Debit Card"
                      : payMethod === "cod"
                        ? "Cash on Delivery"
                        : "Bank Transfer"}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      padding: "13px 24px",
                      background: "white",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      color: "var(--text-primary)",
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    style={{
                      flex: 1,
                      padding: 13,
                      background: "var(--accent)",
                      color: "white",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 15,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <IoLockClosed size={15} /> Place Order · Rs.{" "}
                    {total.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div style={{ position: "sticky", top: 100 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 16,
                }}
              >
                Order Summary
              </h3>
              {ORDER_ITEMS.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 44,
                        height: 44,
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        width: 18,
                        height: 18,
                        background: "var(--primary)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      {item.qty}
                    </span>
                  </div>
                  <p
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.name}
                  </p>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      flexShrink: 0,
                    }}
                  >
                    Rs. {(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
              <div
                style={{
                  height: 1,
                  background: "var(--border)",
                  margin: "16px 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                <span>Subtotal</span>
                <span style={{ fontWeight: 600 }}>
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                <span>Delivery</span>
                <span
                  style={{
                    fontWeight: 600,
                    color:
                      delivery === 0 ? "var(--accent)" : "var(--text-primary)",
                  }}
                >
                  {delivery === 0 ? "FREE" : `Rs. ${delivery}`}
                </span>
              </div>
              <div
                style={{
                  height: 1,
                  background: "var(--border)",
                  marginBottom: 12,
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: "var(--primary)",
                  }}
                >
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
