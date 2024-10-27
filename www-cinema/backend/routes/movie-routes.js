const {
  addMovie,
  getAllMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  updateMovieSchedule,
} = require("../controllers/movie-controller");

express = require("express");

const movierouter = express.Router();

movierouter.get("/", getAllMovies);
movierouter.post("/", addMovie);
movierouter.get("/:id", getMovieById);
movierouter.delete("/:id", deleteMovie);
movierouter.put("/update/:id", updateMovie);
movierouter.put("/Schedule/:id", updateMovieSchedule);

module.exports = movierouter;
