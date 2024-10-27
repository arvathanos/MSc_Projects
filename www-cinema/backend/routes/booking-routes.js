const { get } = require("mongoose");
const {
  newBooking,
  getBookingById,
  deleteBooking,
  getAllBooking,
  updateBookingNum,
} = require("../controllers/booking-controller");

express = require("express");

const bookingsRouter = express.Router();

bookingsRouter.post("/", newBooking);
bookingsRouter.get("/:id", getBookingById);
bookingsRouter.delete("/:id", deleteBooking);
bookingsRouter.get("/", getAllBooking);
bookingsRouter.put("/updateNum/:id", updateBookingNum);

module.exports = bookingsRouter;
