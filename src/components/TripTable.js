import { Pencil, Trash2 } from "lucide-react";

export default function TripTable({ trips, onEdit, onDelete, styles }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={styles.th}>Vehicle</th>
            <th style={styles.th}>Party</th>
            <th style={styles.th}>Route</th>
            <th style={styles.th}>Rate</th>
            <th style={styles.th}>Balance</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => {
            const balance = Math.max(
              Number(trip.rate || 0) - Number(trip.advance || 0),
              0
            );

            return (
              <tr key={trip.id}>
                <td style={styles.td}>{trip.vehicle}</td>
                <td style={styles.td}>{trip.partyName || "-"}</td>
                <td style={styles.td}>{trip.source} → {trip.destination}</td>
                <td style={styles.td}>₹{Number(trip.rate || 0).toLocaleString()}</td>

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

                <td style={styles.td}>
                  <button style={styles.actionBtn} onClick={() => onEdit(trip)}>
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button style={styles.deleteButton} onClick={() => onDelete(trip.id)}>
                    <Trash2 size={14} />
                    Delete
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