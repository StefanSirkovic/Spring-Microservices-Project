import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage"
import MemberDashboard from "./components/MemberDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/member/dashboard"
          element={
            <ProtectedRoute allowedRoles={["MEMBER", "ADMIN", "MANAGER"]}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
      
    </Router>
  );
}

export default App;
