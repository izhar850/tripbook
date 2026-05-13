import { useLocation, useNavigate } from "react-router-dom";

export default function InvoicePreviewPage() {
  const navigate = useNavigate();

  const { state } = useLocation();

  if (!state) {
    return (
      <div style={styles.page}>
        <h1>No invoice data found.</h1>

        <button
          style={styles.button}
          onClick={() => navigate("/billing")}
        >
          Back
        </button>
      </div>
    );
  }

  const {
  selectedParty,
  selectedTrips,
  invoiceTotal,
  userProfile,
} = state;

  return (
    <div style={styles.page}>
      <div style={styles.invoiceCard}>
        <div style={styles.topBar}>
          <button
            style={styles.button}
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <button
            style={styles.printButton}
            onClick={() => window.print()}
          >
            Print Invoice
          </button>
        </div>

        <div style={styles.header}>
          <h1 style={styles.company}>
  {userProfile?.companyName || "Transport Company"}
</h1>

<p style={styles.sub}>
  {userProfile?.address || "Company Address"}
</p>

<p style={styles.sub}>
  GST: {userProfile?.gstNo || "-"}
</p>

<p style={styles.sub}>
  Mobile: {userProfile?.mobile || "-"}
  {userProfile?.officePhone ? ` | Office: ${userProfile.officePhone}` : ""}
</p>

<p style={styles.sub}>
  Email: {userProfile?.email || "-"}
</p>
        </div>

        <div style={styles.partySection}>
          <div>
            <h3>Bill To</h3>

            <p>{selectedParty}</p>
          </div>

          <div>
            <h3>Invoice</h3>

            <p>
              Date:{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Vehicle</th>
              <th style={styles.th}>Route</th>
              <th style={styles.th}>Rate</th>
              <th style={styles.th}>Advance</th>
              <th style={styles.th}>Pending</th>
            </tr>
          </thead>

          <tbody>
            {selectedTrips.map((trip) => {
              const pending =
                Number(trip.rate || 0) -
                Number(trip.advance || 0);

              return (
                <tr key={trip.id}>
                  <td style={styles.td}>
                    {trip.date}
                  </td>

                  <td style={styles.td}>
                    {trip.vehicle}
                  </td>

                  <td style={styles.td}>
                    {trip.source} →{" "}
                    {trip.destination}
                  </td>

                  <td style={styles.td}>
                    ₹
                    {Number(
                      trip.rate || 0
                    ).toLocaleString()}
                  </td>

                  <td style={styles.td}>
                    ₹
                    {Number(
                      trip.advance || 0
                    ).toLocaleString()}
                  </td>

                  <td style={styles.td}>
                    ₹
                    {pending.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={styles.totalBox}>
          Total Amount: ₹
          {invoiceTotal.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#e5e7eb",
    padding: 24,
  },

  invoiceCard: {
    maxWidth: 1100,
    margin: "0 auto",
    background: "white",
    borderRadius: 18,
    padding: 32,
    color: "#111827",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  header: {
    textAlign: "center",
    marginBottom: 30,
    borderBottom: "2px solid #d1d5db",
    paddingBottom: 18,
  },

  company: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
  },

  sub: {
    margin: "4px 0",
    color: "#4b5563",
  },

  partySection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    background: "#111827",
    color: "white",
    padding: 12,
    textAlign: "left",
  },

  td: {
    padding: 12,
    borderBottom: "1px solid #e5e7eb",
  },

  totalBox: {
    marginTop: 24,
    textAlign: "right",
    fontSize: 24,
    fontWeight: 800,
  },

  button: {
    padding: "10px 14px",
    borderRadius: 10,
    border: 0,
    cursor: "pointer",
    fontWeight: 700,
  },

  printButton: {
    padding: "10px 14px",
    borderRadius: 10,
    border: 0,
    cursor: "pointer",
    fontWeight: 700,
    background: "#2563eb",
    color: "white",
  },
};