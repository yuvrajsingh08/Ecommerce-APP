const userModel = require("../../models/userModel");

async function deleteUser(req, res) {
  try {
    const sessionUser = req.userId; // logged-in user (from auth middleware)
    const { userId } = req.params; // user to delete

    // Ensure logged-in user exists
    const user = await userModel.findById(sessionUser);
    if (!user) {
      return res.status(404).json({
        message: "Logged-in user not found",
        error: true,
        success: false,
      });
    }

    // Only ADMIN can delete
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Unauthorized. Only admin can delete users.",
        error: true,
        success: false,
      });
    }

    // Delete user
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    res.json({
      data: deletedUser,
      message: "User deleted successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Server error",
      error: true,
      success: false,
    });
  }
}

module.exports = deleteUser;
