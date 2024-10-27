import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ScheduleEditor = ({ schedule, onChange }) => {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  const handleAdd = () => {
    if (newDate && newTime) {
      const existingDateIndex = schedule.findIndex(
        (entry) => entry.date === newDate
      );

      if (existingDateIndex !== -1) {
        // If date already exists, add new time
        const updatedSchedule = [...schedule];
        updatedSchedule[existingDateIndex].times.push({
          time: newTime,
          bookedSeats: [],
        });
        onChange(updatedSchedule);
      } else {
        // If date doesn't exist, create a new entry
        const newSchedule = [
          ...schedule,
          {
            date: newDate,
            times: [{ time: newTime, bookedSeats: [] }],
          },
        ];
        onChange(newSchedule);
      }

      setNewDate("");
      setNewTime("");
    }
  };

  const handleDelete = (dateIndex, timeIndex) => {
    const updatedSchedule = [...schedule];
    const times = updatedSchedule[dateIndex].times;
    times.splice(timeIndex, 1);

    if (times.length === 0) {
      // If no more times for this date, remove the entire entry
      updatedSchedule.splice(dateIndex, 1);
    }

    onChange(updatedSchedule);
  };

  return (
    <Box>
      <Typography variant="h6">Schedule Editor</Typography>
      {schedule.map((entry, dateIndex) => (
        <Box key={dateIndex} display="flex" alignItems="center">
          <strong>{formatDate(entry.date)}:</strong>
          {entry.times.map((timeEntry, timeIndex) => (
            <Box key={timeEntry} ml={1} display="flex" alignItems="center">
              <Typography>{timeEntry.time}</Typography>
              <IconButton onClick={() => handleDelete(dateIndex, timeIndex)}>
                <DeleteIcon style={{ color: "red" }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      ))}
      <FormControl>
        <InputLabel htmlFor="releaseDate" shrink>
          Release Date
        </InputLabel>
        <TextField
          id="releaseDate"
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          fullWidth
          margin="normal"
        />{" "}
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="Time" shrink>
          Time
        </InputLabel>
        <TextField
          id="Time"
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          fullWidth
          margin="normal"
        />{" "}
      </FormControl>

      <Button
        onClick={handleAdd}
        sx={{
          backgroundColor: "#0a1c3a",
          marginTop: "25px",
          marginLeft: "10px",
          color: "#ffffff", // Λευκό χρώμα για το κείμενο
          ":hover": {
            backgroundColor: "green", // Χρώμα on hover
          },
        }}
      >
        Add
      </Button>
    </Box>
  );
};

export default ScheduleEditor;
