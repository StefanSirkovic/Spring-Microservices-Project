import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("users");
  const [selectedAction, setSelectedAction] = useState(null);

  const handleAction = (action) => {
    setSelectedAction(action);
  };

  useEffect(() => {
    fetch("http://localhost:8080/admin/dashboard", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.text())
      .catch((err) => console.error("Error fetching Admin Dashboard:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
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
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const userData = Object.fromEntries(formData);
                  console.log("Add User Data:", userData);
                  alert("User successfully added!");
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
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
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </form>
            )}

            {/* Delete User Form */}
            {selectedAction === "deleteUser" && (
              <form
                className="mt-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const userId = e.target.userId.value;
                  console.log("Delete User ID:", userId);
                  alert("User successfully deleted!");
                }}
              >
                <label className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <input
                  type="text"
                  name="userId"
                  className="block w-full px-4 py-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete User
                </button>
              </form>
            )}

            {/* Update User Form */}
            {selectedAction === "updateUser" && (
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const updatedData = Object.fromEntries(formData);
                  console.log("Update User Data:", updatedData);
                  alert("User successfully updated!");
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <input
                    type="text"
                    name="userId"
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="block w-full px-4 py-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Update
                </button>
              </form>
            )}
          </div>
        )}

        {selectedSection === "teams" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Team Management</h2>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => alert("Create Team")}
              >
                Create Team
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => alert("Edit Team")}
              >
                Edit Team
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
