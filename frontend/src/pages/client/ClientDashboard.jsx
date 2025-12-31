import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import ClientNavbar from "../../components/navbar/ClientNavbar";

const ClientDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/complaints/my");
      // Filter strictly for non-closed complaints (Pending, In Progress, Resolved)
      const activeComplaints = res.data.filter((c) => c.status !== "CLOSED");
      setComplaints(activeComplaints);
    } catch (err) {
      setError("Unable to retrieve your active cases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const closeComplaint = async (id, e) => {
    e.preventDefault(); // Prevent navigating to details
    if (
      !window.confirm(
        "Are you sure you want to close this case? This action is final."
      )
    )
      return;

    try {
      await api.patch(`/api/complaints/${id}/close`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    }
  };

  const reopenComplaint = async (id, e) => {
    e.preventDefault();
    try {
      await api.patch(`/api/complaints/${id}/reopen`);
      fetchComplaints();
    } catch (err) {
      alert("Failed to reopen.");
    }
  };

  // Helper for status visuals
  const getStatusStyle = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-blue-600";
      default:
        return "bg-yellow-500";
    }
  };

  if (loading)
    return (
      <>
        <ClientNavbar />
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-4 bg-black rounded-full mb-2"></div>
            <span className="text-sm font-medium tracking-widest text-gray-400">
              LOADING
            </span>
          </div>
        </div>
      </>
    );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <ClientNavbar />

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-black">
              Active Complaints
            </h1>
            <p className="text-gray-500 mt-2 text-sm tracking-wide">
              Manage your ongoing cases and track their resolution status.
            </p>
          </div>

          <button
            onClick={() => navigate("/client/create")}
            className="mt-4 md:mt-0 group flex items-center gap-2 bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-all duration-300"
          >
            <span>New Complaint</span>
            {/* Plus Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-red-200 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-300 rounded-sm">
            <p className="text-gray-400 font-light text-lg">
              No active complaints found.
            </p>
            <button
              onClick={() => navigate("/client/create")}
              className="mt-4 text-sm text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
            >
              Start a new case
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <Link
                to={`/complaints/${complaint._id}`}
                key={complaint._id}
                className="group block p-8 border border-gray-200 hover:border-black transition-colors duration-300 bg-white relative"
              >
                {/* Card Top: Status & ID */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                    #{complaint._id.slice(-6)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${getStatusStyle(
                        complaint.status
                      )}`}
                    ></span>
                    <span className="text-xs font-semibold tracking-wide text-gray-700">
                      {complaint.status}
                    </span>
                  </div>
                </div>

                {/* Card Content: Title */}
                <h2 className="text-xl font-medium text-black mb-2 line-clamp-1 group-hover:underline decoration-1 underline-offset-4">
                  {complaint.title}
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                  Created on{" "}
                  {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                {/* Card Bottom: Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    View Details
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>

                  <div className="flex gap-3 z-10">
                    {/* Only show Reopen if resolved, otherwise show Close */}
                    {complaint.status === "RESOLVED" ? (
                      <button
                        onClick={(e) => reopenComplaint(complaint._id, e)}
                        className="text-xs font-medium text-gray-500 hover:text-black border border-gray-200 hover:border-black px-3 py-1.5 transition-all"
                      >
                        Reopen
                      </button>
                    ) : (
                      <button
                        onClick={(e) => closeComplaint(complaint._id, e)}
                        className="text-xs font-medium text-gray-400 hover:text-red-600 px-2 py-1 transition-colors"
                      >
                        Close Case
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
