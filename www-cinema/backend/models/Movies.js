const { default: mongoose } = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actors: [{ type: String, required: true }],
  releaseDate: {
    type: Date,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
  },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  admin: { type: mongoose.Types.ObjectId, ref: "Admin", required: true },
  schedule: [
    {
      date: { type: Date, required: true },
      times: [
        {
          time: { type: String, required: true },
          bookedSeats: [{ type: String }],
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Movie", movieSchema);
