const Booking = require("../models/Bookings");
const sendEmail = require("./sendEmail");
const User = require("../models/User");
const Movie = require("../models/Movies");
const markBookingAsDone = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Booking not yet completed" });
    }

    booking.numUsers += 1;

    // Add logic to mark the booking as done (update the database or perform any required action)
    // Check if all users have checked in
    if (booking.numUsers >= booking.numTickets) {
      // Mark the booking as completed
      booking.status = "completed";
    }

    await booking.save();

    return res
      .status(200)
      .json({ message: "Booking marked as completed", booking });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error marking booking as completed" });
  }
};

const generateBookingNumber = async () => {
  // Generate a random 6-digit number
  const bookingNumber = Math.floor(100000 + Math.random() * 900000);

  return bookingNumber;
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
const EmailBooking = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    const user = await User.findById(booking.user);
    if (!user) {
      throw new Error("User not found");
    }

    const movie = await Movie.findById(booking.movie);
    let text = `Dear user, here are the details of your booking.\n ID: ${
      booking._id
    }.\n MOVIE: ${movie.title} .\n DATE: ${formatDate(booking.date)}.\n TIME: ${
      booking.time
    }.\n SEATS: ${booking.seatNumber}.\n BOOKING NUMBER: ${booking.numBooking}`;
    await sendEmail(user.email, "Booking Details", text);
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

module.exports = {
  EmailBooking,
  markBookingAsDone,
  generateBookingNumber,
};
