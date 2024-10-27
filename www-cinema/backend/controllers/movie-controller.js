const Movie = require("../models/Movies");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Admin = require("../models/Admin");

const {
  deleteBookingsByMovieId,
  updateBookingsAndNotifyUsers,
} = require("../utils/movieChanges");

exports.addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken && extractedToken.trim() === "") {
    return res.statuw(404).json({ message: "token not found" });
  }
  let adminId;

  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  const {
    title,
    description,
    releaseDate,
    posterUrl,
    featured,
    actors,
    schedule,
  } = req.body;
  if (
    !title &&
    title.trim() == "" &&
    !description &&
    description.trim() === "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "invalid Inputs" });
  }
  let movie;
  try {
    movie = new Movie({
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      admin: adminId,
      posterUrl,
      title,
      schedule,
    });

    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);

    session.startTransaction();
    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(201).json({ movie });
};

exports.getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }
  if (!movies) {
    return res.status(500).jason({ message: "request Failed" });
  }
  return res.status(200).json({ movies });
};

exports.getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }
  return res.status(200).json({ movie });
};

exports.deleteMovie = async (req, res, next) => {
  const id = req.params.id;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Invalid Movie ID" });
    }
    await Movie.findByIdAndDelete(id);
    let text = `Dear user, there has been changes in your booking regarding the movie with \n ID: ${movie._id}.\n Movie Title: ${movie.title} has been deleted. Please login to your account to see more details. For more information contact us at cinema.app2024@gmail.com`;
    await updateBookingsAndNotifyUsers(movie, text);
    await deleteBookingsByMovieId(id);

    return res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateMovie = async (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const movie = await Movie.findByIdAndUpdate(id, updates);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Update associated bookings and send emails to affected users
    let text = `Dear user, there has been changes in your booking regarding the schedule of the movie with: \n ID: ${movie._id}. \n Movie Title: ${movie.title}.\n Please login to your account to see more details.`;
    await updateBookingsAndNotifyUsers(movie, text);

    return res.status(200).json({ message: "Movie updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateMovieSchedule = async (req, res, next) => {
  const movieId = req.params.id;
  const { date, time, seatNumbers } = req.body;
  try {
    // Εύρεση της ταινίας
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const scheduleEntry = movie.schedule.find(
      (entry) => entry.date.getTime() === new Date(date).getTime()
    );

    if (!scheduleEntry) {
      return res.status(404).json({ error: "Schedule entry not found" });
    }

    const timeEntry = scheduleEntry.times.find((entry) => entry.time === time);

    if (!timeEntry) {
      return res.status(404).json({ error: "Time entry not found" });
    }

    timeEntry.bookedSeats.push(...seatNumbers);

    await movie.save();

    res.status(200).json({ message: "Schedule updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
