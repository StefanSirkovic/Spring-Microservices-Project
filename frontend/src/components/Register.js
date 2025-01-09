import React, { useState } from "react";
import { toast } from "react-toastify";

const Register = ({ onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });
  
      if (response.ok) {
        toast.success("Successfully registered!");
        setEmail("");
        setPassword("");
        setRole("MEMBER");
        onToggle();
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Registration failed");
      }
    } catch (error) {
      toast.error("Error registering. Please try again.");
      console.error("Error registering:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-10 shadow-lg rounded-lg border border-gray-200"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Create Your Account
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Please enter your informations.
      </p>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="Enter your password"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
        >
          <option value="MEMBER">Member</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
      >
        Register
      </button>
    </form>
  );
};  

export default Register;
