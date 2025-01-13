import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/admin/dashboard", {
      method : "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.text())
      .then(setMessage)
      .catch((err) => console.error("Error fetching Admin Dashboard:", err));
  }, []);

  return (
    <div className="dashboard">
      <h1>{message || "Admin Loading..."}</h1>
    </div>
  );
};

export default AdminDashboard;
