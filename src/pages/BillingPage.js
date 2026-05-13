import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
getDoc,
runTransaction,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export default function BillingPage() {
  const navigate = useNavigate();
const [partyTrips, setPartyTrips] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
const [selectedTripIds, setSelectedTripIds] = useState([]);
  const [parties, setParties] = useState([]);
const [userProfile, setUserProfile] = useState(null);
  const [selectedParty, setSelectedParty] =
    useState("");

    const selectedTrips = partyTrips.filter((trip) =>
  selectedTripIds.includes(trip.id)
);

const invoiceTotal = selectedTrips.reduce(
  (sum, trip) =>
    sum +
    Number(trip.rate || 0) +
    Number(trip.unloadingCharges || 0),
  0
);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          navigate("/");
          return;
        }

        setCurrentUser(user);
        loadUserProfile(user.uid);
        loadParties(user.uid);
      }
    );
    

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  if (!currentUser || !selectedParty) {
    setPartyTrips([]);
    return;
  }

  loadPartyTrips(currentUser.uid, selectedParty);
}, [currentUser, selectedParty]);

  async function loadParties(uid) {
    const q = query(
      collection(db, "parties"),
      where("userId", "==", uid)
    );

    const snap = await getDocs(q);

    setParties(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  }
  async function loadUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));

  if (snap.exists()) {
    setUserProfile(snap.data());
  }
}
function toggleTripSelection(tripId) {
  setSelectedTripIds((prev) =>
    prev.includes(tripId)
      ? prev.filter((id) => id !== tripId)
      : [...prev, tripId]
  );
}
async function generateNextBillNo(uid) {
  const counterRef = doc(db, "billCounters", uid);

  const nextNo = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    const lastNo = counterDoc.exists()
      ? counterDoc.data().lastBillNo || 0
      : 0;

    const newNo = lastNo + 1;

    transaction.set(
      counterRef,
      { lastBillNo: newNo },
      { merge: true }
    );

    return newNo;
  });

  return `BILL-${String(nextNo).padStart(4, "0")}`;
}
  async function loadPartyTrips(uid, partyName) {
  const q = query(
    collection(db, "trips"),
    where("userId", "==", uid),
    where("partyName", "==", partyName)
  );

  const snap = await getDocs(q);

  setPartyTrips(
    snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))
  );
}

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Billing / Invoice
          </h1>

          <p style={styles.subtitle}>
            Generate transport invoices
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={{ marginTop: 0 }}>
          Select Party
        </h2>

        <select
          style={styles.select}
          value={selectedParty}
          onChange={(e) =>
            setSelectedParty(e.target.value)
          }
        >
          <option value="">
            Select Party
          </option>

          {parties.map((party) => (
            <option
              key={party.id}
              value={party.partyName}
            >
              {party.partyName}
            </option>
          ))}
        </select>

        {selectedParty && (
          <div style={styles.selectedBox}>
            Selected Party:
            {selectedParty && (
  <div style={styles.tripsCard}>
    <h2 style={{ marginTop: 0 }}>
      Trips for {selectedParty}
    </h2>

    {partyTrips.length === 0 ? (
  <p style={{ color: "#94a3b8" }}>
    No trips found for this party.
  </p>
) : (
  <>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Select</th>
          <th style={styles.th}>L.R. No</th>
        <th style={styles.th}>Date</th>
        <th style={styles.th}>Party</th>
        <th style={styles.th}>Pkgs</th>
        <th style={styles.th}>Weight</th>
        <th style={styles.th}>Vehicle</th>
        <th style={styles.th}>Route</th>
        <th style={styles.th}>Rate</th>
        <th style={styles.th}>Amount</th>
          
        </tr>
      </thead>

      <tbody>
        {partyTrips.map((trip) => {
          const pending =
            Number(trip.rate || 0) -
            Number(trip.advance || 0);

          return (
            <tr key={trip.id}>
             <td style={styles.td}>
  <input
    type="checkbox"
    checked={selectedTripIds.includes(trip.id)}
    onChange={() => toggleTripSelection(trip.id)}
  />
</td>

<td style={styles.td}>{trip.lrNo || "-"}</td>
<td style={styles.td}>{trip.date}</td>
<td style={styles.td}>{trip.partyName || selectedParty}</td>
<td style={styles.td}>{trip.packages || "-"}</td>
<td style={styles.td}>{trip.weight || "-"}</td>
<td style={styles.td}>{trip.vehicle}</td>

<td style={styles.td}>
  {trip.source} → {trip.destination}
</td>

<td style={styles.td}>Fix</td>

<td style={styles.td}>
  ₹{Number(trip.rate || 0).toLocaleString()}
</td>
            </tr>
          );
        })}
      </tbody>
    </table>

    {selectedTrips.length > 0 && (
      <div style={styles.invoiceSummary}>
        <div>
          <strong>{selectedTrips.length}</strong> trips selected
        </div>

        <div style={styles.invoiceTotal}>
          Total: ₹{invoiceTotal.toLocaleString()}
        </div>

      <button
  style={styles.generateButton}
  onClick={async () => {
    const billNo = await generateNextBillNo(currentUser.uid);

    navigate("/invoice-preview", {
      state: {
        selectedParty,
        selectedTrips,
        invoiceTotal,
        userProfile,
        billNo,
      },
    });
  }}
>
  Generate Invoice
</button>
      </div>
    )}
  </>
)}
  </div>
  
)}
            <strong>
              {" "}
              {selectedParty}
            </strong>
          </div>
        )}
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

  card: {
    maxWidth: 650,
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 22,
    padding: 22,
  },

  select: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.08)",
    background: "#111827",
    color: "white",
    outline: "none",
    fontSize: 14,
  },

  selectedBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    background: "rgba(37,99,235,.14)",
    border: "1px solid rgba(59,130,246,.22)",
    color: "#dbeafe",
  },

  tripsCard: {
  marginTop: 24,
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
invoiceSummary: {
  marginTop: 18,
  padding: 16,
  borderRadius: 16,
  background: "rgba(37,99,235,.14)",
  border: "1px solid rgba(59,130,246,.22)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
},

invoiceTotal: {
  fontSize: 20,
  fontWeight: 800,
  color: "#ffffff",
},

generateButton: {
  padding: "12px 16px",
  borderRadius: 14,
  border: 0,
  cursor: "pointer",
  fontWeight: 800,
  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
  color: "white",
},
};