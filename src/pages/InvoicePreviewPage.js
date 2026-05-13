import { useLocation, useNavigate } from "react-router-dom";

function numberToWords(num) {
  if (!num) return "Zero Rupees Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
    return `${ones[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
  }

  let n = Math.floor(num);
  let result = "";

  const crore = Math.floor(n / 10000000);
  n %= 10000000;

  const lakh = Math.floor(n / 100000);
  n %= 100000;

  const thousand = Math.floor(n / 1000);
  n %= 1000;

  const hundred = n;

  if (crore) result += `${convert(crore)} Crore `;
  if (lakh) result += `${convert(lakh)} Lakh `;
  if (thousand) result += `${convert(thousand)} Thousand `;
  if (hundred) result += `${convert(hundred)} `;

  return `${result.trim()} Rupees Only`;
}

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
  billNo,
  selectedParty,
  selectedTrips,
  invoiceTotal,
  userProfile,
} = state;

  return (
    <div style={styles.page}>
      <div style={styles.invoiceCard}>
        <div style={styles.topBar} className="no-print">
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
        <p>Bill No: {billNo}</p>
            <p>
              Date:{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
           <tr>
  <th style={styles.th}>L.R. No</th>
  <th style={styles.th}>Date</th>
  <th style={styles.th}>Pkgs</th>
  <th style={styles.th}>Weight</th>
  <th style={styles.th}>Vehicle No</th>
  <th style={styles.th}>Route</th>
  <th style={styles.th}>Rate</th>
  <th style={styles.th}>
  Unloading
</th>
  <th style={styles.th}>Amount</th>
</tr>
          </thead>

          <tbody>
            {selectedTrips.map((trip) => {
              const pending =
                Number(trip.rate || 0) -
                Number(trip.advance || 0);

              return (
               <tr key={trip.id}>
  <td style={styles.td}>{trip.lrNo || "-"}</td>
  <td style={styles.td}>{trip.date}</td>
  <td style={styles.td}>{trip.packages || "-"}</td>
  <td style={styles.td}>{trip.weight || "-"}</td>
  <td style={styles.td}>{trip.vehicle}</td>
  <td style={styles.td}>
    {trip.source} → {trip.destination}
  </td>
  <td style={styles.td}>Fix</td>
  <td style={styles.td}>
  ₹{Number(trip.unloadingCharges || 0).toLocaleString()}
</td>

<td style={styles.td}>
  ₹
  {(
    Number(trip.rate || 0) +
    Number(trip.unloadingCharges || 0)
  ).toLocaleString()}
</td>
</tr>
              );
            })}
          </tbody>
        </table>

        <div style={styles.invoiceFooter}>
  <div style={styles.wordsBox}>
    <strong>Amount in words:</strong>
    <p>{numberToWords(invoiceTotal)}</p>
  </div>

  <div style={styles.totalBox}>
    Total: ₹{invoiceTotal.toLocaleString()}
  </div>
</div>

<div style={styles.bankBox}>
  <strong>Bank Details : {userProfile?.companyName || "-"}</strong>
  
  <p>Account No: <strong>{userProfile?.accountNo || "-"}</strong> IFSC: <strong>{userProfile?.ifscCode || "-"}</strong></p>
  
  <p><strong>{userProfile?.bankName || "-"}</strong></p>
</div>
      </div>
    </div>
  );
}

const styles = {
  page: {
  minHeight: "100vh",
  background: "#e5e7eb",
  padding: 16,
},

invoiceCard: {
  maxWidth: 1000,
  margin: "0 auto",
  background: "white",
  borderRadius: 12,
  padding: 20,
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
  invoiceFooter: {
  marginTop: 24,
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  alignItems: "flex-start",
  borderTop: "2px solid #d1d5db",
  paddingTop: 18,
},

bankBox: {
  marginTop: 20,
  paddingTop: 14,
  borderTop: "1px solid #e5e7eb",
  color: "#374151",
},
invoiceFooter: {
  marginTop: 24,
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  alignItems: "flex-start",
  borderTop: "2px solid #d1d5db",
  paddingTop: 18,
},

wordsBox: {
  maxWidth: "60%",
  color: "#111827",
},

bankBox: {
  marginTop: 20,
  paddingTop: 14,
  borderTop: "1px solid #e5e7eb",
  color: "#374151",
},

totalBox: {
  fontSize: 24,
  fontWeight: 800,
  whiteSpace: "nowrap",
},
};