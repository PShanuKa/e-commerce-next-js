import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineEmail, MdLockOutline, MdPersonOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { useRegisterMutation } from "@/services/authSlice";
import { setCredentials } from "@/features/authSlice";
import type { AppDispatch } from "@/app/store";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agreeTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    try {
      const response = (await register({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      }).unwrap()) as {
        token: string;
        user: Parameters<typeof setCredentials>[0]["user"];
      };
      dispatch(setCredentials({ token: response.token, user: response.user }));
      navigate("/");
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string }; message?: string };
      setError(
        apiError?.data?.message ||
          apiError?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  const passwordStrength = PASSWORD_RULES.filter((r) =>
    r.test(form.password),
  ).length;
  const strengthColor =
    ["#EF4444", "#F59E0B", "#10B981", "#2563EB"][
      Math.max(0, passwordStrength - 1)
    ] || "#E2E8F0";
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][
    passwordStrength
  ];

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}
        >
          Create your account 🛍️
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Join millions of happy shoppers on ShopLK
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
            marginBottom: 18,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {/* Name Row */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 5,
              }}
            >
              First Name
            </label>
            <div style={{ position: "relative" }}>
              <MdPersonOutline
                size={17}
                color="var(--text-muted)"
                style={{
                  position: "absolute",
                  left: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                className="input-field"
                type="text"
                placeholder="John"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                style={{ paddingLeft: 36 }}
                required
              />
            </div>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 5,
              }}
            >
              Last Name
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 5,
            }}
          >
            Email Address
          </label>
          <div style={{ position: "relative" }}>
            <MdOutlineEmail
              size={17}
              color="var(--text-muted)"
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              className="input-field"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              style={{ paddingLeft: 36 }}
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 5,
            }}
          >
            Phone Number
          </label>
          <div style={{ position: "relative" }}>
            <FiPhone
              size={16}
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
              type="tel"
              placeholder="+94 77 123 4567"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 5,
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <MdLockOutline
              size={17}
              color="var(--text-muted)"
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={{ paddingLeft: 36, paddingRight: 40 }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
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
                <AiOutlineEyeInvisible size={17} />
              ) : (
                <AiOutlineEye size={17} />
              )}
            </button>
          </div>

          {/* Strength Meter */}
          {(form.password || passwordFocused) && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      background:
                        i <= passwordStrength ? strengthColor : "var(--border)",
                      transition: "var(--transition)",
                    }}
                  />
                ))}
              </div>
              {strengthLabel && (
                <span
                  style={{
                    fontSize: 11,
                    color: strengthColor,
                    fontWeight: 600,
                  }}
                >
                  {strengthLabel} password
                </span>
              )}
              <div
                style={{
                  marginTop: 6,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 4,
                }}
              >
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(form.password);
                  return (
                    <div
                      key={rule.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        color: passed ? "var(--success)" : "var(--text-muted)",
                      }}
                    >
                      <FaCheck
                        size={9}
                        color={passed ? "var(--success)" : "#CBD5E1"}
                      />
                      {rule.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 5,
            }}
          >
            Confirm Password
          </label>
          <div style={{ position: "relative" }}>
            <MdLockOutline
              size={17}
              color="var(--text-muted)"
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              className="input-field"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              style={{
                paddingLeft: 36,
                paddingRight: 40,
                borderColor:
                  form.confirmPassword && form.confirmPassword !== form.password
                    ? "var(--error)"
                    : undefined,
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: 10,
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
              {showConfirm ? (
                <AiOutlineEyeInvisible size={17} />
              ) : (
                <AiOutlineEye size={17} />
              )}
            </button>
          </div>
          {form.confirmPassword && form.confirmPassword !== form.password && (
            <p style={{ marginTop: 4, fontSize: 12, color: "var(--error)" }}>
              Passwords do not match
            </p>
          )}
        </div>

        {/* Terms */}
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={form.agreeTerms}
            onChange={(e) => update("agreeTerms", e.target.checked)}
            style={{
              width: 16,
              height: 16,
              accentColor: "var(--primary)",
              marginTop: 2,
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            I agree to the{" "}
            <Link
              to="/terms"
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              Privacy Policy
            </Link>
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
            marginTop: 4,
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
                  width: 17,
                  height: 17,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Login Link */}
      <p
        style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 14,
          color: "var(--text-secondary)",
        }}
      >
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
          Sign in →
        </Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Register;
