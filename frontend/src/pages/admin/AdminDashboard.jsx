import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../../api/axios";

// --- Internal Component: Admin Navbar ---
const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          <span className="text-lg font-bold tracking-tight text-black">
            Remedy<span className="text-gray-400">.</span>{" "}
            <span className="text-xs font-normal text-gray-500 ml-1 border-l border-gray-300 pl-2">
              Admin
            </span>
          </span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-sm font-medium text-black border-b-2 border-black pb-5 mt-5">
            User Management
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- Main Component: Admin Dashboard ---
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const roles = ["CLIENT", "SUPPORT_L1", "DEVELOPER_L2", "ADMIN"];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("Unable to retrieve user directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, newRole) => {
    // Optimistic UI update could go here, but we'll stick to fetch-on-success for safety
    try {
      await api.patch(`/api/admin/users/${userId}/role`, {
        role: newRole,
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  // Helper for role badges
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-black text-white border-black";
      case "DEVELOPER_L2":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "SUPPORT_L1":
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  // Stats Calculation
  const stats = [
    { label: "Total Users", value: users.length },
    {
      label: "Support Staff",
      value: users.filter((u) => u.role === "SUPPORT_L1").length,
    },
    {
      label: "Developers",
      value: users.filter((u) => u.role === "DEVELOPER_L2").length,
    },
    { label: "Admins", value: users.filter((u) => u.role === "ADMIN").length },
  ];

  if (loading)
    return (
      <>
        <AdminNavbar />
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-4 bg-black rounded-full mb-2"></div>
            <span className="text-sm font-medium tracking-widest text-gray-400">
              LOADING DIRECTORY
            </span>
          </div>
        </div>
      </>
    );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-tight text-black">
            Team Directory
          </h1>
          <p className="text-gray-500 mt-2 text-sm tracking-wide">
            Manage user access levels and roles across the organization.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="border border-gray-200 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-light text-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-8 p-4 border border-red-200 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Table Container */}
        <div className="border border-gray-200 bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3">
            <div className="col-span-5 text-xs font-bold uppercase tracking-widest text-gray-500">
              User Details
            </div>
            <div className="col-span-3 text-xs font-bold uppercase tracking-widest text-gray-500">
              Current Role
            </div>
            <div className="col-span-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">
              Actions
            </div>
          </div>

          {/* Table Body */}
          <div>
            {users.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-200 group"
              >
                {/* User Details */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-black">
                      {user.email}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      ID: {user._id.slice(-6)}
                    </span>
                  </div>
                </div>

                {/* Current Role Badge */}
                <div className="col-span-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${getRoleBadgeStyle(
                      user.role
                    )}`}
                  >
                    {user.role.replace("_", " ")}
                  </span>
                </div>

                {/* Action: Change Role */}
                <div className="col-span-4 flex justify-end">
                  <div className="relative w-48">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                      className="appearance-none w-full bg-white border border-gray-300 text-black text-xs font-medium py-2 pl-3 pr-8 rounded-sm hover:border-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors cursor-pointer"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {/* Custom Chevron Icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-right">
          <p className="text-xs text-gray-400">
            Showing all {users.length} users in the organization.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
