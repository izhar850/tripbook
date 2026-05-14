const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,.18), transparent 28%), #050816",
    color: "white",
    padding: 24,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    background: "linear-gradient(135deg,#2563eb,#06b6d4)",
    boxShadow: "0 8px 24px rgba(37,99,235,.28)",
  },

  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 14,
  },

  searchWrap: {
    position: "relative",
    width: 320,
    maxWidth: "100%",
  },

  searchIcon: {
    position: "absolute",
    left: 12,
    top: 12,
    color: "#64748b",
  },

  search: {
    width: "100%",
    padding: "12px 12px 12px 38px",
    borderRadius: 14,
    background: "#0f172a",
    color: "white",
    border: "1px solid rgba(255,255,255,.06)",
    boxSizing: "border-box",
    fontSize: 15,
  },

  layout: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  tablePane: {
    transition: "all .25s ease",
  },

  card: {
    padding: 22,
    borderRadius: 24,
    background: "rgba(15,23,42,.78)",
    border: "1px solid rgba(255,255,255,.06)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
    flexWrap: "wrap",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 18px",
    borderRadius: 14,
    border: 0,
    fontWeight: 700,
    cursor: "pointer",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    boxShadow: "0 8px 24px rgba(37,99,235,.35)",
  },

  panel: {
    flex: 1,
    minWidth: 320,
    padding: 22,
    borderRadius: 24,
    background: "rgba(15,23,42,.86)",
    border: "1px solid rgba(255,255,255,.06)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  closeBtn: {
    background: "transparent",
    border: 0,
    color: "white",
    cursor: "pointer",
    fontSize: 18,
  },

  fieldWrap: {
    position: "relative",
    marginBottom: 12,
  },

  fieldIcon: {
    position: "absolute",
    left: 12,
    top: 12,
    color: "#64748b",
    zIndex: 2,
  },

  input: {
    width: "100%",
    padding: "12px 12px 12px 38px",
    borderRadius: 12,
    background: "#111827",
    color: "white",
    border: "1px solid rgba(255,255,255,.05)",
    boxSizing: "border-box",
    fontSize: 15,
  },

  balance: {
    marginTop: 12,
    marginBottom: 12,
    fontWeight: 700,
    fontSize: 16,
    color: "#e2e8f0",
  },

  saveButton: {
    width: "100%",
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    border: 0,
    fontWeight: 700,
    cursor: "pointer",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    boxShadow: "0 8px 24px rgba(37,99,235,.30)",
  },

  th: {
    textAlign: "left",
    padding: "12px 8px",
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 600,
  },

  td: {
    padding: "14px 8px",
    borderTop: "1px solid rgba(255,255,255,.05)",
    fontSize: 15,
    color: "#f8fafc",
  },

  actionBtn: {
    marginRight: 8,
    padding: "7px 12px",
    borderRadius: 10,
    border: "1px solid rgba(59,130,246,.25)",
    cursor: "pointer",
    fontWeight: 600,
    background: "rgba(37,99,235,.14)",
    color: "#60a5fa",
  },

  deleteButton: {
    padding: "7px 12px",
    borderRadius: 10,
    border: "1px solid rgba(239,68,68,.25)",
    cursor: "pointer",
    fontWeight: 600,
    background: "rgba(239,68,68,.14)",
    color: "#f87171",
  },
  fieldLabel: {
  fontSize: 12,
  color: "#94a3b8",
  marginBottom: 6,
  paddingLeft: 2,
},
fieldIcon: {
  position: "absolute",
  left: 12,
  top: 34,
  color: "#64748b",
  zIndex: 2,
},
statsGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 22,
},

statCard: {
  background: "rgba(15,23,42,.78)",
  border: "1px solid rgba(255,255,255,.06)",
  borderRadius: 18,
  padding: 18,
  backdropFilter: "blur(12px)",
},

statLabel: {
  fontSize: 12,
  color: "#94a3b8",
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: 0.8,
},

statValue: {
  fontSize: 26,
  fontWeight: 800,
},
loginPage: {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background:
    "radial-gradient(circle at top right, rgba(37,99,235,.18), transparent 30%), #050816",
},

loginCard: {
  width: "100%",
  maxWidth: 420,
  padding: 28,
  borderRadius: 24,
  background: "rgba(15,23,42,.82)",
  border: "1px solid rgba(255,255,255,.06)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 20px 60px rgba(0,0,0,.35)",
},

loginLogo: {
  width: 56,
  height: 56,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg,#2563eb,#06b6d4)",
  marginBottom: 18,
},

loginTitle: {
  margin: 0,
  fontSize: 28,
  fontWeight: 800,
   color: "#ffffff",
},

loginSubtitle: {
  marginTop: 6,
  marginBottom: 20,
  color: "#94a3b8",
},

loginInput: {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.08)",
  background: "#111827",
  color: "#fff",
  boxSizing: "border-box",
  marginBottom: 12,
  fontSize: 15,
},

loginButton: {
  width: "100%",
  padding: 14,
  borderRadius: 14,
  border: 0,
  cursor: "pointer",
  fontWeight: 700,
  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
  color: "#fff",
  boxShadow: "0 8px 24px rgba(37,99,235,.28)",
},

loginError: {
  color: "#f87171",
  fontSize: 13,
  marginBottom: 12,
},
logoutButton: {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid rgba(239,68,68,.25)",
  background: "rgba(239,68,68,.14)",
  color: "#f87171",
  cursor: "pointer",
  fontWeight: 600,
},
welcomeBox: {
  color: "#e2e8f0",
  fontSize: 14,
  fontWeight: 700,
},

profileButton: {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid rgba(59,130,246,.25)",
  background: "rgba(37,99,235,.14)",
  color: "#60a5fa",
  cursor: "pointer",
  fontWeight: 700,
},

profileOverlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  zIndex: 80,
  overflowY: "auto",
},

profileModal: {
  width: "100%",
  maxWidth: 520,
  maxHeight: "78vh",
  overflowY: "auto",
  background: "#0f172a",
  border: "1px solid rgba(255,255,255,.06)",
  borderRadius: 24,
  padding: 22,
  boxShadow: "0 20px 60px rgba(0,0,0,.45)",
  boxSizing: "border-box",
},

profileLabel: {
  display: "block",
  marginBottom: 6,
  marginTop: 12,
  color: "#94a3b8",
  fontSize: 13,
  fontWeight: 700,
},
profileBanner: {
  marginBottom: 20,
  padding: 18,
  borderRadius: 20,
  background: "rgba(245,158,11,.12)",
  border: "1px solid rgba(245,158,11,.22)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
},

profileBannerTitle: {
  color: "#fbbf24",
  fontWeight: 800,
  fontSize: 16,
},

profileBannerText: {
  color: "#fde68a",
  marginTop: 4,
  fontSize: 14,
},

profileBannerButton: {
  padding: "12px 16px",
  borderRadius: 14,
  border: 0,
  background: "#f59e0b",
  color: "#111827",
  fontWeight: 800,
  cursor: "pointer",
},
selectWrap: {
  marginBottom: 14,
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
partyButton: {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid rgba(59,130,246,.25)",
  background: "rgba(37,99,235,.14)",
  color: "#60a5fa",
  cursor: "pointer",
  fontWeight: 700,
},
sizeRow: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 10,
  marginBottom: 12,
},
invoiceButton: {
  marginTop: 6,
  padding: "7px 12px",
  borderRadius: 10,
  border: "1px solid rgba(34,197,94,.25)",
  cursor: "pointer",
  fontWeight: 600,
  background: "rgba(34,197,94,.14)",
  color: "#22c55e",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
},
};

export default styles