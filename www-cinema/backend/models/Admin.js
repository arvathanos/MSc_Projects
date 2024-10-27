const { default: mongoose, trusted } = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 6,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  addedMovies: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
