import React, { useState, useEffect } from 'react'
import '../css/cropdetail.css'
import { FaLeaf, FaMapMarkerAlt, FaCamera, FaCalendarAlt,FaCheckCircle,FaRegCircle, FaTint, FaBug, FaSeedling } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function Cropdetails() {
  const navigation = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [timeline, setTimeline] = useState([]);
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

          // Generate dynamic timeline
          const stagesConfig = [
            { title: "Planting", desc: "Seed planting completed", daysFromStart: 0 },
            { title: "Germination", desc: "Plants emerged successfully", daysFromStart: 10 },
            { title: "Tillering", desc: "Active growth phase", daysFromStart: 61 },
            { title: "Grand Growth", desc: "Rapid height increase", daysFromStart: 108 },
            { title: "Maturation", desc: "Sugar accumulation phase", daysFromStart: 153 },
            { title: "Harvest Ready", desc: "Ready for cutting", daysFromStart: 170 },
          ];

          let dynamicTimeline = stagesConfig.map(stage => {
            let stageDate = new Date(plantedDate);
            stageDate.setDate(stageDate.getDate() + stage.daysFromStart);
            return {
              title: stage.title,
              desc: stage.desc,
              dateObj: stageDate,
              date: stageDate.toLocaleDateString('en-GB'),
            };
          });

          let activeFound = false;
          const todayStart = new Date(today);
          todayStart.setHours(0,0,0,0);

          for (let i = dynamicTimeline.length - 1; i >= 0; i--) {
            const sDate = new Date(dynamicTimeline[i].dateObj);
            sDate.setHours(0,0,0,0);

            if (todayStart >= sDate) {
              if (!activeFound && i !== dynamicTimeline.length - 1) {
                 dynamicTimeline[i].status = "active";
                 activeFound = true;
              } else if (!activeFound && i === dynamicTimeline.length - 1) {
                 dynamicTimeline[i].status = "done";
                 activeFound = true;
              } else {
                 dynamicTimeline[i].status = "done";
              }
            } else {
              dynamicTimeline[i].status = "pending";
            }
          }
          if(!activeFound && dynamicTimeline.length > 0) {
            dynamicTimeline[0].status = "active";
          }
          setTimeline(dynamicTimeline);

          // Generate dynamic tasks
          let dynamicTasks = [];
          if (diffDays < 10) {
             dynamicTasks.push({ id: 1, title: "Irrigation Schedule", desc: "Keep soil moist for germination", priority: "HIGH", color: "blue", icon: <FaTint /> });
          } else if (diffDays >= 10 && diffDays < 60) {
             dynamicTasks.push({ id: 1, title: "Irrigation Schedule", desc: "Next watering due in 2 days", priority: "MEDIUM", color: "blue", icon: <FaTint /> });
             dynamicTasks.push({ id: 2, title: "Weed Control", desc: "Check for weeds in active growth phase", priority: "MEDIUM", color: "orange", icon: <FaLeaf /> });
          } else if (diffDays >= 60 && diffDays < 150) {
             dynamicTasks.push({ id: 1, title: "Irrigation Schedule", desc: "Next watering due in 2 days", priority: "MEDIUM", color: "blue", icon: <FaTint /> });
             dynamicTasks.push({ id: 2, title: "Pest Inspection", desc: "Monthly pest control check overdue", priority: "HIGH", color: "red", icon: <FaBug /> });
             dynamicTasks.push({ id: 3, title: "Fertilizer Application", desc: "Apply potassium fertilizer for sugar content", priority: "MEDIUM", color: "green", icon: <FaSeedling /> });
          } else {
             dynamicTasks.push({ id: 1, title: "Harvest Preparation", desc: "Check equipment and schedule labor", priority: "HIGH", color: "orange", icon: <FaCalendarAlt /> });
             dynamicTasks.push({ id: 2, title: "Final Inspection", desc: "Assess crop maturity and sugar levels", priority: "MEDIUM", color: "green", icon: <FaLeaf /> });
          }
          setTasks(dynamicTasks);
        }
      } catch(err) {
        console.log(err);
      }
    };
    fetchFirstCrop();
  }, []);
  



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
  <button className="back-btn" onClick={()=>navigation('/farmer')}>← Back to Dashboard</button>
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
        <button className="map-btn buttonHover">View on Map</button>
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
        {timeline.map((item, index) => (
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
            {index !== timeline.length - 1 && (
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