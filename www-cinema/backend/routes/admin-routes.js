const {
  addAdmin,
  adminlogin,
  getAdmins,
  getAdminById,
} = require("../controllers/admin-controller");

express = require("express");

const adminrouter = express.Router();

adminrouter.post("/signup", addAdmin);
adminrouter.post("/login", adminlogin);
adminrouter.get("/", getAdmins);
adminrouter.get("/:id", getAdminById);

module.exports = adminrouter;
