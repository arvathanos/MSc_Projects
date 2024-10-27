const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  googleId: {
    type: String,
    unique: true,
  },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
});

module.exports = mongoose.model("User", userschema);
