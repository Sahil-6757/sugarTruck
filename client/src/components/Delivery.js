import React, { useState, useEffect } from 'react'
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
  FaCamera,
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Delivery() {
  const navigation = useNavigate();
  const [data, setData] = useState(null);
  const [driver, setDriver] = useState(null);
  const [nodani, setNodani] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) return;

        // Fetch deliveries for farmer
        const delRes = await fetch(`http://localhost:8000/get-deliveries?farmerId=${user.id}`);
        const deliveries = await delRes.json();

        if (deliveries && deliveries.length > 0) {
          const latestDelivery = deliveries[0];
          setData(latestDelivery);

          // Fetch driver details if driverId exists
          if (latestDelivery.driver_id) {
            const driversRes = await fetch(`http://localhost:8000/getAllDrivers`);
            const allDrivers = await driversRes.json();
            const assignedDriver = allDrivers.find(d => d.id === latestDelivery.driver_id);
            if (assignedDriver) setDriver(assignedDriver);
          }

          // Fetch nodani to get expected weight and crop info
          const nodRes = await fetch(`http://localhost:8000/getNodani/${user.id}`);
          const crops = await nodRes.json();
          if (crops && crops.length > 0) {
            setNodani(crops[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      }
    };
    fetchData();
  }, []);
  const expectedWeight = nodani?.estimated_yield || "45"; // fallback to 45
  const ratePerTon = 5400; // Mock rate or fetch from settings
  const transportCharges = 2700; // Mock transport charge
  const expectedAmount = (parseFloat(expectedWeight) * ratePerTon) - transportCharges;
  const deliveryStatus = data ? data.status : 'PENDING';
  const progressPercent = deliveryStatus === 'COMPLETED' ? 100 : (deliveryStatus === 'IN_TRANSIT' ? 63 : 25);
  const journeyPercent = deliveryStatus === 'COMPLETED' ? 100 : (deliveryStatus === 'IN_TRANSIT' ? 67 : 0);

  const steps = [
    {
      title: "Order Created",
      desc: "Harvest request approved by factory admin",
      time: data ? new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "10:00 AM",
      status: "done",
    },
    {
      title: "Driver Assigned",
      desc: driver ? `Truck ${driver.vehicle_number} assigned with driver ${driver.name}` : "Pending assignment",
      time: data ? new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "10:30 AM",
      status: data?.driver_id ? "done" : "pending",
    },
    {
      title: "Driver En Route",
      desc: "Driver started journey to your farm",
      time: "11:00 AM",
      status: deliveryStatus === 'IN_TRANSIT' || deliveryStatus === 'COMPLETED' ? "done" : "pending",
    },
    {
      title: "Pickup Verified",
      desc: "OTP verified, sugarcane loaded successfully",
      time: "12:00 PM",
      status: deliveryStatus === 'IN_TRANSIT' || deliveryStatus === 'COMPLETED' ? "done" : "pending",
    },
    {
      title: "On the Way",
      desc: "Currently traveling to sugar factory",
      time: "12:15 PM",
      status: deliveryStatus === 'IN_TRANSIT' ? "active" : (deliveryStatus === 'COMPLETED' ? "done" : "pending"),
    },
    {
      title: "Arrived at Factory",
      desc: "Truck will arrive at weighing station",
      time: "ETA 2:30 PM",
      status: deliveryStatus === 'COMPLETED' ? "done" : "pending",
    },
    {
      title: "Weighment Done",
      desc: "Final weight measurement and quality check",
      time: "Pending",
      status: deliveryStatus === 'COMPLETED' ? "active" : "pending",
    },
    {
      title: "Payment Released",
      desc: "Amount will be credited to your account",
      time: "Pending",
      status: "pending",
    },
  ];

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="tracking-page" style={{ padding: '20px', textAlign: 'center' }}>
          <h2>No active deliveries found</h2>
          <button className="back-btn" onClick={() => navigation('/farmer')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <div className="tracking-page">

        {/* HEADER */}
        <div className="header">
          <button className="back-btn" onClick={() => navigation('/farmer')}>
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
                <h3>Delivery #DEL-{data.id.toString().padStart(4, '0')}</h3>
                <p>{nodani?.nod_id || 'NOD-2024-001'} • {nodani?.variety || 'CO-265'} • {expectedWeight} tons</p>
              </div>
              <span style={{ height: "fit-content" }} className="status">{deliveryStatus.replace('_', ' ')}</span>
            </div>

            {/* OVERALL PROGRESS */}
            <p className="label">Overall Progress</p>
            <div className="progress-bar">
              <div style={{ width: `${progressPercent}%` }}></div>
            </div>

            {/* JOURNEY */}
            <p className="label">Journey Progress</p>
            <div className="progress-bar">
              <div style={{ width: `${journeyPercent}%` }}></div>
            </div>

            {/* LIVE STATUS BOX */}
            <div className="live-box">
              <div>
                <p className="bold"> Your order is on the way!</p>
                <p>Near Sangli Highway, 15km from factory</p>
                <p className="">15 km remaining • ETA: 2:30 PM</p>
                <p className="small">Last updated: 1:45 PM</p>
              </div>

              <button className="map-btn buttonHover">
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
                <div className="avatar">{driver ? driver.name.charAt(0) : 'D'}</div>
                <div>
                  <h4>{driver ? driver.name : "Unassigned"}</h4>
                  <p>
                    <FaStar /> 4.8 (248 trips)
                  </p>
                </div>
              </div>

              <p>Truck Number <strong>{driver?.vehicle_number || "N/A"}</strong></p>
              <p>Contact <strong>{driver ? "+91 9876543210" : "N/A"}</strong></p>
              <p>Speciality <strong>Sugarcane Transport</strong></p>

              <button className="call-btn buttonHover">
                <FaPhone /> Call {driver ? driver.name.split(' ')[0] : "Driver"}
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

                  <div className="content">
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
            <div className="card success" style={{ marginTop: '-12rem', background: '#eaf4eb', border: '1px solid #d1e7d2' }}>
              <h3>Pickup Verification</h3>
              <div style={{ textAlign: 'center', margin: '15px 0' }}>
                <FaCheckCircle style={{ color: '#166534', fontSize: '32px' }} />
                <p style={{ color: '#166534', fontWeight: 'bold', margin: '5px 0' }}>OTP Verified Successfully</p>
                <h2 style={{ color: '#166534', fontSize: '28px', margin: '0' }}>1234</h2>
              </div>
              <ul style={{ listStyleType: 'none', padding: '0', fontSize: '13px', color: '#4b5563', marginBottom: '15px' }}>
                <li style={{ marginBottom: '4px' }}>✔ OTP verified at 12:00 PM</li>
                <li style={{ marginBottom: '4px' }}>✔ Staff photos uploaded</li>
                <li style={{ marginBottom: '4px' }}>✔ Load secured and documented</li>
              </ul>
              <button className="buttonHover" style={{ width: '100%', padding: '10px', background: 'white', border: '1px solid #ccc', borderRadius: '6px' }}>
                <FaCamera style={{ marginRight: '8px' }} /> View Pickup Photos
              </button>
            </div>

            {/* PAYMENT */}
            <div className="card">
              <h3>Expected Payment</h3>
              <p>Estimated Weight <strong>{expectedWeight} tons</strong></p>
              <p>Rate per Ton <strong>₹{ratePerTon.toLocaleString('en-IN')}</strong></p>
              <p>Transport Charges <strong>-₹{transportCharges.toLocaleString('en-IN')}</strong></p>
              <hr />
              <h3 className="">₹{expectedAmount.toLocaleString('en-IN')}</h3>
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