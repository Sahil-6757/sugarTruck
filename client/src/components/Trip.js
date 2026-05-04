import React from 'react';
import Navbar from './Navbar'
import { FaCheckCircle, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt, 
  FaTruck, FaCube, FaFileAlt, FaCamera, FaClock } from 'react-icons/fa'
import '../css/trip.css'
function Trip() {
  return (
    <>
      <Navbar />
      <div className="drvTrip_container">

        {/* Header */}
        <div className="drvTrip_header">
          <FaTruck className="drvTrip_headerIcon" />
          <h2>Trip T001 - Active Delivery</h2>
        </div>

        {/* Farmer Info */}
        <div className="drvTrip_card">
          <div className="drvTrip_cardHeader">
            <span>Farmer Information</span>
            <button className="drvTrip_callBtn buttonHover">
              <FaPhoneAlt /> Call Farmer
            </button>
          </div>

          <div className="drvTrip_farmerDetails">
            <h3>Suresh Patil</h3>
            <p>+91 9876543210</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="drvTrip_navigationBox">
          <h3>En Route to Pickup Location</h3>
          <p>Navigate to farmer's field for sugarcane pickup</p>

          <div className="drvTrip_navActions">
            <button className="drvTrip_navBtn buttonHover">
              <FaPaperPlane /> Start Navigation
            </button>

            <button className="drvTrip_mapBtn buttonHover">
              <FaMapMarkerAlt /> View on Map
            </button>
          </div>
        </div>

        {/* OTP Section */}
        <div className="drvTrip_card">
          <h3>Pickup Verification</h3>
          <p>Enter OTP provided by farmer to confirm pickup</p>

          <div className="drvTrip_otpRow">
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              className="drvTrip_otpInput"
            />
            <button className="drvTrip_verifyBtn">
              <FaCheckCircle /> Verify Pickup
            </button>
          </div>
        </div>

      </div>
      <div className="drvDoc_container">

        {/* Document Pickup */}
        <div className="drvDoc_section">
          <h3 className="drvDoc_title">📷 Document Pickup</h3>

          <div className="drvDoc_grid">
            <div className="drvDoc_item buttonHover">
              <FaCamera /> Photo: Loading Area
            </div>

            <div className="drvDoc_item buttonHover">
              <FaCamera /> Photo: Sugarcane Quality
            </div>

            <div className="drvDoc_item buttonHover">
              <FaFileAlt /> Weight Receipt
            </div>

            <div className="drvDoc_item buttonHover">
              <FaCube /> Load Confirmation
            </div>
          </div>
        </div>

        {/* Delivery Destination */}
        <div className="drvDoc_destination">
          <h3>Delivery Destination</h3>

          <div className="drvDoc_info">
            <p>
              <FaMapMarkerAlt /> Sugar Factory, Industrial Area
            </p>
            <p>
              <FaClock /> ETA: 14:30
            </p>
            <p>
              <FaCube /> Expected: 45 tons
            </p>
          </div>
        </div>

      </div>
    </>

  )
}
export default Trip;