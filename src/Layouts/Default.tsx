import Navbar from "./Nav";

const Default = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <footer
        style={{
          background: "var(--text-primary)",
          color: "var(--text-muted)",
          textAlign: "center",
          padding: "20px",
          fontSize: 13,
        }}
      >
        © 2025 Sellora. All rights reserved.
      </footer>
    </div>
  );
};

export default Default;
