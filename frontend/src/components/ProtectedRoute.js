import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode(token);

    if (Date.now() >= decodedToken.exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }

    const userRole = decodedToken.role;

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
