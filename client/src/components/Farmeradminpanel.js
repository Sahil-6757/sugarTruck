import React, { useEffect, useState } from 'react'
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
  width: { xs: '94vw', sm: 580 },
  maxWidth: 580,
  bgcolor: '#ffffff',
  borderRadius: '24px',
  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
  p: 0,
  outline: 'none',
  overflow: 'hidden'
};

const DispatchModal = ({ open, handleClose, onSuccess }) => {
  const [form, setForm] = useState({
    farmer: "",
    vehicle: "",
    driver: "",
    date: "",
    time: "",
  });

  const [farmersList, setFarmersList] = useState([]);
  const [harvestReadyFarmers, setHarvestReadyFarmers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [driversList, setDriversList] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const resFarmers = await fetch("http://localhost:8000/getAllFarmers");
          const dataFarmers = await resFarmers.json();
          setFarmersList(dataFarmers);

          const resReady = await fetch("http://localhost:8000/getHarvestReadyFarmers");
          const dataReady = await resReady.json();
          setHarvestReadyFarmers(dataReady);

          const resDrivers = await fetch("http://localhost:8000/getAllDrivers");
          const dataDrivers = await resDrivers.json();
          setDriversList(dataDrivers);

          const v = dataDrivers.map(d => d.vehicle_number || d.vehicle).filter(Boolean);
          setVehicles([...new Set(v)]);
        } catch (error) {
          console.error("Error fetching data for dispatch modal", error);
        }
      };
      fetchData();
    }
  }, [open]);

  const [AssignModalOpen, setAssignModalOpen] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.farmer || !form.vehicle || !form.driver || !form.date) {
      alert("Please fill all required fields");
      return;
    }

    const selectedFarmer = farmersList.find(f => f.name === form.farmer);
    const selectedDriver = driversList.find(d => d.name === form.driver);

    try {
      const response = await fetch("http://localhost:8000/add-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId: selectedFarmer?.id,
          farmerName: form.farmer,
          driverId: selectedDriver?.id,
          driverName: form.driver,
          vehicleNumber: form.vehicle,
          date: form.date,
          time: form.time
        })
      });

      if (response.ok) {
        alert("🚚 Vehicle Dispatched Successfully!");
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        alert("Failed to dispatch vehicle.");
      }
    } catch (error) {
      console.error("Error dispatching vehicle", error);
    }
  };



  return (
    <Modal
      open={open}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '94vw', sm: 640 },
        bgcolor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
        outline: 'none',
        overflow: 'hidden',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <Box className="fw-header" sx={{ p: '24px 32px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: 20, sm: 24 }, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Vehicle Dispatch
          </Typography>
          <FaTimes onClick={handleClose} style={{ cursor: 'pointer', color: '#64748b', fontSize: '20px' }} />
        </Box>

        <Box sx={{ p: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Farmer Selection Section */}
            <div className="fw-section" style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                  <FaUser />
                </div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Farmer Selection</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="fw-label">Harvest Ready (Quick)</label>
                  <select 
                    className="fw-input" 
                    name="farmer" 
                    value={form.farmer} 
                    onChange={handleChange}
                  >
                    <option value="">Choose ready farmer</option>
                    {harvestReadyFarmers.map((f, i) => (
                      <option key={i} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="fw-label">Search All Farmers <span>*</span></label>
                  <select 
                    className="fw-input" 
                    name="farmer" 
                    value={form.farmer} 
                    onChange={handleChange}
                  >
                    <option value="">Select farmer</option>
                    {farmersList.map((f, i) => (
                      <option key={i} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed #e2e8f0' }}></div>

            {/* Logistics Section */}
            <div className="fw-section" style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', background: '#eff6ff', color: '#1e40af', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                  <FaTruck />
                </div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Logistics & Personnel</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="fw-label">Assign Vehicle <span>*</span></label>
                  <select className="fw-input" name="vehicle" value={form.vehicle} onChange={handleChange}>
                    <option value="">Choose truck</option>
                    {vehicles.map((v, i) => (
                      <option key={i} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="fw-label">Assign Driver <span>*</span></label>
                  <select className="fw-input" name="driver" value={form.driver} onChange={handleChange}>
                    <option value="">Choose driver</option>
                    {driversList.map((d, i) => (
                      <option key={i} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed #e2e8f0' }}></div>

            {/* Schedule Section */}
            <div className="fw-section" style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', background: '#fef3c7', color: '#92400e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                  <FaChartBar />
                </div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Dispatch Schedule</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="fw-label">Pickup Date <span>*</span></label>
                  <input className="fw-input" type="date" name="date" value={form.date} onChange={handleChange} />
                </div>
                <div>
                  <label className="fw-label">Pickup Time</label>
                  <input className="fw-input" type="time" name="time" value={form.time} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button 
              className="fw-confirm-btn" 
              style={{ width: '100%', margin: '16px 0 0' }}
              onClick={handleSubmit}
            >
              ✔ Dispatch Vehicle & Notify
            </button>
          </div>
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
    <Modal
      open={open}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '94vw', sm: 700 },
        bgcolor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
        outline: 'none',
        overflow: 'hidden',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <Box className="fw-header" sx={{ p: '24px 32px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: 20, sm: 24 }, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Farmer Registration
          </Typography>
          <FaTimes onClick={handleClose} style={{ cursor: 'pointer', color: '#64748b', fontSize: '20px' }} />
        </Box>

        <div className="fr-container">

          {/* Stepper */}
          <div className="fr-stepper">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="fr-step-item">
                  <div className={`fr-step-circle ${step >= s.num ? "fr-active" : ""}`}>
                    {step > s.num ? <FaCheckCircle /> : s.num}
                  </div>
                  <span className={`fr-step-label ${step >= s.num ? "fr-active-text" : ""}`}>
                    {s.label}
                  </span>
                </div>

                {i < 2 && (
                  <div className={`fr-step-line ${step > s.num ? "fr-line-active" : ""}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form Box */}
          <div className="fr-form-box">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="fr-form">
                <div className="fr-section-title">
                  <FaUser /> Personal Information
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="fw-label">Full Name <span>*</span></label>
                    <input
                      type='text'
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className="fw-input"
                      placeholder="Enter farmer's full name"
                    />
                  </div>

                  <div>
                    <label className="fw-label">Mobile Number <span>*</span></label>
                    <div className="fr-mobile-row">
                      <input value="+91" disabled className="fw-input fr-prefix" />
                      <input
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        className="fw-input"
                        placeholder="9876543210"
                        maxLength={10}
                      />
                      <button className="btn" style={{ height: '52px', padding: '0 20px', whiteSpace: 'nowrap' }}>
                        Send OTP
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="fw-label">Aadhaar Number <span>*</span></label>
                    <input
                      name="aadhaarNumber"
                      value={form.aadhaarNumber}
                      maxLength={12}
                      onChange={handleChange}
                      className="fw-input"
                      placeholder="XXXX XXXX XXXX"
                    />
                  </div>
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
                  <div>
                    <label className="fw-label">Village <span>*</span></label>
                    <input className="fw-input" name="village" value={form.village} onChange={handleChange} placeholder="Village name" />
                  </div>

                  <div>
                    <label className="fw-label">Taluka <span>*</span></label>
                    <input className="fw-input" name="taluka" value={form.taluka} onChange={handleChange} placeholder="Taluka name" />
                  </div>

                  <div>
                    <label className="fw-label">District <span>*</span></label>
                    <input className="fw-input" name="district" value={form.district} onChange={handleChange} placeholder="District name" />
                  </div>

                  <div>
                    <label className="fw-label">State</label>
                    <input className="fw-input" name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
                  </div>

                  <div className="fr-field fr-full">
                    <label className="fw-label">PIN Code <span>*</span></label>
                    <input className="fw-input" name="pinCode" value={form.pinCode} maxLength={6} onChange={handleChange} placeholder="6-digit PIN code" />
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="fw-label">Bank Name <span>*</span></label>
                    <input className="fw-input" name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g., State Bank of India" />
                  </div>

                  <div>
                    <label className="fw-label">Account Holder Name <span>*</span></label>
                    <input className="fw-input" name="accountHolderName" value={form.accountHolderName} onChange={handleChange} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label className="fw-label">Account Number <span>*</span></label>
                      <input className="fw-input" name="accountNumber" value={form.accountNumber} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="fw-label">IFSC Code <span>*</span></label>
                      <input className="fw-input" name="ifscCode" value={form.ifscCode} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="fr-footer">
            {step > 1 ? (
              <button className="fr-btn fr-btn-outline" onClick={prevStep}>
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button className="fr-btn fr-btn-green" onClick={nextStep}>
                Next Step
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

  const [openAddcrops, setopenAddcrops] = useState(false);
  const handleCloseAddcrops = () => setopenAddcrops(false);


  const [openRecord, setOpenRecord] = useState(false);
  const [pendingWeighments, setPendingWeighments] = useState([]);
  const [selectedDeliveryForWeighment, setSelectedDeliveryForWeighment] = useState(null);
  const [weighmentForm, setWeighmentForm] = useState({
    grossWeight: "",
    tareWeight: ""
  });

  const handleRecord = async () => {
    try {
      const response = await fetch("http://localhost:8000/get-pending-weighments");
      const data = await response.json();
      setPendingWeighments(data);
      setOpenRecord(true);
    } catch (error) {
      console.log(error);
    }
  };

  const closeRecord = () => {
    setOpenRecord(false);
    setSelectedDeliveryForWeighment(null);
    setWeighmentForm({ grossWeight: "", tareWeight: "" });
  };

  const handleSubmitWeighment = async () => {
    if (!selectedDeliveryForWeighment || !weighmentForm.grossWeight || !weighmentForm.tareWeight) {
      alert("Please select a delivery and enter both weights.");
      return;
    }

    const netWeight = (parseFloat(weighmentForm.grossWeight) - parseFloat(weighmentForm.tareWeight)).toFixed(2);

    try {
      const response = await fetch(`http://localhost:8000/update-weighment/${selectedDeliveryForWeighment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grossWeight: weighmentForm.grossWeight,
          tareWeight: weighmentForm.tareWeight,
          netWeight: netWeight
        })
      });

      if (response.ok) {
        alert("⚖️ Weighment Recorded Successfully!");
        closeRecord();
        fetchAdminDeliveries();
        fetchStats();
      } else {
        alert("Failed to record weighment.");
      }
    } catch (error) {
      console.error("Error updating weighment", error);
    }
  };

  const [tab, setTab] = useState("farmers");

  const [openView, setopenView] = useState(false)
  const [selectedFarmerForView, setSelectedFarmerForView] = useState(null)
  const openViewmodel = (f) => {
    setSelectedFarmerForView(f);
    setopenView(true);
  }
  const closeView = () => {
    setopenView(false);
    setSelectedFarmerForView(null);
  }
  const [AssignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");

  const [crops, setCrops] = useState("");
  const [cropsData, setcropsData] = useState([])
  const handleCrops = async () => {
    if (!crops) {
      alert("Enter Crop")
    }
    else {
      try {
        const response = await fetch("http://localhost:8000/addCrops", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ crop: crops })
        });

        const data = await response.json();
        setcropsData(data.crops);
        setCrops("")

      } catch (error) {
        console.log(error);
      }
    }
  };

  const [adminDeliveries, setAdminDeliveries] = useState([]);

  const fetchAdminDeliveries = async () => {
    try {
      const response = await fetch("http://localhost:8000/get-deliveries");
      const data = await response.json();
      setAdminDeliveries(data.map(d => ({
        id: "DEL-" + String(d.id).padStart(4, '0'),
        farmer: d.farmer_name,
        driver: d.driver_name,
        tons: d.weight || "Pending",
        route: "Field → Factory",
        status: d.status,
        color: d.status === "COMPLETED" ? "green" : d.status === "SCHEDULED" ? "orange" : "blue"
      })));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCrop = async (id) => {

    try {

      const response = await fetch(`http://localhost:8000/deleteCrop/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();
      setcropsData(data.crops);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCrops = async () => {
    try {
      const response = await fetch("http://localhost:8000/getCrops");
      const data = await response.json();
      setcropsData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const [farmers, setFarmers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalFarmers: 0,
    activeCrops: 0,
    pendingDeliveries: 0,
    monthlyRevenue: "₹0.0L"
  });

  const [staffList, setStaffList] = useState([]);
  const [selectedFarmerForStaff, setSelectedFarmerForStaff] = useState(null);

  const fetchAdminFarmers = async () => {
    try {
      const response = await fetch("http://localhost:8000/admin/farmers");
      const data = await response.json();
      setFarmers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/admin/dashboard-stats");
      const data = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch("http://localhost:8000/getAllFieldStaff");
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssignStaffSubmit = async () => {
    try {
      await fetch("http://localhost:8000/assignStaff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: selectedFarmerForStaff.id,
          staff_id: selectedStaff
        })
      });
      setAssignModalOpen(false);
      setSelectedStaff("");
      alert("Staff assigned successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCrops();
    fetchAdminFarmers();
    fetchStats();
    fetchStaff();
    fetchAdminDeliveries();
  }, []);


  const stats = [
    {
      title: "Total Farmers",
      value: dashboardStats.totalFarmers,
      sub: "Active users",
      icon: <FaUsers />,
      color: "green",
    },
    {
      title: "Active Crops",
      value: dashboardStats.activeCrops,
      sub: `across ${dashboardStats.totalFarmers} farms`,
      icon: <FaChartBar />,
      color: "blue",
    },
    {
      title: "Pending Deliveries",
      value: dashboardStats.pendingDeliveries,
      sub: "Requires attention",
      icon: <FaTruck />,
      color: "orange",
    },
    {
      title: "Monthly Revenue",
      value: dashboardStats.monthlyRevenue,
      sub: "This month",
      icon: <FaDollarSign />,
      color: "green",
    },
  ];




  const handleAddcrops = () => {
    setopenAddcrops(true)
  }

  const handleaddFarmer = () => {
    setOpenAddFarmer(true);
  }

  return (
    <>
      <div className="admin-page">
        <Navbar />

        {/* HEADER */}
        <div className="admin-header">

          <div>
            <h1>Factory Admin Panel</h1>
            <p>Manage farmers, crops, and deliveries</p>
          </div>

          <div className="actions">
            <button className="btn buttonHover" onClick={handleAddcrops}>
              <FaUserPlus /> Add Crops
            </button>



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

        {/* TABS */}
        <div className="tabs" style={{ inlineSize: "-webkit-fill-available" }}>

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
                  {f.status === "VERIFIED & READY" && f.verifiedBy && (
                    <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'right', marginTop: "6px" }}>
                      Verified by: <strong>{f.verifiedBy}</strong>
                    </div>
                  )}
                  <button className='buttonHover' onClick={() => openViewmodel(f)}><FaEye /> View</button>
                  <button className='buttonHover' onClick={() => { setSelectedFarmerForStaff(f); setAssignModalOpen(true); }}><FaUserPlus /> Assign Staff</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Modal
          open={openView}
          onClose={closeView}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(8px)'
              }
            }
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '94vw', sm: 520 },
            bgcolor: 'background.paper',
            borderRadius: '24px',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            outline: 'none',
            fontFamily: "'Outfit', sans-serif"
          }}>
            <Box className="fw-header" sx={{ p: '24px 32px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: 20, sm: 24 }, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Inspection Details
              </Typography>
              <FaTimes onClick={closeView} style={{ cursor: 'pointer', color: '#64748b', fontSize: '20px' }} />
            </Box>

            <Box sx={{ p: 4 }}>
              {selectedFarmerForView ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Farmer Info Card */}
                  <div className="stat-card" style={{ padding: '16px', boxShadow: 'none', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <div className="left" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div className="avatar" style={{ background: 'var(--primary-gradient)', color: 'white' }}>
                        <FaUser />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{selectedFarmerForView.name}</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>{selectedFarmerForView.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="card" style={{ padding: '16px', boxShadow: 'none', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>Status</p>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#15803d' }}>{selectedFarmerForView.status}</h3>
                    </div>
                    <div className="card" style={{ padding: '16px', boxShadow: 'none', background: '#eff6ff', border: '1px solid #dbeafe' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '4px' }}>Crop ID</p>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1d4ed8' }}>{selectedFarmerForView.nod_id}</h3>
                    </div>
                  </div>

                  {/* Report Section */}
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ background: '#f8fafc', padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#475569' }}>Verification Report</h4>
                    </div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="monthly-row" style={{ padding: '8px 0' }}>
                        <span className="monthly-label">Inspected By</span>
                        <strong className="monthly-value">{selectedFarmerForView.verifiedBy || 'Not Verified'}</strong>
                      </div>
                      <div className="monthly-row" style={{ padding: '8px 0' }}>
                        <span className="monthly-label">Date</span>
                        <strong className="monthly-value">{selectedFarmerForView.verifiedAt ? new Date(selectedFarmerForView.verifiedAt).toLocaleDateString() : 'N/A'}</strong>
                      </div>
                      <div className="monthly-row" style={{ padding: '8px 0', border: 'none' }}>
                        <span className="monthly-label">Condition</span>
                        <span className={`badge ${selectedFarmerForView.verificationCondition === 'good' ? 'green' : selectedFarmerForView.verificationCondition === 'average' ? 'orange' : 'red'}`}>
                          {selectedFarmerForView.verificationCondition || 'N/A'}
                        </span>
                      </div>
                      
                      {selectedFarmerForView.verificationNotes && (
                        <div style={{ marginTop: '12px', padding: '16px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #cbd5e1' }}>
                          <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Inspector Notes</p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                            "{selectedFarmerForView.verificationNotes}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button className="btn" onClick={closeView} style={{ padding: '10px 30px' }}>Close</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  Loading farmer details...
                </div>
              )}
            </Box>
          </Box>
        </Modal>

        {/* DELIVERIES */}
        {tab === "deliveries" && (
          <div className="card">
            <h2>Delivery Management</h2>

            {adminDeliveries.map((d, i) => (
              <div className="row" key={i}>
                <div className="left">
                  <div className="avatar"><FaTruck /></div>
                  <div>
                    <h4>{d.id}</h4>
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
              <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>Monthly Performance</h2>
              <div className="monthly-row">
                <span className="monthly-label">Total Deliveries</span>
                <strong className="monthly-value">156</strong>
              </div>
              <div className="monthly-row">
                <span className="monthly-label">Average Delivery Time</span>
                <strong className="monthly-value">2.4 hours</strong>
              </div>
              <div className="monthly-row">
                <span className="monthly-label">Total Volume Processed</span>
                <strong className="monthly-value">4,250 tons</strong>
              </div>
              <div className="monthly-row">
                <span className="monthly-label">Payment Settlement Rate</span>
                <strong className="monthly-value">98.5%</strong>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>Top Performing Farmers</h2>

              <div className="rank-list">
                <div className="rank-item">
                  <div className="rank-number">1</div>
                  <div className="rank-info">
                    <h4>Suresh Patil</h4>
                    <p>Kolhapur</p>
                  </div>
                  <div className="rank-stat">
                    <strong>4.3 acres</strong>
                  </div>
                </div>

                <div className="rank-item">
                  <div className="rank-number">2</div>
                  <div className="rank-info">
                    <h4>Ramesh Jadhav</h4>
                    <p>Sangli</p>
                  </div>
                  <div className="rank-stat">
                    <strong>2.8 acres</strong>
                  </div>
                </div>

                <div className="rank-item">
                  <div className="rank-number">3</div>
                  <div className="rank-info">
                    <h4>Prakash More</h4>
                    <p>Satara</p>
                  </div>
                  <div className="rank-stat">
                    <strong>5.2 acres</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      <FarmerRegistrationModal open={openAddFarmer} handleClose={handleCloseAddFarmer} />
      <DispatchModal open={open} handleClose={handleClose} onSuccess={() => { fetchAdminDeliveries(); fetchStats(); }} />

      <Modal
        open={openRecord}
        onClose={closeRecord}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)'
            }
          }
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '94vw', sm: 580 },
          maxWidth: 580,
          bgcolor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
          outline: 'none',
          overflow: 'hidden',
          fontFamily: "'Outfit', sans-serif"
        }}>
          <div className="fw-modal">
            <div className="fw-header">
              <div className="fw-title">
                ⚖️ <span>Factory Weighment</span>
              </div>
              <FaTimes onClick={closeRecord} style={{ cursor: 'pointer', color: '#6b7280', fontSize: '20px' }} />
            </div>

            <div className="fw-section" style={{ paddingBottom: 0 }}>
              <label className="fw-label">Select Delivery to Weigh <span>*</span></label>
              <select
                className="fw-input"
                value={selectedDeliveryForWeighment?.id || ""}
                onChange={(e) => {
                  const delivery = pendingWeighments.find(d => d.id === parseInt(e.target.value));
                  setSelectedDeliveryForWeighment(delivery);
                }}
              >
                <option value="">-- Choose Pending Delivery --</option>
                {pendingWeighments.map((d) => (
                  <option key={d.id} value={d.id}>
                    DEL-{String(d.id).padStart(4, '0')} - {d.farmer_name} ({d.vehicle_number})
                  </option>
                ))}
              </select>
            </div>

            {selectedDeliveryForWeighment && (
              <>
                <div className="fw-delivery-card" style={{ marginTop: '24px' }}>
                  <div className="fw-delivery-icon">🚚</div>
                  <div>
                    <div className="fw-delivery-id">Delivery DEL-{String(selectedDeliveryForWeighment.id).padStart(4, '0')}</div>
                    <div className="fw-delivery-meta">
                      Farmer: {selectedDeliveryForWeighment.farmer_name} • Driver: {selectedDeliveryForWeighment.driver_name}
                    </div>
                  </div>
                </div>

                <div className="fw-section" style={{ paddingTop: 0 }}>
                  <div style={{ borderTop: '1px dashed #e2e8f0', margin: '0 0 24px', paddingBottom: '24px' }}></div>
                  <h4 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>⚖️ Weighbridge Entry</h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label className="fw-label">Gross Weight (Tons)</label>
                      <input
                        type="number"
                        placeholder="e.g., 58.50"
                        className="fw-input"
                        value={weighmentForm.grossWeight}
                        onChange={(e) => setWeighmentForm({ ...weighmentForm, grossWeight: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="fw-label">Tare Weight (Tons)</label>
                      <input
                        type="number"
                        placeholder="e.g., 13.20"
                        className="fw-input"
                        value={weighmentForm.tareWeight}
                        onChange={(e) => setWeighmentForm({ ...weighmentForm, tareWeight: e.target.value })}
                      />
                    </div>
                  </div>

                  {weighmentForm.grossWeight && weighmentForm.tareWeight && (
                    <div style={{ marginTop: '24px', padding: '20px', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calculated Net Cane Weight</div>
                      <div style={{ fontSize: '32px', fontWeight: 900, color: '#15803d', marginTop: '4px' }}>
                        {(parseFloat(weighmentForm.grossWeight) - parseFloat(weighmentForm.tareWeight)).toFixed(2)} <span style={{ fontSize: '16px', fontWeight: 700 }}>Tons</span>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  className="fw-confirm-btn" 
                  onClick={handleSubmitWeighment}
                  disabled={!weighmentForm.grossWeight || !weighmentForm.tareWeight}
                >
                  ✔ Confirm & Record Weighment
                </button>
              </>
            )}
          </div>
        </Box>
      </Modal>

      <Modal
        open={AssignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)'
            }
          }
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '94vw', sm: 540 },
          bgcolor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)',
          outline: 'none',
          overflow: 'hidden',
          fontFamily: "'Outfit', sans-serif"
        }}>
          <Box className="fw-header" sx={{ p: '24px 32px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: 20, sm: 24 }, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Assign Field Staff
            </Typography>
            <FaTimes onClick={() => setAssignModalOpen(false)} style={{ cursor: 'pointer', color: '#64748b', fontSize: '20px' }} />
          </Box>

          <Box sx={{ p: 4 }}>
            {/* Info Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ padding: '16px', boxShadow: 'none', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Nodani Ref</p>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{selectedFarmerForStaff?.nod_id || "Multiple"}</h3>
              </div>
              <div className="card" style={{ padding: '16px', boxShadow: 'none', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Farmer Name</p>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{selectedFarmerForStaff?.name || "N/A"}</h3>
              </div>
            </div>

            {/* Selection Area */}
            <div className="fw-section">
              <label className="fw-label" style={{ marginBottom: '10px', display: 'block' }}>
                Select Staff Member <span>*</span>
              </label>
              
              <select
                className="fw-input"
                style={{ width: '100%', cursor: 'pointer' }}
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                <option value="">Choose available staff</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>

            {/* Action Button */}
            <button 
              className="fw-confirm-btn" 
              style={{ margin: '24px 0 0', width: '100%' }}
              disabled={!selectedStaff}
              onClick={handleAssignStaffSubmit}
            >
              ✔ Assign & Notify Staff
            </button>
          </Box>
        </Box>
      </Modal>

      {/* Add crops model */}
      <Modal
        open={openAddcrops}
        onClose={handleCloseAddcrops}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)'
            }
          }
        }}
      >
        <Box sx={style}>
          <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: 18, sm: 20 }, color: '#0f172a' }}>
              Manage Crop Types
            </Typography>
            <FaTimes onClick={handleCloseAddcrops} style={{ cursor: 'pointer', color: '#64748b' }} />
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter new crop name..."
                value={crops}
                onChange={(e) => setCrops(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    bgcolor: '#f8fafc',
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleCrops}
                sx={{
                  bgcolor: '#059669',
                  borderRadius: '10px',
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#047857' }
                }}
              >
                Add
              </Button>
            </Box>

            <Box sx={{ maxHeight: '300px', overflowY: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Crop Name</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cropsData.map((crop, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>{crop.crop_name}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCrop(crop.id)}
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        </Box>
      </Modal>

    </>
  );
};

export default Farmeradminpanel;
