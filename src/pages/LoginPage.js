import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import {
  loginUser,
  registerTransporter,
  getUserProfile,
} from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("transporterLogin"); 
  // transporterLogin | adminLogin | signup

  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (mode === "signup") {
        const user = await registerTransporter({
          companyName,
          ownerName,
          email,
          password,
        });

        const profile = await getUserProfile(user.uid);

        if (profile?.role === "transporter") {
          navigate("/dashboard");
        }

        return;
      }

      const user = await loginUser(email, password);
      const profile = await getUserProfile(user.uid);

      if (!profile) {
        alert("User profile not found in Firestore.");
        return;
      }

      if (mode === "adminLogin") {
        if (profile.role !== "admin") {
          alert("This login is only for admin.");
          return;
        }

        navigate("/admin");
        return;
      }

      if (profile.role === "transporter") {
        navigate("/dashboard");
      } else {
        alert("Please use admin login.");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <Truck size={26} />
        </div>

        <h1 style={styles.title}>TripBook</h1>
        <p style={styles.subtitle}>Transport management system</p>

        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(mode === "transporterLogin" ? styles.activeTab : {}),
            }}
            onClick={() => setMode("transporterLogin")}
          >
            Transporter
          </button>

          <button
            style={{
              ...styles.tab,
              ...(mode === "adminLogin" ? styles.activeTab : {}),
            }}
            onClick={() => setMode("adminLogin")}
          >
            Admin
          </button>

          <button
            style={{
              ...styles.tab,
              ...(mode === "signup" ? styles.activeTab : {}),
            }}
            onClick={() => setMode("signup")}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <input
                style={styles.input}
                placeholder="Company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              <input
                style={styles.input}
                placeholder="Owner name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />
            </>
          )}

          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button} type="submit">
            {mode === "signup"
              ? "Create Transporter Account"
              : mode === "adminLogin"
              ? "Admin Login"
              : "Transporter Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,.18), transparent 30%), #050816",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(15,23,42,.86)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 26,
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,.35)",
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 16,
    background: "linear-gradient(135deg,#2563eb,#06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    marginBottom: 18,
  },

  title: {
    margin: 0,
    color: "white",
    fontSize: 32,
    fontWeight: 800,
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 6,
    marginBottom: 22,
  },

  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    marginBottom: 18,
  },

  tab: {
    padding: "10px 8px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.06)",
    background: "#111827",
    color: "#94a3b8",
    cursor: "pointer",
    fontWeight: 700,
  },

  activeTab: {
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "white",
  },

  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.08)",
    background: "#111827",
    color: "white",
    boxSizing: "border-box",
    marginBottom: 12,
    fontSize: 15,
  },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: 0,
    cursor: "pointer",
    fontWeight: 800,
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "white",
    boxShadow: "0 8px 24px rgba(37,99,235,.28)",
  },
};