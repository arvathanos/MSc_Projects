// admin-middleware.js

const User = require("../models/User");
const Admin = require("../models/Admin");

const isAdmin = async (req, res, next) => {
  const adminId = req.adminId; // Assuming you have a middleware to extract the user ID from the token

  try {
    const admin = await Admin.findById(adminId);

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // next(); // User is an admin, proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const isChecker = async (req, res, next) => {
  const adminId = req.adminId; // Assuming you have a middleware to extract the user ID from the token

  try {
    const admin = await Admin.findById(adminId);

    if (!admin || !admin.isChecker) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // next(); // User is an admin, proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { isAdmin, isChecker };
