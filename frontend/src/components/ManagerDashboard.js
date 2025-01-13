import React, { useEffect, useState } from "react";

const ManagerDashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/manager/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.text())
      .then(setMessage)
      .catch((err) => console.error("Error fetching Manager Dashboard:", err));
  }, []);

  return (
    <div className="dashboard">
      <h1>{message || "Manager Loading..."}</h1>
    </div>
  );
};

export default ManagerDashboard;
