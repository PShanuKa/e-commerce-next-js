import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  IoPerson,
  IoSettings,
  IoHeart,
  IoShieldCheckmark,
  IoLogOut,
  IoCameraOutline,
  IoCheckmarkCircle,
  IoClose,
} from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { TbTruckDelivery } from "react-icons/tb";
import { MdLockOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { setUser, clearUser } from "@/features/authSlice";
import {
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
} from "@/services/authSlice";
import { useGetWishlistQuery } from "@/services/wishlistSlice";

/* ─── Sidebar nav ────────────────────────────────── */
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

/* ─── Account Layout ────────────────────────────── */
export const AccountLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

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
              {/* Avatar + name */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "16px 0 20px",
                }}
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: 12,
                    }}
                  />
                ) : (
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
                      fontSize: 26,
                      fontWeight: 900,
                      marginBottom: 12,
                    }}
                  >
                    {initials}
                  </div>
                )}
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 2,
                  }}
                >
                  {user?.name ?? "—"}
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {user?.email ?? "—"}
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
                  {user?.role === "admin" ? "Admin" : "Gold Member"}
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
                  onClick={handleLogout}
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Profile Page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((s: RootState) => s.auth);

  /* ── Fetch latest user from API → sync to Redux store ── */
  const { data: meData, isLoading: loadingMe } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (meData?.user) dispatch(setUser(meData.user));
  }, [meData, dispatch]);

  /* ── Wishlist count from API ── */
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const wishlistCount = wishlistData?.wishlist?.length ?? 0;

  /* ── Mutations ── */
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changingPw }] =
    useChangePasswordMutation();

  /* ── Edit profile state ── */
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  /* ── Change password state ── */
  const [pwOpen, setPwOpen] = useState(false);
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  const openEdit = () => {
    setEditName(user?.name ?? "");
    setEditPhone(user?.phone ?? "");
    setEditAvatar(user?.avatarUrl ?? "");
    setSaveError("");
    setSaveSuccess(false);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaveError("");
    try {
      const result = await updateMe({
        name: editName.trim() || undefined,
        phone: editPhone.trim() || undefined,
        avatar_url: editAvatar.trim() || undefined,
      }).unwrap();
      dispatch(setUser(result.user));
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: unknown) {
      setSaveError("Failed to save changes. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    setPwError("");
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    try {
      const res = await changePassword({
        currentPassword: curPw,
        newPassword: newPw,
      }).unwrap();
      setPwSuccess(res.message);
      setCurPw("");
      setNewPw("");
      setConfirmPw("");
      setTimeout(() => {
        setPwSuccess("");
        setPwOpen(false);
      }, 3000);
    } catch {
      setPwError("Current password is incorrect.");
    }
  };

  /* ── Input style ── */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: 14,
    color: "var(--text-primary)",
    boxSizing: "border-box",
    outline: "none",
    background: "var(--bg-card)",
  };
  const focusStyle = { borderColor: "var(--primary)" };

  /* ── Field row (view / edit) ── */
  const Field = ({
    label,
    value,
    editValue,
    onEdit,
    type = "text",
    readOnly = false,
  }: {
    label: string;
    value: string;
    editValue?: string;
    onEdit?: (v: string) => void;
    type?: string;
    readOnly?: boolean;
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
      {editing && !readOnly ? (
        <input
          type={type}
          value={editValue ?? ""}
          onChange={(e) => onEdit?.(e.target.value)}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) =>
            Object.assign(e.target.style, { borderColor: "var(--border)" })
          }
        />
      ) : (
        <p
          style={{
            fontSize: 14,
            color: value ? "var(--text-primary)" : "var(--text-muted)",
            fontWeight: 500,
            padding: "10px 0",
          }}
        >
          {value || "—"}
        </p>
      )}
    </div>
  );

  if (loadingMe && !user) {
    return (
      <AccountLayout>
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Loading profile…
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      {/* ══ Personal Information ══ */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        {/* Header */}
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {saveSuccess && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                <IoCheckmarkCircle size={16} /> Saved!
              </span>
            )}
            {saveError && (
              <span
                style={{ fontSize: 13, color: "var(--error)", fontWeight: 600 }}
              >
                {saveError}
              </span>
            )}
            {!editing ? (
              <button
                onClick={openEdit}
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
                    color: "var(--text-secondary)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: "8px 20px",
                    background: "var(--accent)",
                    color: "white",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 13,
                    fontWeight: 700,
                    border: "none",
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.75 : 1,
                  }}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Avatar URL field (edit only) */}
        {editing && (
          <div
            style={{
              marginBottom: 20,
              padding: 16,
              background: "var(--bg-base)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              <IoCameraOutline size={14} /> Avatar Image URL
            </label>
            <input
              type="url"
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
              placeholder="https://…"
              style={{ ...inputStyle }}
            />
          </div>
        )}

        {/* Fields grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          <Field
            label="Full Name"
            value={user?.name ?? ""}
            editValue={editName}
            onEdit={setEditName}
          />
          <Field label="Email Address" value={user?.email ?? ""} readOnly />
          <Field
            label="Phone Number"
            value={user?.phone ?? ""}
            editValue={editPhone}
            onEdit={setEditPhone}
            type="tel"
          />
          <Field
            label="Member Since"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"
            }
            readOnly
          />
          <Field label="Account Role" value={user?.role ?? "—"} readOnly />
        </div>
      </div>

      {/* ══ Stats ══ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Wishlist Items", value: wishlistCount, icon: "❤️" },
          {
            label: "Member Status",
            value: user?.role === "admin" ? "Admin" : "Gold Member",
            icon: "⭐",
          },
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

      {/* ══ Change Password ══ */}
      <div className="card" style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: pwOpen ? 20 : 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MdLockOutline size={20} color="var(--primary)" />
            <div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                Change Password
              </h3>
              <p
                style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}
              >
                Update your account password
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPwOpen(!pwOpen);
              setPwError("");
              setPwSuccess("");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: pwOpen ? "var(--bg-base)" : "var(--primary)",
              color: pwOpen ? "var(--text-secondary)" : "white",
              border: pwOpen ? "1.5px solid var(--border)" : "none",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {pwOpen ? (
              <>
                <IoClose size={14} /> Cancel
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </div>

        {pwOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Current password */}
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
                Current Password
              </label>
              <input
                type="password"
                value={curPw}
                onChange={(e) => setCurPw(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) =>
                  Object.assign(e.target.style, {
                    borderColor: "var(--border)",
                  })
                }
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
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
                  New Password
                </label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  style={inputStyle}
                  placeholder="Min. 8 characters"
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) =>
                    Object.assign(e.target.style, {
                      borderColor: "var(--border)",
                    })
                  }
                />
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
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  style={inputStyle}
                  placeholder="Repeat password"
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) =>
                    Object.assign(e.target.style, {
                      borderColor: "var(--border)",
                    })
                  }
                />
              </div>
            </div>

            {pwError && (
              <p
                style={{ fontSize: 13, color: "var(--error)", fontWeight: 600 }}
              >
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--accent)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <IoCheckmarkCircle size={16} />
                {pwSuccess}
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handlePasswordChange}
                disabled={changingPw || !curPw || !newPw || !confirmPw}
                style={{
                  padding: "10px 28px",
                  background: "var(--primary)",
                  color: "white",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "none",
                  cursor: changingPw ? "not-allowed" : "pointer",
                  opacity: changingPw ? 0.75 : 1,
                }}
              >
                {changingPw ? "Updating…" : "Update Password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
