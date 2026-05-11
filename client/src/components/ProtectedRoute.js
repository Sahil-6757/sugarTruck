import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      // case 'Farmer':
      //   return <Navigate to="/farmer" replace />;
      // case 'Factory Admin':
      //   return <Navigate to="/farmer-admin-panel" replace />;
      // case 'Field Staff':
      //   return <Navigate to="/field" replace />;
      // case 'Driver':
      //   return <Navigate to="/driver" replace />;
      // default:
      //   return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
