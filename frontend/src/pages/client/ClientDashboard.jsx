import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ClientDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/complaints/my");
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

  const closeComplaint = async (id) => {
    try {
      await api.patch(`/api/complaints/${id}/close`);
      fetchComplaints(); // refresh dashboard
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Complaint cannot be closed as it is not yet resolved"
      );
    }
  };

  const reopenComplaint = async (id) => {
    await api.patch(`/api/complaints/${id}/reopen`);
    fetchComplaints();
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Complaints</h1>
        <button
          onClick={() => navigate("/client/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Complaint
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{complaint.title}</h2>
                <p className="text-sm text-gray-600">
                  Status: {complaint.status}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="space-x-2">
                {complaint.status === "RESOLVED" && (
                  <button
                    onClick={() => reopenComplaint(complaint._id)}
                    className="border px-3 py-1 rounded"
                  >
                    Reopen
                  </button>
                )}

                {complaint.status !== "CLOSED" && (
                  <button
                    onClick={() => closeComplaint(complaint._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
