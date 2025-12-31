const ComplaintHistory = ({ complaint }) => {
  if (!complaint) return null;

  const { status, createdAt, createdBy, assignedL1, assignedL2 } = complaint;

  const history = [];

  // Created
  history.push({
    label: "Complaint created",
    by: createdBy?.email || "Client",
    time: createdAt,
  });

  // Assigned to L1
  if (assignedL1) {
    history.push({
      label: "Assigned to Support (L1)",
      by: assignedL1.email,
    });
  }

  // In progress L1
  if (
    ["IN_PROGRESS_L1", "ESCALATED_TO_L2", "RESOLVED", "CLOSED"].includes(status)
  ) {
    history.push({
      label: "Work started by Support",
      by: assignedL1?.email || "Support",
    });
  }

  // Escalated
  if (
    ["ESCALATED_TO_L2", "IN_PROGRESS_L2", "RESOLVED", "CLOSED"].includes(status)
  ) {
    history.push({
      label: "Escalated to Developer",
      by: assignedL1?.email || "Support",
    });
  }

  // Assigned to L2
  if (assignedL2) {
    history.push({
      label: "Assigned to Developer",
      by: assignedL2.email,
    });
  }

  // Resolved
  if (["RESOLVED", "CLOSED"].includes(status)) {
    history.push({
      label: "Resolved",
      by: assignedL2?.email || assignedL1?.email || "System",
    });
  }

  // Closed
  if (status === "CLOSED") {
    history.push({
      label: "Closed by client",
      by: createdBy?.email,
    });
  }

  return (
    <div className="border rounded p-4 mt-6">
      <h3 className="font-semibold text-lg mb-3">Activity History</h3>

      <ul className="space-y-3">
        {history.map((item, index) => (
          <li key={index} className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-sm text-gray-600">
                {item.by}
                {item.time && <> · {new Date(item.time).toLocaleString()}</>}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintHistory;
