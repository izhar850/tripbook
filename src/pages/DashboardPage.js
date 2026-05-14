import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/dashboardStyles";
import Field from "../components/Field";
import { auth, db } from "../firebase/firebase";
import TripTable from "../components/TripTable";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { logoutUser } from "../services/authService";
import { Package, Weight } from "lucide-react";
import {
  User,
  StickyNote,
} from "lucide-react";


import Swal from "sweetalert2";
import {
 Search,
  Truck,
  MapPin,
  Phone,
  IndianRupee,
  Calendar,
  FileText,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  getDoc,
  setDoc,
  runTransaction
} from "firebase/firestore";

const emptyForm = {
  date: "",
  vehicle: "",
   partyName: "",
   partyGst: "",
partyAddress: "",
partyMobile: "",
  source: "",
  destination: "",
  mobile: "",
  rate: "",
  advance: "",
  notes: "",
  lrNo: "",
  packages: "",
  weight: "",
  unloadingCharges: "",
partyGst: "",
description: "",
vehicleType: "",
sizeL: "",
sizeW: "",
sizeH: "",
rateQtl: "",
remark: "",
gstPayBy: "",
};



export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
const [currentUser, setCurrentUser] = useState(null);
const [userProfile, setUserProfile] = useState(null);
const [showProfile, setShowProfile] = useState(false);
const [parties, setParties] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
  sessionStorage.getItem("tripbook_auth") === "true"
  
);
const [showProfileModal, setShowProfileModal] = useState(false);

const [profileForm, setProfileForm] = useState({
  companyName: "",
  ownerName: "",
  email: "",
  mobile: "",
  officePhone: "",
  gstNo: "",
  address: "",
  bankName: "",
  accountNo: "",
  ifscCode: "",
});

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loginError, setLoginError] = useState("");
  const [form, setForm] = useState(emptyForm);
  

  useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, async  (user) => {
    if (!user) {
      navigate("/");
      return;
    }

    setCurrentUser(user);
    const profileSnap = await getDoc(doc(db, "users", user.uid));

if (profileSnap.exists()) {
  const profileData = profileSnap.data();

  setUserProfile(profileData);

  setProfileForm({
    companyName: profileData.companyName || "",
    ownerName: profileData.ownerName || "",
    email: profileData.email || "",
    mobile: profileData.mobile || "",
    officePhone: profileData.officePhone || "",
    gstNo: profileData.gstNo || "",
    address: profileData.address || "",
    bankName: profileData.bankName || "",
    accountNo: profileData.accountNo || "",
    ifscCode: profileData.ifscCode || "",
  });
}
    loadTrips(user.uid);
    loadParties(user.uid);
  });

  return () => unsubscribe();
  }, []);

  function handleLogin(e) {
   e.preventDefault();

  if (username === "admin" && password === "tripbook123") {
    sessionStorage.setItem("tripbook_auth", "true");
    setIsLoggedIn(true);
    setLoginError("");
  } else {
    setLoginError("Invalid username or password");
  }
}
function handlePartySelect(partyId) {
  const selectedParty = parties.find((p) => p.id === partyId);

  if (!selectedParty) {
    update("partyId", "");
    update("partyName", "");
    update("partyGst", "");
    update("partyAddress", "");
    update("partyMobile", "");
    return;
  }

  setForm((prev) => ({
    ...prev,
    partyId: selectedParty.id,
    partyName: selectedParty.partyName || "",
    partyGst: selectedParty.gstNo || "",
    partyAddress: selectedParty.address || "",
    partyMobile: selectedParty.mobile || "",
  }));
}
function handleLogout() {
  sessionStorage.removeItem("tripbook_auth");
  setIsLoggedIn(false);
  setUsername("");
  setPassword("");
}

  async function loadTrips(uid) {
  const q = query(
    collection(db, "trips"),
    where("userId", "==", uid)
  );

  const snap = await getDocs(q);
  setTrips(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}
async function generateNextLrNo(uid) {
  const counterRef = doc(db, "counters", uid);

  const nextNo = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    const lastNo = counterDoc.exists()
      ? counterDoc.data().lastLrNo || 0
      : 0;

    const newNo = lastNo + 1;

    transaction.set(
      counterRef,
      { lastLrNo: newNo },
      { merge: true }
    );

    return newNo;
  });

  return `LR-${String(nextNo).padStart(4, "0")}`;
}
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

