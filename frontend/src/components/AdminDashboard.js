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
  const [formUpdateData, setFormUpdateData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "MEMBER",
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserUpdate, setSelectedUserUpdate] = useState(null);

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
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setFormUpdateData({ ...formUpdateData, [name]: value });
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
        fetch("http://localhost:8080/admin/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => res.json())
          .then((data) => setUsers(data.users || []))
          .catch((err) => console.error("Error fetching users:", err));
        setSelectedUser(null);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Deletion failed.");
      }
    } catch (error) {
      toast.error("Error deleting user. Please try again.");
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!formUpdateData.firstName || !formUpdateData.lastName || !formUpdateData.email || !formUpdateData.password) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/auth/update/${selectedUserUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formUpdateData),
      });
  
      if (response.ok) {
        toast.success("User successfully updated!", {
          duration: 5000,
        });
  
        fetch("http://localhost:8080/admin/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => res.json())
          .then((data) => setUsers(data.users || []))
          .catch((err) => console.error("Error fetching users:", err));
  
  
        setSelectedUserUpdate(null);
        setFormUpdateData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "MEMBER",
        });
        setSelectedAction(null);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Update failed.");
      }
    } catch (error) {
      toast.error("Error updating user. Please try again.");
      console.error("Error updating user:", error);
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


  const [teamData, setTeamData] = useState({ name: '', description: '', members: [] });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  
  const handleTeamInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelection = (userId) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

const handleAddTeam = (e) => {
  e.preventDefault();

  fetch("http://localhost:8082/teams/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      name: teamData.name,
      description: teamData.description,
      userIds: selectedMembers,
      
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to add team");
      }
      return res.json();
    })
    .then(() => {

      fetch("http://localhost:8082/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Error fetching teams:", err));

      setSelectedAction(null);
      setTeamData({ name: '', description: '', members: [] });
      setSelectedMembers([]);
      setIsOpen(false);
      toast.success("Team created successfully!");
    })
    .catch((err) => {
      console.error("Error adding team:", err);
      toast.error("Error adding team. Please try again.");
    });
    
  };

    const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    };

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    fetch("http://localhost:8082/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Error fetching teams:", err));
        }, []);


  const handleDeleteTeam = () => {
    if (!selectedTeam) {
      toast.error("Please select a team to delete.");
      return;
      }

    fetch(`http://localhost:8082/teams/delete/${selectedTeam}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
       },
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete team.");
          }
        toast.success("Team deleted successfully!");
        setTeams(teams.filter((team) => team.id !== selectedTeam));
        setSelectedTeam("");
        
        fetch("http://localhost:8082/teams")
        .then((res) => res.json())
        .then((data) => setTeams(data))
        .catch((err) => console.error("Error fetching teams:", err));
       
        })
      .catch((err) => {
        console.error("Error deleting team:", err);
        toast.error("Error deleting team. Please try again.");
        });
    };




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
              <button
                className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${
                  selectedAction === "updateUser" && "ring ring-yellow-300"
                }`}
                onClick={() => handleAction("updateUser")}
              >
                Update User
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

            {/* Update User Section */}
            {selectedAction === "updateUser" && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Select User to Update</h3>
                <select
                  value={selectedUserUpdate || ""}
                  onChange={(e) => setSelectedUserUpdate(e.target.value)}
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
                <form className="mt-6 space-y-4" onSubmit={handleUpdateUser}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formUpdateData.firstName}
                    onChange={handleUpdateInputChange}
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
                    value={formUpdateData.lastName}
                    onChange={handleUpdateInputChange}
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
                    value={formUpdateData.email}
                    onChange={handleUpdateInputChange}
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
                    value={formUpdateData.password}
                    onChange={handleUpdateInputChange}
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
                    value={formUpdateData.role}
                    onChange={handleUpdateInputChange}
                    className="block w-full px-4 py-2 border rounded"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                    
                  </select>
                </div>
                <button
                  onClick={handleUpdateUser}
                  className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded hover:bg-yellow-600"
                >
                  Update User
                </button>
              </form>
                
              </div>
            )}

          </div>
        )}

        {selectedSection === "teams" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Team Management</h2>
          <div className="flex gap-4">
            <button type="button"
              className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                selectedAction === "addTeam" && "ring ring-green-300"
              }`}
              onClick={() => handleAction("addTeam")}
            >
              Create Team
            </button>
            <button
              className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
                selectedAction === "deleteTeam" && "ring ring-red-300"
              }`}
              onClick={() => handleAction("deleteTeam")}
            >
              Delete Team
            </button>
            <button
              className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${
                selectedAction === "updateTeam" && "ring ring-yellow-300"
              }`}
              onClick={() => handleAction("updateTeam")}
            >
              Update Team
            </button>
          </div>
      
          {/* Add Team Form */}
          {selectedAction === "addTeam" && (
            <form className="mt-6 space-y-4" onSubmit={handleAddTeam}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <input
                  type="text"
                  name="name"
                  value={teamData.name}
                  onChange={handleTeamInputChange}
                  className="block w-full px-4 py-2 border rounded"
                  required
                />
              </div>
      
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Description</label>
                <textarea
                  name="description"
                  value={teamData.description}
                  onChange={handleTeamInputChange}
                  className="block w-full px-4 py-2 border rounded"
                  rows="4"
                  placeholder="Enter a brief description of the team"
                />
              </div>
      
              <div>
                <label className="block text-sm font-medium text-gray-700">Add Users to Team</label>
                <div className="relative">
                  <button type="button"
                    onClick={handleToggle}
                    className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {selectedMembers.length > 0
                      ? `${selectedMembers.length} selected`
                      : 'Select members'}
                  </button>
      
                  {isOpen && (
                    <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="max-h-60 overflow-y-auto">
                        {users.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-center px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100"
                          >
                            <input
                              type="checkbox"
                              value={user.id}
                              checked={selectedMembers.includes(user.id)}
                              onChange={() => handleSelection(user.id)}
                              className="mr-2"
                            />
                            {user.firstName} {user.lastName}
                          </label>
                        ))}
                      </div>
                      <div className="px-4 py-2 bg-gray-100 border-t border-gray-300 text-right">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
      
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Team
              </button>
            </form>
          )}

        {/* Delete Team Section */}
        {selectedAction === "deleteTeam" && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Select Team to Delete</h3>
                <select
                  value={selectedTeam || ""}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="block w-full px-4 py-2 border rounded mt-2"
                >
                  <option value="" disabled>
                    Select a team
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleDeleteTeam}
                  className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
                >
                  Delete Team
                </button>
              </div>
            )}
 
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
