import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); 

  if (!token) return <Navigate to="/" />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
