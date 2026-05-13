import styles from "../styles/dashboardStyles";

export default function Field({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div style={styles.fieldWrap}>
      <div style={styles.fieldLabel}>{placeholder}</div>
      <div style={styles.fieldIcon}>{icon}</div>

      <input
        type={type}
        style={styles.input}
        placeholder={type === "date" ? undefined : placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}