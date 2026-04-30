import React, { useState } from 'react'
import {
  FaSeedling, FaMapMarkerAlt, FaTruck, FaDollarSign,
  FaPlus, FaTimes, FaCheckCircle, FaUpload, FaStar,FaLeaf,  FaExclamationTriangle
} from "react-icons/fa";

import '../css/farmer.css'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
function Farmer() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const [openRate, setOpenRate] = useState(false);
  const [openHarvest,setopenHarvest] = useState(false)
  const handleopenHarvest = ()=>setopenHarvest(true)
  const handlecloseHarvest = ()=>setopenHarvest(false)
  const handleCloseRate = () => setOpenRate(false);
  const handleOpen = () => setOpen(true);
  const [hover, setHover] = useState(0);
  const handleOpenRate = () => setOpenRate(true);
  const handleClose = () => setOpen(false);
  const data = {
    name: "Suresh Patil",
    totalCrops: 2,
    totalArea: "4.3 acres",
    deliveries: 1,
    earnings: "₹2,45,000",
  };

  const navigation = useNavigate()


  const [ratings, setRatings] = useState({
    overall: 0,
    behavior: 0,
    timeliness: 0,
    handling: 0,
  });
  const [comment, setComment] = useState("");
  const StarRating = ({ value, onChange }) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`star ${index < (hover || value) ? "filled" : ""}`}
            onMouseEnter={() => setHover(index + 1)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(index + 1)}
          />
        ))}
        <span className="rating-value">{value || 0}/5</span>
      </div>
    );
  };

  const [form, setForm] = useState({
    variety: "CO-0238",
    date: "",
    fieldName: "",
    area: "",
    unit: "Acres",
    soil: "",
    irrigation: "",
    notes: "",
  });

  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 📍 GPS
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        alert("Location captured!");
      },
      () => alert("Location access denied")
    );
  };

  // 📷 Image Upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    console.log({ form, location, image });
    alert("Crop Created (static)");
  };


  const crops = [
    {
      title: "Field A - North Block",
      date: "3/15/2024",
      status: "READY FOR HARVEST",
      statusType: "green",
      ref: "NOD-2024-001",
      variety: "CO-265",
      area: "2.5 acres",
      days: 160,
      yield: "45 tons",
      verify: "verified",
      verifyType: "green",
      progress: 100,
    },
    {
      title: "Field B - South Block",
      date: "5/20/2024",
      status: "PEST CONTROL DUE",
      statusType: "yellow",
      ref: "NOD-2024-002",
      variety: "CO-86032",
      area: "1.8 acres",
      days: 95,
      yield: "32 tons",
      verify: "pending",
      verifyType: "yellow",
      progress: 70,
    },
  ];


  return (
    <>
    {
     
        <>
        <div className="dashboard">

        {/* HEADER */}
      <Navbar/>

        {/* MAIN */}
        <div className="container">

          <div className="header-row">
            <div>
              <h1>Farmer Dashboard</h1>
              <p>Welcome back, {data.name}</p>
            </div>

            <div className="actions">
              <button className="primary" onClick={handleOpen}>
                <FaPlus /> Add New Crop
              </button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <div className="modal">
                    <div className="modal-card">

                      {/* HEADER */}
                      <div className="modal-header">
                        <div>
                          <h2 className='text-center'>🌱 New Crop Nodani Entry</h2>
                          <p className='text-center'>Register a new sugarcane crop for tracking</p>
                        </div>
                      </div>

                      {/* CROP DETAILS */}
                      <div className="section">
                        <h3><FaSeedling /> Crop Details</h3>

                        <label>Crop Variety *</label>
                        <select name="variety" value={form.variety} onChange={handleChange}>
                          <option>CO-0238</option>
                          <option>CO-265</option>
                          <option>CO-86032</option>
                        </select>

                        <div className="form-row">
                          <div>
                            <label>Plantation Date *</label>
                            <input type="date" name="date" onChange={handleChange} />
                          </div>
                          <div>
                            <label>Field / Plot Name</label>
                            <input
                              type="text"
                              name="fieldName"
                              placeholder="e.g., Field A - North"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div>
                            <label>Area *</label>
                            <div className="area-group">
                              <input
                                type="number"
                                name="area"
                                placeholder="2.5"
                                onChange={handleChange}
                              />
                              <select name="unit" onChange={handleChange}>
                                <option>Acres</option>
                                <option>Hectares</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label>Soil Type</label>
                            <select name="soil" onChange={handleChange}>
                              <option value="">Select</option>
                              <option>Clay</option>
                              <option>Sandy</option>
                              <option>Loamy</option>
                            </select>
                          </div>
                        </div>

                        <label>Irrigation Method</label>
                        <select name="irrigation" onChange={handleChange}>
                          <option value="">Select irrigation method</option>
                          <option>Drip</option>
                          <option>Sprinkler</option>
                          <option>Flood</option>
                        </select>
                      </div>

                      {/* GPS */}
                      <div className="section gps">
                        <h3><FaMapMarkerAlt /> GPS Location Tagging</h3>
                        <button onClick={getLocation} className="gps-btn">
                          Tag Current GPS Location
                        </button>
                        {location && (
                          <p className="success">
                            <FaCheckCircle /> {location.lat}, {location.lng}
                          </p>
                        )}
                      </div>

                      {/* PHOTO */}
                      <div className="section">
                        <h3>📷 Photo Upload (Optional)</h3>
                        <label className="upload">
                          <FaUpload /> Add Photo
                          <input type="file" hidden onChange={handleImage} />
                        </label>
                        {image && <img src={image} alt="preview" className="preview" />}
                      </div>

                      {/* NOTES */}
                      <div className="section">
                        <label>Additional Notes</label>
                        <textarea
                          name="notes"
                          placeholder="Any additional information about the crop..."
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      {/* SUBMIT */}
                      <button className="submit" onClick={handleSubmit}>
                        Create Crop Nodani
                      </button>

                    </div>
                  </div>
                </Box>
              </Modal>

              <Modal
                open={openRate}
                onClose={handleCloseRate}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <div className="modal">
                    <div className="modal-card">

                      {/* HEADER */}
                      <div className="modal-header">
                        <h2>💬 Delivery Feedback</h2>
                        <FaTimes className="close" onClick={handleCloseRate} />
                      </div>

                      {/* DELIVERY INFO */}
                      <div className="delivery-info">
                        <div className="icon">
                          <FaTruck />
                        </div>
                        <div>
                          <p className="title">Delivery DEL-0001</p>
                          <p className="sub">Driver: Rajesh Kumar</p>
                        </div>
                      </div>

                      {/* RATINGS */}
                      <div className="rating-block">
                        <div className="rating-item">
                          <label>Overall Experience *</label>
                          <StarRating
                            value={ratings.overall}
                            onChange={(val) => setRatings({ ...ratings, overall: val })}
                          />
                        </div>

                        <div className="rating-item">
                          <label>Driver Behavior</label>
                          <StarRating
                            value={ratings.behavior}
                            onChange={(val) => setRatings({ ...ratings, behavior: val })}
                          />
                        </div>

                        <div className="rating-item">
                          <label>Timeliness</label>
                          <StarRating
                            value={ratings.timeliness}
                            onChange={(val) => setRatings({ ...ratings, timeliness: val })}
                          />
                        </div>

                        <div className="rating-item">
                          <label>Crop Handling</label>
                          <StarRating
                            value={ratings.handling}
                            onChange={(val) => setRatings({ ...ratings, handling: val })}
                          />
                        </div>
                      </div>

                      {/* COMMENT */}
                      <div className="comment">
                        <label>Additional Comments</label>
                        <textarea
                          placeholder="Share your experience..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>

                      {/* SUBMIT */}
                      <button className="submit" onClick={handleSubmit}>
                        <FaCheckCircle /> Submit Feedback
                      </button>

                    </div>
                  </div>
                </Box>
              </Modal>
              <button className="secondary" onClick={handleOpenRate}>Rate Delivery</button>
            </div>
          </div>

          {/* STATS */}
          <div className="stats">

            <div className="card">
              <p>Total Crops</p>
              <h2>{data.totalCrops}</h2>
              <FaSeedling className="icon" />
            </div>

            <div className="card">
              <p>Total Area</p>
              <h2>{data.totalArea}</h2>
              <FaMapMarkerAlt className="icon" />
            </div>

            <div className="card">
              <p>Active Deliveries</p>
              <h2>{data.deliveries}</h2>
              <FaTruck className="icon" />
            </div>

            <div className="card">
              <p>Total Earnings</p>
              <h2>{data.earnings}</h2>
              <FaDollarSign className="icon" />
            </div>

          </div>

          {/* TABS */}
          <div className="tabs">
            <button className="active">Overview</button>
            <button onClick={()=>navigation('/crop-detail')}>Crop Details</button>
            <button onClick={()=>navigation('/delivery')}>Deliveries</button>
          </div>

        </div>
      </div>

      <div className="crop-container">
        {crops.map((data, index) => (
          <div className="crop-card" key={index}>

            {/* HEADER */}
            <div className="crop-header">
              <div>
                <h3>{data.title}</h3>
                <p>Planted on {data.date}</p>
              </div>

              <span className={`status ${data.statusType}`}>
                {data.status}
              </span>
            </div>

            {/* INFO */}
            <div className="crop-info">
              <div>
                <p>Nodani Ref</p>
                <strong>{data.ref}</strong>
              </div>
              <div>
                <p>Variety</p>
                <strong>{data.variety}</strong>
              </div>
              <div>
                <p>Area</p>
                <strong>{data.area}</strong>
              </div>
              <div>
                <p>Days Planted</p>
                <strong>{data.days}</strong>
              </div>
              <div>
                <p>Expected Yield</p>
                <strong>{data.yield}</strong>
              </div>
              <div>
                <p>Verification</p>
                <span className={`badge ${data.verifyType}`}>
                  {data.verify}
                </span>
              </div>
            </div>

            {/* REMINDERS */}
            <div className="reminders">
              <p>Care Reminders</p>
              <div className="reminder-grid">
                <div>
                  <div className="dot green"></div>
                  <p>30D</p>
                  <span>Fertilizer</span>
                </div>
                <div>
                  <div className="dot yellow"></div>
                  <p>90D</p>
                  <span>Irrigation</span>
                </div>
                <div>
                  <div className="dot green"></div>
                  <p>180D</p>
                  <span>Pest-Control</span>
                </div>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="progress-section">
              <div className="progress-top">
                <span>Growth Progress</span>
                <span>{data.progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${data.progress}%` }}
                ></div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="actions">
              <button className="secondary">
                <FaMapMarkerAlt /> View Location
              </button>

              <button onClick={handleopenHarvest} className="primary">
                {data.progress === 100 ? "Harvest Ready" : "Update Status"}
              </button>
            </div>

          </div>
        ))}
         <Modal
        open={openHarvest}
        onClose={handlecloseHarvest}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal">
      <div className="modal-card">

        {/* HEADER */}
        <div className="modal-header">
          <div className="title">
            <FaLeaf />
            <h2>Harvest Ready Declaration</h2>
          </div>
        </div>

        {/* ALERT */}
        <div className="alert">
          <FaExclamationTriangle />
          <p>
            Declaring harvest ready will notify the factory admin and initiate
            the inspection process. Field staff will be assigned for final verification.
          </p>
        </div>

        {/* INFO */}
        <div className="info">
          <div>
            <p>Crop ID</p>
            <strong>CROP-0001</strong>
          </div>
          <div>
            <p>Location</p>
            <strong>Field A - North Block</strong>
          </div>
        </div>

        {/* FORM */}
        <div className="form-group">
          <label>Expected Harvest Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Estimated Yield (tons)</label>
          <input
            type="number"
            name="yield"
            placeholder="e.g., 45"
            value={form.yield}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            name="notes"
            placeholder="Any notes for the inspection team..."
            value={form.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* BUTTON */}
        <button className="submit" onClick={handleSubmit}>
          <FaCheckCircle /> Confirm Harvest Ready
        </button>

      </div>
    </div>
        </Box>
      </Modal>
      </div>
      <div className="delivery-card">

        {/* HEADER */}
        <div className="delivery-header">
          <FaTruck className="header-icon" />
          <h3>Active Deliveries</h3>
        </div>

        {/* DELIVERY ITEM */}
        <div className="delivery-item">

          {/* LEFT */}
          <div className="left">
            <div className="icon-circle">
              <FaTruck />
            </div>
            <div>
              <p className="title">Delivery #1</p>
              <p className="sub">Driver: Rajesh Kumar</p>
            </div>
          </div>

          {/* CENTER */}
          <div className="center">
            <span className="status">In Transit</span>
            <p className="eta">ETA: 2:30 PM</p>
          </div>

          {/* RIGHT */}
          <div className="right">
            <button className="track-btn" onClick={()=>navigation('/delivery')}>Track Live</button>
          </div>
        </div>
      </div>
     
      </>
      
      

      

    }
    
    
     
    </>
  )
}

export default Farmer