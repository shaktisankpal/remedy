import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import SupportNavbar from "../../components/navbar/SupportNavbar";

const SupportDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/complaints/l1");
      setComplaints(res.data);
    } catch (err) {
      setError("Unable to sync tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ---- ACTION HANDLERS ----
  const assignToMe = async (id) => {
    try {
      await api.patch(`/api/complaints/${id}/assign-l1`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign complaint");
    }
  };

  const startWork = async (id) => {
    try {
      await api.patch(`/api/complaints/${id}/start-l1`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot start work");
    }
  };

  const resolveComplaint = async (id) => {
    if (!window.confirm("Mark this ticket as resolved?")) return;
    try {
      await api.patch(`/api/complaints/${id}/resolve-l1`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot resolve complaint");
    }
  };

  const escalateComplaint = async (id) => {
    if (!window.confirm("Escalate this ticket to L2 Developer?")) return;
    try {
      await api.patch(`/api/complaints/${id}/escalate`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot escalate complaint");
    }
  };

  // Helper for status visuals
  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-green-500";
      case "REOPENED":
        return "bg-orange-500";
      case "ASSIGNED_L1":
        return "bg-gray-400";
      case "IN_PROGRESS_L1":
        return "bg-blue-600";
      default:
        return "bg-gray-300";
    }
  };

  if (loading)
    return (
      <>
        <SupportNavbar />
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-4 bg-black rounded-full mb-2"></div>
            <span className="text-sm font-medium tracking-widest text-gray-400">
              LOADING WORKSPACE
            </span>
          </div>
        </div>
      </>
    );

  const unassigned = complaints.filter(
    (c) => c.status === "OPEN" || c.status === "REOPENED"
  );

  const assignedToMe = complaints.filter(
    (c) => c.status === "ASSIGNED_L1" || c.status === "IN_PROGRESS_L1"
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <SupportNavbar />

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-light tracking-tight text-black">
            Support Workspace
          </h1>
          <p className="text-gray-500 mt-2 text-sm tracking-wide">
            Manage incoming requests and your active caseload.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-red-200 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* SECTION 1: INCOMING QUEUE (Unassigned) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Incoming Tickets{" "}
                <span className="bg-gray-100 text-black px-1.5 py-0.5 rounded ml-2">
                  {unassigned.length}
                </span>
              </h2>
            </div>

            {unassigned.length === 0 ? (
              <div className="p-8 border border-dashed border-gray-200 text-center rounded-sm">
                <p className="text-gray-400 text-sm">
                  No new tickets in queue.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {unassigned.map((c) => (
                  <div
                    key={c._id}
                    className="group border border-gray-200 p-6 hover:border-black transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(
                            c.status
                          )}`}
                        ></span>
                        <span className="text-xs font-bold tracking-wide text-gray-600 uppercase">
                          {c.status}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-gray-400">
                        #{c._id.slice(-6)}
                      </span>
                    </div>

                    <h3 className="font-medium text-lg mb-2 text-black group-hover:underline decoration-1 underline-offset-4">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-light">
                      {c.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-black transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => assignToMe(c._id)}
                        className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                      >
                        Assign to Me
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: MY CASELOAD (Assigned) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black">
                Active tickets{" "}
                <span className="bg-black text-white px-1.5 py-0.5 rounded ml-2">
                  {assignedToMe.length}
                </span>
              </h2>
            </div>

            {assignedToMe.length === 0 ? (
              <div className="p-8 border border-gray-100 bg-gray-50 text-center rounded-sm">
                <p className="text-gray-400 text-sm">Your caseload is empty.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Assign tickets from the queue to start working.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedToMe.map((c) => (
                  <div
                    key={c._id}
                    className="relative border-l-4 border-black pl-6 py-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-black">
                        {c.title}{" "}
                        <span className="text-gray-400 font-normal text-xs ml-2">
                          #{c._id.slice(-6)}
                        </span>
                      </h3>
                      <div className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold uppercase tracking-wide text-gray-600">
                        {c.status.replace(/_/g, " ")}
                      </div>
                    </div>

                    <Link
                      to={`/complaints/${c._id}`}
                      className="text-sm text-gray-500 hover:text-black underline decoration-gray-300 underline-offset-2 mb-4 inline-block"
                    >
                      View Details
                    </Link>

                    <div className="flex gap-3 mt-2">
                      {c.status === "ASSIGNED_L1" && (
                        <button
                          onClick={() => startWork(c._id)}
                          className="flex-1 bg-black text-white py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                        >
                          Start Work
                        </button>
                      )}

                      {c.status === "IN_PROGRESS_L1" && (
                        <>
                          <button
                            onClick={() => resolveComplaint(c._id)}
                            className="flex-1 border border-green-600 text-green-700 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-green-50 transition-colors"
                          >
                            Resolve
                          </button>

                          <button
                            onClick={() => escalateComplaint(c._id)}
                            className="flex-1 border border-gray-200 text-gray-500 py-1.5 text-xs font-bold uppercase tracking-wider hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            Escalate (L2)
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default SupportDashboard;
