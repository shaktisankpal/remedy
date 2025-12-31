import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

const DeveloperDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/complaints/l2");
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

  // ================= ACTIONS =================

  const assignToMe = async (id) => {
    try {
      await api.patch(`/api/complaints/${id}/assign-l2`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign complaint");
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await api.patch(`/api/complaints/${id}/resolve-l2`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resolve complaint");
    }
  };

  // ================= FILTERING =================

  const unassigned = complaints.filter((c) => c.status === "ESCALATED_TO_L2");

  const assignedToMe = complaints.filter((c) => c.status === "IN_PROGRESS_L2");

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Developer Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* ESCALATED */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Escalated Complaints ({unassigned.length})
        </h2>

        {unassigned.length === 0 ? (
          <p className="text-gray-500">No escalated complaints</p>
        ) : (
          <div className="space-y-3">
            {unassigned.map((c) => (
              <div
                key={c._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <Link
                    to={`/complaints/${c._id}`}
                    className="text-blue-600 underline text-sm"
                  >
                    View details
                  </Link>
                  <p className="text-gray-600 text-sm">{c.description}</p>
                  <p className="text-sm mt-1">
                    Status: <b>{c.status}</b>
                  </p>
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

      {/* ASSIGNED */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Assigned to Me ({assignedToMe.length})
        </h2>

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
                  <Link
                    to={`/complaints/${c._id}`}
                    className="text-blue-600 underline text-sm"
                  >
                    View details
                  </Link>
                  <p className="text-gray-600 text-sm">{c.description}</p>
                  <p className="text-sm mt-1">
                    Status: <b>{c.status}</b>
                  </p>
                </div>

                <button
                  onClick={() => resolveComplaint(c._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DeveloperDashboard;
