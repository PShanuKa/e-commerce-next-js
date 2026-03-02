import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    // navigate("/") after real auth
  };

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}
        >
          Welcome back! 👋
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Sign in to your account to continue shopping
        </p>
      </div>

      {/* Error */}
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

      {/* Social Login */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        <button
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "11px 16px",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            background: "white",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
            cursor: "pointer",
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.borderColor =
              "var(--border)")
          }
        >
          <FcGoogle size={18} />
          Google
        </button>
        <button
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "11px 16px",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            background: "white",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
            cursor: "pointer",
            transition: "var(--transition)",
          }}
        >
          <FaFacebook size={18} color="#1877F2" />
          Facebook
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span
          style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}
        >
          or continue with email
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        {/* Email */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 6,
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

        {/* Password */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500 }}
            >
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <MdLockOutline
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
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: 40, paddingRight: 44 }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                padding: 0,
              }}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={18} />
              ) : (
                <AiOutlineEye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{
              width: 16,
              height: 16,
              accentColor: "var(--primary)",
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Remember me for 30 days
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "13px",
            background: isLoading ? "#93C5FD" : "var(--primary)",
            color: "white",
            borderRadius: "var(--radius-sm)",
            fontSize: 15,
            fontWeight: 700,
            transition: "var(--transition)",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            letterSpacing: "0.2px",
          }}
          onMouseEnter={(e) =>
            !isLoading &&
            ((e.currentTarget as HTMLElement).style.background =
              "var(--primary-hover)")
          }
          onMouseLeave={(e) =>
            !isLoading &&
            ((e.currentTarget as HTMLElement).style.background =
              "var(--primary)")
          }
        >
          {isLoading ? (
            <>
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Register Link */}
      <p
        style={{
          marginTop: 28,
          textAlign: "center",
          fontSize: 14,
          color: "var(--text-secondary)",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{ color: "var(--primary)", fontWeight: 700 }}
        >
          Create one free →
        </Link>
      </p>

      <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  );
};

export default Login;
