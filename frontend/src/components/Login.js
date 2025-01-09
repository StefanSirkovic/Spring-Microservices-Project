import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.token);
        setEmail("");
        setPassword("");
        toast.success("Successfully logged in!");
        navigate("/dashboard"); // Preusmeravanje
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Error logging in. Please try again.");
      console.error("Error logging in:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-10 shadow-lg rounded-lg border border-gray-200"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Welcome Back
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Please log in to access your account.
      </p>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
      >
        Log In
      </button>
    </form>
  );
};

export default Login;
