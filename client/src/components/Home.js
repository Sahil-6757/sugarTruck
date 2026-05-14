import React from 'react'
import { FaSeedling, FaIndustry, FaUsers, FaTruck } from "react-icons/fa";
import { FaProjectDiagram, FaMapMarkerAlt, FaShieldAlt, FaChartBar, FaArrowRight } from "react-icons/fa";

import '../css/home.css'
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigation = useNavigate();
  const roles = [
    {
      title: "Farmer",
      description: "Register crops, track growth & manage harvest",
      icon: <FaSeedling />,
    },
    {
      title: "Factory Admin",
      description: "Monitor farms, assign pickups & manage payments",
      icon: <FaIndustry />,
    },
    {
      title: "Field Staff",
      description: "Verify crops, assist deliveries & field monitoring",
      icon: <FaUsers />,
    },
    {
      title: "Driver",
      description: "Accept deliveries, track routes & proof of delivery",
      icon: <FaTruck />,
    },
  ];

  const features = [
    {
      icon: <FaProjectDiagram />,
      title: "11-Step Workflow",
      desc: "Complete micro-detailed tracking from registration to payment",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Geo-Tagged Tracking",
      desc: "Real-time GPS location and growth monitoring",
    },
    {
      icon: <FaShieldAlt />,
      title: "OTP Verified",
      desc: "Secure pickup verification with one-time passwords",
    },
    {
      icon: <FaChartBar />,
      title: "Transparent Payments",
      desc: "Weight-based automatic settlements & invoicing",
    },
  ];


  return (
    <div>
      <div className="hero">
        <div className="overlay">
          <div className="content">

            {/* Badge */}
            <div className="badge">
              🌱 Farm to Factory Tracking sahil
            </div>

            {/* Title */}
            <h1 className="title" style={{ textAlign: "left", fontSize: "48px" }}>
              Sugar<span>Track</span>
            </h1>

            {/* Description */}
            <p className="description" style={{ fontSize: '18px' }}>
              Complete sugarcane tracking platform — from planting to payment.
              Monitor growth, manage deliveries, and ensure transparent settlements
              for every stakeholder.
            </p>

            {/* Buttons */}
            <div className="buttons">
              <button className="primary-btn" style={{ width: "auto" }} onClick={() => navigation("/auth")}>
                Get Started →
              </button>
              {/* <button className="secondary-btn"></button> */}
            </div>

            {/* Stats */}
            <div className="stats">
              <div>
                <h2>500+</h2>
                <p>Farmers</p>
              </div>
              <div>
                <h2>4,250</h2>
                <p>Tons Processed</p>
              </div>
              <div>
                <h2>98.5%</h2>
                <p>Settlement Rate</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="role-section">
        <div className="role-grid">
          {roles.map((role, index) => (
            <div className="role-card" key={index}>
              <div className="icon" style={{ color: "green" }}>{role.icon}</div>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
            </div>
          ))}
        </div>
      </div>
      <section className="why">
        <h1>Why SugarTrack?</h1>
        <p className="subtitle">Built for the Indian sugarcane industry</p>

        <div className="features">
          {features.map((item, index) => (
            <div className="feature-card" key={index}>
              <div className="icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="cta">
        <div className="cta-content">
          <h2>
            Ready to modernize your sugarcane operations?
          </h2>

          <p>
            Join hundreds of farmers, factory admins, and field staff already
            using SugarTrack.
          </p>

          <button className="cta-btn" style={{ width: "auto" }} onClick={() => navigation('/auth')}>
            Create Account <FaArrowRight className="arrow" />
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
