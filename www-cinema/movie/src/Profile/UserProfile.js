import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import {
  deleteBooking,
  getAllMovies,
  getUserBooking,
  getUserDetails,
} from "../api-helpers/api.helpers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import moment from "moment";

const UserProfile = () => {
  const [bookings, setBookings] = useState();
  const [user, setUser] = useState();
  const [movies, setMovie] = useState([]);
  useEffect(() => {
    getUserBooking()
      .then((res) => setBookings(res.bookings))
      .catch((err) => console.log(err));

    getUserDetails()
      .then((res) => setUser(res.user))
      .catch((err) => console.log(err));

    getAllMovies()
      .then((res) => setMovie(res.movies))
      .catch((err) => console.log(err));
  }, [movies, user, bookings]);
  const handleDelete = (id) => {
    deleteBooking(id)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const today = moment();

  return (
    <Box width={"100%"} display="flex" color="white">
      <Fragment>
        {" "}
        {user && (
          <Box
            flexDirection={"column"}
            justifyContent="center"
            alignItems={"stretch"}
            width={"35%"}
            padding={2}
            display={"flex"}
          >
            <Box display={"flex"} justifyContent={"center"}>
              <AccountCircleIcon
                sx={{ fontSize: "10rem", display: "flex", ml: 2 }}
              />
            </Box>
            <Typography
              padding={1}
              width={"auto"}
              textAlign={"center"}
              border={"1px solid #ccc"}
              borderRadius={6}
            >
              Name: {user.name}
            </Typography>
            <Typography
              mt={1}
              padding={1}
              width={"auto"}
              textAlign={"center"}
              border={"1px solid #ccc"}
              borderRadius={6}
            >
              Email: {user.email}
            </Typography>
          </Box>
        )}
        {bookings && (
          <Box width={"100%"} display="flex" flexDirection={"column"}>
            <Typography
              variant="h3"
              fontFamily={"verdana"}
              textAlign="center"
              padding={4}
              display="flex"
              flexDirection="column"
            >
              Bookings
            </Typography>
            <Box
              margin={"auto"}
              display="flex"
              flexDirection={"column"}
              width="80%"
            >
              <List>
                {bookings.map((booking, index) => (
                  <ListItem
                    sx={{
                      bgcolor: booking.changes ? "#FFA500" : "#00d386",
                      color: "white",
                      textAlign: "center",
                      margin: 1.5,
                    }}
                  >
                    <ListItemText
                      sx={{ margin: 1, width: "20%", textAlign: "left" }}
                    >
                      Movie:{" "}
                      {movies.find((movie) => movie._id === booking.movie)
                        ?.title || "Unknown Movie"}
                    </ListItemText>
                    <ListItemText
                      sx={{ margin: 1, width: "20%", textAlign: "left" }}
                    >
                      Booking Number{" :"}{" "}
                      <Typography
                        variant="body1"
                        style={{ textAlign: "center" }}
                      >
                        {booking.numBooking}
                      </Typography>
                    </ListItemText>
                    <ListItemText
                      sx={{ margin: 1, width: "20%", textAlign: "left" }}
                    >
                      Seat: {booking.seatNumber.join(",")}
                    </ListItemText>
                    <ListItemText
                      sx={{ margin: 1, width: "20%", textAlign: "left" }}
                    >
                      Date: {new Date(booking.date).toDateString()} (
                      {booking.time})
                    </ListItemText>

                    {!moment(booking.date).isAfter(today, "day") ? (
                      <ListItemText
                        sx={{ margin: 1, width: "20%", textAlign: "left" }}
                      >
                        Unavailable
                      </ListItemText>
                    ) : booking.changes === true ? (
                      <ListItemText
                        sx={{ margin: 1, width: "20%", textAlign: "left" }}
                      >
                        Changes
                      </ListItemText>
                    ) : null}
                    <IconButton
                      onClick={() => handleDelete(booking._id)}
                      color="error"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}
      </Fragment>
    </Box>
  );
};

export default UserProfile;
