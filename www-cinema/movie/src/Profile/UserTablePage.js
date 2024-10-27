import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Bookings,
  getAllMovies,
  getAllUsers,
  updateUsers,
} from "../api-helpers/api.helpers";

const UserTablePage = () => {
  const [users, setUsers] = useState([]);
  const [filterId, setFilterId] = useState("");
  const [filteredbooks, setFilteredBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [movies, setMovie] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(0);

  useEffect(() => {
    getAllUsers()
      .then((data) => setUsers(data.users))
      .catch((err) => console.log(err));

    Bookings()
      .then((data) => {
        setBookings(data.bookings);
      }) // Εδώ προσαρμόστε το δομή των δεδομένων ανάλογα με το τι επιστρέφει η συνάρτηση Bookings
      .catch((err) => console.log(err));

    getAllMovies()
      .then((data) => setMovie(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const handleFilter = () => {
    const filtered = bookings.filter(
      (booking) => booking.numBooking === parseInt(filterId)
    );
    setFilteredBookings(filtered);
  };

  const handleButtonClick = (id, NumIn) => {
    updateUsers(id, NumIn);
    const updatedBooks = filteredbooks.map((booking) => {
      if (booking._id === id) {
        const numUsersBefore = booking.numUsers;
        const newNumUsers = numUsersBefore - NumIn;
        const newStatus = newNumUsers === 0 ? "completed" : "incompleted"; // Ελέγχει αν το νέο numUsers είναι 0 και αλλάζει το status αναλόγως

        return { ...booking, numUsers: newNumUsers, status: newStatus };
      }
      return booking;
    });
    setFilteredBookings(updatedBooks);
  };

  const handleChange = (event) => {
    setSelectedNumber(event.target.value);
  };
  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Typography
        variant="h3"
        fontFamily={"verdana"}
        textAlign="center"
        padding={2}
        display={"flex"}
        align-items={"center"}
        marginBottom={5}
      >
        Bookings
      </Typography>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Typography variant="h5" marginRight={60}>
          Booking Check-In
        </Typography>
        <TextField
          label={<span style={{ color: "white" }}>Booking Number</span>}
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          InputProps={{
            style: { color: "white" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleFilter}
          style={{ marginLeft: "10px" }}
        >
          Ai breston
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking Number</TableCell>
              <TableCell>Movie</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Name-Email</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Tickets</TableCell>
              <TableCell>Checked-In</TableCell>

              <TableCell>Input</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredbooks.map((booking) => (
              <TableRow
                key={booking.numBooking}
                style={{
                  background:
                    booking.status === "completed" ? "palegreen" : "white",
                }}
              >
                <TableCell>{booking.numBooking}</TableCell>
                <TableCell>
                  {movies.find((movie) => movie._id === booking.movie)?.title ||
                    "Unknown Movie"}
                </TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  {users.find((user) => user._id === booking.user)?.name ||
                    "Unknown User"}
                  -
                  {users.find((user) => user._id === booking.user)?.email ||
                    "Unknown Email"}
                </TableCell>
                <TableCell>{booking.seatNumber.join(",")}</TableCell>
                <TableCell>{booking.seatNumber.length}</TableCell>

                <TableCell>{booking.numUsers}</TableCell>

                {booking.numUsers !== 0 && (
                  <>
                    <TableCell>
                      <Select
                        labelId="label"
                        id="select"
                        value={selectedNumber === 0 ? "" : selectedNumber}
                        onChange={handleChange}
                      >
                        {Array.from(
                          { length: booking.numUsers },
                          (_, index) => (
                            <MenuItem key={index + 1} value={index + 1}>
                              {index + 1}
                            </MenuItem>
                          )
                        )}{" "}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleButtonClick(booking._id, selectedNumber)
                        }
                      >
                        button
                      </Button>
                    </TableCell>{" "}
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>{" "}
    </Box>
  );
};

export default UserTablePage;
