import React, { useState } from 'react'
import Navbar from './Navbar'
import '../css/farmeradmin.css'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FaUserTie, FaTimes, FaCheckCircle } from "react-icons/fa";

import {
  FaUserPlus,
  FaTruck,
  FaBalanceScale,
  FaUsers,
  FaChartBar,
  FaDollarSign,
  FaEye,
  FaMapMarkerAlt,
  FaUser,
  FaCreditCard,
} from "react-icons/fa";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '94vw', sm: 470 },
  maxWidth: 470,
  bgcolor: '#ffffff',
  border: '1px solid #dfe5e1',
  borderRadius: 1.2,
  boxShadow: '0 14px 30px rgba(15, 23, 42, 0.18)',
  p: { xs: 2, sm: 2.5 },
};

const DispatchModal = ({ open, handleClose }) => {
  const [form, setForm] = useState({
    farmer: "",
    vehicle: "",
    driver: "",
    date: "",
    time: "",
  });

  const farmers = ["Suresh Patil", "Ramesh Jadhav", "Prakash More"];
  const vehicles = ["MH-12-1234", "MH-14-5678"];
  const drivers = ["Rajesh Kumar", "Amit Sharma"];

  const [AssignModalOpen, setAssignModalOpen] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log(form);

    if (!form.farmer || !form.vehicle || !form.driver || !form.date) {
      alert("Please fill all required fields");
      return;
    }

    alert("🚚 Vehicle Dispatched Successfully!");
    handleClose();
  };



  return (
    <Modal
      open={open}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(17, 24, 39, 0.3)',
          },
        },
      }}
    >
      <Box sx={style}>
        <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
          <Box display="inline-flex" gap={1} alignItems="center">
            {/* <LocalShippingIcon sx={{ color: "#2e7d32", fontSize: 28 }} /> */}
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: 18, sm: 22 } }}>
              Vehicle Dispatch & Delivery Assignment
            </Typography>
          </Box>


        </Box>

        <Box mt={3} display="flex" flexDirection="column" gap={1.8}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1f2937' }}>
            Select Farmer (Harvest Ready) <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
          </Typography>
          <TextField
            select
            name="farmer"
            value={form.farmer}
            onChange={handleChange}
            fullWidth
            size="small"
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => selected || 'Choose farmer',
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
                height: 44,
              },
            }}
          >
            {farmers.map((f, i) => (
              <MenuItem key={i} value={f}>
                {f}
              </MenuItem>
            ))}
          </TextField>

          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1f2937' }}>
            Assign Vehicle <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
          </Typography>
          <TextField
            select
            name="vehicle"
            value={form.vehicle}
            onChange={handleChange}
            fullWidth
            size="small"
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => selected || 'Choose truck',
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
                height: 44,
              },
            }}
          >
            {vehicles.map((v, i) => (
              <MenuItem key={i} value={v}>
                {v}
              </MenuItem>
            ))}
          </TextField>

          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1f2937' }}>
            Assign Driver <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
          </Typography>
          <TextField
            select
            name="driver"
            value={form.driver}
            onChange={handleChange}
            fullWidth
            size="small"
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => selected || 'Choose driver',
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#fff',
                height: 44,
              },
            }}
          >
            {drivers.map((d, i) => (
              <MenuItem key={i} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>

          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Typography sx={{ mb: 0.8, fontSize: 15, fontWeight: 600, color: '#1f2937' }}>
                Pickup Date <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
              </Typography>
              <TextField
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#fff',
                    height: 44,
                  },
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ mb: 0.8, fontSize: 15, fontWeight: 600, color: '#1f2937' }}>
                Pickup Time
              </Typography>
              <TextField
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#fff',
                    height: 44,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckCircleIcon />}
            onClick={handleSubmit}
            sx={{
              mt: 2,
              bgcolor: "#2e7d32",
              height: 44,
              fontWeight: 700,
              borderRadius: 2,
              letterSpacing: 0,
              textTransform: 'none',
              boxShadow: 'none',
              "&:hover": {
                bgcolor: "#1b5e20",
                boxShadow: 'none',
              },
            }}
          >
            Dispatch Vehicle & Notify All
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

