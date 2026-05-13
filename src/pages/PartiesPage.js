import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

const emptyParty = {
  partyName: "",
  gstNo: "",
  mobile: "",
  address: "",
};

export default function PartiesPage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [parties, setParties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [partyForm, setPartyForm] = useState(emptyParty);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      setCurrentUser(user);
      loadParties(user.uid);
    });

    return () => unsubscribe();
  }, []);

  async function loadParties(uid) {
    const q = query(
      collection(db, "parties"),
      where("userId", "==", uid)
    );

    const snap = await getDocs(q);
    setParties(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function saveParty() {
    if (!currentUser) return;

    await addDoc(collection(db, "parties"), {
      ...partyForm,
      userId: currentUser.uid,
      createdAt: new Date(),
    });

    setPartyForm(emptyParty);
    setShowForm(false);
    loadParties(currentUser.uid);
  }

  function updateField(key, value) {
    setPartyForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Party Management</h1>
          <p style={styles.subtitle}>
            Add and manage billing parties
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          Add Party
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={{ marginTop: 0 }}>New Party</h2>

          <input
            style={styles.input}
            placeholder="Party Name"
            value={partyForm.partyName}
            onChange={(e) => updateField("partyName", e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="GST No."
            value={partyForm.gstNo}
            onChange={(e) => updateField("gstNo", e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Mobile"
            value={partyForm.mobile}
            onChange={(e) => updateField("mobile", e.target.value)}
          />

          <textarea
            style={{ ...styles.input, minHeight: 80 }}
            placeholder="Address"
            value={partyForm.address}
            onChange={(e) => updateField("address", e.target.value)}
          />

          <div style={styles.formActions}>
            <button style={styles.saveButton} onClick={saveParty}>
              Save Party
            </button>

            <button
              style={styles.cancelButton}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Saved Parties</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Party Name</th>
              <th style={styles.th}>GST No.</th>
              <th style={styles.th}>Mobile</th>
              <th style={styles.th}>Address</th>
            </tr>
          </thead>

          <tbody>
            {parties.map((party) => (
              <tr key={party.id}>
                <td style={styles.td}>{party.partyName}</td>
                <td style={styles.td}>{party.gstNo}</td>
                <td style={styles.td}>{party.mobile}</td>
                <td style={styles.td}>{party.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,.18), transparent 30%), #050816",
    color: "white",
    padding: 24,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
    flexWrap: "wrap",
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

  addButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: 0,
    cursor: "pointer",
    fontWeight: 700,
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "white",
  },

  formCard: {
    maxWidth: 520,
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 22,
    padding: 22,
    marginBottom: 24,
  },

  input: {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.08)",
    background: "#111827",
    color: "white",
    boxSizing: "border-box",
    marginBottom: 12,
  },

  formActions: {
    display: "flex",
    gap: 10,
  },

  saveButton: {
    padding: "12px 16px",
    borderRadius: 12,
    border: 0,
    cursor: "pointer",
    fontWeight: 700,
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "white",
  },

  cancelButton: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.08)",
    cursor: "pointer",
    background: "#111827",
    color: "#94a3b8",
  },

  card: {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 22,
    padding: 22,
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: 12,
    color: "#94a3b8",
    borderBottom: "1px solid rgba(255,255,255,.06)",
  },

  td: {
    padding: 14,
    borderBottom: "1px solid rgba(255,255,255,.05)",
  },
};