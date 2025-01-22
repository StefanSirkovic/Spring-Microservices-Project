import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';

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
      .then((data) => {
        setTeams(data); 
        setTeamsMembers(data);
      })
      .catch((err) => console.error("Error fetching teams:", err));
      fetchTeamUsers();
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
      if (!window.confirm("Are you sure you want to delete this team?")) 
        return;
      
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
        fetchTeamUsers(null);
        toast.success("Team deleted successfully!");
        setTeams(teams.filter((team) => team.id !== selectedTeam));
        setSelectedTeam("");
        
        fetch("http://localhost:8082/teams")
        .then((res) => res.json())
        .then((data) => {
          setTeams(data); 
          setTeamsMembers(data);
        })
        .catch((err) => console.error("Error fetching teams:", err));
       
        })
      .catch((err) => {
        console.error("Error deleting team:", err);
        toast.error("Error deleting team. Please try again.");
        });
    };

    const [selectedTeamForMembers, setSelectedTeamForMembers] = useState(null);
    const [selectedTeamUsers, setSelectedTeamUsers] = useState([]);
    const [isMembersOpen, setIsMembersOpen] = useState(false);

    useEffect(() => {
      fetch("http://localhost:8082/teams")
        .then((res) => res.json())
        .then((data) => setTeams(data))
        .catch((err) => console.error("Error fetching teams:", err));
          }, []);

          const handleToggleMembers = () => {
            setIsMembersOpen(!isMembersOpen);
          };

          const handleSelectionTeamMembers = (userId) => {
            if (selectedTeamUsers.includes(userId)) {
              setSelectedTeamUsers(selectedTeamUsers.filter((id) => id !== userId));
            } else {
              setSelectedTeamUsers([...selectedTeamUsers, userId]);
            }
          };
          
          const handleAddMembersToTeam = async () => {
            if (!selectedTeamForMembers || selectedTeamUsers.length === 0) {
              toast.error("Please select a team and at least one member.");
              return;
            }
          
            try {
              const response = await fetch("http://localhost:8082/teams/add-members", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: selectedTeamForMembers,
                  userIds: selectedTeamUsers,
                }),
              });
          
              if (response.ok) {
                fetch("http://localhost:8082/teams")
                .then((res) => res.json())
                .then((data) => {
                  setTeams(data); 
                  setTeamsMembers(data);
                })
                .catch((err) => console.error("Error fetching teams:", err));

                fetchTeamUsers(selectedTeamForMembers);
                toast.success("Members added successfully!");
                setSelectedTeamUsers([]);
                setIsMembersOpen(false);
                setSelectedAction(null);
                
              } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message}`);
              }
            } catch (error) {
              console.error("Error adding members:", error);
              toast.error("An error occurred. Please try again.");
            }
          };

          const [teamsMembers, setTeamsMembers] = useState([]);
          const [selectedTeamName, setSelectedTeamName] = useState("");
          const [teamUsers, setTeamUsers] = useState([]);
          const [selectedUsers, setSelectedUsers] = useState([]);
          const [isMembersOpenRemove, setIsMembersOpenRemove] = useState(false);

          useEffect(() => {
            const fetchTeams = async () => {
              try {
                const response = await fetch("http://localhost:8082/teams");
                if (!response.ok) {
                  throw new Error("Failed to fetch teams");
                }
                const data = await response.json();
                setTeamsMembers(data);
              } catch (error) {
                console.error("Error fetching teams:", error);
              }
            };
            fetchTeams();
          }, []);

          
            const fetchTeamUsers = useCallback(async (teamName) => {
              if (!teamName) return;
              try {
                const response = await fetch(`http://localhost:8082/teams/members/${teamName}`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });
                if (!response.ok) {
                  throw new Error("Failed to fetch team users");
                }
                const data = await response.json();
                setTeamUsers(data);
              } catch (error) {
                console.error("Error fetching team users:", error);
              }
            }, []);

              useEffect(() => {
              fetchTeamUsers(selectedTeamName);
            }, [selectedTeamName, fetchTeamUsers]);
          
          const handleTeamSelectionForRemoval = (teamId) => {
            setSelectedTeamName(teamId);
            setSelectedUsers([]);
          };
          
          const handleSelectionTeamMembersRemove = (userId) => {
            setSelectedUsers((prevSelectedUsers) =>
              prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter((id) => id !== userId)
                : [...prevSelectedUsers, userId] 
            );
          };

          const handleRemoveMembersFromTeam = async () => {
              if (!window.confirm("Are you sure you want to remove this member?")) 
                return;
            try {
              const response = await fetch(`http://localhost:8082/teams/remove/${selectedTeamName}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ userIds: selectedUsers }),
              });
              if (!response.ok) {
                throw new Error("Failed to remove members");
              }
              const updatedUsers = await response.json();
              setTeamUsers(updatedUsers);
              setSelectedUsers([]);
              toast.success("Members removed successfully!");
              setSelectedAction(null);
              fetchTeamUsers();
              window.location.reload();
            } catch (error) {
              toast.error("Error removing members:", error);
              console.error("Error removing members:", error);
            }
          };
        
          const [menuOpen, setMenuOpen] = useState(false);

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

          {/* Hamburger Icon */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Navigation Links */}
          <nav
            className={`${
              menuOpen ? "block" : "hidden"
            } fixed top-0 right-0 w-48 bg-blue-600 text-white p-4 space-y-4 lg:flex lg:space-x-4 lg:w-auto lg:static lg:flex-row lg:items-center`}
          >
            <div className="flex lg:flex-row flex-col items-center lg:space-x-4 space-y-4 lg:space-y-0">
              <button
                className={`px-4 py-2 rounded text-center ${
                  selectedSection === "users"
                    ? "bg-blue-500"
                    : "bg-blue-700 hover:bg-blue-500"
                } transition-all duration-300 ease-in-out text-sm`}
                onClick={() => {
                  setSelectedSection("users");
                  setSelectedAction(null);
                  setMenuOpen(false); // Zatvara meni kada se klikne
                }}
              >
                Manage Users
              </button>
              <button
                className={`px-4 py-2 rounded text-center ${
                  selectedSection === "teams"
                    ? "bg-blue-500"
                    : "bg-blue-700 hover:bg-blue-500"
                } transition-all duration-300 ease-in-out text-sm`}
                onClick={() => {
                  setSelectedSection("teams");
                  setSelectedAction(null);
                  setMenuOpen(false); // Zatvara meni kada se klikne
                }}
              >
                Manage Teams
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 text-sm"
              >
                <span className="mr-2">Logout</span>
                <img src="/logout.png" alt="logout" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {selectedSection === "users" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="flex flex-wrap gap-4 justify-start">
          <button
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              selectedAction === "addUser" && "ring ring-green-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("addUser")}
          >
            Add User
          </button>
          <button
            className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
              selectedAction === "deleteUser" && "ring ring-red-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("deleteUser")}
          >
            Delete User
          </button>
          <button
            className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${
              selectedAction === "updateUser" && "ring ring-yellow-300"
            } w-full sm:w-auto`}
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
          <div className="flex flex-wrap gap-4 justify-start">
  <button
    type="button"
    className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
      selectedAction === "addTeam" && "ring ring-green-300"
    } w-full sm:w-auto`}
    onClick={() => handleAction("addTeam")}
  >
    Create Team
  </button>
  <button
    className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
      selectedAction === "deleteTeam" && "ring ring-red-300"
    } w-full sm:w-auto`}
    onClick={() => handleAction("deleteTeam")}
  >
    Delete Team
  </button>
  <button
    className={`px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 ${
      selectedAction === "addTeamMember" && "ring ring-indigo-300"
    } w-full sm:w-auto`}
    onClick={() => handleAction("addTeamMember")}
  >
    Add Team Member
  </button>
  <button
    className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${
      selectedAction === "removeTeamMember" && "ring ring-yellow-300"
    } w-full sm:w-auto`}
    onClick={() => handleAction("removeTeamMember")}
  >
    Remove Team Member
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

           {/* Add Team Member Section */}
          {selectedAction === "addTeamMember" && (
          <div className="mt-6">
          <h3 className="text-lg font-bold">Select Team to Add Member</h3>
          <select
          value={selectedTeamForMembers || ""}
          onChange={(e) => setSelectedTeamForMembers(e.target.value)}
          className="block w-full px-4 py-2 border rounded mt-2"
           >
          <option value="" disabled>
            Select a team
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>

    <div className="mt-5 mb-5">
      <label className="block mt-5 text-sm font-medium text-gray-700">
        Add Members to Team
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={handleToggleMembers}
          className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {selectedTeamUsers.length > 0
            ? `${selectedTeamUsers.length} selected`
            : "Select members"}
        </button>

        {isMembersOpen && (
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
                    checked={selectedTeamUsers.includes(user.id)}
                    onChange={() => handleSelectionTeamMembers(user.id)}
                    className="mr-2"
                  />
                  {user.firstName} {user.lastName}
                </label>
              ))}
            </div>
            <div className="px-4 py-2 bg-gray-100 border-t border-gray-300 text-right">
              <button
                onClick={() => setIsMembersOpen(false)}
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
      onClick={handleAddMembersToTeam}
      className="bg-indigo-500 text-white px-4 py-2 mt-4 rounded hover:bg-indigo-600"
    >
      Add Team Member
    </button>
  </div>
  )}

  {/* Remove Team Member Section */}
  {selectedAction === "removeTeamMember" && (
          <div className="mt-6">
          <h3 className="text-lg font-bold">Select Team to Remove Member</h3>
              <select
      value={selectedTeamName || ""}
      onChange={(e) => handleTeamSelectionForRemoval(e.target.value)}
      className="block w-full px-4 py-2 border rounded mt-2">
      <option value="" disabled>
        Select a team
      </option>
      {teamsMembers.map((team) => (
        <option key={team.id} value={team.name}>
          {team.name}
        </option>
      ))}
    </select>


    <div className="mt-5 mb-5">
      <label className="block mt-5 text-sm font-medium text-gray-700">
        Remove Members from Team
      </label>
      <div className="relative">
  <button
    type="button"
    onClick={() => setIsMembersOpenRemove(!isMembersOpenRemove)}
    className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    {selectedUsers.length > 0
      ? `${selectedUsers.length} selected`
      : "Select members"}
  </button>

  {isMembersOpenRemove && (
    <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
      <div className="max-h-60 overflow-y-auto">
        {teamUsers.map((user) => (
          <label
            key={user.id}
            className="flex items-center px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100"
          >
            <input
              type="checkbox"
              value={user.id}
              checked={selectedUsers.includes(user.id)}
              onChange={() => handleSelectionTeamMembersRemove(user.id)}
              className="mr-2"
            />
            {user.firstName} {user.lastName}
          </label>
        ))}
      </div>
      <div className="px-4 py-2 bg-gray-100 border-t border-gray-300 text-right">
        <button
          onClick={() => setIsMembersOpenRemove(false)}
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
      onClick={handleRemoveMembersFromTeam}
      className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded hover:bg-yellow-600">
      Remove Team Member
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
