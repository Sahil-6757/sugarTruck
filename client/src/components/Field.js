import React, { useState } from "react";
import {  MapPin, Clock, CheckCircle, Phone, Eye,
    FileText, AlertTriangle, Home, 
    Clock1,
    Users} from "lucide-react";
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
  });

  const toggleCheck = (key) => {
    setChecklist({ ...checklist, [key]: !checklist[key] });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,

};

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

   const farmers = [
    {
      name: "Suresh Patil",
      location: "Field A, Kolhapur",
      crops: "2 crops",
      lastVisit: "15/01/2024",
      status: "HARVEST READY",
      statusType: "success",
      note: "Pickup verification required",
    },
    {
      name: "Ramesh Jadhav",
      location: "Field B, Sangli",
      crops: "1 crops",
      lastVisit: "10/01/2024",
      status: "PEST CONTROL NEEDED",
      statusType: "warning",
      note: "Field inspection due",
    },
    {
      name: "Prakash More",
      location: "Field C, Satara",
      crops: "3 crops",
      lastVisit: "08/01/2024",
      status: "GROWING WELL",
      statusType: "info",
      note: "Scheduled visit in 2 days",
    },
  ];

  const deliveries = [
    {
      id: "D001",
      farmer: "Suresh Patil",
      driver: "Rajesh Kumar",
      weight: "45 tons",
      status: "PICKUP IN-PROGRESS",
      statusType: "warning",
      note: "Verification Required"
    },
    {
      id: "D002",
      farmer: "Vikram Shinde",
      driver: "Amit Desai",
      weight: "38 tons",
      status: "SCHEDULED",
      statusType: "info",
      note: "Standby"
    }
  ];

   const cards = [
    {
      title: "Assigned Farmers",
      value: 12,
      sub: "",
      icon: <Users />,
    },
    {
      title: "Field Visits",
      value: 8,
      sub: "This week",
      icon: <MapPin />,
    },
    {
      title: "Pending Tasks",
      value: 5,
      sub: "Requires attention",
      icon: <Clock1 />,
      highlight: true,
    },
    {
      title: "Deliveries Assisted",
      value: 23,
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
          <p className="fsd-subtitle">Welcome back, Mahesh Kale</p>
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
                  className={`fsd-card-sub ${
                    card.highlight ? "fsd-warning" : ""
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
                        <MapPin size={14} style={{display:'inline', marginRight:4}} /> {farmer.location} &nbsp;&nbsp; 
                        <Home size={14} style={{display:'inline', marginRight:4}} /> {farmer.crops} &nbsp;&nbsp; 
                        <Clock size={14} style={{display:'inline', marginRight:4}} /> Last visit: {farmer.lastVisit}
                      </div>
                      <div className="fm-note">{farmer.note}</div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="fm-right">
                    <span className={`fm-badge fm-${farmer.statusType}`}>
                      <CheckCircle size={12} style={{display:'inline', marginRight:4}} /> {farmer.status}
                    </span>

                    <button className="fm-btn fm-btn-outline buttonHover">
                      <Phone size={14} style={{display:'inline', marginRight:4}} /> Call
                    </button>

                    <button className="fm-btn fm-btn-primary buttonHover" onClick={handleOpen}>
                      <Eye size={14} style={{display:'inline', marginRight:4}} /> Visit & Verify
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
                      <MapPin size={14} style={{display:'inline', marginRight:4}} /> Track
                    </button>
                    <button className="fm-btn fm-btn-primary" onClick={handleOpen}>
                      <CheckCircle size={14} style={{display:'inline', marginRight:4}} /> Verify
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
                  <span>Farms Visited</span> <strong>3</strong>
                </div>
                <div className="fm-report-item warning">
                  <span>Issues Reported</span> <strong>2</strong>
                </div>
                <div className="fm-report-item">
                  <span>Deliveries Verified</span> <strong>1</strong>
                </div>
                <button className="fm-btn fm-btn-primary fm-full">
                  <FileText size={14} style={{display:'inline', marginRight:4}} /> Submit Daily Report
                </button>
              </div>
              <div className="fm-report-card">
                <h2 className="fm-title">Quick Actions</h2>
                <div className="fm-quick-actions">
                  <button className="fm-btn fm-btn-outline fm-full buttonHover">
                    <FileText size={14} style={{display:'inline', marginRight:4}} /> Upload Field Photos
                  </button>
                  <button className="fm-btn fm-btn-outline fm-full buttonHover">
                    <AlertTriangle size={14} style={{display:'inline', marginRight:4}} /> Report Issue
                  </button>
                  <button className="fm-btn fm-btn-outline fm-full buttonHover">
                    <MapPin size={14} style={{display:'inline', marginRight:4}} /> Update Location
                  </button>
                  <button className="fm-btn fm-btn-outline fm-full buttonHover">
                    <Phone size={14} style={{display:'inline', marginRight:4}} /> Emergency Contact
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
            Nodani: NOD-2024-001 • Farmer: Suresh Patil
          </p>
        </div>
        <button className="fvr-close">✕</button>
      </div>

      {/* GPS Section */}
      <div className="fvr-card">
        <div className="fvr-section-title">📍 GPS Tracking (Mandatory)</div>
        <button className="fvr-btn fvr-btn-outline">
          📍 Start GPS Tracking
        </button>
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
            {item.label}
          </label>
        ))}
      </div>

      {/* Photo */}
      <div className="fvr-card">
        <div className="fvr-section-title">📷 Photo Documentation</div>
        <button className="fvr-btn fvr-btn-outline">
          ⬆ Capture Photo
        </button>
      </div>

      {/* Dropdown */}
      <div className="fvr-field">
        <label>Overall Crop Condition</label>
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
        <label>Field Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Observations, recommendations..."
        />
      </div>

      {/* Submit */}
      <button className="fvr-btn fvr-btn-primary">
        ✔ Submit Verification Report
      </button>
    </div>
  </Box>
</Modal>
    </div>
  );
}

export default Field;
