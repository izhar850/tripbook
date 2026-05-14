import { useLocation, useNavigate } from "react-router-dom";

function numberToWords(num) {
  if (!num) return "Zero Rupees Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];

  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
    return `${ones[Math.floor(n / 100)]} Hundred ${convert(n % 100)}`.trim();
  }

  let n = Math.floor(num);
  let result = "";

  const lakh = Math.floor(n / 100000);
  n %= 100000;

  const thousand = Math.floor(n / 1000);
  n %= 1000;

  if (lakh) result += `${convert(lakh)} Lakh `;
  if (thousand) result += `${convert(thousand)} Thousand `;
  if (n) result += `${convert(n)} `;

  return `${result.trim()} Rupees Only`;
}

export default function LrReceiptPreviewPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div style={styles.page}>
        <h1>No LR data found.</h1>
        <button onClick={() => navigate("/dashboard")}>Back</button>
      </div>
    );
  }

  const { trip, userProfile } = state;

  const totalFreight = Number(trip.rate || 0);
  const advance = Number(trip.advance || 0);
  const balance = Math.max(totalFreight - advance, 0);

  return (
    <div style={styles.page}>
      <div className="no-print" style={styles.actions}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Back
        </button>

        <button style={styles.printBtn} onClick={() => window.print()}>
          Print LR Receipt
        </button>
      </div>

      <div style={styles.receipt}>
        <div style={styles.header}>
          <h1 style={styles.companyName}>
            {userProfile?.companyName || "Transport Company"}
          </h1>

          <div style={styles.companyText}>
            {userProfile?.address || "-"}
          </div>

          <div style={styles.companyText}>
            Mobile: {userProfile?.mobile || "-"}
            {userProfile?.officePhone ? ` | Office: ${userProfile.officePhone}` : ""}
          </div>

          <div style={styles.companyText}>
            Email: {userProfile?.email || "-"} | GSTIN: {userProfile?.gstNo || "-"}
          </div>
        </div>

        <div style={styles.lrTitle}>LORRY RECEIPT / LR COPY</div>

        <div style={styles.twoCol}>
          <div style={styles.box}>
            <div style={styles.row}>
              <strong>LR No:</strong>
              <span>{trip.lrNo || "-"}</span>
            </div>

            <div style={styles.row}>
              <strong>From:</strong>
              <span>{trip.source || "-"}</span>
            </div>

            <div style={styles.row}>
              <strong>Consignor:</strong>
              <span>{userProfile?.companyName || "-"}</span>
            </div>

            <div style={styles.row}>
              <strong>GST No:</strong>
              <span>{userProfile?.gstNo || "-"}</span>
            </div>
          </div>

          <div style={styles.box}>
            <div style={styles.row}>
              <strong>Date:</strong>
              <span>{trip.date || "-"}</span>
            </div>

            <div style={styles.row}>
              <strong>To:</strong>
              <span>{trip.destination || "-"}</span>
            </div>

            <div style={styles.row}>
              <strong>Consignee:</strong>
              <span>{trip.partyName || "-"}</span>
            </div>

            <div style={styles.row}>
              <strong>GST No:</strong>
              <span>{trip.partyGst || "-"}</span>
            </div>
          </div>
        </div>

        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.label}>No. of Packages</td>
              <td style={styles.value}>{trip.packages || "-"}</td>
              <td style={styles.label}>Weight</td>
              <td style={styles.value}>{trip.weight || "-"}</td>
            </tr>

            <tr>
              <td style={styles.label}>Description of Goods</td>
              <td style={styles.value} colSpan="3">
                {trip.description || "-"}
              </td>
            </tr>

            <tr>
              <td style={styles.label}>Vehicle No</td>
              <td style={styles.value}>{trip.vehicle || "-"}</td>
              <td style={styles.label}>Vehicle Type</td>
              <td style={styles.value}>{trip.vehicleType || "-"}</td>
            </tr>

            <tr>
              <td style={styles.label}>Size L/W/H</td>
              <td style={styles.value}>
                {trip.sizeL || "-"} / {trip.sizeW || "-"} / {trip.sizeH || "-"}
              </td>
              <td style={styles.label}>Rate / Qtl</td>
              <td style={styles.value}>₹{Number(trip.rateQtl || 0).toLocaleString()}</td>
            </tr>

            <tr>
              <td style={styles.label}>Total Freight</td>
              <td style={styles.value}>₹{totalFreight.toLocaleString()}</td>
              <td style={styles.label}>Advance</td>
              <td style={styles.value}>₹{advance.toLocaleString()}</td>
            </tr>

            <tr>
              <td style={styles.label}>Balance</td>
              <td style={styles.value}>₹{balance.toLocaleString()}</td>
              <td style={styles.label}>Remark</td>
              <td style={styles.value}>{trip.remark || "-"}</td>
            </tr>
          </tbody>
        </table>

        <div style={styles.wordsBox}>
          <strong>Amount in Words:</strong> {numberToWords(totalFreight)}
        </div>

        <div style={styles.gstBox}>
          <strong>GST / Service Tax To Pay By:</strong>

          <span style={styles.checkBox}>
            {trip.gstPayBy === "consigner" ? "☑" : "☐"} Consignor
          </span>

          <span style={styles.checkBox}>
            {trip.gstPayBy === "consignee" ? "☑" : "☐"} Consignee
          </span>

          <span style={styles.checkBox}>
            {trip.gstPayBy === "transporter" ? "☑" : "☐"} Transporter
          </span>
        </div>

        <div style={styles.bottomSection}>
          <div style={styles.terms}>
            <strong>Terms & Conditions</strong>
            <ol>
              <li>Goods carried at owner’s risk.</li>
              <li>All disputes subject to local jurisdiction.</li>
              <li>Please verify packages and goods before acknowledgement.</li>
              <li>Company is not responsible for leakage, breakage or shortage.</li>
            </ol>
          </div>

          <div style={styles.stampBox}>
            Party Acknowledgement / Stamp
          </div>
        </div>

        <div style={styles.signature}>
          For {userProfile?.companyName || "Transport Company"}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#e5e7eb",
    padding: 20,
  },

  actions: {
    maxWidth: 1000,
    margin: "0 auto 16px",
    display: "flex",
    justifyContent: "space-between",
  },

  backBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: 0,
    cursor: "pointer",
    fontWeight: 700,
  },

  printBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: 0,
    cursor: "pointer",
    fontWeight: 700,
    background: "#2563eb",
    color: "white",
  },

  receipt: {
    maxWidth: 1000,
    margin: "0 auto",
    background: "white",
    padding: 24,
    color: "#111827",
    border: "2px solid #111827",
    fontSize: 14,
  },

  header: {
    textAlign: "center",
    borderBottom: "2px solid #111827",
    paddingBottom: 10,
  },

  companyName: {
    margin: 0,
    fontSize: 30,
    fontWeight: 900,
    textTransform: "uppercase",
  },

  companyText: {
    marginTop: 4,
    color: "#374151",
  },

  lrTitle: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 18,
    padding: 10,
    borderBottom: "2px solid #111827",
  },

  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    borderBottom: "1px solid #111827",
  },

  box: {
    padding: 12,
    borderRight: "1px solid #111827",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 14,
  },

  label: {
    border: "1px solid #111827",
    padding: 10,
    fontWeight: 800,
    background: "#f3f4f6",
    width: "22%",
  },

  value: {
    border: "1px solid #111827",
    padding: 10,
  },

  wordsBox: {
    marginTop: 14,
    padding: 12,
    border: "1px solid #111827",
    fontWeight: 600,
  },

  gstBox: {
    marginTop: 14,
    padding: 12,
    border: "1px solid #111827",
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
  },

  checkBox: {
    fontWeight: 700,
  },

  bottomSection: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: 14,
  },

  terms: {
    border: "1px solid #111827",
    padding: 12,
  },

  stampBox: {
    border: "1px solid #111827",
    padding: 12,
    minHeight: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    color: "#6b7280",
  },

  signature: {
    marginTop: 26,
    textAlign: "right",
    fontWeight: 900,
  },
};