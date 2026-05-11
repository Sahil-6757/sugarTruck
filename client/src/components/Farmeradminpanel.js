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
  width: { xs: '94vw', sm: 470 },
  maxWidth: 470,
  bgcolor: '#ffffff',
  border: '1px solid #dfe5e1',
  borderRadius: 1.2,
  boxShadow: '0 14px 30px rgba(15, 23, 42, 0.18)',
  p: { xs: 2, sm: 2.5 },
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
  const [vehicles, setVehicles] = useState([]);
  const [driversList, setDriversList] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const resFarmers = await fetch("http://localhost:8000/getAllFarmers");
          const dataFarmers = await resFarmers.json();
          setFarmersList(dataFarmers);

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
            {farmersList.map((f, i) => (
              <MenuItem key={i} value={f.name}>
                {f.name}
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
            {driversList.map((d, i) => (
              <MenuItem key={i} value={d.name}>
                {d.name}
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

  const [openAddcrops, setopenAddcrops] = useState(false);
  const handleCloseAddcrops = () => setopenAddcrops(false);


  const [openRecord, setOpenRecord] = useState(false);
  const [AssignModalOpen, setAssignModalOpen] = useState(false);

  const handleRecord = () => setOpenRecord(true);
  const closeRecord = () => setOpenRecord(false)

  const [tab, setTab] = useState("farmers");
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
                  <button className='buttonHover' onClick={() => { setSelectedFarmerForStaff(f); setAssignModalOpen(true); }}><FaUserPlus /> Assign Staff</button>
                </div>
              </div>
            ))}
          </div>
        )}

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
      <DispatchModal open={open} handleClose={handleClose} onSuccess={() => { fetchAdminDeliveries(); fetchStats(); }} />

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
                  <h3 className="drvAssignStaff_value">{selectedFarmerForStaff?.nod_id || "Multiple"}</h3>
                </div>

                <div>
                  <p className="drvAssignStaff_label">Farmer</p>
                  <h3 className="drvAssignStaff_value">{selectedFarmerForStaff?.name || "N/A"}</h3>
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
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>

              {/* Button */}
              <button
                className="drvAssignStaff_btn"
                disabled={!selectedStaff}
                onClick={handleAssignStaffSubmit}
              >
                <FaCheckCircle /> Assign & Notify Staff
              </button>

            </div>
          </div>
        </Box>
      </Modal>

      {/* Add crops model */}
      <Modal
        open={openAddcrops}
        onClose={handleCloseAddcrops}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='addCrops-section'>
            <input type='text' onChange={(e) => setCrops(e.target.value)} value={crops} placeholder='Enter crop' style={{ width: "80%", height: "32px", marginTop: "12px", marginRight: "5px" }} />
            <button className='buttonHover' style={{ width: "20%" }} onClick={handleCrops}>Add crop</button>
          </div>
          <table
            border="1"
            cellPadding="10"
            cellSpacing="0"
            style={{
              width: "100%",
              marginTop: "20px",
              textAlign: "center"
            }}
          >

            <thead>
              <tr>
                <th>Crop Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {
                cropsData?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.crop_name}</td>

                    <td>
                      <button
                        onClick={() => handleDeleteCrop(item.id)}
                        style={{
                          background: "red",
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              }

            </tbody>

          </table>
        </Box>
      </Modal>

    </div>
  )
}

export default Farmeradminpanel
