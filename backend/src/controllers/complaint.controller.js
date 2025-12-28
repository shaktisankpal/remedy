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
  const complaints = await complaintService.getL1Complaints();
  res.json(complaints);
};

exports.assignToL1 = async (req, res) => {
  const complaint = await complaintService.assignToL1(req);
  res.json(complaint);
};

exports.startL1 = async (req, res) => {
  const complaint = await complaintService.startL1(req);
  res.json(complaint);
};

exports.resolveByL1 = async (req, res) => {
  const complaint = await complaintService.resolveByL1(req);
  res.json(complaint);
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
  const complaint = await complaintService.closeComplaint(req);
  res.json(complaint);
};
