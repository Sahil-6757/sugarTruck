import React from "react";
import { Users, MapPin, Clock, CheckCircle } from "lucide-react";
import Navbar from "./Navbar";

function Field() {
  return (
    <div>
      <Navbar />
       <div className="dashboard">
      
      {/* Header */}
      <div className="header">
        <div>
          <h1>Field Staff Dashboard</h1>
          <p className="welcome">Welcome back, Mahesh Kale</p>
        </div>

        <div className="territory-box">
          <span className="territory-label">Territory</span>
          <span className="territory-value">Kolhapur-Sangli Region</span>
        </div>
      </div>

      {/* Cards */}
      <div className="cards">
        
        <div className="card">
          <div>
            <p className="title">Assigned Farmers</p>
            <h2>12</h2>
          </div>
          <Users className="icon" />
        </div>

        <div className="card">
          <div>
            <p className="title">Field Visits</p>
            <h2>8</h2>
            <p className="sub">This week</p>
          </div>
          <MapPin className="icon" />
        </div>

        <div className="card">
          <div>
            <p className="title">Pending Tasks</p>
            <h2>5</h2>
            <p className="warning">Requires attention</p>
          </div>
          <Clock className="icon" />
        </div>

        <div className="card">
          <div>
            <p className="title">Deliveries Assisted</p>
            <h2>23</h2>
            <p className="success">This month</p>
          </div>
          <CheckCircle className="icon" />
        </div>

      </div>
    </div>
    </div>
  );
}

export default Field;
