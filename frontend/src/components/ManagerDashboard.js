import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';

const ManagerDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("projects");
  const [selectedAction, setSelectedAction] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    team: "",
  });
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    };

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
  

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate || !formData.team) {
      toast.error("All fields are required.");
      return;
    }
    const requestData = {
      ...formData,
      team: {
        id: selectedTeam,
      },
    };
  
    try {
      const response = await fetch("http://localhost:8082/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        toast.success("Project successfully added!");

        fetch("http://localhost:8082/projects")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Error fetching teams:", err));
  
        setFormData({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          team: "",
        });
        
        setSelectedTeam("");
        setSelectedAction(null);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Project creation failed.");
      }
    } catch (error) {
      toast.error("Error creating project. Please try again.");
      console.error("Error creating project:", error);
    }
  };

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  
    useEffect(() => {
      fetch("http://localhost:8082/teams")
        .then((res) => res.json())
        .then((data) => setTeams(data))
        .catch((err) => console.error("Error fetching teams:", err));
          }, []);

        useEffect(() => {
          fetch("http://localhost:8082/projects")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Error fetching teams:", err));
              }, []);
  
      const handleDeleteProject = async () => {
        if (!selectedProject) {
          toast.error("Please select a project to delete.");
          return;
        }

        if (!window.confirm("Are you sure you want to delete this project?")) {
          return;
        }
        
        try {
          const response = await fetch(`http://localhost:8082/projects/delete/${selectedProject}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.ok) {
            toast.success("Project successfully deleted!");
            fetch("http://localhost:8082/projects")
                .then((res) => res.json())
                .then((data) => setProjects(data))
                .catch((err) => console.error("Error fetching teams:", err));
            fetchTasks();
            setSelectedProject(null);
          } else {
            const errorText = await response.text();
            toast.error(errorText || "Deletion failed.");
          }
        } catch (error) {
          toast.error("Error deleting project. Please try again.");
          console.error("Error deleting project:", error);
        }
      };

  

  const [teamData, setTeamData] = useState({ name: '', description: '', members: [] });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  
  const handleTeamInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelection = (projectId) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(projectId)
        ? prevSelected.filter((id) => id !== projectId)
        : [...prevSelected, projectId]
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
      projectIds: selectedMembers,
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
      })
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


  const [taskFormData, setTaskFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    priority: "",
    assignedMember: "",
  });

  const [selectedProjectTask, setSelectedProjectTask] = useState(null);
  

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleAddTask = async (e) => {
    e.preventDefault();
  
    if (
      !taskFormData.name ||
      !taskFormData.description ||
      !taskFormData.deadline ||
      !taskFormData.priority ||
      selectedUsers.length === 0 ||
      !selectedProjectTask
    ) {
      toast.error("All fields are required.");
      return;
    }
  
    const requestData = {
      name: taskFormData.name,
      description: taskFormData.description,
      priority: taskFormData.priority,
      deadline: taskFormData.deadline,
      userId: selectedUsers[0],
      status: "Pending",
      comments: [],
    };
    
  
    try {
      const response = await fetch(`http://localhost:8082/tasks/create/${selectedProjectTask}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        toast.success("Task successfully added!");
  
        setTaskFormData({
          name: "",
          description: "",
          deadline: "",
          priority: "",
          assignedMember: "",
        });
        fetchTasks();
        setSelectedUsers([]);
        setSelectedProjectTask(null);
        setSelectedAction(null);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Task creation failed.");
      }
    } catch (error) {
      toast.error("Error creating task. Please try again.");
      console.error("Error creating task:", error);
    }
  };
  
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  
  const handleSelectionTeamMember = (userId) => {
    setSelectedUsers([userId]);
  };
  

  const handleProjectChange = async (e) => {
    const projectId = Number(e.target.value);
    setSelectedProjectTask(projectId);
  
    try {
      const response = await fetch(`http://localhost:8082/projects/get-members/${projectId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        const users = await response.json();
        setUsers(users);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to load users for the selected project.");
      }
    } catch (error) {
      toast.error("Error fetching users. Please try again.");
      console.error("Error fetching users:", error);
    }
  };



  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8082/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to fetch tasks.");
      }
    } catch (error) {
      toast.error("Error fetching tasks. Please try again.");
      console.error("Error fetching tasks:", error);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  

  const handleDeleteTask = async () => {
    if (!selectedTask) {
      toast.error("Please select a task to remove.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8082/tasks/remove/${selectedTask}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        toast.success("Task successfully removed!");
        fetchTasks();
        setSelectedTask(null);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to remove task.");
      }
    } catch (error) {
      toast.error("Error removing task. Please try again.");
      console.error("Error removing task:", error);
    }
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
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>

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
            } fixed top-0 right-0 w-48 bg-green-600 text-white p-4 space-y-4 lg:flex lg:space-x-4 lg:w-auto lg:static lg:flex-row lg:items-center`}
          >
            <div className="flex lg:flex-row flex-col items-center lg:space-x-4 space-y-4 lg:space-y-0">
              <button
                className={`px-4 py-2 rounded text-center ${
                  selectedSection === "projects"
                    ? "bg-green-500"
                    : "bg-green-700 hover:bg-green-500"
                } transition-all duration-300 ease-in-out text-sm`}
                onClick={() => {
                  setSelectedSection("projects");
                  setSelectedAction(null);
                  setMenuOpen(false);
                }}
              >
                Manage Projects
              </button>
              <button
                className={`px-4 py-2 rounded text-center ${
                  selectedSection === "teams"
                    ? "bg-green-500"
                    : "bg-green-700 hover:bg-green-500"
                } transition-all duration-300 ease-in-out text-sm`}
                onClick={() => {
                  setSelectedSection("teams");
                  setSelectedAction(null);
                  setMenuOpen(false);
                }}
              >
                Team Statistics
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
        {selectedSection === "projects" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Project Management</h2>
            <div className="flex flex-wrap gap-4 justify-start">
          <button
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              selectedAction === "addProject" && "ring ring-green-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("addProject")}
          >
            Add Project
          </button>
          <button
            className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
              selectedAction === "deleteProject" && "ring ring-red-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("deleteProject")}
          >
            Delete Project
          </button>
          <button
            className={`px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 ${
              selectedAction === "createTask" && "ring ring-indigo-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("createTask")}
          >
            Create Task
          </button>
          <button
            className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${
              selectedAction === "removeTask" && "ring ring-yellow-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("removeTask")}
          >
            Remove Task
          </button>
          <button
            className={`px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 ${
              selectedAction === "monitorProgress" && "ring ring-sky-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("monitorProgress")}
          >
            Progress Monitoring
          </button>
        </div>

            {/* Add New Project Form */}
            {selectedAction === "addProject" && (
              <form className="mt-6 space-y-4" onSubmit={handleCreate}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Team
                  </label>
                  <select
                  value={selectedTeam || ""}
                  onChange={(e) => {
                    const teamId = e.target.value;
                    setSelectedTeam(teamId);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      team: teamId,
                    }));
                  }}
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
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Project
                </button>
              </form>
            )}


            {/* Delete Project Section */}
            {selectedAction === "deleteProject" && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Select Project to Delete</h3>
                <select
                value={selectedProject || ""}
                onChange={(e) => setSelectedProject(Number(e.target.value))}
                className="block w-full px-4 py-2 border rounded mt-2"
              >
                <option value="" disabled>
                  Select a project
                </option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

                <button
                  onClick={handleDeleteProject}
                  className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
                >
                  Delete Project
                </button>
              </div>
            )}

            {/* Create Task Section */}
            {selectedAction === "createTask" && (
              <form className="mt-6 space-y-4" onSubmit={handleAddTask}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={taskFormData.name}
                    onChange={handleTaskInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task Description
                  </label>
                  <textarea
                    name="description"
                    value={taskFormData.description}
                    onChange={handleTaskInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={taskFormData.deadline}
                    onChange={handleTaskInputChange}
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={taskFormData.priority || ""}
                    onChange={handleTaskInputChange}
                    className="block w-full px-4 py-2 border rounded mt-2"
                    required
                  >
                    <option value="" disabled>
                      Select priority
                    </option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select a project for the task
                  </label>
                <select
                value={selectedProjectTask || ""}
                onChange={handleProjectChange}
                className="block w-full px-4 py-2 border rounded mt-2"
              >
                <option value="" disabled>
                  Select a project
                </option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

                </div>

                <div className="mt-5 mb-5">
                  <label className="block mt-5 mb-2 text-sm font-medium text-gray-700">
                    Select a Member from the project team to assign the task to
                  </label>
                  <div className="relative">
                <button
            type="button"
            onClick={() => setIsMembersOpen(!isMembersOpen)}
            className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {selectedUsers.length > 0
              ? `${selectedUsers.length} selected`
              : "Select member"}
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
                      type="radio"
                      name="teamMember"
                      value={user.id}
                      checked={selectedUsers[0] === user.id} 
                      onChange={() => handleSelectionTeamMember(user.id)}
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
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Create Task
                </button>
              </form>
            )}


            {/* Remove Task Section */}
            {selectedAction === "removeTask" && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Select Task to Remove</h3>
                <select
                  value={selectedTask || ""}
                  onChange={async (e) => {
                    setSelectedTask(Number(e.target.value));
                  }}
                  className="block w-full px-4 py-2 border rounded mt-2"
                >
                  <option value="" disabled>
                    Select a task
                  </option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleDeleteTask}
                  className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded hover:bg-yellow-600"
                >
                  Remove Task
                </button>
              </div>
            )}





            {/* Monitor Progress Section */}
            {selectedAction === "monitorProgress" && (
              <div></div>
            )}



          </div>
        )}

          {selectedSection === "teams" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Team Statistics</h2>
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
                <label className="block text-sm font-medium text-gray-700">Add Projects to Team</label>
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
                        {projects.map((project) => (
                          <labelf
                            key={project.id}
                            className="flex items-center px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100"
                          >
                            <input
                              type="checkbox"
                              value={project.id}
                              checked={selectedMembers.includes(project.id)}
                              onChange={() => handleSelection(project.id)}
                              className="mr-2"
                            />
                            {project.firstName} {project.lastName}
                          </labelf>
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




          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
