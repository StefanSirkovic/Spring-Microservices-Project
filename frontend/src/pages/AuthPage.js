import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => setIsLogin(!isLogin);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      {isLogin ? (
        <Login onLogin={(token) => localStorage.setItem("token", token)} />
      ) : (
        <Register onToggle={handleToggle} />
      )}
      <button
        onClick={handleToggle}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
};

export default AuthPage;
