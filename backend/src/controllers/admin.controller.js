const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.assignRole = async (req, res) => {
  const { userId, role } = req.body;

  const allowedRoles = ["ADMIN", "CLIENT", "SUPPORT_L1", "DEVELOPER_L2"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();

  res.json({
    message: "Role updated successfully",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};
