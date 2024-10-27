const Bookings = require("../models/Bookings");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return console.log(err);
  }

  if (!users) {
    return res.status(500).json({ message: "Unexpected Error" });
  }

  return res.status(200).json({ users });
};

exports.getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!user) {
    return res.status(500).json({ message: "Unexpected Error" });
  }

  return res.status(200).json({ user });
};

exports.getUserByEmail = async (req, res, next) => {
  const email = req.params.email;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unexpected Error" });
  }

  if (!user) {
    return res.status(200).json({ found: false });
  }

  // Αν υπάρχει ο χρήστης, επιστρέφουμε τον κωδικό του
  return res.status(200).json({ found: true });
};

exports.getUserPasswordByEmail = async (req, res, next) => {
  const email = req.params.email; // Υποθέτω ότι το email βρίσκεται στο body του αιτήματος
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unexpected Error" });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Αν υπάρχει ο χρήστης, επιστρέφουμε μόνο τον κωδικό του
  return res.status(200).json({ password: user.password });
};

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new User({ name, email, password: hashedPassword });
    user = await user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(201).json({ id: user._id });
};

exports.updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "something wrong" });
  }
  res.status(200).json({ message: "updated succ" });
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "something wrong" });
  }
  res.status(200).json({ message: "deleted succ" });
};

exports.login = async (req, res, next) => {
  const { email, password, isGoogleLogin } = req.body;

  if (!email && email.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existUser;

  try {
    existUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existUser) {
    return res.status(400).json({ message: "Unable to find user" });
  }
  if (isGoogleLogin) {
    // Εάν ο χρήστης συνδέεται μέσω Google Login, επιστρέφουμε επιτυχία
    return res
      .status(200)
      .json({ message: "Google Login Successfull", id: existUser._id });
  }

  if (!password && password.trim === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  const ispasscorrect = bcrypt.compareSync(password, existUser.password);

  if (!ispasscorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res
    .status(200)
    .json({ message: "Login Successfull", id: existUser._id });
};

exports.getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;

  try {
    bookings = await Bookings.find({ user: id });
  } catch (err) {
    return console.log(err);
  }
  if (!bookings) {
    return res.status(400).json({ message: " Unable to get Bookings" });
  }
  return res.status(200).json({ bookings });
};
