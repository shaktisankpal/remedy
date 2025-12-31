import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import DeveloperNavbar from "../../components/navbar/DeveloperNavbar";

const DeveloperDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination State
  const [escalationPage, setEscalationPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 3;

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/complaints/l2");
      setComplaints(res.data);
    } catch (err) {
      setError("Failed to sync engineering tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ================= ACTIONS =================

  const assignToMe = async (id) => {
    try {
      await api.patch(`/api/complaints/${id}/assign-l2`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to claim ticket");
    }
  };

  const resolveComplaint = async (id) => {
    if (!window.confirm("Confirm fix deployment and resolution?")) return;
    try {
      await api.patch(`/api/complaints/${id}/resolve-l2`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resolve complaint");
    }
  };

  // ================= DATA PROCESSING =================

  const unassigned = complaints.filter((c) => c.status === "ESCALATED_TO_L2");
  const assignedToMe = complaints.filter((c) => c.status === "IN_PROGRESS_L2");

  // Helper for status visuals
  const getStatusColor = (status) => {
    switch (status) {
      case "ESCALATED_TO_L2":
        return "bg-purple-600";
      case "IN_PROGRESS_L2":
        return "bg-blue-600";
      default:
        return "bg-gray-300";
    }
  };

  // --- Pagination Logic: Escalations ---
  const totalEscalationPages = Math.ceil(unassigned.length / itemsPerPage);
  const currentEscalations = unassigned.slice(
    (escalationPage - 1) * itemsPerPage,
    escalationPage * itemsPerPage
  );

  // --- Pagination Logic: Active Tickets ---
  const totalActivePages = Math.ceil(assignedToMe.length / itemsPerPage);
  const currentActive = assignedToMe.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  // Adjust pages if items are moved/removed
  useEffect(() => {
    if (escalationPage > totalEscalationPages && totalEscalationPages > 0) {
      setEscalationPage(totalEscalationPages);
    }
    if (activePage > totalActivePages && totalActivePages > 0) {
      setActivePage(totalActivePages);
    }
  }, [unassigned.length, assignedToMe.length]);

  if (loading)
    return (
      <>
        <DeveloperNavbar />
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-4 bg-black rounded-full mb-2"></div>
            <span className="text-sm font-medium tracking-widest text-gray-400">
              LOADING CONSOLE
            </span>
          </div>
        </div>
      </>
    );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-purple-900 selection:text-white">
      <DeveloperNavbar />

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-light tracking-tight text-black">
            Developer Console
          </h1>
          <p className="text-gray-500 mt-2 text-sm tracking-wide">
            L2 Escalations and technical resolution tracking.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-red-200 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* =========================================
              SECTION 1: ESCALATION QUEUE
             ========================================= */}
          <section className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-purple-700">
                Escalation Queue{" "}
                <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded ml-2 border border-purple-100">
                  {unassigned.length}
                </span>
              </h2>
            </div>

            {unassigned.length === 0 ? (
              <div className="p-8 border border-dashed border-gray-200 text-center rounded-sm">
                <p className="text-gray-400 text-sm">No pending escalations.</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {currentEscalations.map((c) => (
                  <div
                    key={c._id}
                    className="group border border-gray-200 p-6 hover:border-purple-600 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(
                            c.status
                          )}`}
                        ></span>
                        <span className="text-xs font-bold tracking-wide text-gray-600 uppercase">
                          Escalated
                        </span>
                      </div>
                      <span className="text-xs font-mono text-gray-400">
                        #{c._id.slice(-6)}
                      </span>
                    </div>

                    <h3 className="font-medium text-lg mb-2 text-black group-hover:underline decoration-1 underline-offset-4 decoration-purple-600">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-light">
                      {c.description ||
                        "No description provided by L1 Support."}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-black transition-colors"
                      >
                        Review Specs
                      </Link>
                      <button
                        onClick={() => assignToMe(c._id)}
                        className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition-colors"
                      >
                        Claim Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls: Escalations */}
            {unassigned.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Page {escalationPage} of {totalEscalationPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEscalationPage((p) => Math.max(1, p - 1))}
                    disabled={escalationPage === 1}
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-gray-200 hover:border-purple-600 hover:text-purple-700 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-inherit transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setEscalationPage((p) =>
                        Math.min(totalEscalationPages, p + 1)
                      )
                    }
                    disabled={escalationPage === totalEscalationPages}
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-gray-200 hover:border-purple-600 hover:text-purple-700 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-inherit transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* =========================================
              SECTION 2: ACTIVE SPRINTS
             ========================================= */}
          <section className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black">
                Active Tickets{" "}
                <span className="bg-black text-white px-1.5 py-0.5 rounded ml-2">
                  {assignedToMe.length}
                </span>
              </h2>
            </div>

            {assignedToMe.length === 0 ? (
              <div className="p-8 border border-gray-100 bg-gray-50 text-center rounded-sm">
                <p className="text-gray-400 text-sm">No active tickets.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Claim an escalation to start working.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {currentActive.map((c) => (
                  <div
                    key={c._id}
                    className="relative border-l-4 border-purple-600 pl-6 py-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-black">
                        {c.title}{" "}
                        <span className="text-gray-400 font-normal text-xs ml-2">
                          #{c._id.slice(-6)}
                        </span>
                      </h3>
                      <div className="px-2 py-0.5 bg-blue-50 rounded text-[10px] font-bold uppercase tracking-wide text-blue-600">
                        In Progress
                      </div>
                    </div>

                    <Link
                      to={`/complaints/${c._id}`}
                      className="text-sm text-gray-500 hover:text-black underline decoration-gray-300 underline-offset-2 mb-4 inline-block"
                    >
                      Open technical details
                    </Link>

                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => resolveComplaint(c._id)}
                        className="w-full bg-black text-white py-2 text-xs font-bold uppercase tracking-wider hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Deploy Fix & Resolve</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls: Active Tickets */}
            {assignedToMe.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Page {activePage} of {totalActivePages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                    disabled={activePage === 1}
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-gray-200 hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setActivePage((p) => Math.min(totalActivePages, p + 1))
                    }
                    disabled={activePage === totalActivePages}
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-gray-200 hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;
