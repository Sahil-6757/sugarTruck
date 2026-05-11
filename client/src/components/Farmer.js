import React, { useEffect, useEffectEvent, useState } from 'react'
import {
  FaSeedling, FaMapMarkerAlt, FaTruck, FaDollarSign,
  FaPlus, FaTimes, FaCheckCircle, FaUpload, FaStar, FaLeaf, FaExclamationTriangle,
  FaTrash
} from "react-icons/fa";
import axios from "axios";
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
  const [openHarvest, setopenHarvest] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState(null)

  const handleopenHarvest = (crop) => {
    setSelectedCrop(crop)
    setopenHarvest(true)
  }
  const handlecloseHarvest = () => setopenHarvest(false)
  const handleCloseRate = () => setOpenRate(false);
  const handleOpen = () => setOpen(true);
  const [hover, setHover] = useState(0);
  const handleOpenRate = () => setOpenRate(true);
  const handleClose = () => setOpen(false);
  const [user, setUser] = useState("");


  const dashboardStats = {
    name: user?.name || "Farmer",
    totalCrops: 0,
    totalArea: "0 acres",
    deliveries: 1,
    earnings: "₹0",
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



  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);



  // 📍 GPS


  // 📷 Image Upload



  const [form, setForm] = useState({
    variety: "",
    date: "",
    fieldName: "",
    area: "",
    unit: "Acres",
    soil: "",
    irrigation: "",
    notes: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };
  const getLocation = () => {

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(latitude, longitude);

        setLocation({
          lat: latitude,
          lng: longitude,
        });

      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

  };

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }

  };



  const handleSubmit = async () => {

    try {

      if (!form.variety || !form.date || !form.fieldName || !form.area) {
        alert("Please fill all required fields");
        return;
      }


      const user = JSON.parse(localStorage.getItem("user"));

      const response = await fetch("http://localhost:8000/addNodani", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,

          farmerId: user.id,
          farmerName: user.name,

          latitude: location?.lat || "",
          longitude: location?.lng || "",
          image
        })
      });

      const data = await response.json();

      console.log(data);

      alert("Nodani Added Successfully");
      setOpen(false); // Close the modal
      if (user && user.id) {
        getNodaniData(user.id); // Refresh the list
      }

    } catch (error) {

      console.log(error);

    }

  };

  const handleHarvestSubmit = async () => {
    try {
      if (!form.date) {
        alert("Please select the expected harvest date");
        return;
      }

      if (!selectedCrop || !selectedCrop.id) {
        alert("No crop selected");
        return;
      }

      const response = await fetch(`http://localhost:8000/declareHarvest/${selectedCrop.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: form.date,
          yield: form.yield,
          notes: form.notes
        })
      });

      const data = await response.json();
      console.log(data);

      alert("Harvest Declaration Submitted Successfully");
      setopenHarvest(false);
      
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        getNodaniData(user.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [crops, setCrops] = useState([]);

  const getNodaniData = async (farmerId) => {
    try {
      const response = await fetch(`http://localhost:8000/getNodani/${farmerId}`);
      const data = await response.json();

      const formattedData = data.map((item, index) => {
        const plantedDate = new Date(item.plantation_date);
        const today = new Date();
        const diffTime = Math.abs(today - plantedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let progress = Math.min(Math.round((diffDays / 365) * 100), 100);

        return {
          title: item.field_name || `Field ${index + 1}`,
          date: plantedDate.toLocaleDateString(),
          status: progress >= 100 ? "READY FOR HARVEST" : "GROWING",
          statusType: progress >= 100 ? "green" : "yellow",
          ref: item.nod_id || `NOD-${new Date(item.created_at).getFullYear()}-${item.id.toString().padStart(3, '0')}`,
          variety: item.variety,
          area: `${item.area} ${item.unit}`,
          days: diffDays || 0,
          yield: "Pending",
          verify: "pending",
          verifyType: "yellow",
          progress: progress,
          id: item.id
        };
      });

      setCrops(formattedData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (e) => {
    console.log(e)
    axios.delete('http://localhost:8000/deleteNodani/' + e).then(res => {
      getCropList()
      getNodaniData(user.id)
    }).catch(err => {
      console.log(err)
    })
  }


  const [cropList, setCropList] = useState()

  const getCropList = async () => {

    try {

      const response = await fetch('http://localhost:8000/getCrops');

      const data = await response.json();

      console.log(data);

      setCropList(data);

    } catch (error) {

      console.log(error);

    }

  }

  useEffect(() => {
    try {
      const getLogin = JSON.parse(localStorage.getItem("user"));
      setUser(getLogin)
      getCropList();
      if (getLogin && getLogin.id) {
        getNodaniData(getLogin.id);
      }
    } catch (error) {
      console.log(error)
    }
  }, [])


  return (
    <>
      {

        <>
          <div className="dashboard">

            {/* HEADER */}
            <Navbar />

            {/* MAIN */}
            <div className="container">

              <div className="header-row">
                <div>
                  <h1>Farmer Dashboard</h1>
                  <p>Welcome back, {user.name}</p>
                </div>

                <div className="actions">
                  <button className="primary buttonHover" onClick={handleOpen}>
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
                              <h2 className='text-center'>New Crop Nodani Entry</h2>
                              <p className='text-center'>Register a new sugarcane crop for tracking</p>
                            </div>
                          </div>

                          {/* CROP DETAILS */}
                          <div className="section">
                            <h3><FaSeedling /> Crop Details</h3>

                            <label>Crop Variety *</label>
                            <select
                              name="variety"
                              value={form.variety}
                              onChange={handleChange}
                            >

                              <option value="">Select Crop</option>

                              {
                                cropList?.map((item) => (
                                  <option
                                    key={item.id}
                                    value={item.crop_name}
                                  >
                                    {item.crop_name}
                                  </option>
                                ))
                              }

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
                            <h2>Delivery Feedback</h2>
                            {/* <FaTimes className="close" onClick={handleCloseRate} /> */}
                          </div>

                          {/* DELIVERY INFO */}
                          <div className="delivery-info">

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
                  <button className="secondary buttonHover" onClick={handleOpenRate}>Rate Delivery</button>
                </div>
              </div>

              {/* STATS */}
              <div className="stats">

                <div className="card">
                  <p>Total Crops</p>
                  <h2 className='frm-Dashboard'>{crops.length}</h2>
                  <FaSeedling className="icon" />
                </div>

                <div className="card">
                  <p>Total Area</p>
                  <h2 className='frm-Dashboard'>
                    {crops.reduce((acc, curr) => acc + (parseFloat(curr.area) || 0), 0)} acres
                  </h2>
                  <FaMapMarkerAlt className="icon" />
                </div>

                <div className="card">
                  <p>Active Deliveries</p>
                  <h2 className='frm-Dashboard'>{dashboardStats.deliveries}</h2>
                  <FaTruck className="icon" />
                </div>

                <div className="card">
                  <p>Total Earnings</p>
                  <h2 className='frm-Dashboard'>{dashboardStats.earnings}</h2>
                  <FaDollarSign className="icon" />
                </div>

              </div>

              {/* TABS */}
              <div className="tabs">
                <button className="active">Overview</button>
                <button onClick={() => navigation('/crop-detail')}>Crop Details</button>
                <button onClick={() => navigation('/delivery')}>Deliveries</button>
              </div>

            </div>
          </div>

          <div className="crop-container">
            {crops.map((item, index) => (
              <div className="crop-card" key={index}>

                {/* HEADER */}
                <div className="crop-header">
                  <div>
                    <h3>{item.title}</h3>
                    <p>Planted on {item.date}</p>
                  </div>

                  <span className={`status ${item.statusType}`}>
                    {item.status}
                  </span>
                  <span className='delete-btn'>
                    <FaTrash color='red' onClick={() => handleDelete(item.id)} />
                  </span>
                </div>

                {/* INFO */}
                <div className="crop-info">
                  <div>
                    <p>Nodani Ref</p>
                    <strong>{item.ref}</strong>
                  </div>
                  <div>
                    <p>Variety</p>
                    <strong>{item.variety}</strong>
                  </div>
                  <div>
                    <p>Area</p>
                    <strong>{item.area}</strong>
                  </div>
                  <div>
                    <p>Days Planted</p>
                    <strong>{item.days}</strong>
                  </div>
                  <div>
                    <p>Expected Yield</p>
                    <strong>{item.yield}</strong>
                  </div>
                  <div>
                    <p>Verification</p>
                    <span className={`badge ${item.verifyType}`}>
                      {item.verify}
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
                    <span>{item.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="actions">
                  <button className="secondary buttonHover">
                    <FaMapMarkerAlt /> View Location
                  </button>

                  <button onClick={() => handleopenHarvest(item)} style={{ background: "green", color: 'white' }} className="primary ">
                    {item.progress === 100 ? "Harvest Ready" : "Update Status"}
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
                        <strong>{selectedCrop?.ref || "N/A"}</strong>
                      </div>
                      <div>
                        <p>Location</p>
                        <strong>{selectedCrop?.title || "N/A"}</strong>
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
                    <button className="submit" onClick={handleHarvestSubmit}>
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
                <button className="track-btn" onClick={() => navigation('/delivery')}>Track Live</button>
              </div>
            </div>
          </div>

        </>





      }



    </>
  )
}

export default Farmer