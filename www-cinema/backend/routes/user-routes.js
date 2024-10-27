const express = require("express");
const {
  getAllUsers,
  getUserByEmail,
  signup,
  updateUser,
  deleteUser,
  login,
  getBookingsOfUser,
  getUserById,
  getUserPasswordByEmail,
} = require("../controllers/user-controller");

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/email/:email", getUserByEmail);
userRouter.get("/Pas/:email", getUserPasswordByEmail);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", signup);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);
userRouter.get("/bookings/:id", getBookingsOfUser);

module.exports = userRouter;
