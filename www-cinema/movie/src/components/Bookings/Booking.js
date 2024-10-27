import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api.helpers";
import "../../Mystyles/Booking.css";
import moment from "moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BookingDialog from "./BookingDialog";
import Footer from "../Footer";

const Booking = () => {
  const [movie, setMovie] = useState();
  const [inputs, setInputs] = useState({ selectedSeats: [] });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showBookingWindow, setShowBookingWindow] = useState(false);

  const handleOpenBookingWindow = () => {
    setShowBookingWindow(true);
  };

  const handleCloseBookingWindow = () => {
    setShowBookingWindow(false);
  };
  const id = useParams().id;
  console.log(id);

  useEffect(() => {
    getMovieDetails(id)
      .then((res) => setMovie(res.movie))
      .catch((err) => console.log(err));
  }, [id]);
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      const bookingData = {
        ...inputs,
        movie: movie._id,
        date: selectedDate,
        time: selectedTime,
      };
      newBooking(bookingData)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      // Κλείνω τον διάλογο μετά την υποβολή
      handleCloseBookingWindow();
    } else {
      console.log("Please select a date and time");
    }
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
  };

  const uniqueDates = movie?.schedule
    ? Array.from(
        new Set(movie.schedule.map((scheduleItem) => scheduleItem.date))
      )
    : [];

  const today = moment();
  const filteredDates = uniqueDates.filter((date) =>
    moment(date).isAfter(today, "day")
  );

  return (
    <div>
      {movie && (
        <Fragment>
          <div className="firstofall">
            <Typography
              className="movie-title"
              fontSize={"270%"}
              marginBottom={4}
              marginTop={2}
            >
              {movie.title}
            </Typography>
            <Box className="movie-container">
              <Box sx={{ flex: "0 0 40%", width: "40%", maxWidth: "40%" }}>
                <img
                  className="movie-poster"
                  src={movie.posterUrl}
                  alt={movie.title}
                />
              </Box>
              <Box sx={{ flex: "0 0 60%", width: "60%", maxWidth: "60%" }}>
                <Box className="movie-details-box">
                  <Box className="movie-description">
                    <Typography className="movie-details">CAST </Typography>
                    <Typography marginTop={1} marginBottom={2}>
                      {movie.actors.map((actor) => " " + actor + " ")}
                    </Typography>
                    <Typography className="movie-details">SYNOPSIS </Typography>

                    <Typography paddingTop={1} marginBottom={2}>
                      {movie.description}
                    </Typography>
                    <Typography className="movie-details">
                      RELEASE DATE
                    </Typography>
                    <Typography fontWeight={"bold"} marginTop={1}>
                      {new Date(movie.releaseDate).toDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>{" "}
            <div className="ShowTimes">
              <Box
                padding={0}
                margin={"auto"}
                display="flex"
                flexDirection={"column"}
                color={"white"}
                width={"70%"}
              >
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  fontSize="24px"
                >
                  Show me times
                </Box>
                <Slider {...settings}>
                  {filteredDates.map((date, index) => (
                    <div key={index} className="schedule-item">
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          handleDateClick(date);
                        }}
                        className={`day-button ${
                          selectedDate === date ? "selected" : ""
                        }`}
                        style={{
                          background: "white",
                        }}
                      >
                        {moment.utc(date).format("dddd, LL")}
                      </button>{" "}
                      {selectedDate === date && movie && movie.schedule && (
                        <div className="time-buttons">
                          {movie.schedule
                            .filter((scheduleItem) =>
                              moment(scheduleItem.date).isSame(date, "day")
                            )

                            .map((scheduleItem, index) => (
                              <Box
                                key={index}
                                padding={1}
                                display="flex"
                                flexWrap="nowrap"
                              >
                                {scheduleItem.times.map((timeObj, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      handleTimeSelect(timeObj.time);
                                      handleOpenBookingWindow();
                                    }}
                                    style={{
                                      marginLeft: "8px",
                                      position: "relative",
                                      width: "120%", // Καθορισμός πλάτους στο 100%
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      background: "white",
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      style={{ marginBottom: "10px" }}
                                    >
                                      {moment
                                        .utc(timeObj.time, "HH:mm")
                                        .format("HH:mm")}
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      style={{
                                        position: "absolute",
                                        top: "75%",
                                        left: "0%",
                                        marginBottom: "10px",
                                        background: "blue",
                                        color: "white",
                                        width: "100%", // Καθορισμός πλάτους στο 100%
                                        textAlign: "center",
                                        fontSize: "12px",
                                        margin: "5px", // Καθορισμός μεγέθους γραμματοσειράς
                                      }}
                                    >
                                      Book Now
                                    </Typography>
                                  </button>
                                ))}
                              </Box>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </Slider>{" "}
              </Box>

              <BookingDialog
                isOpen={showBookingWindow}
                handleClose={handleCloseBookingWindow}
                handleOpen={handleOpenBookingWindow}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                movieId={movie._id}
              />
            </div>
          </div>
          <Footer />
        </Fragment>
      )}
    </div>
  );
};

export default Booking;
