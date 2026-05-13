import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  Users,
  Truck,
  IndianRupee,
  AlertCircle,
} from "lucide-react";

import { db } from "../firebase/firebase";

export default function AdminPage() {
    const [showTrips, setShowTrips] = useState(false);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
const navigate = useNavigate();
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const usersSnap = await getDocs(collection(db, "users"));

    const tripsSnap = await getDocs(collection(db, "trips"));

    setUsers(usersSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })));

    setTrips(tripsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })));
  }

  async function handleLogout() {
  await logoutUser();
  navigate("/");
}

  const transporterCount = users.filter(
    (u) => u.role === "transporter"
  ).length;

  const totalTrips = trips.length;

  const totalRevenue = trips.reduce(
    (sum, trip) => sum + Number(trip.rate || 0),
    0
  );

  const totalPending = trips.reduce(
    (sum, trip) =>
      sum +
      (
        Number(trip.rate || 0) -
        Number(trip.advance || 0)
      ),
    0
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
  <div>
    <h1 style={styles.title}>TripBook Admin</h1>
    <p style={styles.subtitle}>
      System overview dashboard
    </p>
  </div>

  <button
    style={styles.logoutButton}
    onClick={handleLogout}
  >
    Logout
  </button>
</div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <Users size={22} />
          <div>
            <div style={styles.statLabel}>
              Transporters
            </div>
            <div style={styles.statValue}>
              {transporterCount}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <Truck size={22} />
          <div>
            <div style={styles.statLabel}>
              Total Trips
            </div>
            <div style={styles.statValue}>
              {totalTrips}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <IndianRupee size={22} />
          <div>
            <div style={styles.statLabel}>
              Revenue
            </div>
            <div style={styles.statValue}>
              ₹{totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <AlertCircle size={22} />
          <div>
            <div style={styles.statLabel}>
              Pending
            </div>
            <div
              style={{
                ...styles.statValue,
                color: "#f87171",
              }}
            >
              ₹{totalPending.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={{ margin: 0 }}>
            Registered Transporters
          </h2>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Owner</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>
                  {user.companyName}
                </td>

                <td style={styles.td}>
                  {user.ownerName}
                </td>

                <td style={styles.td}>
                  {user.email}
                </td>

                <td style={styles.td}>
                  <span style={styles.roleBadge}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>
<div style={styles.collapseWrap}>
  <button
    style={styles.collapseButton}
    onClick={() => setShowTrips(!showTrips)}
  >
    {showTrips ? "Hide All Trips" : "View All Trips"}
  </button>
</div>

{showTrips && (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <h2 style={{ margin: 0 }}>
        All Trips
      </h2>
    </div>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={styles.th}>Company</th>
          <th style={styles.th}>Owner</th>
          <th style={styles.th}>Vehicle</th>
          <th style={styles.th}>Route</th>
          <th style={styles.th}>Rate</th>
          <th style={styles.th}>Advance</th>
          <th style={styles.th}>Pending</th>
          <th style={styles.th}>Date</th>
        </tr>
      </thead>

      <tbody>
        {trips.map((trip) => {
          const pending =
            Number(trip.rate || 0) -
            Number(trip.advance || 0);

          return (
            <tr key={trip.id}>
              <td style={styles.td}>
                {trip.companyName || "-"}
              </td>

              <td style={styles.td}>
                {trip.ownerName || "-"}
              </td>

              <td style={styles.td}>
                {trip.vehicle}
              </td>

              <td style={styles.td}>
                {trip.source} → {trip.destination}
              </td>

              <td style={styles.td}>
                ₹{Number(trip.rate || 0).toLocaleString()}
              </td>

              <td style={styles.td}>
                ₹{Number(trip.advance || 0).toLocaleString()}
              </td>

              <td
                style={{
                  ...styles.td,
                  color:
                    pending > 2000
                      ? "#f87171"
                      : "#22c55e",
                  fontWeight: 700,
                }}
              >
                ₹{pending.toLocaleString()}
              </td>

              <td style={styles.td}>
                {trip.date}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}
    </div>
  );
  
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,.18), transparent 30%), #050816",
    padding: 24,
    color: "white",
  },

  header: {
    marginBottom: 24,
  },

  title: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 6,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: 16,
    marginBottom: 24,
  },

  statCard: {
    background: "rgba(15,23,42,.85)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 22,
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  statLabel: {
    color: "#94a3b8",
    fontSize: 13,
  },

  statValue: {
    fontSize: 26,
    fontWeight: 800,
    marginTop: 4,
  },

  card: {
    background: "rgba(15,23,42,.85)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 24,
    padding: 22,
    overflowX: "auto",
  },

  cardHeader: {
    marginBottom: 18,
  },

  th: {
    textAlign: "left",
    padding: 12,
    color: "#94a3b8",
    borderBottom:
      "1px solid rgba(255,255,255,.06)",
  },

  td: {
    padding: 14,
    borderBottom:
      "1px solid rgba(255,255,255,.05)",
  },

  roleBadge: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(37,99,235,.15)",
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "capitalize",
  },
  logoutButton: {
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid rgba(239,68,68,.25)",
  background: "rgba(239,68,68,.14)",
  color: "#f87171",
  cursor: "pointer",
  fontWeight: 700,
},
collapseWrap: {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: 18,
},

collapseButton: {
  padding: "12px 18px",
  borderRadius: 14,
  border: "1px solid rgba(59,130,246,.25)",
  background:
    "linear-gradient(135deg,#2563eb,#3b82f6)",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 700,
  boxShadow: "0 8px 24px rgba(37,99,235,.28)",
},
headerActions: {
  display: "flex",
  alignItems: "center",
  gap: 12,
},
};