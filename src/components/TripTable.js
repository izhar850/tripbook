import { Pencil, Trash2, ReceiptText  } from "lucide-react";

export default function TripTable({ trips, onEdit, onDelete, styles, onLrReceipt  }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={styles.th}>L.R. No</th>
            <th style={styles.th}>Vehicle</th>
            <th style={styles.th}>Party</th>
            <th style={styles.th}>Route</th>
            <th style={styles.th}>Rate</th>
            <th style={styles.th}>Unloading</th>
            <th style={styles.th}>Balance</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Pkgs</th>
            <th style={styles.th}>Weight</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => {
            const totalAmount =
  Number(trip.rate || 0) + Number(trip.unloadingCharges || 0);

const balance = Math.max(
  totalAmount - Number(trip.advance || 0),
  0
);
            

            return (
              <tr key={trip.id}>
                <td style={styles.td}>{trip.lrNo || "-"}</td>
                <td style={styles.td}>{trip.vehicle}</td>
                <td style={styles.td}>{trip.partyName || "-"}</td>
                <td style={styles.td}>{trip.source} → {trip.destination}</td>
                <td style={styles.td}>₹{Number(trip.rate || 0).toLocaleString()}</td>
                <td style={styles.td}>
  ₹{Number(trip.unloadingCharges || 0).toLocaleString()}
</td>
                

                <td
                  style={{
                    ...styles.td,
                    color: balance <= 2000 ? "#22c55e" : "#ef4444",
                    fontWeight: 700,
                  }}
                >
                  ₹{balance.toLocaleString()}
                </td>

                <td style={styles.td}>{trip.date}</td>
<td style={styles.td}>{trip.packages || "-"}</td>
<td style={styles.td}>{trip.weight || "-"}</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={() => onEdit(trip)}>
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button style={styles.deleteButton} onClick={() => onDelete(trip.id)}>
                    <Trash2 size={14} />
                    Delete
                  </button>
                  
                  <button
  style={styles.invoiceButton}
  onClick={() => onLrReceipt(trip)}
>
  <ReceiptText size={14} />
  LR Receipt
</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}