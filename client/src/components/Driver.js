import React from 'react';
import Navbar from './Navbar'
import '../css/driver.css'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { FaCheckCircle, FaMapMarkerAlt, FaCube, FaTruck, FaFileAlt, FaPhoneAlt, FaClock } from 'react-icons/fa';
function Driver() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [vehicleNumber, setVehicleNumber] = React.useState("");
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);



  const [driverData, setDriverData] = React.useState({
    name: user.name,
    phone: '',
    email: user.email,
    address: '',
    vehicle: '',
  });

  const [driverId, setDriverId] = React.useState(null);
  const [deliveries, setDeliveries] = React.useState([]);

  const handleDriverChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (!/^[0-9]+$/.test(value)) {
        return;
      }
      if (value.length > 10) {
        return;
      }
    }

    if (name === 'address') {
      if (value.length > 255) {
        return;
      }
    }
    if (name === 'vehicle' || name === 'vehicle_number') {
      if (value.length > 255) {
        return;
      }
    }

    setDriverData({
      ...driverData,
      [name]: value
    });
  };

  const getDriversDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/getDrivers",
        {
          params: { email: user.email }
        }
      );

      console.log(response.data);

      if (response.data.length > 0) {
        const data = response.data[0];
        setVehicleNumber(data.vehicle_number);
        setDriverId(data.id);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get("http://localhost:8000/get-deliveries");
      setDeliveries(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getDriversDetails();
    fetchDeliveries();
  }, []);

  const handleDriverSubmit = async () => {
    console.log(driverData);
    try {
      const response = await axios.post('http://localhost:8000/add-driver', driverData);
      console.log(response.data);
      setDriverData({
        name: '',
        phone: '',
        email: '',
        address: '',
        vehicle: '',
      });
      alert('Driver added successfully');
      getDriversDetails();
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  const myDeliveries = deliveries.filter(d => d.driver_id === driverId);
  const todayStr = new Date().toISOString().split('T')[0];
  const tripsToday = myDeliveries.filter(d => {
    if (!d.delivery_date) return false;
    return new Date(d.delivery_date).toISOString().split('T')[0] === todayStr;
  });
  const totalWeight = myDeliveries.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);
  const distanceCovered = myDeliveries.length * 42; // Placeholder for distance
  const earningsToday = tripsToday.length * 850; // Placeholder for earnings

  return (
    <>
      <Navbar role={user.role} />
      <div className="drvDash_container">
        <div className="drvDash_header">
          <div>
            <h1 className="drvDash_title">Driver Dashboard</h1>
            <p className="drvDash_subtitle">Welcome back, {user.name}</p>
          </div>
          <div className="drvDash_vehicle" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div className='AddDriver-btn'>
              <button className='primary buttonHover' onClick={() => handleOpen()}> Add Driver</button>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="drvDash_vehicleLabel">Vehicle Number</span>
              <span className="drvDash_vehicleNumber">{vehicleNumber ? vehicleNumber : "Not Added Yet"}</span>
            </div>
          </div>
        </div>

        <div className="drvDash_cards">
          <div className="drvDash_card">
            <div>
              <p className="drvDash_cardTitle">Today's Trips</p>
              <h2 className="drvDash_cardValue">{tripsToday.length}</h2>
            </div>
            <FaTruck className="drvDash_icon" />
          </div>

          <div className="drvDash_card">
            <div>
              <p className="drvDash_cardTitle">Distance Covered</p>
              <h2 className="drvDash_cardValue">{distanceCovered} km</h2>
            </div>
            <FaMapMarkerAlt className="drvDash_icon" />
          </div>

          <div className="drvDash_card">
            <div>
              <p className="drvDash_cardTitle">Total Weight</p>
              <h2 className="drvDash_cardValue">{totalWeight > 0 ? totalWeight.toFixed(2) : "0"} tons</h2>
            </div>
            <FaCube className="drvDash_icon" />
          </div>

          <div className="drvDash_card">
            <div>
              <p className="drvDash_cardTitle">Earnings Today</p>
              <h2 className="drvDash_cardValue">₹{earningsToday.toLocaleString('en-IN')}</h2>
            </div>
            <FaCheckCircle className="drvDash_icon" />
          </div>
        </div>
      </div>
      <div className="drvAssign_container">

        {/* Assignments Section */}
        <div className="drvAssign_section">
          <h2 className="drvAssign_title">Available Delivery Assignments</h2>

          {deliveries.filter(d => d.driver_id === driverId).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>No deliveries assigned yet.</p>
          ) : (
            deliveries
              .filter(d => d.driver_id === driverId)
              .map((delivery, index) => (
                <div className="drvAssign_card" key={delivery.id}>
                  <div className="drvAssign_left">
                    <div className="drvAssign_iconCircle">
                      <FaTruck />
                    </div>

                    <div>
                      <h3 className="drvAssign_tripId">Trip DEL-{String(delivery.id).padStart(4, '0')}</h3>
                      <p className="drvAssign_info">
                        Farmer: {delivery.farmer_name}
                        <span className="drvAssign_meta">
                          <FaMapMarkerAlt /> 25 km
                        </span>
                        <span className="drvAssign_meta">
                          <FaClock /> 45 min
                        </span>
                      </p>
                      <p className="drvAssign_subInfo">
                        Date: {new Date(delivery.delivery_date).toLocaleDateString()} <b>{delivery.delivery_time || 'N/A'}</b>
                      </p>
                    </div>
                  </div>

                  <div className="drvAssign_right">
                    <span className={delivery.status === 'COMPLETED' ? "drvAssign_badgeAssigned" : "drvAssign_badgeAvailable"}>
                      {delivery.status || 'SCHEDULED'}
                    </span>
                    <p className="drvAssign_time">Pickup: {delivery.delivery_time || 'N/A'}</p>
                    {delivery.status !== 'COMPLETED' ? (
                      <button className="drvAssign_btnPrimary buttonHover" onClick={() => navigate('/trip', { state: { delivery } })}>Start Trip</button>
                    ) : (
                      <button className="drvAssign_btnSecondary" disabled>Completed</button>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Bottom Action Cards */}
        <div className="drvAssign_actions">

          <div className="drvAssign_actionCard">
            <FaMapMarkerAlt className="drvAssign_actionIcon" />
            <h3>Update Location</h3>
            <p>Share current location for accurate tracking</p>
            <button className="drvAssign_actionBtn buttonHover">Update Location</button>
          </div>

          <div className="drvAssign_actionCard">
            <FaPhoneAlt className="drvAssign_actionIcon" />
            <h3>Emergency Contact</h3>
            <p>Contact dispatch or farmer directly</p>
            <button className="drvAssign_actionBtn buttonHover">Call Support</button>
          </div>

          <div className="drvAssign_actionCard">
            <FaFileAlt className="drvAssign_actionIcon buttonHover" />
            <h3>Trip History</h3>
            <p>View completed deliveries and earnings</p>
            <button className="drvAssign_actionBtn buttonHover">View History</button>
          </div>

        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h1>Add Driver</h1>
            <input type='text' name='name' disabled value={driverData.name} onChange={handleDriverChange} placeholder='Driver Name' className='addDriver' />
            <input maxLength={10} name='phone' value={driverData.phone} onChange={handleDriverChange} placeholder='Driver Phone' className='addDriver' />
            <input type='email' name='email' disabled value={driverData.email} onChange={handleDriverChange} placeholder='Driver Email' className='addDriver' />
            <input type='text' name='address' value={driverData.address} onChange={handleDriverChange} placeholder='Driver Address' className='addDriver' />
            <input type='text' name='vehicle' value={driverData.vehicle} onChange={handleDriverChange} placeholder='Driver Vehicle' className='addDriver' />
            <input type='text' name='vehicle_number' value={driverData.vehicle_number} onChange={handleDriverChange} placeholder='Vehicle Number' className='addDriver' />
            <button className='primary buttonHover' onClick={handleDriverSubmit}> Add Driver</button>
          </Box>
        </Modal>
      </div>
    </>
  )
}

export default Driver;