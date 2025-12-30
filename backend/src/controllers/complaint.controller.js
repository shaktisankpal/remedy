const complaintService = require("../services/complaint.service");

exports.createComplaint = async (req, res) => {
  const complaint = await complaintService.createComplaint(req);
  res.status(201).json(complaint);
};

exports.getMyComplaints = async (req, res) => {
  const complaints = await complaintService.getMyComplaints(req);
  res.json(complaints);
};

exports.getComplaintById = async (req, res) => {
  const complaint = await complaintService.getComplaintById(req.params.id);
  res.json(complaint);
};

exports.getL1Complaints = async (req, res) => {
  try {
    const complaints = await complaintService.getL1Complaints(req.user._id);
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignToL1 = async (req, res) => {
  try {
    const complaint = await complaintService.assignToL1(
      req.params.id,
      req.user._id // 👈 MUST be _id
    );

    res.json(complaint);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

exports.startL1 = async (req, res) => {
  try {
    const complaint = await complaintService.startL1(
      req.params.id,
      req.user._id
    );

    res.json(complaint);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

exports.resolveByL1 = async (req, res) => {
  try {
    const complaint = await complaintService.resolveByL1(
      req.params.id,
      req.user._id
    );

    res.json(complaint);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

exports.escalateToL2 = async (req, res) => {
  const complaint = await complaintService.escalateToL2(req);
  res.json(complaint);
};

exports.getL2Complaints = async (req, res) => {
  const complaints = await complaintService.getL2Complaints();
  res.json(complaints);
};

exports.assignToL2 = async (req, res) => {
  const complaint = await complaintService.assignToL2(req);
  res.json(complaint);
};

exports.resolveByL2 = async (req, res) => {
  const complaint = await complaintService.resolveByL2(req);
  res.json(complaint);
};

exports.reopenComplaint = async (req, res) => {
  const complaint = await complaintService.reopenComplaint(req);
  res.json(complaint);
};

exports.closeComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user.id; // ensure authMiddleware runs before this

    const updatedComplaint = await complaintService.closeComplaint(
      complaintId,
      userId
    );

    return res.status(200).json(updatedComplaint);
  } catch (error) {
    console.error(error.message); // backend logs human-readable message, no ReferenceError
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};
