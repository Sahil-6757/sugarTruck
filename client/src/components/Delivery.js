import React from 'react'
import '../css/delivery.css'
import Navbar from './Navbar'
import {
  FaArrowLeft,
  FaPhone,
  FaComment,
  FaExclamationCircle,
  FaTruck,
  FaMapMarkerAlt,
  FaStar,
  FaComments,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


function Delivery() {
  const navigation = useNavigate();
  const steps = [
    {
      title: "Order Created",
      desc: "Harvest request approved by factory admin",
      time: "10:00 AM",
      status: "done",
    },
    {
      title: "Driver Assigned",
      desc: "Truck MH-12-1234 assigned with driver Rajesh",
      time: "10:30 AM",
      status: "done",
    },
    {
      title: "Driver En Route",
      desc: "Driver started journey to your farm",
      time: "11:00 AM",
      status: "done",
    },
    {
      title: "Pickup Verified",
      desc: "OTP verified, sugarcane loaded successfully",
      time: "12:00 PM",
      status: "done",
    },
    {
      title: "On the Way",
      desc: "Currently traveling to sugar factory",
      time: "12:15 PM",
      status: "active",
    },
    {
      title: "Arrived at Factory",
      desc: "Truck will arrive at weighing station",
      time: "ETA 2:30 PM",
      status: "pending",
    },
    {
      title: "Weighment Done",
      desc: "Final weight measurement and quality check",
      time: "Pending",
      status: "pending",
    },
    {
      title: "Payment Released",
      desc: "Amount will be credited to your account",
      time: "Pending",
      status: "pending",
    },
  ];

  const data = {
    deliveryId: "DEL-0001",
    crop: "NOD-2024-001 • CO-265 • 45 tons",
    progress: 63,
    journey: 67,
    driver: {
      name: "Rajesh Kumar",
      rating: 4.8,
      trips: 248,
      truck: "MH-12-1234",
      phone: "+91-9876543210",
      type: "Sugarcane Transport",
    },
  };
  return (
    <>
      <Navbar />
      <div className="tracking-page">

        {/* HEADER */}
        <div className="header">
          <button className="back-btn" onClick={() => navigation('/farmer')} style={{ width: "auto" }}>
            <FaArrowLeft /> Back
          </button>

          <div>
            <h2>Live Delivery Tracking</h2>
            <p>Track your sugarcane delivery in real-time</p>
          </div>
        </div>

        <div className="grid">

          {/* LEFT SIDE */}
          <div className="card">

            <div className="top">
              <div>
                <h3>Delivery #{data.deliveryId}</h3>
                <p>{data.crop}</p>
              </div>
              <span className="status">In Transit</span>
            </div>

            {/* OVERALL PROGRESS */}
            <p className="label">Overall Progress</p>
            <div className="progress-bar">
              <div style={{ width: `${data.progress}%` }}></div>
            </div>

            {/* JOURNEY */}
            <p className="label">Journey Progress</p>
            <div className="progress-bar">
              <div style={{ width: `${data.journey}%` }}></div>
            </div>

            {/* LIVE STATUS BOX */}
            <div className="live-box">
              <div>
                <p className="bold"> Your order is on the way!</p>
                <p>Near Sangli Highway, 15km from factory</p>
                <p className="">15 km remaining • ETA: 2:30 PM</p>
                <p className="small">Last updated: 1:45 PM</p>
              </div>

              <button className="map-btn buttonHover" style={{ height: '2rem', width: "auto" }}>
                <FaMapMarkerAlt /> Live Map
              </button>
            </div>

            {/* ACTIONS */}
            <div className="actions">
              <button className="buttonHover"><FaPhone /> Call Rajesh</button>
              <button className="buttonHover"><FaComment /> Message</button>
              <button className="buttonHover"><FaExclamationCircle /> Report Issue</button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="side">

            {/* DRIVER */}
            <div className="card">
              <h3>Your Driver</h3>

              <div className="driver">
                <div className="avatar">R</div>
                <div>
                  <h4>{data.driver.name}</h4>
                  <p>
                    <FaStar /> {data.driver.rating} ({data.driver.trips} trips)
                  </p>
                </div>
              </div>

              <p>Truck Number <strong>{data.driver.truck}</strong></p>
              <p>Contact <strong>{data.driver.phone}</strong></p>
              <p>Speciality <strong>{data.driver.type}</strong></p>

              <button className="call-btn buttonHover">
                <FaPhone /> Call Rajesh
              </button>
            </div>

            {/* PICKUP (placeholder) */}


          </div>

        </div>
      </div>
      <div className="progress-page">

        <div className="grid">

          {/* LEFT TIMELINE */}
          <div className="card">
            <h3>Step-by-Step Progress</h3>

            <div className="timeline">
              {steps.map((step, i) => (
                <div className="timeline-item" key={i}>

                  <div className={`icon ${step.status}`}>
                    {step.status === "done" && <FaCheckCircle />}
                    {step.status === "active" && <FaTruck />}
                    {step.status === "pending" && <FaClock />}
                  </div>

                  <div style={{ padding: "20px" }} className="content">
                    <div className="top">
                      <h4>{step.title}</h4>
                      <span>{step.time}</span>
                    </div>
                    <p>{step.desc}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="side">

            {/* PICKUP */}
            <div className="card success">
              <h3>Pickup Verification</h3>
              <p className="big">✔ OTP Verified Successfully</p>
              <h2>1234</h2>
              <button className="buttonHover">View Pickup Photos</button>
            </div>

            {/* PAYMENT */}
            <div className="card">
              <h3>Expected Payment</h3>
              <p>Estimated Weight <strong>45 tons</strong></p>
              <p>Rate per Ton <strong>₹5,400</strong></p>
              <p>Transport Charges <strong>-₹2,700</strong></p>
              <hr />
              <h3 className="">₹2,40,300</h3>
            </div>

            {/* HELP */}
            <div className="card">
              <h3>Need Help?</h3>
              <button className="buttonHover card-btn"><FaExclamationCircle /> Report Delivery Issue</button>
              <button className="buttonHover card-btn"><FaPhone /> Contact Factory Support</button>
              <button className="buttonHover card-btn"><FaComments /> Chat with Admin</button>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default Delivery