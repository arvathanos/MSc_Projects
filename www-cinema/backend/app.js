const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user-routes");
const adminrouter = require("./routes/admin-routes");
const movierouter = require("./routes/movie-routes");
const bookingsRouter = require("./routes/booking-routes");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminrouter);
app.use("/movie", movierouter);
app.use("/booking", bookingsRouter);

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASS}@cluster0.4mwpeas.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() =>
    app.listen(5000, () =>
      console.log("Connected to database and server running on port 5000")
    )
  )
  .catch((err) => console.log(err));
