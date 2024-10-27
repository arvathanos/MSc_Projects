import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  AlertTitle,
} from "@mui/material";
import {
  getMovieDetails,
  newBooking,
  updateSchedule,
} from "../../api-helpers/api.helpers";
import "./style.css";
import { useParams } from "react-router-dom";
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const BookingDialog = ({
  isOpen,
  handleClose,
  handleOpen,
  selectedDate,
  selectedTime,
}) => {
  const [inputs, setInputs] = useState({ selectedSeats: [] });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movie, setMovie] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  const id = useParams().id;
  console.log(id);

  useEffect(() => {
    getMovieDetails(id)
      .then((res) => setMovie(res.movie))
      .catch((err) => console.log(err));
  }, [id]);

  const handleSeatClick = (e) => {
    const seat = e.target;
    if (!seat.classList.contains("occupied")) {
      seat.classList.toggle("selected");
      const seatInfo = `${seat.parentElement.dataset.row}-${seat.dataset.seat}`;
      if (selectedSeats.includes(seatInfo)) {
        setSelectedSeats(
          selectedSeats.filter((selectedSeat) => selectedSeat !== seatInfo)
        );
      } else {
        setSelectedSeats([...selectedSeats, seatInfo]);
      }

      // Ρυθμίζει το data-seat όταν γίνεται κλικ σε μια θέση αναπηρικού
      if (seat.classList.contains("wheelchair")) {
        seat.removeAttribute("data-seat");
      } else {
        seat.setAttribute("data-seat", seat.dataset.seat);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSnackbarOpen(true);

    if (selectedDate && selectedTime && selectedSeats.length > 0) {
      const numTickets = selectedSeats.length;
      const bookingData = {
        ...inputs,
        movie: id,
        date: selectedDate,
        time: selectedTime,
        seatNumber: selectedSeats,
        numUsers: numTickets,
      };
      newBooking(bookingData)
        .then((res) => {
          console.log(res);
          const data = {
            id: id,
            date: selectedDate,
            time: selectedTime,
            seatNumbers: selectedSeats,
          };
          updateSchedule(data)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
      // Κλείστε τον διάλογο μετά την υποβολή
      setTimeout(() => {
        handleClose();
        navigate("/user");
      }, 4000);
    } else {
      console.log("Please select a date and time");
    }
  };
  const dialogStyle = {
    backgroundColor: "#0a1c3a",
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Paper style={dialogStyle}>
        <DialogTitle className="DialogTitle">Booking Details</DialogTitle>
        <DialogContent className="dialog-background">
          <div>
            <ul className="showcase">
              <li>
                <div className="seat"></div>
                <small>Available</small>
              </li>
              <li>
                <div className="seat selected"></div>
                <small>Selected</small>
              </li>
              <li>
                <div className="seat occupied"></div>
                <small>Occupied</small>
              </li>
            </ul>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={9000}
              onClose={handleSnackbarClose}
            >
              <MuiAlert
                onClose={handleSnackbarClose}
                severity="success"
                sx={{ width: "150%" }}
              >
                <AlertTitle>Your booking was successful!</AlertTitle>
                You will find details in your email.
              </MuiAlert>
            </Snackbar>
            <div className="container">
              <div className="screen">
                {" "}
                <p class="screen-text">Screen</p>
              </div>
              <div className="row" data-row="A">
                {[...Array(8).keys()].map((seat) => {
                  const seatId = `A-${seat + 1}`;
                  const isOccupied =
                    movie && movie.schedule
                      ? movie.schedule.some((entry) => {
                          const entryDate = new Date(entry.date);
                          return (
                            moment.utc(entryDate).format("dddd, LL") ===
                              moment.utc(selectedDate).format("dddd, LL") &&
                            entry.times.some(
                              (timeEntry) =>
                                timeEntry.time === selectedTime &&
                                timeEntry.bookedSeats.includes(seatId)
                            )
                          );
                        })
                      : false;

                  const isSeatSelected = selectedSeats.includes(seatId);
                  const seatClassName = `seat ${isOccupied ? "occupied" : ""} ${
                    isSeatSelected ? "selected" : ""
                  }`;
                  return (
                    <div
                      className={seatClassName}
                      key={`A-${seat + 1}`}
                      data-seat={seat + 1}
                      onClick={handleSeatClick}
                      disabled={isOccupied} // Καθορίστε την επιλεξιμότητα ανάλογα με το αν η θέση είναι κρατημένη
                    ></div>
                  );
                })}
              </div>

              <div className="row" data-row="B">
                {[...Array(8).keys()].map((seat) => {
                  const seatId = `B-${seat + 1}`;
                  const isOccupied =
                    movie && movie.schedule
                      ? movie.schedule.some((entry) => {
                          const entryDate = new Date(entry.date);
                          return (
                            moment.utc(entryDate).format("dddd, LL") ===
                              moment.utc(selectedDate).format("dddd, LL") &&
                            entry.times.some(
                              (timeEntry) =>
                                timeEntry.time === selectedTime &&
                                timeEntry.bookedSeats.includes(seatId)
                            )
                          );
                        })
                      : false;

                  const isSeatSelected = selectedSeats.includes(seatId);
                  const seatClassName = `seat ${isOccupied ? "occupied" : ""} ${
                    isSeatSelected ? "selected" : ""
                  }`;
                  return (
                    <div
                      className={seatClassName}
                      key={`B-${seat + 1}`}
                      data-seat={seat + 1}
                      onClick={handleSeatClick}
                      disabled={isOccupied}
                    ></div>
                  );
                })}{" "}
              </div>

              <div className="row" data-row="C">
                {[...Array(8).keys()].map((seat) => {
                  const seatId = `C-${seat + 1}`;
                  const isOccupied =
                    movie && movie.schedule
                      ? movie.schedule.some((entry) => {
                          const entryDate = new Date(entry.date);
                          return (
                            moment.utc(entryDate).format("dddd, LL") ===
                              moment.utc(selectedDate).format("dddd, LL") &&
                            entry.times.some(
                              (timeEntry) =>
                                timeEntry.time === selectedTime &&
                                timeEntry.bookedSeats.includes(seatId)
                            )
                          );
                        })
                      : false;

                  const isSeatSelected = selectedSeats.includes(seatId);
                  const seatClassName = `seat ${isOccupied ? "occupied" : ""} ${
                    isSeatSelected ? "selected" : ""
                  }`;
                  return (
                    <div
                      className={seatClassName}
                      key={`C-${seat + 1}`}
                      data-seat={seat + 1}
                      onClick={handleSeatClick}
                      disabled={isOccupied}
                    ></div>
                  );
                })}{" "}
              </div>

              <div className="row" data-row="D">
                {[...Array(8).keys()].map((seat) => {
                  const seatId = `D-${seat + 1}`;
                  const isOccupied =
                    movie && movie.schedule
                      ? movie.schedule.some((entry) => {
                          const entryDate = new Date(entry.date);
                          return (
                            moment.utc(entryDate).format("dddd, LL") ===
                              moment.utc(selectedDate).format("dddd, LL") &&
                            entry.times.some(
                              (timeEntry) =>
                                timeEntry.time === selectedTime &&
                                timeEntry.bookedSeats.includes(seatId)
                            )
                          );
                        })
                      : false;

                  const isSeatSelected = selectedSeats.includes(seatId);
                  const seatClassName = `seat ${isOccupied ? "occupied" : ""} ${
                    isSeatSelected ? "selected" : ""
                  }`;
                  return (
                    <div
                      className={seatClassName}
                      key={`D-${seat + 1}`}
                      data-seat={seat + 1}
                      onClick={handleSeatClick}
                      disabled={isOccupied}
                    ></div>
                  );
                })}{" "}
              </div>

              <div className="row" data-row="E">
                {[...Array(8).keys()].map((seat) => {
                  const seatId = `E-${seat + 1}`;
                  const isOccupied =
                    movie && movie.schedule
                      ? movie.schedule.some((entry) => {
                          const entryDate = new Date(entry.date);
                          return (
                            moment.utc(entryDate).format("dddd, LL") ===
                              moment.utc(selectedDate).format("dddd, LL") &&
                            entry.times.some(
                              (timeEntry) =>
                                timeEntry.time === selectedTime &&
                                timeEntry.bookedSeats.includes(seatId)
                            )
                          );
                        })
                      : false;

                  const isSeatSelected = selectedSeats.includes(seatId);
                  const seatClassName = `seat ${isOccupied ? "occupied" : ""} ${
                    isSeatSelected ? "selected" : ""
                  }`;
                  return (
                    <div
                      className={seatClassName}
                      key={`E-${seat + 1}`}
                      data-seat={seat + 1}
                      onClick={handleSeatClick}
                      disabled={isOccupied}
                    ></div>
                  );
                })}{" "}
              </div>
              <div className="row" data-row="F">
                {[...Array(8).keys()].map((seat) => {
                  const seatId = `F-${seat + 1}`;
                  const isWheelchair = seatId === "F-2" || seatId === "F-3"; // Έλεγχος αν είναι αναπηρική θέση
                  const isOccupied =
                    movie && movie.schedule
                      ? movie.schedule.some((entry) => {
                          const entryDate = new Date(entry.date);
                          return (
                            moment.utc(entryDate).format("dddd, LL") ===
                              moment.utc(selectedDate).format("dddd, LL") &&
                            entry.times.some(
                              (timeEntry) =>
                                timeEntry.time === selectedTime &&
                                timeEntry.bookedSeats.includes(seatId)
                            )
                          );
                        })
                      : false;

                  const isSeatSelected = selectedSeats.includes(seatId);
                  let seatClassName = `seat ${isOccupied ? "occupied" : ""} ${
                    isSeatSelected ? "selected" : ""
                  }`;

                  if (isWheelchair) {
                    seatClassName += " wheelchair";
                  }
                  return (
                    <div
                      className={seatClassName}
                      key={`F-${seat + 1}`}
                      data-seat={seat + 1}
                      onClick={handleSeatClick}
                      disabled={isOccupied}
                      style={
                        isWheelchair
                          ? {
                              backgroundSize: "cover",
                              backgroundImage:
                                'url("https://c.scdn.gr/images/sku_images/069102/69102993/xlarge_20221209104902_f2be74d1.jpeg")',
                              backgroundPosition: "25%",
                            }
                          : {}
                      }
                    ></div>
                  );
                })}{" "}
              </div>
              <p className="text">
                Seats Selected:{" "}
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((seat, index) => (
                    <span key={index}>{seat} </span>
                  ))
                ) : (
                  <span>None Selected</span>
                )}
              </p>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Confirm Booking
          </Button>
        </DialogActions>
      </Paper>
    </Dialog>
  );
};

export default BookingDialog;
