import React, { useState } from "react";
import {
  MapPin, Clock, CheckCircle, Phone, Eye,
  FileText, AlertTriangle, Home,
  Clock1,
  Users
} from "lucide-react";
import Navbar from "./Navbar";
import '../css/field.css'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

function Field() {
  const [tab, setTab] = useState("farmers");
  const [checklist, setChecklist] = useState({
    plantation: false,
    crop: false,
    area: false,
    growth: false,
    pest: false,
  });



  const [form, setForm] = useState({
    condition: "",
    notes: "",
    image: null
  });

  const toggleCheck = (key) => {
    setChecklist({ ...checklist, [key]: !checklist[key] });
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm({ ...form, image: reader.result });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 500 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 0,
    outline: 'none'
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const [farmers, setFarmers] = React.useState([]);
  const [deliveries, setDeliveries] = React.useState([]);
  const [selectedFarmerToVerify, setSelectedFarmerToVerify] = React.useState(null);
  const [gpsLocation, setGpsLocation] = React.useState(null);

  const handleStartGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setGpsLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, (error) => {
        alert("Failed to get location: " + error.message);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmitDailyReport = async () => {
    // You can replace these hardcoded values with actual state values if you make them dynamic later
    const reportData = {
      staffId: user?.id,
      staffName: user?.name,
      date: new Date().toISOString(),
      farmsVisited: dashboardStats.fieldVisits,
      issuesReported: dashboardStats.issuesReported,
      deliveriesVerified: dashboardStats.deliveriesAssisted,
    };

    try {
      // Replace with your actual backend endpoint for daily reports
      const response = await fetch(`http://localhost:8000/staff/submitDailyReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        alert("Daily report submitted successfully to the Factory Admin!");
      } else {
        alert("Failed to submit daily report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting daily report:", error);
      alert("An error occurred. Please check your connection.");
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await fetch("http://localhost:8000/admin/farmers?staffId=" + user.id);
      const data = await response.json();

      const formattedData = data.map(f => ({
        id: f.id,
        name: f.name,
        location: f.location,
        crops: `${f.crops} crops`,
        lastVisit: new Date().toLocaleDateString(),
        status: f.status,
        statusType: f.color === "green" ? "success" : f.color === "orange" ? "warning" : "info",
        note: f.max_field_staff_id ? "Assigned by Factory Admin" : (f.status === "HARVEST READY" ? "Pickup verification required" : f.status === "PEST CONTROL NEEDED" ? "Field inspection due" : "Scheduled visit in 2 days"),
      }));
      setFarmers(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/staff/dashboard-stats?staffId=" + user.id);
      const data = await response.json();
      setDashboardStats({
        assignedFarmers: data.assignedFarmers || 0,
        fieldVisits: data.fieldVisits || 0,
        issuesReported: data.issuesReported || 0,
        pendingTasks: data.pendingTasks || 0,
        deliveriesAssisted: data.deliveriesAssisted || 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("http://localhost:8000/get-deliveries?staffId=" + user.id);
      const data = await response.json();
      const formattedDeliveries = data.map(d => ({
        id: "DEL-" + String(d.id).padStart(4, '0'),
        farmer: d.farmer_name,
        driver: d.driver_name,
        weight: d.weight || "Pending",
        status: d.status,
        statusType: d.status === "COMPLETED" ? "success" : d.status === "PICKUP IN-PROGRESS" ? "warning" : "info",
        note: d.status === "SCHEDULED" ? "Standby" : "Action Required"
      }));
      setDeliveries(formattedDeliveries);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitVerification = async () => {
    if (!gpsLocation) {
      alert("Please capture GPS location first.");
      return;
    }
    const allChecked = Object.values(checklist).every(v => v === true);
    if (!allChecked) {
      alert("Please complete the verification checklist.");
      return;
    }
    if (!form.image) {
      alert("Please upload a field photo.");
      return;
    }
    if (!form.condition) {
      alert("Please select overall crop condition.");
      return;
    }
    if (!form.notes) {
      alert("Please enter field notes.");
      return;
    }
    if (!selectedFarmerToVerify) return;

    try {
      const response = await fetch(`http://localhost:8000/submitVerification/${selectedFarmerToVerify.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: gpsLocation.lat,
          longitude: gpsLocation.lng,
          condition: form.condition,
          notes: form.notes,
          checklist: checklist,
          verifiedBy: user?.name,
          image: form.image
        })
      });
      if (response.ok) {
        alert("Verification report submitted successfully!");
        handleClose();
        fetchFarmers();
        fetchStats();
        setForm({ condition: "", notes: "", image: null });
        setChecklist({
          plantation: false,
          crop: false,
          area: false,
          growth: false,
          pest: false,
        });
        setGpsLocation(null);
      } else {
        alert("Failed to submit report.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchFarmers();
    fetchStats();
    fetchDeliveries();
  }, []);



  const [dashboardStats, setDashboardStats] = React.useState({
    assignedFarmers: 0,
    fieldVisits: 0,
    issuesReported: 0,
    pendingTasks: 0,
    deliveriesAssisted: 0
  });

  const cards = [
    {
      title: "Assigned Farmers",
      value: dashboardStats.assignedFarmers,
      sub: "",
      icon: <Users />,
    },
    {
      title: "Field Visits",
      value: dashboardStats.fieldVisits,
      sub: "This week",
      icon: <MapPin />,
    },
    {
      title: "Pending Tasks",
      value: dashboardStats.pendingTasks,
      sub: "Requires attention",
      icon: <Clock1 />,
      highlight: true,
    },
    {
      title: "Deliveries Assisted",
      value: dashboardStats.deliveriesAssisted,
      sub: "This month",
      icon: "✔",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="fsd-container">

        {/* Header */}
        <div className="fsd-header">
          <div>
            <h2 className="fsd-title">Field Staff Dashboard</h2>
            <p className="fsd-subtitle">Welcome back, {user.name}</p>
          </div>

          <div className="fsd-territory">
            <span>Territory</span>
            <strong>Kolhapur-Sangli Region</strong>
          </div>
        </div>

        {/* Cards */}
        <div className="fsd-card-grid">
          {cards.map((card, index) => (
            <div className="fsd-card" key={index}>
              <div>
                <p className="fsd-card-title">{card.title}</p>
                <h3 className="fsd-card-value">{card.value}</h3>
                {card.sub && (
                  <span
                    className={`fsd-card-sub ${card.highlight ? "fsd-warning" : ""
                      }`}
                  >
                    {card.sub}
                  </span>
                )}
              </div>

              <div className="fsd-card-icon">{card.icon}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="fsd-tabs">
          <button onClick={() => setTab("farmers")} className={`fsd-tab ${tab === "farmers" ? "fsd-tab-active" : ""}`}>
            Assigned Farmers
          </button>
          <button onClick={() => setTab("deliveries")} className={`fsd-tab ${tab === "deliveries" ? "fsd-tab-active" : ""}`}>
            Active Deliveries
          </button>
          <button onClick={() => setTab("reports")} className={`fsd-tab ${tab === "reports" ? "fsd-tab-active" : ""}`}>
            Field Reports
          </button>
        </div>

      </div>

      <div className="fm-container">
        {tab === "farmers" && (
          <>
            <h2 className="fm-title">Farmer Management</h2>

            <div className="fm-list">
              {farmers.map((farmer, index) => (
                <div className="fm-card" key={index}>

                  {/* Left Section */}
                  <div className="fm-left">
                    <div className="fm-avatar">👤</div>

                    <div>
                      <div className="fm-name">{farmer.name}</div>
                      <div className="fm-meta">
                        <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> {farmer.location} &nbsp;&nbsp;
                        <Home size={14} style={{ display: 'inline', marginRight: 4 }} /> {farmer.crops} &nbsp;&nbsp;
                        <Clock size={14} style={{ display: 'inline', marginRight: 4 }} /> Last visit: {farmer.lastVisit}
                      </div>
                      <div className="fm-note">{farmer.note}</div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="fm-right">
                    <span className={`fm-badge fm-${farmer.statusType}`}>
                      <CheckCircle size={12} style={{ display: 'inline', marginRight: 4 }} /> {farmer.status}
                    </span>

                    <button className="fm-btn fm-btn-outline buttonHover">
                      <Phone size={14} style={{ display: 'inline', marginRight: 4 }} /> Call
                    </button>

                    <button className="fm-btn fm-btn-primary buttonHover" onClick={() => { setSelectedFarmerToVerify(farmer); handleOpen(); }}>
                      <Eye size={14} style={{ display: 'inline', marginRight: 4 }} /> Visit & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "deliveries" && (
          <>
            <h2 className="fm-title">Delivery Support</h2>
            <div className="fm-list">
              {deliveries.map((d, index) => (
                <div className="fm-card" key={index}>
                  <div className="fm-left">
                    <div className="fm-avatar">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <div className="fm-name">Delivery {d.id}</div>
                      <div className="fm-meta">
                        Farmer: {d.farmer} &nbsp;&nbsp;
                        Driver: {d.driver} &nbsp;&nbsp;
                        Weight: {d.weight}
                      </div>
                      <div className="fm-note">Role: {d.note}</div>
                    </div>
                  </div>
                  <div className="fm-right">
                    <span className={`fm-badge fm-${d.statusType}`}>
                      {d.status}
                    </span>
                    <button className="fm-btn fm-btn-outline buttonHover">
                      <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> Track
                    </button>
                    <button className="fm-btn fm-btn-primary" onClick={handleOpen}>
                      <CheckCircle size={14} style={{ display: 'inline', marginRight: 4 }} /> Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "reports" && (
          <>
            <div className="fm-grid">
              <div className="fm-report-card">
                <h2 className="fm-title">Today's Field Report</h2>
                <div className="fm-report-item">
                  <span>Farms Visited</span> <strong>{dashboardStats.fieldVisits}</strong>
                </div>
                <div className="fm-report-item warning">
                  <span>Issues Reported</span> <strong>{dashboardStats.issuesReported}</strong>
                </div>
                <div className="fm-report-item">
                  <span>Deliveries Verified</span> <strong>{dashboardStats.deliveriesAssisted}</strong>
                </div>
                <button className="fm-btn fm-btn-primary fm-full" onClick={handleSubmitDailyReport}>
                  <FileText size={14} style={{ display: 'inline', marginRight: 4 }} /> Submit Daily Report
                </button>
              </div>
              <div className="fm-report-card">
                <h2 className="fm-title">Quick Actions</h2>
                <div className="fm-quick-actions">
                  <button className="fm-btn fm-btn-outline fm-full buttonHover">
                    <FileText size={14} style={{ display: 'inline', marginRight: 4 }} /> Upload Field Photos
                  </button>
                  <button className="fm-btn fm-btn-outline fm-full buttonHover">
                    <AlertTriangle size={14} style={{ display: 'inline', marginRight: 4 }} /> Report Issue
                  </button>
                  <button className="fm-btn fm-btn-outline fm-full buttonHover">
                    <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> Update Location
                  </button>
                  <button className="fm-btn fm-btn-outline fm-full buttonHover">
                    <Phone size={14} style={{ display: 'inline', marginRight: 4 }} /> Emergency Contact
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="fvr-container">

            {/* Header */}
            <div className="fvr-header">
              <div>
                <h2 className="fvr-title">📄 Field Verification Report</h2>
                <p className="fvr-subtitle">
                  Nodani: {selectedFarmerToVerify?.nod_id || "N/A"} • Farmer: {selectedFarmerToVerify?.name || "N/A"}
                </p>
              </div>
            </div>

            {/* GPS Section */}
            <div className="fvr-card">
              <div className="fvr-section-title">📍 GPS Tracking (Mandatory)</div>
              {gpsLocation ? (
                <div style={{ color: "green", fontWeight: "bold" }}>
                  ✔ Location Captured ({gpsLocation.lat.toFixed(4)}, {gpsLocation.lng.toFixed(4)})
                </div>
              ) : (
                <button className="fvr-btn fvr-btn-outline" onClick={handleStartGPS}>
                  📍 Start GPS Tracking
                </button>
              )}
            </div>

            {/* Checklist */}
            <div className="fvr-card">
              <div className="fvr-section-title">🌱 Verification Checklist</div>

              {[
                { key: "plantation", label: "Plantation date verified" },
                { key: "crop", label: "Crop variety confirmed (CO-265)" },
                { key: "area", label: "Field area matches records (2.5 acres)" },
                { key: "growth", label: "Healthy growth observed" },
                { key: "pest", label: "No major pest/disease issues" },
              ].map((item) => (
                <label key={item.key} className="fvr-checkbox">
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    onChange={() => toggleCheck(item.key)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            {/* Photo */}
            <div className="fvr-card">
              <div className="fvr-section-title">📷 Photo Documentation (Mandatory)</div>
              <input
                type="file"
                name="image"
                id="verification-image"
                accept="image/*"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              <button
                className={`fvr-btn ${form.image ? "fvr-btn-success" : "fvr-btn-outline"}`}
                onClick={() => document.getElementById('verification-image').click()}
                style={{ width: '100%', background: form.image ? '#dcfce7' : '' }}
              >
                {form.image ? "✔ Photo Captured" : "⬆ Capture Photo"}
              </button>
              {form.image && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <img src={form.image} alt="Verification" style={{ maxWidth: '100%', borderRadius: '8px', height: '100px', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            {/* Dropdown */}
            <div className="fvr-field">
              <label>Overall Crop Condition <span>*</span></label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
              >
                <option value="">Select condition</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Notes */}
            <div className="fvr-field">
              <label>Field Notes <span>*</span></label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Observations, recommendations..."
              />
            </div>

            {/* Submit */}
            <button className="fvr-btn fvr-btn-primary" onClick={handleSubmitVerification}>
              ✔ Submit Verification Report
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Field;
