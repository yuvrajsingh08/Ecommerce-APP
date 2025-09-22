const userModel = require("../../models/userModel")

async function updateUser(req, res) {
  try {
    const sessionUser = req.userId;
    const { userId, email, name, role } = req.body;

    const payload = {
      ...(email && { email }),
      ...(name && { name }),
      ...(role && { role }),
    };
    console.log("payload", payload);    

    const user = await userModel.findById(sessionUser);
    if (!user) {
      return res.status(404).json({
        message: "Logged-in user not found",
        error: true,
        success: false,
      });
    }

    console.log("user.role", user.role);

    const updateUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });
    if (!updateUser) {
      return res.status(404).json({
        message: "User to update not found",
        error: true,
        success: false,
      });
    }

    res.json({
      data: updateUser,
      message: "User Updated",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}


module.exports = updateUser