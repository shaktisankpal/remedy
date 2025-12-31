const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

router.get("/users", auth, role("ADMIN"), adminController.getAllUsers);
router.patch(
  "/users/:id/role",
  auth,
  role("ADMIN"),
  adminController.assignRole
);

module.exports = router;
