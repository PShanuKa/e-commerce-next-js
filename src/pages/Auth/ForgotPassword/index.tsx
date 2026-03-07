import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineEmail, MdArrowBack } from "react-icons/md";
import { useForgotPasswordMutation } from "@/services/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ animation: "fadeInUp 0.4s ease", textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            background: "#F0FDF4",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            color: "#16A34A",
          }}
        >
          <MdOutlineEmail size={32} />
        </div>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 12,
          }}
        >
          Check your email 📧
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 15,
            lineHeight: 1.6,
            marginBottom: 30,
          }}
        >
          We've sent a password reset link to <strong>{email}</strong>. Please
          check your inbox and follow the instructions.
        </p>
        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--primary)",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <MdArrowBack /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Forgot password? 🔐
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          No worries! Enter your email and we'll send you a link to reset your
          password.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "var(--radius-sm)",
            padding: "12px 16px",
            color: "var(--error)",
            fontSize: 13,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            Email Address
          </label>
          <div style={{ position: "relative" }}>
            <MdOutlineEmail
              size={18}
              color="var(--text-muted)"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: 40 }}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "14px",
            background: isLoading ? "#93C5FD" : "var(--primary)",
            color: "white",
            borderRadius: "var(--radius-sm)",
            fontSize: 15,
            fontWeight: 700,
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "var(--transition)",
          }}
        >
          {isLoading ? "Sending Link..." : "Send Reset Link"}
        </button>
      </form>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-secondary)",
            fontSize: 14,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          <MdArrowBack /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
