import React from 'react';
import Navbar from './Navbar'
import '../css/driver.css'
import { useNavigate} from 'react-router-dom';
import { FaCheckCircle, FaMapMarkerAlt,FaCube,FaTruck,FaFileAlt, FaPhoneAlt,FaClock } from 'react-icons/fa';
function Driver(){
    const navigate = useNavigate();
    return(
        <>
        <Navbar/>
         <div className="drvDash_container">
      <div className="drvDash_header">
        <div>
          <h1 className="drvDash_title">Driver Dashboard</h1>
          <p className="drvDash_subtitle">Welcome back, Rajesh Kumar</p>
        </div>
        <div className="drvDash_vehicle">
          <span className="drvDash_vehicleLabel">Vehicle</span>
          <span className="drvDash_vehicleNumber">MH-09-AB-1234</span>
        </div>
      </div>

      <div className="drvDash_cards">
        <div className="drvDash_card">
          <div>
            <p className="drvDash_cardTitle">Today's Trips</p>
            <h2 className="drvDash_cardValue">3</h2>
          </div>
          <FaTruck className="drvDash_icon" />
        </div>

        <div className="drvDash_card">
          <div>
            <p className="drvDash_cardTitle">Distance Covered</p>
            <h2 className="drvDash_cardValue">127 km</h2>
          </div>
          <FaMapMarkerAlt className="drvDash_icon" />
        </div>

        <div className="drvDash_card">
          <div>
            <p className="drvDash_cardTitle">Total Weight</p>
            <h2 className="drvDash_cardValue">98 tons</h2>
          </div>
          <FaCube className="drvDash_icon" />
        </div>

        <div className="drvDash_card">
          <div>
            <p className="drvDash_cardTitle">Earnings Today</p>
            <h2 className="drvDash_cardValue">₹3,200</h2>
          </div>
          <FaCheckCircle className="drvDash_icon" />
        </div>
      </div>
    </div>
      <div className="drvAssign_container">

      {/* Assignments Section */}
      <div className="drvAssign_section">
        <h2 className="drvAssign_title">Available Delivery Assignments</h2>

        {/* Trip 1 */}
        <div className="drvAssign_card">
          <div className="drvAssign_left">
            <div className="drvAssign_iconCircle">
              <FaTruck />
            </div>

            <div>
              <h3 className="drvAssign_tripId">Trip T001</h3>
              <p className="drvAssign_info">
                Farmer: Suresh Patil
                <span className="drvAssign_meta">
                  <FaMapMarkerAlt /> 25 km
                </span>
                <span className="drvAssign_meta">
                  <FaClock /> 45 min
                </span>
              </p>
              <p className="drvAssign_subInfo">
                Pickup: Field A, Kolhapur <b>45 tons</b>
              </p>
            </div>
          </div>

          <div className="drvAssign_right">
            <span className="drvAssign_badgeAssigned">ASSIGNED</span>
            <p className="drvAssign_time">Pickup: 14:00</p>
            <button className="drvAssign_btnPrimary buttonHover" onClick={()=>navigate('/trip')}>Start Trip</button>
          </div>
        </div>

        {/* Trip 2 */}
        <div className="drvAssign_card">
          <div className="drvAssign_left">
            <div className="drvAssign_iconCircle">
              <FaTruck />
            </div>

            <div>
              <h3 className="drvAssign_tripId">Trip T002</h3>
              <p className="drvAssign_info">
                Farmer: Ramesh Jadhav
                <span className="drvAssign_meta">
                  <FaMapMarkerAlt /> 32 km
                </span>
                <span className="drvAssign_meta">
                  <FaClock /> 55 min
                </span>
              </p>
              <p className="drvAssign_subInfo">
                Pickup: Field B, Sangli <b>38 tons</b>
              </p>
            </div>
          </div>

          <div className="drvAssign_right">
            <span className="drvAssign_badgeAvailable">AVAILABLE</span>
            <p className="drvAssign_time">Pickup: 16:30</p>
            <button className="drvAssign_btnSecondary buttonHover">Accept Trip</button>
          </div>
        </div>
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

    </div>
        </>
    )
}

export default Driver;