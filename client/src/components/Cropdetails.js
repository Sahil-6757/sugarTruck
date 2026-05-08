import React, { useState, useEffect } from 'react'
import '../css/cropdetail.css'
import { FaLeaf, FaMapMarkerAlt, FaCamera, FaCalendarAlt,FaCheckCircle,FaRegCircle, FaTint, FaBug } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function Cropdetails() {
  const navigation = useNavigate();
  const initialTasks = [
    {
      id: 1,
      title: "Irrigation Due",
      desc: "Field A needs watering in the next 24 hours",
      priority: "High",
      color: "blue",
      icon: <FaTint />,
    },
    {
      id: 2,
      title: "Pest Monitoring",
      desc: "Check signs of stem borer in north section",
      priority: "Medium",
      color: "orange",
      icon: <FaBug />,
    },
  ];
  const [tasks, setTasks] = useState(initialTasks);
  const [data, setData] = useState({
    name: "Loading...",
    cropId: "",
    date: "",
    days: 0,
    area: "",
    variety: "",
    stage: "",
    yield: "Pending",
    location: "Not tagged",
    progress: 0,
  });

  useEffect(() => {
    const fetchFirstCrop = async () => {
      try {
        const getLogin = JSON.parse(localStorage.getItem("user"));
        if (!getLogin || !getLogin.id) return;

        const response = await fetch(`http://localhost:8000/getNodani/${getLogin.id}`);
        const crops = await response.json();
        
        if (crops && crops.length > 0) {
          const item = crops[0]; 
          
          const plantedDate = new Date(item.plantation_date);
          const today = new Date();
          const diffTime = Math.abs(today - plantedDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          let progress = Math.min(Math.round((diffDays / 365) * 100), 100);

          setData({
            name: item.field_name || "Unnamed Field",
            cropId: item.nod_id || `NOD-${new Date(item.created_at).getFullYear()}-${item.id.toString().padStart(3, '0')}`,
            date: plantedDate.toLocaleDateString(),
            days: diffDays || 0,
            area: `${item.area} ${item.unit}`,
            variety: item.variety,
            stage: progress >= 100 ? "READY FOR HARVEST" : "GROWING",
            yield: "Pending",
            location: item.latitude ? `${item.latitude}, ${item.longitude}` : "Not tagged",
            progress: progress,
          });
        }
      } catch(err) {
        console.log(err);
      }
    };
    fetchFirstCrop();
  }, []);
  

  const timelineData = [
    {
      title: "Planting",
      desc: "Seed planting completed",
      date: "3/15/2024",
      status: "done",
    },
    {
      title: "Germination",
      desc: "Plants emerged successfully",
      date: "3/25/2024",
      status: "done",
    },
    {
      title: "Tillering",
      desc: "Active growth phase",
      date: "5/15/2024",
      status: "done",
    },
    {
      title: "Grand Growth",
      desc: "Rapid height increase",
      date: "7/1/2024",
      status: "done",
    },
    {
      title: "Maturation",
      desc: "Sugar accumulation phase",
      date: "8/15/2024",
      status: "active",
    },
    {
      title: "Harvest Ready",
      desc: "Ready for cutting",
      date: "9/1/2024",
      status: "pending",
    },
  ];

  const markDone = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <>
    
     <Navbar/>
    <div className='container'>
        <div className="crop-page">

{/* TOP */}
<div className="top-bar">
  <button className="back-btn" style={{width:"auto"}} onClick={()=>navigation('/farmer')}>← Back to Dashboard</button>
  <div className="title">
    <h2>{data.name}</h2>
    <p>Crop ID: {data.cropId}</p>
  </div>
</div>

<div className="grid">

  {/* LEFT CARD */}
  <div className="card">
    <h3><FaLeaf /> Crop Information</h3>

    <div className="info-grid">
      <div>
        <p>Planting Date</p>
        <strong>{data.date}</strong>
      </div>

      <div>
        <p>Days Planted</p>
        <strong>{data.days} days</strong>
      </div>

      <div>
        <p>Area</p>
        <strong>{data.area}</strong>
      </div>

      <div>
        <p>Variety</p>
        <strong>{data.variety}</strong>
      </div>

      <div>
        <p>Current Stage</p>
        <span className="badge">{data.stage}</span>
      </div>

      <div>
        <p>Expected Yield</p>
        <strong>{data.yield}</strong>
      </div>
    </div>

    <hr />

    {/* LOCATION */}
    <div className="location">
      <p>Location</p>
      <div className="loc-row">
        <FaMapMarkerAlt />
        <span>{data.location}</span>
        <button style={{width:"auto"}} className="map-btn buttonHover">View on Map</button>
      </div>
    </div>

    {/* ACTIONS */}
    <div className="actions">
      <button className="primary buttonHover">
        <FaCamera /> Add Photos
      </button>
      <button className="secondary buttonHover">
        <FaCalendarAlt /> Update Status
      </button>
    </div>
  </div>

  {/* RIGHT CARD */}
  <div className="card small">
    <h3>Growth Progress</h3>

    <h2 className="progress-text">{data.progress}%</h2>

    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${data.progress}%` }}
      ></div>
    </div>

    <p className="stage">Stage 5 of 6</p>

    <ul className="steps">
      <li className="done">✔ Grand Growth</li>
      <li className="active">● Maturation</li>
      <li>○ Harvest Ready</li>
    </ul>
  </div>

</div>
</div>

<div className="timeline-card">
      <h3>Growth Timeline</h3>

      <div className="timeline">
        {timelineData.map((item, index) => (
          <div className="timeline-item" key={index}>

            {/* LEFT ICON */}
            <div className="timeline-icon">
              {item.status === "done" && (
                <FaCheckCircle className="done" />
              )}
              {item.status === "active" && (
                <MdOutlineAccessTime className="active" />
              )}
              {item.status === "pending" && (
                <FaRegCircle className="pending" />
              )}
            </div>

            {/* LINE */}
            {index !== timelineData.length - 1 && (
              <div className="timeline-line"></div>
            )}

            {/* CONTENT */}
            <div className="timeline-content">
              <div className="text">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
              <div className="date">{item.date}</div>
            </div>

          </div>
        ))}
      </div>
    </div>
    <div className="tasks-card">
      <h3>Upcoming Tasks & Reminders</h3>

      {tasks.map((task) => (
        <div className="task-row" key={task.id}>

          {/* LEFT */}
          <div className="task-left">
            <div className={`icon ${task.color}`}>
              {task.icon}
            </div>

            <div>
              <h4>{task.title}</h4>
              <p>{task.desc}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="task-right">
            <span className={`badge ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>

            <button className="buttonHover" onClick={() => markDone(task.id)}>
              Mark Done
            </button>
          </div>

        </div>
      ))}
    </div>  
    </div>
    </>
  )
}

export default Cropdetails