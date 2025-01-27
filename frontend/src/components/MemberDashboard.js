import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {jwtDecode} from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';


const MemberDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("tasks");
  const [selectedAction, setSelectedAction] = useState(null);
 

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
    
  
    const [selectedTask, setSelectedTask] = useState(null);
    const [newStatus, setNewStatus] = useState("");
  
    const handleUpdateStatus = async () => {
      if (!selectedTask || !newStatus) {
        setError("Please select a task and a new status.");
        return;
      }
  
      try {
        window.location.reload();
        setLoading(true);
        toast.success("Task status updated successfully!");
        setError(null);
        setSelectedAction(null);
        await updateTaskStatus(selectedTask, newStatus);
        
        
      } catch (err) {
        setError("Failed to update task status.");
      } finally {
        setLoading(false);
      }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
      const response = await fetch(`http://localhost:8082/tasks/update-status/${taskId}?status=${newStatus}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      });
    
      if (!response.ok) {
        throw new Error("Failed to update task status");

      }
    
      const data = await response.json();
      return data;
      
    };


    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [selectedTaskComment, setSelectedTaskComment] = useState(null);

    const fetchTaskComments = async (taskId) => {
      const response = await fetch(`http://localhost:8082/tasks/${taskId}/get-comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments.");
      }
      const data = await response.json();
  
      const parsedComments = data.map((item) => {
        try {
          return JSON.parse(item);
        } catch (error) {
          console.error("Failed to parse comment:", item, error);
          return null;
        }
      }).filter((comment) => comment && comment.text); 

      
      return parsedComments;
    };

    const handleAddComment = async () => {
      if (!newComment.trim()) {
        setError("Comment cannot be empty.");
        return;
      }
      
    
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8082/tasks/${selectedTaskComment}/add-comment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newComment }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to add comment.");
        }
    
        
        const updatedComments = await fetchTaskComments(selectedTaskComment);
        setComments(updatedComments);
       
        setNewComment("");
        toast.success("Comment added successfully!");
        setError(null);
        setSelectedAction(null);
        
      } catch (err) {
        setError("Failed to add comment.");
      } finally {
        setLoading(false);
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

        
        {loading && (
          <p className="text-blue-500 animate-pulse">Loading tasks...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        
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
                  .sort((a, b) => b.priority - a.priority)
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
        
        {!loading && tasks.length === 0 && (
          <p className="text-gray-600">No tasks assigned to this member.</p>
        )}
        </div>
      )}

            {/* Update Task Status Section */}
            {selectedAction === "updateStatus" && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Select Task to Update Status</h3>
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

      
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Select New Status</label>
              <select
                value={newStatus || ""}
                onChange={(e) => setNewStatus(e.target.value)}
                className="block w-full px-4 py-2 border rounded mt-2"
              >
                <option value="" disabled>Select a status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              onClick={handleUpdateStatus}
              className="bg-yellow-500 text-white px-4 py-2 mt-4 rounded hover:bg-yellow-600"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
              </div>
            )}



            {/* Task Comments Section */}
            {selectedAction === "taskComments" && (
            <div className="mt-6">
            <h3 className="text-lg font-bold">Task Comments</h3>

    
            <label htmlFor="taskSelect" className="block mt-4 font-medium">
              Select a Task:
            </label>
            <select
              id="taskSelect"
              value={selectedTaskComment || ""}
              onChange={async (e) => {
                const taskId = Number(e.target.value);
                setSelectedTaskComment(taskId);
                setLoading(true);
                try {
                  const comments = await fetchTaskComments(taskId);
                  setComments(comments);
                  setError(null);
                } catch (err) {
                  setError("Failed to fetch comments.");
                } finally {
                  setLoading(false);
                }
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

    
            {selectedTaskComment && (
              <div className="mt-4">
                <label htmlFor="commentText" className="block font-medium">
                  Add a Comment:
                </label>
                <textarea
                  id="commentText"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  className="block w-full px-4 py-2 border rounded mt-2"
                />

                <button
                  onClick={handleAddComment}
                  className="bg-indigo-500 text-white px-4 py-2 mt-4 rounded hover:bg-indigo-600"
                  disabled={loading || !newComment.trim()}
                >
                  {loading ? "Adding Comment..." : "Add Comment"}
                </button>
              </div>
            )}


            <div className="mt-6">
            <h4 className="text-md font-semibold">Comments:</h4>
            {comments.length > 0 ? (
              <ul className="list-disc pl-5">
                {comments.map((comment, index) => (
                  <li key={index} className="text-gray-800">
                    {comment.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No comments for this task.</p>
            )}
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}


          </div>
        )}
    
      </main>
    </div>
  );
};

export default MemberDashboard;
