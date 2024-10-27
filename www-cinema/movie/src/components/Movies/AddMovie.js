import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { addMovie } from "../../api-helpers/api.helpers";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const labelProps = {
  mt: 1,
  mb: 1,
};
const AddMovie = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    posterUrl: "",
    releaseDate: "",
    featured: false,
    schedule: [], // Προσθήκη πεδίου για το πρόγραμμα προβολών
    selectedDate: null, // Νέα καταχώρηση για την επιλεγμένη ημέρα
    selectedTime: "",
  });
  const [actors, setActors] = useState([]);
  const [actor, setActor] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDateClick = (date) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      selectedDate: date,
      selectedTime: "",
    }));
  };

  const handleAddTime = () => {
    if (inputs.selectedTime && inputs.selectedDate) {
      const existingDateIndex = inputs.schedule.findIndex(
        (entry) => entry.date === inputs.selectedDate
      );

      if (existingDateIndex !== -1) {
        // Η ημερομηνία υπάρχει ήδη στο πρόγραμμα
        const existingDate = inputs.schedule[existingDateIndex];

        const updatedTimes =
          existingDate.times && Array.isArray(existingDate.times)
            ? [
                ...existingDate.times.map((timeEntry) => timeEntry.time),
                inputs.selectedTime,
              ]
            : [inputs.selectedTime];

        const updatedSchedule = [
          ...inputs.schedule.slice(0, existingDateIndex),
          {
            date: inputs.selectedDate,
            times: updatedTimes.map((time) => ({
              time: time,
              bookedSeats: [],
            })),
          },
          ...inputs.schedule.slice(existingDateIndex + 1),
        ];
        setInputs((prevInputs) => ({
          ...prevInputs,
          schedule: updatedSchedule,
          selectedTime: "",
        }));
      } else {
        // Δημιουργία νέας εγγραφής
        setInputs((prevInputs) => ({
          ...prevInputs,
          schedule: [
            ...prevInputs.schedule,
            {
              date: inputs.selectedDate,
              times: [{ time: inputs.selectedTime, bookedSeats: [] }],
            },
          ],
          selectedTime: "",
        }));
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs, actors);
    const movieData = {
      ...inputs,
      schedule: inputs.schedule,
    };
    addMovie(movieData)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    navigate("/movies");
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          width={"50%"}
          padding={10}
          margin="auto"
          display={"flex"}
          flexDirection="column"
          boxShadow={"10px 10px 20px #aaa"}
          sx={{
            backgroundColor: "white", // Προσθήκη χρώματος φόντου
          }}
        >
          <Typography textAlign={"center"} variant="h5" fontFamily={"verdana"}>
            Add New Movie
          </Typography>
          <FormLabel sx={labelProps}>Title</FormLabel>
          <TextField
            value={inputs.title}
            onChange={handleChange}
            name="title"
            variant="standard"
            margin="normal"
          />
          <FormLabel sx={labelProps}>Description</FormLabel>
          <TextField
            value={inputs.description}
            onChange={handleChange}
            name="description"
            variant="standard"
            margin="normal"
          />
          <FormLabel sx={labelProps}>Poster URL</FormLabel>
          <TextField
            value={inputs.posterUrl}
            onChange={handleChange}
            name="posterUrl"
            variant="standard"
            margin="normal"
          />
          <FormLabel sx={labelProps}>Release Date</FormLabel>
          <TextField
            type={"date"}
            value={inputs.releaseDate}
            onChange={handleChange}
            name="releaseDate"
            variant="standard"
            margin="normal"
          />
          <FormLabel sx={labelProps}>Actor</FormLabel>
          <Box display={"flex"}>
            <TextField
              value={actor}
              name="actor"
              onChange={(e) => setActor(e.target.value)}
              variant="standard"
              margin="normal"
            />
            <Button
              onClick={() => {
                setActors([...actors, actor]);
                setActor("");
              }}
            >
              Add
            </Button>
          </Box>

          <FormLabel sx={labelProps}>Select Date</FormLabel>
          <div>
            <input
              type="date"
              name="selectedDate"
              value={inputs.selectedDate}
              onChange={(e) => handleDateClick(e.target.value)}
            />
          </div>
          <div>
            <label>Select Time: </label>
            <input
              type="time"
              name="selectedTime"
              value={inputs.selectedTime}
              onChange={(e) =>
                setInputs({ ...inputs, selectedTime: e.target.value })
              }
            />
            <Button onClick={handleAddTime}>Add Time</Button>
          </div>
          <div>
            <label>Schedule</label>
            <ul>
              {inputs.schedule.map((entry, index) => (
                <li key={index}>
                  {new Date(entry.date).toDateString()} -{" "}
                  {entry.times.map((timeEntry, timeIndex) => (
                    <span key={timeIndex}>
                      {timeEntry.time}
                      {timeIndex < entry.times.length - 1 && ", "}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </div>

          <FormLabel sx={labelProps}>Featured</FormLabel>
          <Checkbox
            name="featured"
            checked={inputs.featured}
            onClick={(e) =>
              setInputs((prevSate) => ({
                ...prevSate,
                featured: e.target.checked,
              }))
            }
            sx={{ mr: "auto" }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "40%",
              margin: "auto",
              bgcolor: "#0a1c3a",
              ":hover": {
                bgcolor: "green",
              },
            }}
          >
            Add New Movie
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default AddMovie;
