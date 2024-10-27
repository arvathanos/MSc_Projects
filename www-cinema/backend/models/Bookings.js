const { default: mongoose } = require("mongoose");

const bookingSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Types.ObjectId, //String
    ref: "Movie",
    require: true,
  },

  date: { type: Date, required: true },
  time: { type: String, required: true },

  seatNumber: {
    type: [String],
    require: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  }, //621395
  numUsers: {
    type: Number,
    default: 0,
  },
  numBooking: {
    type: Number,
  },
  status: {
    type: String,
    default: "Incompleted",
  },
  changes: {
    type: Boolean,
    default: false, //false means no changes
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
