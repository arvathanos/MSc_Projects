const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.addAdmin = async (req, res, next) => {
  const { email, password, isAdmin } = req.body;
  if (!email && email.trim() === "" && !password && password.trim === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existAdmin;
  try {
    existAdmin = await Admin.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existAdmin) {
    return res.status(400).json({ message: "Admin already exist" });
  }
  let admin;
  const hashedPassword = bcrypt.hashSync(password);
  try {
    admin = new Admin({ email, password: hashedPassword, isAdmin });
    admin = await admin.save();
  } catch (err) {
    return console.log(err);
  }
  if (!admin) {
    return res.status(500).jason({ message: "Unable to store admin" });
  }
  return res.status(201).json({ admin });
};

exports.adminlogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let existAdmin;
  try {
    existAdmin = await Admin.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existAdmin) {
    return res.status(400).json({ message: "Not found Admin" });
  }
  const ispasscorrect = bcrypt.compareSync(password, existAdmin.password);

  if (!ispasscorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }
  const token = jwt.sign({ id: existAdmin._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return res
    .status(200)
    .json({ message: "Authentication Complete", token, id: existAdmin._id });
};

exports.getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find();
  } catch (err) {
    return console.log(err);
  }
  if (!admins) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  return res.status(200).json({ admins });
};

exports.getAdminById = async (req, res, next) => {
  let admin;
  const id = req.params.id;
  try {
    admin = await Admin.findById(id).populate("addedMovies");
  } catch (err) {
    return console.log(err);
  }

  if (!admin) {
    return console.log("Can't find Admin");
  }
  return res.status(200).json({ admin });
};
