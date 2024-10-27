const { default: mongoose } = require("mongoose");
const Booking = require("../models/Bookings");
const Movie = require("../models/Movies");
const User = require("../models/User");
const Bookings = require("../models/Bookings");
const {
  EmailBooking,
  generateBookingNumber,
} = require("../utils/bookingCheck");
exports.newBooking = async (req, res, next) => {
  const { movie, time, date, seatNumber, user, numUsers } = req.body;

  let booking;
  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingMovie) {
    return res.status(404).json({ message: "Movie not found" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    booking = new Booking({
      movie,
      date,
      time,
      seatNumber,
      user,
      numBooking: await generateBookingNumber(),
      numUsers,
    });

    const session = await mongoose.startSession();
    await session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    session.commitTransaction();

    await EmailBooking(booking._id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking });
};

exports.getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "error" });
  }
  return res.status(200).json({ booking });
};

exports.deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findByIdAndDelete(id).populate("user movie"); //gia na τοο σβήσει και απο τα user and movie
    console.log(booking);

    const session = await mongoose.startSession();
    await session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "error" });
  }
  return res.status(200).json({ message: "Succefully Deleted" });
};

exports.getAllBooking = async (req, res, next) => {
  let bookings;
  try {
    bookings = await Booking.find();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  return res.status(200).json({ bookings });
};

exports.updateBookingNum = async (req, res, next) => {
  const id = req.params.id;
  const { NumIn } = req.body;
  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.numUsers -= NumIn;

    if (booking.numUsers === 0) {
      booking.status = "completed";
    }

    await booking.save();

    return res
      .status(200)
      .json({ message: "Booking updated successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
