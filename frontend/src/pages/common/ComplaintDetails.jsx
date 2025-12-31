import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

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
      setError("Failed to load complaint");
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

  const closeComplaint = async () => {
    await api.patch(`/api/complaints/${id}/close`);
    fetchComplaint();
  };

  // ================= RENDER =================
  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
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

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 underline">
        ← Back
      </button>

      {/* DETAILS */}
      <div className="border rounded p-6 space-y-4">
        <h1 className="text-2xl font-bold">{title}</h1>

        <p className="text-gray-700">{description}</p>

        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            <strong>Created By:</strong> {createdBy?.email}
          </p>
          <p>
            <strong>Assigned L1:</strong> {assignedL1?.email || "Not assigned"}
          </p>
          <p>
            <strong>Assigned L2:</strong> {assignedL2?.email || "Not assigned"}
          </p>
          <p>
            <strong>Created:</strong> {new Date(createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="space-y-3">
        {/* -------- SUPPORT L1 -------- */}
        {role === "SUPPORT_L1" && (
          <>
            {(status === "OPEN" || status === "REOPENED") && (
              <button
                onClick={assignToL1}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Assign to me
              </button>
            )}

            {status === "ASSIGNED_L1" && (
              <button
                onClick={startL1}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Start Work
              </button>
            )}

            {status === "IN_PROGRESS_L1" && (
              <div className="flex gap-3">
                <button
                  onClick={resolveL1}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Resolve
                </button>

                <button
                  onClick={escalateToL2}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Escalate
                </button>
              </div>
            )}
          </>
        )}

        {/* -------- DEVELOPER L2 -------- */}
        {role === "DEVELOPER_L2" && (
          <>
            {status === "ESCALATED_TO_L2" && (
              <button
                onClick={assignToL2}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Assign to me
              </button>
            )}

            {status === "IN_PROGRESS_L2" && (
              <button
                onClick={resolveL2}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Resolve
              </button>
            )}
          </>
        )}

        {/* -------- CLIENT -------- */}
        {role === "CLIENT" && (
          <>
            {status === "RESOLVED" && (
              <button
                onClick={reopenComplaint}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Reopen
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