const FarmerRegistrationModal = ({ open, handleClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    aadhaarNumber: "",
    village: "",
    taluka: "",
    district: "",
    state: "Maharashtra",
    pinCode: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: ""
  });

  const steps = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Address' },
    { num: 3, label: 'Bank' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    switch (name) {
      case "fullName":
        processedValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case "mobileNumber":
      case "aadhaarNumber":
      case "pinCode":
      case "accountNumber":
        processedValue = value.replace(/\D/g, '');
        break;
      case "ifscCode":
        processedValue = value.toUpperCase();
        break;
      default:
        break;
    }

    setForm((prev) => ({ ...prev, [name]: processedValue }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const onComplete = () => {
    handleClose();
    setStep(1);
  };

  return (
    <Modal open={open} onClose={handleClose} slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(17, 24, 39, 0.3)' } } }}>
      <Box sx={{ ...style, width: { xs: '94vw', sm: 540 }, maxWidth: 540 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="inline-flex" gap={1} alignItems="center">
            {/* <FaUserPlus style={{ color: "#2e7d32", fontSize: 22 }} /> */}
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: 18, sm: 20 }, color: '#1f2937' }}>
              Farmer Registration
            </Typography>
          </Box>

        </Box>

        <div className="fr-container">

          {/* Stepper */}
          <div className="fr-stepper">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="fr-step-item">
                  <div
                    className={`fr-step-circle ${step >= s.num ? "fr-active" : ""
                      }`}
                  >
                    {step > s.num ? <CheckCircleIcon /> : s.num}
                  </div>
                  <span
                    className={`fr-step-label ${step >= s.num ? "fr-active-text" : ""
                      }`}
                  >
                    {s.label}
                  </span>
                </div>

                {i < 2 && (
                  <div
                    className={`fr-step-line ${step > s.num ? "fr-line-active" : ""
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form Box */}
          <div className="fr-form-box">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="fr-form">
                <div className="fr-field">
                  <label>
                    Full Name <span>*</span>
                  </label>
                  <input
                    type='text'
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter farmer's full name"
                  />
                </div>

                <div className="fr-field">
                  <label>
                    Mobile Number <span>*</span>
                  </label>
                  <div className="fr-mobile-row">
                    <input value="+91" disabled className="fr-prefix" />
                    <input
                      name="mobileNumber"
                      value={form.mobileNumber}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                    <button className="fr-btn fr-btn-green">
                      Send OTP
                    </button>
                  </div>
                </div>

                <div className="fr-field">
                  <label>
                    Aadhaar Number <span>*</span>
                  </label>
                  <input
                    name="aadhaarNumber"
                    value={form.aadhaarNumber}
                    maxLength={12}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="fr-form">
                <div className="fr-section-title">
                  <FaMapMarkerAlt /> Address Details
                </div>

                <div className="fr-grid">
                  <div className="fr-field">
                    <label>Village <span>*</span></label>
                    <input name="village" value={form.village} onChange={handleChange} placeholder="Village name" />
                  </div>

                  <div className="fr-field">
                    <label>Taluka <span>*</span></label>
                    <input name="taluka" value={form.taluka} onChange={handleChange} placeholder="Taluka name" />
                  </div>

                  <div className="fr-field">
                    <label>District <span>*</span></label>
                    <input name="district" value={form.district} onChange={handleChange} placeholder="District name" />
                  </div>

                  <div className="fr-field">
                    <label>State</label>
                    <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
                  </div>

                  <div className="fr-field fr-full">
                    <label>PIN Code <span>*</span></label>
                    <input name="pinCode" value={form.pinCode} maxLength={6} onChange={handleChange} placeholder="6-digit PIN code" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="fr-form">
                <div className="fr-section-title">
                  <FaCreditCard /> Bank Account Information
                </div>

                <div className="fr-field">
                  <label>Bank Name <span>*</span></label>
                  <input name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g., State Bank of India" />
                </div>

                <div className="fr-field">
                  <label>Account Holder Name <span>*</span></label>
                  <input name="accountHolderName" value={form.accountHolderName} onChange={handleChange} />
                </div>

                <div className="fr-field">
                  <label>Account Number <span>*</span></label>
                  <input name="accountNumber" value={form.accountNumber} onChange={handleChange} />
                </div>

                <div className="fr-field">
                  <label>IFSC Code <span>*</span></label>
                  <input name="ifscCode" value={form.ifscCode} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="fr-footer">
            {step > 1 && (
              <button className="fr-btn fr-btn-outline" onClick={prevStep}>
                Back
              </button>
            )}

            {step < 3 ? (
              <button className="fr-btn fr-btn-green" onClick={nextStep}>
                Next: {step === 1 ? "Address Details" : "Bank Details"}
              </button>
            ) : (
              <button className="fr-btn fr-btn-green" onClick={onComplete}>
                ✔ Complete Registration
              </button>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

function Farmeradminpanel() {

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openAddFarmer, setOpenAddFarmer] = useState(false);
  const handleCloseAddFarmer = () => setOpenAddFarmer(false);

  const [openRecord, setOpenRecord] = useState(false);
  const [AssignModalOpen, setAssignModalOpen] = useState(false);

  const handleRecord = () => setOpenRecord(true);
  const closeRecord = () => setOpenRecord(false)

  const [tab, setTab] = useState("farmers");
  const [selectedStaff, setSelectedStaff] = useState("");


  const stats = [
    {
      title: "Total Farmers",
      value: "45",
      sub: "+3 this month",
      icon: <FaUsers />,
      color: "green",
    },
    {
      title: "Active Crops",
      value: "78",
      sub: "across 45 farms",
      icon: <FaChartBar />,
      color: "blue",
    },
    {
      title: "Pending Deliveries",
      value: "12",
      sub: "Requires attention",
      icon: <FaTruck />,
      color: "orange",
    },
    {
      title: "Monthly Revenue",
      value: "₹28.5L",
      sub: "+12% vs last month",
      icon: <FaDollarSign />,
      color: "green",
    },
  ];

  const farmers = [
    {
      name: "Suresh Patil",
      location: "Kolhapur",
      crops: 2,
      area: "4.3 acres",
      status: "HARVEST READY",
      color: "green",
    },
    {
      name: "Ramesh Jadhav",
      location: "Sangli",
      crops: 1,
      area: "2.8 acres",
      status: "GROWING",
      color: "blue",
    },
    {
      name: "Prakash More",
      location: "Satara",
      crops: 3,
      area: "5.2 acres",
      status: "PEST CONTROL NEEDED",
      color: "orange",
    },
  ];

  const deliveries = [
    {
      id: "D001",
      farmer: "Suresh Patil",
      driver: "Rajesh Kumar",
      tons: 45,
      route: "Kolhapur → Factory",
      status: "PICKUP CONFIRMED",
      color: "blue",
    },
    {
      id: "D002",
      farmer: "Vikram Shinde",
      driver: "Unassigned",
      tons: 38,
      route: "Sangli → Factory",
      status: "PENDING ASSIGNMENT",
      color: "orange",
    },
  ];


  const handleaddFarmer = () => {
    setOpenAddFarmer(true);
  }

  return (
    <div>
      <Navbar />
      <div className="admin-page">

        {/* HEADER */}
        <div className="admin-header">

          <div>
            <h1>Factory Admin Panel</h1>
            <p>Manage farmers, crops, and deliveries</p>
          </div>

          <div className="actions">
            <button className="btn buttonHover" onClick={handleaddFarmer}>
              <FaUserPlus /> Add Farmer
            </button>

            <button className="btn primary" onClick={handleOpen}>
              <FaTruck />
              Assign Delivery
            </button>

            <button className="btn buttonHover" onClick={handleRecord}>
              <FaBalanceScale /> Record Weighment
            </button>
          </div>

        </div>

        {/* STATS */}
        <div className="stats-grid">
          {stats.map((item, i) => (
            <div className="stat-card" key={i}>
              <div>
                <p className="title">{item.title}</p>
                <h2>{item.value}</h2>
                <span className="sub">{item.sub}</span>
              </div>

              <div className={`icon ${item.color}`}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>

      </div>
      <div className="admin-tabs">

        {/* TABS */}
        <div className="tabs">
          <button onClick={() => setTab("farmers")} className={tab === "farmers" ? "active" : ""}>
            Farmers & Crops
          </button>
          <button onClick={() => setTab("deliveries")} className={tab === "deliveries" ? "active" : ""}>
            Active Deliveries
          </button>
          <button onClick={() => setTab("analytics")} className={tab === "analytics" ? "active" : ""}>
            Analytics
          </button>
        </div>

        {/* FARMERS */}
        {tab === "farmers" && (
          <div className="card">
            <h2>Farmer Management</h2>

            {farmers.map((f, i) => (
              <div className="row" key={i}>
                <div className="left">
                  <div className="avatar"><FaUser /></div>
                  <div>
                    <h4>{f.name}</h4>
                    <p><FaMapMarkerAlt /> {f.location} • {f.crops} crops • {f.area}</p>
                  </div>
                </div>

                <div className="right">
                  <span className={`badge ${f.color}`}>{f.status}</span>
                  <button className='buttonHover'><FaEye /> View</button>
                  <button className='buttonHover' onClick={() => setAssignModalOpen(true)}><FaUserPlus /> Assign Staff</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DELIVERIES */}
        {tab === "deliveries" && (
          <div className="card">
            <h2>Delivery Management</h2>

            {deliveries.map((d, i) => (
              <div className="row" key={i}>
                <div className="left">
                  <div className="avatar"><FaTruck /></div>
                  <div>
                    <h4>Delivery {d.id}</h4>
                    <p>{d.farmer} • {d.driver} • {d.tons} tons</p>
                    <p>{d.route}</p>
                  </div>
                </div>

                <div className="right">
                  <span className={`badge ${d.color}`}>{d.status}</span>
                  <button className='buttonHover'>Track Live</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <div className="analytics">

            <div className="monthly-card">
              <h2>Monthly Performance</h2>
              <p className='monthly-p'>Total Deliveries <strong style={{ marginLeft: '3rem' }}>156</strong></p>
              <p className='monthly-p'>Average Delivery Time <strong>2.4 hours</strong></p>
              <p className='monthly-p'>Total Volume Processed <strong>4,250 tons</strong></p>
              <p className='monthly-p'>Payment Settlement Rate <strong className='text-center'>98.5%</strong></p>
            </div>

            <div className="card">
              <h2>Top Performing Farmers</h2>

              <div className="rank">
                <span>1</span>
                <div style={{ position: "absolute", left: 72 }}>
                  <h4>Suresh Patil</h4>
                  <p>Kolhapur</p>
                </div>
                <div>
                  <strong>4.3 acres</strong>
                </div>
              </div>

              <div className="rank">
                <span>2</span>
                <div style={{ position: "absolute", left: 72 }}>
                  <h4>Ramesh Jadhav</h4>
                  <p>Sangli</p>
                </div>
                <strong style={{ marginLeft: "2rem" }}>2.8 acres</strong>

              </div>

              <div className="rank ">
                <span>3</span>
                <div style={{ position: "absolute", left: 72 }}>
                  <h4>Prakash More</h4>
                  <p>Satara</p>
                </div>
                <strong style={{ marginLeft: "2rem" }}>5.2 acres</strong>
              </div>

            </div>

          </div>
        )}

      </div>

      <FarmerRegistrationModal open={openAddFarmer} handleClose={handleCloseAddFarmer} />
      <DispatchModal open={open} handleClose={handleClose} />

      <Modal
        open={openRecord}
        onClose={closeRecord}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box >
          <div className="fw-modal">
            <div className="fw-header">
              <div className="fw-title">
                ⚖️ <span>Factory Weighment</span>
              </div>
            </div>

            <div className="fw-delivery-card">
              <div className="fw-delivery-icon">🚚</div>
              <div>
                <div className="fw-delivery-id">Delivery DEL-0001</div>
                <div className="fw-delivery-meta">
                  Farmer: Suresh Patil • Crop: CO-265
                </div>
              </div>
            </div>

            <div className="fw-section">
              <div className="fw-section-title">⚖️ Weighbridge Entry</div>

              <label className="fw-label">
                Step 1: Gross Weight (Truck + Cane) in Tons <span>*</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 58.50"
                className="fw-input fw-input-active"
              />

              <label className="fw-label">
                Step 2: Tare Weight (Empty Truck) in Tons <span>*</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 13.20"
                className="fw-input"
              />
            </div>

            <button className="fw-confirm-btn">
              ✔ Confirm Weighment
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={AssignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="drvAssignStaff_overlay">
            <div className="drvAssignStaff_modal">

              {/* Header */}
              <div className="drvAssignStaff_header">
                <div className="drvAssignStaff_titleWrap">
                  <FaUserTie className="drvAssignStaff_icon" />
                  <h2>Assign Field Staff</h2>
                </div>
                <FaTimes className="drvAssignStaff_close" />
              </div>

              {/* Info Box */}
              <div className="drvAssignStaff_infoBox">
                <div>
                  <p className="drvAssignStaff_label">Nodani Ref</p>
                  <h3 className="drvAssignStaff_value">NOD-2024-001</h3>
                </div>

                <div>
                  <p className="drvAssignStaff_label">Farmer</p>
                  <h3 className="drvAssignStaff_value">Suresh Patil</h3>
                </div>
              </div>

              {/* Dropdown */}
              <div className="drvAssignStaff_field">
                <label>
                  Select Staff Member <span>*</span>
                </label>

                <select
                  className="drvAssignStaff_select"
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                >
                  <option value="">Choose available staff</option>
                  <option value="staff1">Ravi Kumar</option>
                  <option value="staff2">Amit Sharma</option>
                  <option value="staff3">Sanjay Patil</option>
                </select>
              </div>

              {/* Button */}
              <button
                className="drvAssignStaff_btn"
                disabled={!selectedStaff}
              >
                <FaCheckCircle /> Assign & Notify Staff
              </button>

            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default Farmeradminpanel
