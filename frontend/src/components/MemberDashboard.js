import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {jwtDecode} from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';



const MemberDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("tasks");
  const [selectedAction, setSelectedAction] = useState(null);
 
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleAction = (action) => {
    setSelectedAction(action);
  };

 
  
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

  
  const [taskFormData, setTaskFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    priority: "",
    userId: "",
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
      status: "not-started",
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
          userId: "",
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




  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8082/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        
        
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to fetch tasks.");
      }
    } catch (error) {
      toast.error("Error fetching tasks. Please try again.");
      console.error("Error fetching tasks:", error);
    }
  };






  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  
    
    const getMemberId = () => {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.id;
      } catch (err) {
        console.error("Error decoding token:", err);
        return null;
      }
    };
  
    const memberId = getMemberId();
  
    const handleTaskReview = useCallback(async () => {
      if (!memberId) {
        setError("User ID not found. Please log in again.");
        return;
      }
    
      setLoading(true);
      setError(null);
    
      try {
        const response = await fetch(
          `http://localhost:8082/tasks/get-task/${memberId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!response.ok) {
          throw new Error("Failed to fetch tasks.");
        }
    
        const data = await response.json();
      
        setTasks(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, [memberId, token]);
    
    useEffect(() => {
      handleTaskReview();
    }, [handleTaskReview]);
    
  
  

  

 
    
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
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Member Dashboard</h1>

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
            } fixed top-0 right-0 w-48 bg-indigo-600 text-white p-4 space-y-4 lg:flex lg:space-x-4 lg:w-auto lg:static lg:flex-row lg:items-center`}
          >
            <div className="flex lg:flex-row flex-col items-center lg:space-x-4 space-y-4 lg:space-y-0">
              <button
                className={`px-4 py-2 rounded text-center ${
                  selectedSection === "tasks"
                    ? "bg-indigo-500"
                    : "bg-indigo-700 hover:bg-indigo-500"
                } transition-all duration-300 ease-in-out text-sm`}
                onClick={() => {
                  setSelectedSection("tasks");
                  setSelectedAction(null);
                  setMenuOpen(false);
                }}
              >
                Manage Tasks
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
        {selectedSection === "tasks" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Task Management</h2>
            <div className="flex flex-wrap gap-4 justify-start">
          <button
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              selectedAction === "taskReview" && "ring ring-green-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("taskReview")}
          >
            Task Review
          </button>
          <button
            className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${
              selectedAction === "updateStatus" && "ring ring-yellow-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("updateStatus")}
          >
            Update Task Status
          </button>
          <button
            className={`px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 ${
              selectedAction === "taskComments" && "ring ring-indigo-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("taskComments")}
          >
            Task Comments
          </button>
        </div>

            {/* Task Review Section */}
{selectedAction === "taskReview" && (
  <div className="mt-6 space-y-6">
    <h2 className="text-xl font-bold text-gray-800">Task Review</h2>

    {/* Loading and Error Handling */}
    {loading && (
      <p className="text-blue-500 animate-pulse">Loading tasks...</p>
    )}
    {error && <p className="text-red-500">{error}</p>}

    {/* Display Tasks */}
    {!loading && tasks.length > 0 && (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-green-200 border">
          <thead className="bg-green-100">
            <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Task Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Related Project
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tasks
              .sort((a, b) => b.priority - a.priority) // Sort by priority
              .map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {task.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {task.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {task.priority}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {task.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(task.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {task.project.name}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
    {/* No Tasks Found */}
    {!loading && tasks.length === 0 && (
      <p className="text-gray-600">No tasks assigned to this member.</p>
    )}
    </div>)}



            {/* Update Task Status Section */}
            {selectedAction === "updateStatus" && (
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

            {/* Task Comments Section */}
            {selectedAction === "taskComments" && (
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

          </div>
        )}
    
      </main>
    </div>
  );
};

export default MemberDashboard;
