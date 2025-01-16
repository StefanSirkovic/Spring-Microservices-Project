import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("users");
  const [selectedAction, setSelectedAction] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "MEMBER",
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleAction = (action) => {
    setSelectedAction(action);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("All fields are required.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        toast.success("User successfully added!");
  
        fetch("http://localhost:8080/admin/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => res.json())
          .then((data) => setUsers(data.users || []))
          .catch((err) => console.error("Error fetching users:", err));
        
  
        
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "MEMBER",
        });
  
        setSelectedAction(null);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Registration failed.");
      }
    } catch (error) {
      toast.error("Error registering user. Please try again.");
      console.error("Error registering user:", error);
    }
  };
  
  

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      toast.error("Please select a user to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/auth/delete/${selectedUser}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast.success("User successfully deleted!");
        setUsers(users.filter((user) => user.id !== selectedUser));
        setSelectedUser(null);
        window.location.reload();
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Deletion failed.");
      }
    } catch (error) {
      toast.error("Error deleting user. Please try again.");
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/admin/dashboard", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => console.error("Error fetching Admin Dashboard:", err));
  }, []);


  return (
    <div className="min-h-screen bg-gray-100">
      {/* ToastContainer for alerts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <nav>
            <button
              className={`px-4 py-2 rounded ${
                selectedSection === "users"
                  ? "bg-blue-500"
                  : "bg-blue-700 hover:bg-blue-500"
              }`}
              onClick={() => {
                setSelectedSection("users");
                setSelectedAction(null);
              }}
            >
              Manage Users
            </button>
            <button
              className={`ml-4 px-4 py-2 rounded ${
                selectedSection === "teams"
                  ? "bg-blue-500"
                  : "bg-blue-700 hover:bg-blue-500"
              }`}
              onClick={() => {
                setSelectedSection("teams");
                setSelectedAction(null);
              }}
            >
              Manage Teams
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 ml-5 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {selectedSection === "users" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                  selectedAction === "addUser" && "ring ring-green-300"
                }`}
                onClick={() => handleAction("addUser")}
              >
                Add User
              </button>
              <button
                className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
                  selectedAction === "deleteUser" && "ring ring-red-300"
                }`}
                onClick={() => handleAction("deleteUser")}
              >
                Delete User
              </button>
            </div>

            {/* Add User Form */}
            {selectedAction === "addUser" && (
              <form className="mt-6 space-y-4" onSubmit={handleRegister}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                    
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add User
                </button>
              </form>
            )}

            {/* Delete User Section */}
            {selectedAction === "deleteUser" && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Select User to Delete</h3>
                <select
                  value={selectedUser || ""}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="block w-full px-4 py-2 border rounded mt-2"
                >
                  <option value="" disabled>
                    Select a user
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
                >
                  Delete User
                </button>
              </div>
            )}
          </div>
        )}

        {selectedSection === "teams" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Team Management</h2>
            <p>Feature under construction.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
