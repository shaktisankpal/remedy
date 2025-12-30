import { useEffect, useState } from "react";
import api from "../../api/axios";

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
      setError("Failed to load complaints");
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
    try {
      await api.patch(`/api/complaints/${id}/resolve-l1`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot resolve complaint");
    }
  };

  const escalateComplaint = async (id) => {
    try {
      await api.patch(`/api/complaints/${id}/escalate`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot escalate complaint");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const unassigned = complaints.filter(
    (c) => c.status === "OPEN" || c.status === "REOPENED"
  );

  const assignedToMe = complaints.filter(
    (c) => c.status === "ASSIGNED_L1" || c.status === "IN_PROGRESS_L1"
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Support Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* UNASSIGNED */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Open / Reopened Complaints
        </h2>

        {unassigned.length === 0 ? (
          <p className="text-gray-500">No complaints available</p>
        ) : (
          <div className="space-y-3">
            {unassigned.map((c) => (
              <div
                key={c._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-600">Status: {c.status}</p>
                  <p className="text-gray-700 mt-1">{c.description}</p>
                </div>

                <button
                  onClick={() => assignToMe(c._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Assign to me
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ASSIGNED TO ME */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Assigned to Me</h2>

        {assignedToMe.length === 0 ? (
          <p className="text-gray-500">No assigned complaints</p>
        ) : (
          <div className="space-y-3">
            {assignedToMe.map((c) => (
              <div
                key={c._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-600">Status: {c.status}</p>
                </div>

                <div className="flex gap-2">
                  {c.status === "ASSIGNED_L1" && (
                    <button
                      onClick={() => startWork(c._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Start
                    </button>
                  )}

                  {c.status === "IN_PROGRESS_L1" && (
                    <>
                      <button
                        onClick={() => resolveComplaint(c._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Resolve
                      </button>

                      <button
                        onClick={() => escalateComplaint(c._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Escalate
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
  );
};

export default SupportDashboard;
