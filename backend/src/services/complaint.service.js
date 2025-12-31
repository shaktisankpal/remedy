const Complaint = require("../models/Complaint");

// Creating a complaint
exports.createComplaint = async (req) => {
  const { title, description } = req.body;

  // TEMP user simulation (until auth is added)
  const userId = req.user?.id || "000000000000000000000001";

  const complaint = await Complaint.create({
    title,
    description,
    createdBy: userId,
    status: "OPEN",
  });

  return complaint;
};

// Getting my complaints
exports.getMyComplaints = async (req) => {
  const userId = req.user?.id || "000000000000000000000001";

  return Complaint.find({ createdBy: userId }).sort({ createdAt: -1 });
};

// Getting a specific complaint
exports.getComplaintById = async (id) => {
  const complaint = await Complaint.findById(id)
    .populate("createdBy", "email role")
    .populate("assignedL1", "email role")
    .populate("assignedL2", "email role");

  if (!complaint) throw new Error("Complaint not found");

  return complaint;
};

// get L1 complaints
exports.getL1Complaints = async (userId) => {
  return await Complaint.find({
    $or: [
      // Unassigned queue
      { status: { $in: ["OPEN", "REOPENED"] } },

      // Assigned to current L1 user
      {
        status: { $in: ["ASSIGNED_L1", "IN_PROGRESS_L1"] },
        assignedL1: userId,
      },
    ],
  }).sort({ createdAt: -1 });
};

// assign to L1
exports.assignToL1 = async (complaintId, userId) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint)
    throw Object.assign(new Error("Complaint not found"), { statusCode: 404 });

  if (!["OPEN", "REOPENED"].includes(complaint.status)) {
    throw Object.assign(new Error("Complaint cannot be assigned"), {
      statusCode: 400,
    });
  }

  complaint.assignedL1 = userId;
  complaint.status = "ASSIGNED_L1";

  await complaint.save();
  return complaint;
};

// start L1 work
exports.startL1 = async (complaintId, userId) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint)
    throw Object.assign(new Error("Complaint not found"), { statusCode: 404 });

  if (complaint.status !== "ASSIGNED_L1") {
    throw Object.assign(new Error("Complaint must be assigned first"), {
      statusCode: 400,
    });
  }

  if (!complaint.assignedL1.equals(userId)) {
    throw Object.assign(new Error("You are not assigned to this complaint"), {
      statusCode: 403,
    });
  }

  complaint.status = "IN_PROGRESS_L1";
  await complaint.save();

  return complaint;
};

// escalate to L2
exports.escalateToL2 = async (req) => {
  const complaint = await Complaint.findById(req.params.id);

  if (complaint.status !== "IN_PROGRESS_L1") {
    throw new Error("Only in-progress L1 complaints can be escalated");
  }

  complaint.status = "ESCALATED_TO_L2";
  complaint.assignedL2 = null;

  await complaint.save();
  return complaint;
};

//get L2 complaints
exports.getL2Complaints = async (userId) => {
  return Complaint.find({
    $or: [
      { status: "ESCALATED_TO_L2" },
      {
        status: "IN_PROGRESS_L2",
        assignedL2: userId,
      },
    ],
  }).sort({ createdAt: -1 });
};

// assign to L2
exports.assignToL2 = async (req) => {
  const complaint = await Complaint.findById(req.params.id);

  complaint.assignedL2 = req.user?.id || "000000000000000000000003";
  complaint.status = "IN_PROGRESS_L2";

  await complaint.save();
  return complaint;
};

// resolved by L2
exports.resolveByL2 = async (req) => {
  const complaint = await Complaint.findById(req.params.id);

  if (complaint.status !== "IN_PROGRESS_L2") {
    throw new Error("Invalid state");
  }

  complaint.status = "RESOLVED";
  await complaint.save();

  return complaint;
};

exports.resolveByL1 = async (complaintId, userId) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint)
    throw Object.assign(new Error("Complaint not found"), { statusCode: 404 });

  if (!complaint.assignedL1 || !complaint.assignedL1.equals(userId)) {
    throw Object.assign(new Error("You are not assigned to this complaint"), {
      statusCode: 403,
    });
  }

  if (complaint.status !== "IN_PROGRESS_L1") {
    throw Object.assign(
      new Error(`Cannot resolve complaint in status ${complaint.status}`),
      { statusCode: 400 }
    );
  }

  complaint.status = "RESOLVED";
  await complaint.save();

  return complaint;
};

// client Reopen
exports.reopenComplaint = async (req) => {
  const complaint = await Complaint.findById(req.params.id);

  if (complaint.status !== "RESOLVED") {
    throw new Error("Only resolved complaints can be reopened");
  }

  complaint.status = "REOPENED";
  await complaint.save();

  return complaint;
};

//client close
exports.closeComplaint = async (complaintId, userId) => {
  // Find complaint by ID
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    const error = new Error("Complaint not found");
    error.statusCode = 404;
    throw error;
  }

  // Ensure the user closing the complaint is the creator
  if (complaint.createdBy.toString() !== userId) {
    const error = new Error("Unauthorized to close this complaint");
    error.statusCode = 403;
    throw error;
  }

  // Only resolved complaints can be closed
  if (complaint.status !== "RESOLVED") {
    const error = new Error(
      "Complaint cannot be closed as it is not yet resolved"
    );
    error.statusCode = 400; // client error
    throw error;
  }

  // Close the complaint
  complaint.status = "CLOSED";
  complaint.isClosed = true;

  const updatedComplaint = await complaint.save();
  return updatedComplaint;
};
