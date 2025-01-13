import React, { useEffect, useState } from "react";

const MemberDashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/member/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.text())
      .then(setMessage)
      .catch((err) => console.error("Error fetching Member Dashboard:", err));
  }, []);

  return (
    <div className="dashboard">
      <h1>{message || "Member Loading..."}</h1>
    </div>
  );
};

export default MemberDashboard;
