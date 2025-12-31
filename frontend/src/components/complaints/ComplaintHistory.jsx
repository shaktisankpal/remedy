import React from "react";

const ComplaintHistory = ({ complaint }) => {
  if (!complaint) return null;

  const { status, createdAt, createdBy, assignedL1, assignedL2 } = complaint;

  const history = [];

  // 1. Created
  history.push({
    label: "Complaint Created",
    by: createdBy?.email || "Client",
    time: createdAt,
    active: true,
  });

  // 2. Assigned to L1
  if (assignedL1) {
    history.push({
      label: "Assigned to Support (L1)",
      by: assignedL1.email,
      active: true,
    });
  }

  // 3. Work Started (L1)
  if (
    ["IN_PROGRESS_L1", "ESCALATED_TO_L2", "RESOLVED", "CLOSED"].includes(status)
  ) {
    history.push({
      label: "Investigation Started",
      by: assignedL1?.email || "Support Team",
      active: true,
    });
  }

  // 4. Escalated
  if (
    ["ESCALATED_TO_L2", "IN_PROGRESS_L2", "RESOLVED", "CLOSED"].includes(status)
  ) {
    history.push({
      label: "Escalated to Engineering (L2)",
      by: assignedL1?.email || "Support Team",
      active: true,
    });
  }

  // 5. Assigned to L2
  if (assignedL2) {
    history.push({
      label: "Engineer Assigned",
      by: assignedL2.email,
      active: true,
    });
  }

  // 6. Resolved
  if (["RESOLVED", "CLOSED"].includes(status)) {
    history.push({
      label: "Issue Resolved",
      by: assignedL2?.email || assignedL1?.email || "System",
      active: true,
    });
  }

  // 7. Closed
  if (status === "CLOSED") {
    history.push({
      label: "Case Closed",
      by: createdBy?.email,
      time: complaint.updatedAt, // Assuming updated at close
      active: true,
      isLast: true,
    });
  }

  return (
    <div className="relative">
      {/* Vertical Timeline Line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gray-200"></div>

      <div className="space-y-8">
        {history.map((item, index) => (
          <div key={index} className="relative flex items-start gap-6 group">
            {/* Timeline Dot */}
            <div className="relative z-10 flex-shrink-0 mt-1.5">
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 border-white ring-1 ${
                  item.isLast
                    ? "bg-black ring-black"
                    : "bg-gray-400 ring-gray-200"
                }`}
              ></div>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <span
                className={`text-sm font-medium ${
                  item.isLast ? "text-black" : "text-gray-700"
                }`}
              >
                {item.label}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                  {item.by}
                </span>
                {item.time && (
                  <span className="text-xs text-gray-400">
                    •{" "}
                    {new Date(item.time).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintHistory;
