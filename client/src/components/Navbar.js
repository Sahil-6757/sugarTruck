import React from 'react'
import '../css/navbar.css'
import { useNavigate } from 'react-router-dom';
function Navbar() {
  const navigation = useNavigate();
  const handleLogout = ()=>{
    navigation('/auth')
  }
  return (
    <div className="topbar">
    <div className="logo">
      🌱 <span>SugarTrack</span>
      <span className="role">Farmer</span>
    </div>

    <div className="logout" onClick={handleLogout}>Logout</div>
  </div>
  )
}

export default Navbar