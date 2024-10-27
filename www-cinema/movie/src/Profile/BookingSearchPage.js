import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getAllMovies, Bookings } from "../api-helpers/api.helpers";

const BookingSearchPage = () => {
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showBookings, setShowBookings] = useState(false);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));

    Bookings()
      .then((data) => setBookings(data.bookings))
      .catch((err) => console.log(err));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const handleSearch = () => {
    // Αναζήτηση κρατήσεων βάσει του ονόματος της ταινίας ή της ημερομηνίας
    const filteredBookings = bookings.filter((booking) => {
      const movie = movies.find((movie) => movie._id === booking.movie);
      const isNameMatch =
        !searchText || movie?.title.toLowerCase() === searchText.toLowerCase();
      const isDateMatch =
        !searchDate || formatDate(booking.date) === formatDate(searchDate);
      return isNameMatch && isDateMatch;
    });
    return filteredBookings;
  };

  const handleClear = () => {
    setSearchText("");
    setSearchDate("");
    setShowBookings(false);
  };

  return (
    <Box marginTop={4}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Search Bookings
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <TextField
          label="Search by Movie Title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          variant="outlined"
          margin="dense"
          InputProps={{
            style: { color: "white" },
          }}
          InputLabelProps={{
            shrink: true,
            style: { color: "white" },
          }}
        />
        <TextField
          label="Search by Date"
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          variant="outlined"
          margin="dense"
          InputLabelProps={{
            shrink: true,
            style: { color: "white" },
          }}
          InputProps={{
            style: { color: "white" },
          }}
        />
        <Button
          variant="contained"
          onClick={() => setShowBookings(true)}
          style={{ marginLeft: "10px" }}
        >
          Search
        </Button>
        <Button
          variant="contained"
          onClick={handleClear}
          style={{ marginLeft: "10px" }}
        >
          Clear
        </Button>
      </Box>
      {showBookings && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Booking Number</TableCell>
                <TableCell>Movie</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Tickets</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {handleSearch().map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.numBooking}</TableCell>
                  <TableCell>
                    {movies.find((movie) => movie._id === booking.movie)
                      ?.title || "Unknown Movie"}
                  </TableCell>
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{booking.time}</TableCell>

                  <TableCell>{booking.seatNumber.length}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align="right">
                  Total Users:
                </TableCell>
                <TableCell>
                  {handleSearch().reduce(
                    (total, booking) => total + booking.seatNumber.length,
                    0
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BookingSearchPage;
