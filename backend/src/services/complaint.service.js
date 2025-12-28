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
exports.getL1Complaints = async () => {
  return Complaint.find({
    status: { $in: ["OPEN", "REOPENED", "ESCALATED_TO_L2"] },
  }).sort({ createdAt: -1 });
};

// assign to L1
exports.assignToL1 = async (req) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) throw new Error("Complaint not found");

  complaint.assignedL1 = req.user?.id || "000000000000000000000002";
  complaint.status = "ASSIGNED_L1";

  await complaint.save();
  return complaint;
};

// start L1 work
exports.startL1 = async (req) => {
  const complaint = await Complaint.findById(req.params.id);

  if (complaint.status !== "ASSIGNED_L1") {
    throw new Error("Cannot start work unless assigned");
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
exports.getL2Complaints = async () => {
  return Complaint.find({
    status: { $in: ["ESCALATED_TO_L2", "REOPENED"] },
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
exports.closeComplaint = async (req) => {
  const complaint = await Complaint.findById(req.params.id);

  if (complaint.status !== "RESOLVED") {
    throw new Error("Only resolved complaints can be closed");
  }

  complaint.status = "CLOSED";
  complaint.isClosed = true;

  await complaint.save();
  return complaint;
};
