import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Truck,
  MapPin,
  Phone,
  IndianRupee,
  Calendar,
  FileText,
  Plus,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUbkDGR_jmbJXQqhAYYMbLmv5SlA792fU",
  authDomain: "tripbook-371fa.firebaseapp.com",
  projectId: "tripbook-371fa",
  storageBucket: "tripbook-371fa.firebasestorage.app",
  messagingSenderId: "313011544698",
  appId: "1:313011544698:web:8314ba9a739cc6f7e791c3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const emptyForm = {
  date: "",
  vehicle: "",
  source: "",
  destination: "",
  mobile: "",
  rate: "",
  advance: "",
  notes: "",
};

export default function App() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    const snap = await getDocs(collection(db, "trips"));
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTrips(rows);
  }

  const balance = useMemo(
    () => Math.max(Number(form.rate || 0) - Number(form.advance || 0), 0),
    [form.rate, form.advance]
  );

  const filtered = trips.filter((trip) =>
    `${trip.vehicle} ${trip.source} ${trip.destination}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function saveTrip() {
    const payload = {
      ...form,
      rate: Number(form.rate || 0),
      advance: Number(form.advance || 0),
    };

    if (editingId) {
      await updateDoc(doc(db, "trips", editingId), payload);
    } else {
      await addDoc(collection(db, "trips"), payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowModal(false);
    loadTrips();
  }

  async function deleteTrip(id) {
    if (!window.confirm("Delete this trip?")) return;
    await deleteDoc(doc(db, "trips", id));
    loadTrips();
  }

  function editTrip(trip) {
    setForm({
      date: trip.date || "",
      vehicle: trip.vehicle || "",
      source: trip.source || "",
      destination: trip.destination || "",
      mobile: trip.mobile || "",
      rate: String(trip.rate || ""),
      advance: String(trip.advance || ""),
      notes: trip.notes || "",
    });
    setEditingId(trip.id);
    setShowModal(true);
  }

  function openNewTrip() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>TripBook</h1>
            <p style={styles.subtitle}>Transport operations dashboard</p>
          </div>

          <div style={styles.searchWrap}>
            <Search size={16} style={styles.searchIcon} />
            <input
              style={styles.search}
              placeholder="Search trips"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div style={styles.card}>
          <div style={styles.topBar}>
            <div>
              <div style={styles.sectionLabel}>Trips</div>
              <h2 style={styles.sectionTitle}>Recent Trips</h2>
            </div>

            <button style={styles.addButton} onClick={openNewTrip}>
              <Plus size={16} />
              Add New Trip
            </button>
          </div>

          <TripTable
            trips={filtered}
            onEdit={editTrip}
            onDelete={deleteTrip}
          />
        </div>

        {showModal && (
          <div
            style={styles.modalOverlay}
            onClick={() => setShowModal(false)}
          >
            <div
              style={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h2 style={{ margin: 0 }}>
                  {editingId ? "Edit Trip" : "New Trip"}
                </h2>
                <button
                  style={styles.closeBtn}
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <Field
                icon={<Calendar size={15} />}
                placeholder="Trip date"
                value={form.date}
                onChange={(v) => update("date", v)}
              />
              <Field
                icon={<Truck size={15} />}
                placeholder="Vehicle number"
                value={form.vehicle}
                onChange={(v) => update("vehicle", v)}
              />
              <Field
                icon={<MapPin size={15} />}
                placeholder="Source"
                value={form.source}
                onChange={(v) => update("source", v)}
              />
              <Field
                icon={<MapPin size={15} />}
                placeholder="Destination"
                value={form.destination}
                onChange={(v) => update("destination", v)}
              />
              <Field
                icon={<Phone size={15} />}
                placeholder="Driver mobile"
                value={form.mobile}
                onChange={(v) => update("mobile", v)}
              />
              <Field
                icon={<IndianRupee size={15} />}
                placeholder="Rate"
                value={form.rate}
                onChange={(v) => update("rate", v)}
              />
              <Field
                icon={<IndianRupee size={15} />}
                placeholder="Advance"
                value={form.advance}
                onChange={(v) => update("advance", v)}
              />
              <Field
                icon={<FileText size={15} />}
                placeholder="Notes"
                value={form.notes}
                onChange={(v) => update("notes", v)}
              />

              <div style={styles.balanceCard}>
                <div style={styles.balanceLabel}>Current balance</div>
                <div style={styles.balanceValue}>
                  ₹{balance.toLocaleString()}
                </div>
              </div>

              <button style={styles.saveButton} onClick={saveTrip}>
                {editingId ? "Update Trip" : "Save Trip"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon, placeholder, value, onChange }) {
  return (
    <div style={styles.fieldWrap}>
      <div style={styles.fieldIcon}>{icon}</div>
      <input
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TripTable({ trips, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
        <thead>
          <tr>
            <th style={styles.th}>Vehicle</th>
            <th style={styles.th}>Route</th>
            <th style={styles.th}>Rate</th>
            <th style={styles.th}>Balance</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td style={styles.td}>{trip.vehicle}</td>
              <td style={styles.td}>
                {trip.source} → {trip.destination}
              </td>
              <td style={styles.td}>₹{trip.rate}</td>
              <td style={styles.td}>
                ₹{Number(trip.rate - trip.advance).toLocaleString()}
              </td>
              <td style={styles.td}>{trip.date}</td>
              <td style={styles.td}>
                <button
                  style={styles.actionButton}
                  onClick={() => onEdit(trip)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => onDelete(trip.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,.2), transparent 30%), #050816",
    color: "white",
    padding: 20,
  },

  container: {
    maxWidth: 1150,
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 24,
  },

  title: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
  },

  subtitle: {
    marginTop: 6,
    color: "#94a3b8",
  },

  searchWrap: {
    position: "relative",
    width: 320,
    maxWidth: "100%",
  },

  searchIcon: {
    position: "absolute",
    left: 12,
    top: 13,
    color: "#64748b",
  },

  search: {
    width: "100%",
    padding: "12px 12px 12px 38px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.03)",
    color: "white",
    boxSizing: "border-box",
  },

  card: {
    padding: 22,
    borderRadius: 24,
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.06)",
    backdropFilter: "blur(12px)",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  sectionLabel: {
    fontSize: 12,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  sectionTitle: {
    margin: "4px 0 0 0",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderRadius: 14,
    border: 0,
    fontWeight: 700,
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 50,
  },

  modalCard: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "90vh",
    overflowY: "auto",
    padding: 22,
    borderRadius: 26,
    background: "#0b1220",
    border: "1px solid rgba(255,255,255,.06)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  closeBtn: {
    background: "transparent",
    border: 0,
    color: "white",
    fontSize: 18,
    cursor: "pointer",
  },

  fieldWrap: {
    position: "relative",
    marginBottom: 12,
  },

  fieldIcon: {
    position: "absolute",
    left: 12,
    top: 13,
    color: "#64748b",
  },

  input: {
    width: "100%",
    padding: "12px 12px 12px 38px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(255,255,255,.03)",
    color: "white",
    boxSizing: "border-box",
  },

  balanceCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    background: "rgba(37,99,235,.12)",
  },

  balanceLabel: {
    color: "#94a3b8",
    fontSize: 13,
  },

  balanceValue: {
    marginTop: 6,
    fontWeight: 700,
    fontSize: 22,
  },

  saveButton: {
    width: "100%",
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    border: 0,
    fontWeight: 700,
    cursor: "pointer",
  },

  th: {
    textAlign: "left",
    padding: "12px 8px",
    color: "#94a3b8",
    fontSize: 13,
  },

  td: {
    padding: "14px 8px",
    borderTop: "1px solid rgba(255,255,255,.05)",
  },

  actionButton: {
    padding: "6px 10px",
    borderRadius: 8,
    border: 0,
    cursor: "pointer",
    marginRight: 8,
    fontWeight: 600,
  },

  deleteButton: {
    padding: "6px 10px",
    borderRadius: 8,
    border: 0,
    cursor: "pointer",
    fontWeight: 600,
  },
};