const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaint.controller");

router.post("/", auth, complaintController.createComplaint);

router.get("/my", auth, complaintController.getMyComplaints);

router.get("/:id", auth, complaintController.getComplaintById);

// L1
router.get(
  "/l1",
  auth,
  role("SUPPORT_L1"),
  complaintController.getL1Complaints
);
router.patch(
  "/:id/assign-l1",
  auth,
  role("SUPPORT_L1"),
  complaintController.assignToL1
);
router.patch(
  "/:id/start-l1",
  auth,
  role("SUPPORT_L1"),
  complaintController.startL1
);
router.patch(
  "/:id/resolve-l1",
  auth,
  role("SUPPORT_L1"),
  complaintController.resolveByL1
);
router.patch(
  "/:id/escalate",
  auth,
  role("SUPPORT_L1"),
  complaintController.escalateToL2
);

// L2
router.get(
  "/l2",
  auth,
  role("DEVELOPER_L2"),
  complaintController.getL2Complaints
);
router.patch(
  "/:id/assign-l2",
  auth,
  role("DEVELOPER_L2"),
  complaintController.assignToL2
);
router.patch(
  "/:id/resolve-l2",
  auth,
  role("DEVELOPER_L2"),
  complaintController.resolveByL2
);

// Client
router.patch(
  "/:id/reopen",
  auth,
  role("CLIENT"),
  complaintController.reopenComplaint
);
router.patch(
  "/:id/close",
  auth,
  role("CLIENT"),
  complaintController.closeComplaint
);

module.exports = router;