const totalFreight =
  Number(form.weight || 0) * Number(form.rateQtl || 0);

const unloadingAmount =
  Number(form.unloadingCharges || 0);

const advanceAmount =
  Number(form.advance || 0);

const totalAmount =
  totalFreight + unloadingAmount;

const balanceAmount =
  totalAmount - advanceAmount;

//   const balance = useMemo(
//     () => Math.max(Number(form.rate || 0) - Number(form.advance || 0), 0),
//     [form.rate, form.advance]
//   );

  const filtered = trips.filter((trip) =>
    `${trip.vehicle} ${trip.source} ${trip.destination}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const totalTrips = trips.length;

const totalRevenue = trips.reduce(
  (sum, trip) => sum + Number(trip.rate || 0),
  0
);

const totalAdvance = trips.reduce(
  (sum, trip) => sum + Number(trip.advance || 0),
  0
);

const totalPending = trips.reduce(
  (sum, trip) =>
    sum + Math.max(Number(trip.rate || 0) - Number(trip.advance || 0), 0),
  0
);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

async function saveTrip() {
  if (!currentUser) {
    await Swal.fire({
      icon: "error",
      title: "Session expired",
      text: "Please login again.",
      background: "#0f172a",
      color: "#ffffff",
    });

    navigate("/");
    return;
  }

  const isEdit = Boolean(editingId);
const finalLrNo = isEdit
  ? form.lrNo
  : form.lrNo || (await generateNextLrNo(currentUser.uid));
  const payload = {
    ...form,
    rateQtl: Number(form.rateQtl || 0),
rate: totalFreight,
    advance: Number(form.advance || 0),
    userId: currentUser.uid,
    companyName: userProfile?.companyName || "",
    ownerName: userProfile?.ownerName || "",
    lrNo: finalLrNo,
  };

  if (isEdit) {
    await updateDoc(doc(db, "trips", editingId), payload);
  } else {
    await addDoc(collection(db, "trips"), payload);
  }

  setForm(emptyForm);
  setEditingId(null);
  setShowPanel(false);

  await loadTrips(currentUser.uid);

  await Swal.fire({
    icon: "success",
    title: isEdit ? "Trip Updated" : "Trip Added",
    text: isEdit
      ? "Trip updated successfully."
      : "New trip added successfully.",
    timer: 1600,
    showConfirmButton: false,
    background: "#0f172a",
    color: "#ffffff",
  });
}
async function updateProfile() {
  if (!currentUser) return;

  await updateDoc(doc(db, "users", currentUser.uid), {
    companyName: profileForm.companyName,
    ownerName: profileForm.ownerName,
    mobile: profileForm.mobile,
    officePhone: profileForm.officePhone,
    gstNo: profileForm.gstNo,
    address: profileForm.address,
    bankName: profileForm.bankName,
    accountNo: profileForm.accountNo,
    ifscCode: profileForm.ifscCode,
    profileCompleted: true,
  });

  setUserProfile((prev) => ({
    ...prev,
    ...profileForm,
    profileCompleted: true,
  }));

  setShowProfileModal(false);

  await Swal.fire({
    icon: "success",
    title: "Profile Updated",
    text: "Company profile updated successfully.",
    timer: 1600,
    showConfirmButton: false,
    background: "#0f172a",
    color: "#ffffff",
  });
}


  async function deleteTrip(id) {
  if (!currentUser) {
    await Swal.fire({
      icon: "error",
      title: "Session expired",
      text: "Please login again.",
      background: "#0f172a",
      color: "#ffffff",
    });

    navigate("/");
    return;
  }

  const result = await Swal.fire({
    title: "Delete trip?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#ef4444",
    background: "#0f172a",
    color: "#ffffff",
  });

  if (!result.isConfirmed) return;

  await deleteDoc(doc(db, "trips", id));

  await loadTrips(currentUser.uid);

  await Swal.fire({
    icon: "success",
    title: "Deleted",
    text: "Trip deleted successfully.",
    timer: 1500,
    showConfirmButton: false,
    background: "#0f172a",
    color: "#ffffff",
  });
}

  function openNewTrip() {
  setEditingId(null);
  setForm(emptyForm);
  setShowPanel(true);
}

  function editTrip(trip) {
    setEditingId(trip.id);
    setForm({
      date: trip.date || "",
      vehicle: trip.vehicle || "",
      partyName: trip.partyName || "",
      source: trip.source || "",
      destination: trip.destination || "",
      mobile: trip.mobile || "",
      rateQtl: String(trip.rateQtl || ""),
      rate: String(trip.rate || ""),
      advance: String(trip.advance || ""),
      notes: trip.notes || "",
      lrNo: trip.lrNo || "",
      packages: trip.packages || "",
      weight: trip.weight || "",
      unloadingCharges:
  trip.unloadingCharges || "",
  partyGst: trip.partyGst || "",
description: trip.description || "",
vehicleType: trip.vehicleType || "",
sizeL: trip.sizeL || "",
sizeW: trip.sizeW || "",
sizeH: trip.sizeH || "",
rateQtl: trip.rateQtl || "",
remark: trip.remark || "",
gstPayBy: trip.gstPayBy || "",
    });
    setShowPanel(true);
  }

  function handleLrReceipt(trip) {
  navigate("/lr-receipt-preview", {
    state: {
      trip,
      userProfile,
    },
  });
}

  async function handleLogout() {
  await logoutUser();

  setCurrentUser(null);
  setTrips([]);
  setForm(emptyForm);
  setEditingId(null);
  setShowPanel(false);

  navigate("/");
}


  

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brandWrap}>
         <div style={styles.logo}>
  <Truck size={22} />
</div>

          <div>
            <h1 style={styles.title}>TripBook</h1>
            <div style={styles.subtitle}>Transport operations dashboard</div>
          </div>
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
        <button style={styles.logoutButton} onClick={handleLogout}>
  Log out
</button>
      </div>
      
      <div style={styles.userBox}>
  <div>
    <div style={styles.welcomeText}>
      Welcome, {userProfile?.ownerName || "User"}
    </div>
    <div style={styles.roleText}>
      {userProfile?.role || "transporter"}
    </div>
  </div>

  <button
  style={styles.partyButton}
  onClick={() => navigate("/parties")}
>
  Party Management
</button>
<button
  style={styles.partyButton}
  onClick={() => navigate("/billing")}
>
  Billing
</button>

  <button
  style={styles.profileButton}
  onClick={() => setShowProfileModal(true)}
>
  Profile
</button>
</div>


{/* ADD HERE */}
{userProfile && !userProfile.profileCompleted && (
  <div style={styles.profileBanner}>
    <div>
      <div style={styles.profileBannerTitle}>
        Complete your company profile
      </div>

      <div style={styles.profileBannerText}>
        Add GST, address, bank details and contact info
        before generating invoices.
      </div>
    </div>

    <button
      style={styles.profileBannerButton}
      onClick={() => setShowProfileModal(true)}
    >
      Complete Now
    </button>
  </div>
)}

<div style={styles.layout}></div>
      <div style={styles.layout}>
        <div
          style={{
            ...styles.tablePane,
            width: showPanel && window.innerWidth > 768 ? "64%" : "100%",
          }}
        >
          <div style={styles.statsGrid}>
  <div style={styles.statCard}>
    <div style={styles.statLabel}>Total Trips</div>
    <div style={styles.statValue}>{totalTrips}</div>
  </div>

  <div style={styles.statCard}>
    <div style={styles.statLabel}>Total Revenue</div>
    <div style={styles.statValue}>₹{totalRevenue.toLocaleString()}</div>
  </div>

  <div style={styles.statCard}>
    <div style={styles.statLabel}>Total Advance</div>
    <div style={styles.statValue}>₹{totalAdvance.toLocaleString()}</div>
  </div>

  <div style={styles.statCard}>
    <div style={styles.statLabel}>Pending Balance</div>
    <div style={{ ...styles.statValue, color: "#f87171" }}>
      ₹{totalPending.toLocaleString()}
    </div>
  </div>
</div>
          <div style={styles.card}>
            <div style={styles.topBar}>
              
              <h2 style={{ margin: 0 }}>Recent Trips</h2>
              
              <button style={styles.addButton} onClick={openNewTrip}>
                <Plus size={16} /> Add New Trip
              </button>

              
            </div>
            

            <TripTable
              trips={filtered}
              onEdit={editTrip}
              onDelete={deleteTrip}
              onLrReceipt={handleLrReceipt}
                styles={styles}
            />
          </div>
        </div>

        {showPanel && (
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3 style={{ margin: 0 }}>
                {editingId ? "Edit Trip" : "New Trip"}
              </h3>
              <button style={styles.closeBtn} onClick={() => setShowPanel(false)}>
                ✕
              </button>
            </div>

            <DateField form={form} update={update} styles={styles}/>
          {editingId && (
  <Field
    icon={<FileText size={15} />}
    placeholder="L.R. No / Bill No"
    value={form.lrNo}
    onChange={(v) => update("lrNo", v)}
  />
)}
            <Field icon={<Truck size={15} />} placeholder="Vehicle number" value={form.vehicle} onChange={(v) => update("vehicle", v)}/>
            <div style={styles.selectWrap}>
 <select
  style={styles.select}
  value={form.partyId || ""}
  onChange={(e) =>
    handlePartySelect(e.target.value)
  }
>
  <option value="">
    Select Party
  </option>

  {parties.map((party) => (
    <option
      key={party.id}
      value={party.id}
    >
      {party.partyName}
    </option>
  ))}
</select>
</div>
            <Field icon={<MapPin size={15} />} placeholder="Source" value={form.source} onChange={(v) => update("source", v)} />
            <Field icon={<MapPin size={15} />} placeholder="Destination" value={form.destination} onChange={(v) => update("destination", v)}/>
            <Field icon={<Phone size={15} />} placeholder="Driver mobile" value={form.mobile} onChange={(v) => update("mobile", v)} />
            <Field
  icon={<IndianRupee size={15} />}
  placeholder="Rate / Qtl"
  value={form.rateQtl}
  onChange={(v) => update("rateQtl", v)}
/>
            <Field icon={<IndianRupee size={15} />} placeholder="Advance" value={form.advance} onChange={(v) => update("advance", v)}/>
            <Field
  icon={<IndianRupee size={15} />}
  placeholder="Unloading Charges"
  value={form.unloadingCharges}
  onChange={(v) =>
    update("unloadingCharges", v)
  }
/>
            <Field
  icon={<Package size={15} />}
  placeholder="No. of Packages"
  value={form.packages}
  onChange={(v) => update("packages", v)}
/>

<Field
  icon={<Weight size={15} />}
  placeholder="Weight"
  value={form.weight}
  onChange={(v) => update("weight", v)}
/>


<Field
  icon={<FileText size={15} />}
  placeholder="Party GST No"
  value={form.partyGst}
  onChange={(v) =>
    update("partyGst", v)
  }
/>
<Field
  icon={<Package size={15} />}
  placeholder="Description of Goods"
  value={form.description}
  onChange={(v) =>
    update("description", v)
  }
/>
<Field
  icon={<Truck size={15} />}
  placeholder="Vehicle Type"
  value={form.vehicleType}
  onChange={(v) =>
    update("vehicleType", v)
  }
/>
<div style={styles.sizeRow}>
  <input
    style={styles.input}
    placeholder="L"
    value={form.sizeL}
    onChange={(e) =>
      update("sizeL", e.target.value)
    }
  />

  <input
    style={styles.input}
    placeholder="W"
    value={form.sizeW}
    onChange={(e) =>
      update("sizeW", e.target.value)
    }
  />

  <input
    style={styles.input}
    placeholder="H"
    value={form.sizeH}
    onChange={(e) =>
      update("sizeH", e.target.value)
    }
  />
</div>
<Field
  icon={<IndianRupee size={15} />}
  placeholder="Rate / Qtl"
  value={form.rateQtl}
  onChange={(v) =>
    update("rateQtl", v)
  }
/>
<Field
  icon={<StickyNote size={15} />}
  placeholder="Remark"
  value={form.remark}
  onChange={(v) =>
    update("remark", v)
  }
/>
<select
  style={styles.select}
  value={form.gstPayBy}
  onChange={(e) =>
    update("gstPayBy", e.target.value)
  }
>
  <option value="">
    GST/Service Tax To Pay
  </option>

  <option value="consigner">
    Consigner
  </option>

  <option value="consignee">
    Consignee
  </option>

  <option value="transporter">
    Transporter
  </option>
</select>
            <Field icon={<FileText size={15} />} placeholder="Notes" value={form.notes} onChange={(v) => update("notes", v)} />

           <div style={styles.amountSummary}>
  <div style={styles.amountRow}>
    <span>Total Amount</span>

    <strong>
      ₹{totalAmount.toLocaleString()}
    </strong>
  </div>

  <div style={styles.amountRow}>
    <span>Advance</span>

    <strong>
      ₹
      {Number(
        form.advance || 0
      ).toLocaleString()}
    </strong>
  </div>

  <div style={styles.amountRow}>
    <span>Balance</span>

    <strong
      style={{
        color:
          balanceAmount > 0
            ? "#f87171"
            : "#22c55e",
      }}
    >
      ₹{balanceAmount.toLocaleString()}
    </strong>
  </div>
</div>
            <button style={styles.saveButton} onClick={saveTrip}>
              {editingId ? "Update Trip" : "Save Trip"}
            </button>
          </div>
        )}
        {showProfileModal && (
  <div style={styles.profileOverlay}>
    <div style={styles.profileModal}>
      <div style={styles.panelHeader}>
        <h3 style={{ margin: 0 }}>Edit Company Profile</h3>

        <button
          style={styles.closeBtn}
          onClick={() => setShowProfileModal(false)}
        >
          ✕
        </button>
      </div>

      <label style={styles.profileLabel}>Company Name</label>
      <input
        style={styles.input}
        value={profileForm.companyName}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            companyName: e.target.value,
          }))
        }
      />

      <label style={styles.profileLabel}>Owner Name</label>
      <input
        style={styles.input}
        value={profileForm.ownerName}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            ownerName: e.target.value,
          }))
        }
      />

      <label style={styles.profileLabel}>Email</label>
      <input
        style={{ ...styles.input, opacity: 0.65, cursor: "not-allowed" }}
        value={profileForm.email}
        disabled
      />

      <label style={styles.profileLabel}>Mobile</label>
      <input
        style={styles.input}
        value={profileForm.mobile}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            mobile: e.target.value,
          }))
        }
      />

      <label style={styles.profileLabel}>Office Phone</label>
      <input
        style={styles.input}
        value={profileForm.officePhone}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            officePhone: e.target.value,
          }))
        }
      />

      <label style={styles.profileLabel}>GST No.</label>
      <input
        style={styles.input}
        value={profileForm.gstNo}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            gstNo: e.target.value,
          }))
        }
      />

      <label style={styles.profileLabel}>Address</label>
      <textarea
        style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
        value={profileForm.address}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            address: e.target.value,
          }))
        }
      />

      <label style={styles.profileLabel}>Bank Name</label>
      <input
        style={styles.input}
        value={profileForm.bankName}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            bankName: e.target.value,
          }))
        }
      />

      <label style={styles.profileLabel}>Account No.</label>
      <input
        style={styles.input}
        value={profileForm.accountNo}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            accountNo: e.target.value,
          }))
        }
      />

      <label style={styles.profileLabel}>IFSC Code</label>
      <input
        style={styles.input}
        value={profileForm.ifscCode}
        onChange={(e) =>
          setProfileForm((prev) => ({
            ...prev,
            ifscCode: e.target.value,
          }))
        }
      />

      <button style={styles.saveButton} onClick={updateProfile}>
        Save Profile
      </button>
    </div>
  </div>
)}
          <footer style={styles.footer}>
        {/* <img src="tripbook/public/delivery.png" alt="TripBook" style={styles.footerLogo} /> */}
        <span>© {new Date().getFullYear()} TripBook. All rights reserved.</span>
      </footer>
      </div>
    </div>
    
  );
  
}


function DateField({ form, update}) {
  return (
    <div style={styles.fieldWrap}>
      <div style={styles.fieldLabel}>Trip date</div>
      <div style={styles.fieldIcon}><Calendar size={15} /></div>
      <DatePicker
        selected={form.date ? (() => {
          const [d, m, y] = form.date.split("/");
          return new Date(y, m - 1, d);
        })() : null}
        onChange={(date) => {
          if (!date) return update("date", "");
          const d = String(date.getDate()).padStart(2, "0");
          const m = String(date.getMonth() + 1).padStart(2, "0");
          update("date", `${d}/${m}/${date.getFullYear()}`);
        }}
        dateFormat="dd/MM/yyyy"
        customInput={<input style={styles.input} />}
      />
    </div>
  );
}







