import React from 'react'
import '../css/navbar.css'
import { useNavigate } from 'react-router-dom';

import { FaSignOutAlt } from 'react-icons/fa';
function Navbar({ role }) {
  const navigation = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigation('/auth');
  }
  return (
    <div className="topbar">
      <div className="logo">
        🌱 <span>SugarTrack</span>
        <span className="role">{user.role}</span>
      </div>

      <div className="logout" onClick={handleLogout}><FaSignOutAlt /> Logout</div>
    </div>
  )
}

export default Navbar