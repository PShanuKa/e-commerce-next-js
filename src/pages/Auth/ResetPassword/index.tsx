import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdLockOutline } from "react-icons/md";
import { useResetPasswordMutation } from "@/services/authSlice";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid link or token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to reset password.");
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h2 style={{ color: "var(--error)", marginBottom: 16 }}>
          Missing Token
        </h2>
        <p>The link is invalid or expired.</p>
        <Link
          to="/forgot-password"
          style={{ color: "var(--primary)", marginTop: 24, display: "block" }}
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ animation: "fadeInUp 0.4s ease", textAlign: "center" }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "var(--success)",
            marginBottom: 12,
          }}
        >
          Success! 🎉
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          Your password has been reset. Redirecting you to login...
        </p>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
          Click here if not redirected
        </Link>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div style={{ marginBottom: 30 }}>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Reset Password 🔒
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Set a new password to access your account.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            padding: "12px 16px",
            color: "var(--error)",
            fontSize: 13,
            marginBottom: 20,
            borderRadius: "var(--radius-sm)",
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
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        {/* Password */}
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
            New Password
          </label>
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
              placeholder="Enter new password"
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

        {/* Confirm Password */}
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
            Confirm Password
          </label>
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
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          }}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
