import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ComplaintHistory from "../../components/complaints/ComplaintHistory";

// Import all Navbar variants
import ClientNavbar from "../../components/navbar/ClientNavbar";
import SupportNavbar from "../../components/navbar/SupportNavbar";
import DeveloperNavbar from "../../components/navbar/DeveloperNavbar";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH =================
  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/complaints/${id}`);
      setComplaint(res.data);
    } catch (err) {
      setError("Failed to load complaint details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  // ================= ACTION HANDLERS =================
  const assignToL1 = async () => {
    await api.patch(`/api/complaints/${id}/assign-l1`);
    fetchComplaint();
  };

  const startL1 = async () => {
    await api.patch(`/api/complaints/${id}/start-l1`);
    fetchComplaint();
  };

  const resolveL1 = async () => {
    await api.patch(`/api/complaints/${id}/resolve-l1`);
    fetchComplaint();
  };

  const escalateToL2 = async () => {
    await api.patch(`/api/complaints/${id}/escalate`);
    fetchComplaint();
  };

  const assignToL2 = async () => {
    await api.patch(`/api/complaints/${id}/assign-l2`);
    fetchComplaint();
  };

  const resolveL2 = async () => {
    await api.patch(`/api/complaints/${id}/resolve-l2`);
    fetchComplaint();
  };

  const reopenComplaint = async () => {
    await api.patch(`/api/complaints/${id}/reopen`);
    fetchComplaint();
  };

  // ================= STYLES & HELPERS =================
  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-500";
      case "IN_PROGRESS":
      case "IN_PROGRESS_L1":
      case "IN_PROGRESS_L2":
        return "bg-blue-600";
      case "CLOSED":
        return "bg-gray-400";
      case "ESCALATED_TO_L2":
        return "bg-purple-600";
      default:
        return "bg-yellow-500";
    }
  };

  // Helper to check if any actions are available for the current user
  const hasActionsAvailable = (role, status) => {
    if (role === "CLIENT") {
      return status === "RESOLVED";
    }
    if (role === "SUPPORT_L1") {
      return ["OPEN", "REOPENED", "ASSIGNED_L1", "IN_PROGRESS_L1"].includes(
        status
      );
    }
    if (role === "DEVELOPER_L2") {
      return ["ESCALATED_TO_L2", "IN_PROGRESS_L2"].includes(status);
    }
    return false;
  };

  // Dynamic Navbar Renderer
  const renderNavbar = () => {
    switch (role) {
      case "SUPPORT_L1":
        return <SupportNavbar />;
      case "DEVELOPER_L2":
        return <DeveloperNavbar />;
      case "CLIENT":
      default:
        // Default to client, or you could add an AdminNavbar case if needed
        return <ClientNavbar />;
    }
  };

  // ================= RENDER =================
  if (loading)
    return (
      <>
        {renderNavbar()}
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-4 bg-black rounded-full mb-2"></div>
            <span className="text-sm font-medium tracking-widest text-gray-400">
              LOADING TICKET
            </span>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        {renderNavbar()}
        <div className="p-12 flex justify-center">
          <div className="text-red-600 border border-red-200 bg-red-50 px-6 py-4 rounded-sm">
            {error}
          </div>
        </div>
      </>
    );

  if (!complaint) return null;

  const {
    title,
    description,
    status,
    createdBy,
    assignedL1,
    assignedL2,
    createdAt,
  } = complaint;

  const canAct = hasActionsAvailable(role, status);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {renderNavbar()}

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 text-sm hover:text-black transition-colors mb-8 flex items-center gap-2 group w-fit"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header Block */}
            <div className="border-b border-gray-100 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm text-gray-400 uppercase tracking-widest">
                  #{complaint._id.slice(-6)}
                </span>
                <div className="flex items-center gap-2 px-2 py-0.5 rounded-full border border-gray-100 bg-gray-50">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${getStatusColor(
                      status
                    )}`}
                  ></span>
                  <span className="text-xs font-bold tracking-wide text-gray-600 uppercase">
                    {status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-black leading-tight">
                {title}
              </h1>
            </div>

            {/* Description Block */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Description
              </h3>
              <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap font-light">
                {description}
              </div>
            </div>

            {/* History Component Integration */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
                Activity Timeline
              </h3>
              <div className="pl-2">
                <ComplaintHistory complaint={complaint} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Metadata & Actions) */}
          <div className="space-y-8">
            {/* Action Panel */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
              <h3 className="text-sm font-bold text-black mb-4">Actions</h3>

              {/* Render Buttons if Actions Available */}
              {canAct ? (
                <div className="flex flex-col gap-3">
                  {/* -------- SUPPORT L1 ACTIONS -------- */}
                  {role === "SUPPORT_L1" && (
                    <>
                      {(status === "OPEN" || status === "REOPENED") && (
                        <button
                          onClick={assignToL1}
                          className="w-full bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Assign to Me
                        </button>
                      )}

                      {status === "ASSIGNED_L1" && (
                        <button
                          onClick={startL1}
                          className="w-full bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Start Investigation
                        </button>
                      )}

                      {status === "IN_PROGRESS_L1" && (
                        <div className="space-y-3">
                          <button
                            onClick={resolveL1}
                            className="w-full border border-black text-black px-4 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all"
                          >
                            Mark as Resolved
                          </button>
                          <button
                            onClick={escalateToL2}
                            className="w-full border border-red-200 text-red-600 px-4 py-3 text-sm font-medium hover:bg-red-50 transition-colors"
                          >
                            Escalate to L2
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* -------- DEVELOPER L2 ACTIONS -------- */}
                  {role === "DEVELOPER_L2" && (
                    <>
                      {status === "ESCALATED_TO_L2" && (
                        <button
                          onClick={assignToL2}
                          className="w-full bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          Assign to Me
                        </button>
                      )}

                      {status === "IN_PROGRESS_L2" && (
                        <button
                          onClick={resolveL2}
                          className="w-full bg-green-600 text-white px-4 py-3 text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Resolve Issue
                        </button>
                      )}
                    </>
                  )}

                  {/* -------- CLIENT ACTIONS -------- */}
                  {role === "CLIENT" && (
                    <>
                      {status === "RESOLVED" && (
                        <button
                          onClick={reopenComplaint}
                          className="w-full border border-gray-300 text-black px-4 py-3 text-sm font-medium hover:border-black transition-colors"
                        >
                          Reopen Ticket
                        </button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                /* No Actions Available State */
                <div className="flex flex-col items-center justify-center text-center py-6 bg-gray-50 border border-gray-100 rounded-sm">
                  <svg
                    className="w-6 h-6 text-gray-300 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Status: {status.replace(/_/g, " ")}
                  </span>
                  <p className="text-xs text-gray-400 mt-2 px-4 leading-relaxed">
                    Currently no actions available. <br /> Please wait for an
                    update.
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Panel */}
            <div className="space-y-6 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Created By
                </p>
                <p className="font-medium text-black">{createdBy?.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Created
                  </p>
                  <p className="text-gray-600">
                    {new Date(createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Last Update
                  </p>
                  <p className="text-gray-600">
                    {new Date(
                      complaint.updatedAt || createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Assignees
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">L1 Support</span>
                    <span
                      className={`font-mono text-xs ${
                        assignedL1 ? "text-black" : "text-gray-300 italic"
                      }`}
                    >
                      {assignedL1?.email || "Unassigned"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">L2 Engineer</span>
                    <span
                      className={`font-mono text-xs ${
                        assignedL2 ? "text-black" : "text-gray-300 italic"
                      }`}
                    >
                      {assignedL2?.email || "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetails;
