import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, BarElement, LinearScale } from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";


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
    if (formData.startDate > formData.endDate) {
      toast.warn("Start date cannot be later than end date.");
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

  const [selectedProjectProgress, setSelectedProjectProgress] = useState(null);
  const [usersProgress, setUsersProgress] = useState([]);

  const handleProjectChangeProgress = async (e) => {
    const projectId = Number(e.target.value);
    setSelectedProjectProgress(projectId);
  
    try {
      const membersResponse = await fetch(
        `http://localhost:8082/projects/get-members/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (membersResponse.ok) {
        const users = await membersResponse.json();
        setUsersProgress(users);
      } else {
        const errorText = await membersResponse.text();
        toast.error(errorText || "Failed to load users for the selected project.");
      }
  
      const tasksResponse = await fetch(
        `http://localhost:8082/tasks/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (tasksResponse.ok) {
        const tasks = await tasksResponse.json();
        const completedTasks = tasks.filter((task) => task.status === "completed");
        const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
        const notStartedTasks = tasks.filter((task) => task.status === "not-started");
        const delayedTasks = tasks.filter(
          (task) =>
            task.status !== "completed" && new Date(task.deadline) < new Date()
        );
  
        const progressPercentage = Math.round((completedTasks.length / tasks.length) * 100);
  
        setTasksProgress(tasks);
        setProgressData({
          progressPercentage,
          completedTasks,
          inProgressTasks,
          notStartedTasks,
          delayedTasks,
        });
      } else {
        const errorText = await tasksResponse.text();
        toast.error(errorText || "Failed to fetch project details.");
      }
    } catch (error) {
      toast.error("Error fetching project data. Please try again.");
      console.error("Error fetching project data:", error);
    }
  };
  

  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, BarElement, LinearScale);

  const TaskStatusChart = ({ completed, inProgress, notStarted, size = 350 }) => {
    const data = {
      labels: ["Completed", "In Progress", "Not Started"],
      datasets: [
        {
          label: "Task Status",
          data: [completed, inProgress, notStarted],
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
          borderColor: ["#388E3C", "#FFA000", "#D32F2F"],
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
          },
        },
      },
    };
  
    return (
      <div style={{ width: `${size}px`, height: `${size}px` }}>
        <Pie data={data} options={options} />
      </div>
    );
  };


      const [tasksProgress, setTasksProgress] = useState([]);
      const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
      const [progressData, setProgressData] = useState({
      progressPercentage: 0,
      completedTasks: [],
      inProgressTasks: [],
      notStartedTasks: [],
      delayedTasks: [],
      });


      const [selectedTeamReport, setSelectedTeamReport] = useState("");
      const [startDate, setStartDate] = useState("");
      const [endDate, setEndDate] = useState("");
      const [statistics, setStatistics] = useState(null);

      const handleTeamChange = (e) => {
        setSelectedTeamReport(e.target.value);
      };

      const handleFetchStatistics = async () => {
        if (!selectedTeamReport || !startDate || !endDate) {
          toast.warn("Please select a team and date range.");
          return;
        }

        if (new Date(startDate) > new Date(endDate)) {
          toast.warn("Start date cannot be later than end date.");
          return;
        }
        
        const response = await fetchStatistics(selectedTeamReport, startDate, endDate);
        setStatistics(response);
      };

      const fetchStatistics = async (teamId, startDate, endDate) => {
        try {
          const response = await fetch(`http://localhost:8082/tasks/get-tasks?teamId=${teamId}&startDate=${startDate}&endDate=${endDate}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      
          if (!response.ok) throw new Error("Failed to fetch statistics");
      
          const tasks = await response.json();
          toast.success("Statistics loaded successfully!");
      
          const totalTasks = tasks.length;
          const completedTasks = tasks.filter((task) => task.status === "completed").length;
          const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
          const notStartedTasks = tasks.filter((task) => task.status === "not-started").length;
      
          let delayedTasks = tasks.filter((task) => new Date(task.deadline) < new Date(task.completedAt)).length;
          delayedTasks += tasks.filter((task) => new Date(task.deadline) < new Date()).length;
      
          const totalCompletionTime = tasks
            .filter((task) => task.status === "completed")
            .reduce((sum, task) => sum + (new Date(task.completedAt) - new Date(task.startDate)) / (1000 * 60 * 60 * 24), 0);
      
          const averageCompletionTime = (totalCompletionTime / completedTasks).toFixed(2);
      
          const performanceData = await Promise.all(
            tasks.map(async (task) => {
              try {
                const memberResponse = await fetch(`http://localhost:8082/tasks/get-member?id=${task.id}`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });
      
                if (!memberResponse.ok) throw new Error("Failed to fetch member");
      
                const member = await memberResponse.json();
                return {
                  member: `${member.firstName} ${member.lastName}`,
                  completedTasks: task.status === "completed" ? 1 : 0,
                  delayedTasks:
                    (new Date(task.deadline) < new Date(task.completedAt) || new Date(task.deadline) < new Date()) ? 1 : 0,
                };
              } catch (error) {
                console.error(`Error fetching member for task ${task.id}:`, error);
                return {
                  member: "Unknown",
                  completedTasks: task.status === "completed" ? 1 : 0,
                  delayedTasks:
                    (new Date(task.deadline) < new Date(task.completedAt) || new Date(task.deadline) < new Date()) ? 1 : 0,
                };
              }
            })
          );
      
          return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            notStartedTasks,
            averageCompletionTime,
            delayedTasks,
            performanceData,
          };
        } catch (error) {
          console.error("Error fetching statistics:", error);
          toast.error("Failed to fetch team statistics. Please try again later.");
        }
      };
      
      const PerformanceChart = ({ data }) => {
        const chartData = {
          labels: data.map((item) => item.member),
          datasets: [
            {
              label: "Completed Tasks",
              data: data.map((item) => item.completedTasks),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Delayed Tasks",
              data: data.map((item) => item.delayedTasks),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        };
      
        return <Bar data={chartData} />;
      };
      

        const exportToPDF = () => {
          const doc = new jsPDF();
          doc.text("Team Statistics Report", 10, 10);
          doc.autoTable({
            head: [["Total Tasks", "Completed", "In Progress", "Not Started", "Delayed"]],
            body: [[
              statistics.totalTasks,
              statistics.completedTasks,
              statistics.inProgressTasks,
              statistics.notStartedTasks,
              statistics.delayedTasks,
            ]],
          });
          doc.save("team_statistics_report.pdf");
        };

        const exportToExcel = () => {
          const worksheet = XLSX.utils.json_to_sheet([statistics]);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Statistics");
          XLSX.writeFile(workbook, "team_statistics_report.xlsx");
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
                Generate Report
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
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select a project for the progress monitoring
                </label>
                <select
                  value={selectedProjectProgress || ""}
                  onChange={handleProjectChangeProgress}
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

              {progressData && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-4">Project Progress</h3>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                    <div
                      className="bg-sky-600 h-4 rounded-full"
                      style={{ width: `${progressData.progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mb-4">
                    Progress: {progressData.progressPercentage}% completed
                  </p>

                  {/* Delayed Tasks */}
                  {progressData.delayedTasks.length > 0 ? (
                    <div className="text-red-600 font-bold">
                      {progressData.delayedTasks.length} tasks are delayed!
                    </div>
                  ) : (
                    <div className="text-green-600 font-bold">No delays detected.</div>
                  )}

                  {/* Task Status Chart */}
                  <div className="mt-6">
                    <h4 className="text-lg font-bold">Task Status Overview</h4>
                    <div className="flex justify-center mt-4">
                      <TaskStatusChart
                        completed={progressData.completedTasks.length}
                        inProgress={progressData.inProgressTasks.length}
                        notStarted={progressData.notStartedTasks.length}
                      />
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="mt-6">
                    <h4 className="text-lg font-bold">Task Details</h4>
                    <ul>
                      {tasksProgress.map((task) => (
                        <li key={task.id} className="border-b py-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-bold">{task.name}</h5>
                              <p>Status: {task.status}</p>
                            </div>
                            <button
                            onClick={() => setSelectedTaskDetails(task)}
                            className="text-blue-500 hover:underline"
                          >
                            More Details
                          </button>
                        </div>

                {selectedTaskDetails?.id === task.id && (
                <div className="mt-2 text-sm text-gray-600">
                <p>Description: {task.description}</p>
                <p>
                Assigned Member:{" "}
                {usersProgress
                  .filter((user) => user.id === task.userId)
                  .map((user) => (
                    <label key={user.id}>
                      {user.firstName} {user.lastName}
                    </label>
                  ))}
                </p>
                <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              </div>
               )}
                    </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

          </div>
        )}

          {selectedSection === "teams" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Team Reports</h2>
              <div className="flex flex-wrap gap-4 justify-start">
          <button
            type="button"
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              selectedAction === "teamStatistics" && "ring ring-green-300"
            } w-full sm:w-auto`}
            onClick={() => handleAction("teamStatistics")}
          >
            Team Statistics
          </button>
        </div>


        {selectedAction === "teamStatistics" && (
        <div className="mt-6 space-y-4">
          <div>
            {/* Team Selection */}
            <label className="block text-sm font-medium text-gray-700">
              Select a Team
            </label>
            <select
              value={selectedTeamReport || ""}
              onChange={handleTeamChange}
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

          <div>
           
            <label className="block text-sm font-medium text-gray-700">
              Select Date Range
            </label>
            <div className="flex space-x-4 mt-2">
              <input
                type="date"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-4 py-2 border rounded"
              />
              <input
                type="date"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-4 py-2 border rounded"
              />
            </div>
          </div>

        
          <button
            onClick={handleFetchStatistics}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
          >
            Load Statistics
          </button>

          {statistics && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Team Statistics Report</h3>
              <div className="space-y-2">
                <p>Total Tasks: {statistics.totalTasks}</p>
                <p>Completed Tasks: {statistics.completedTasks}</p>
                <p>In Progress Tasks: {statistics.inProgressTasks}</p>
                <p>Not Started Tasks: {statistics.notStartedTasks}</p>
                <p>Average Completion Time: {statistics.averageCompletionTime} days</p>
                <p>Delayed Tasks: {statistics.delayedTasks}</p>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-bold">Team Performance Overview</h4>
                <div className="flex justify-center mt-4">
                  <PerformanceChart data={statistics.performanceData} />
                </div>
              </div>

          
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Export to PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Export to Excel
                </button>
              </div>

                  </div>
                )}
              </div>
            )}



          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
