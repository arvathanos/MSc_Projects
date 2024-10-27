import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import {
  getMovieDetails,
  updateMovieById,
} from "../../api-helpers/api.helpers";
import ScheduleEditor from "./ScheduleEditor";

const MovieDialog = ({ isOpen, handleClose, movieId }) => {
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    posterUrl: "",
    actors: "",
    schedule: [],
  });

  useEffect(() => {
    getMovieDetails(movieId)
      .then((res) => setMovie(res.movie))
      .catch((err) => console.log(err));
  }, [movieId]);

  const handleUpdate = async () => {
    try {
      await updateMovieById(movieId, movie);
      handleClose();

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleScheduleChange = (newSchedule) => {
    setMovie((prev) => ({ ...prev, schedule: newSchedule }));
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>Update Movie</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={movie.title}
          onChange={(e) =>
            setMovie((prev) => ({ ...prev, title: e.target.value }))
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={movie.description}
          onChange={(e) =>
            setMovie((prev) => ({ ...prev, description: e.target.value }))
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Poster URL"
          value={movie.posterUrl}
          onChange={(e) =>
            setMovie((prev) => ({ ...prev, posterUrl: e.target.value }))
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Actors"
          value={movie.actors}
          onChange={(e) =>
            setMovie((prev) => ({ ...prev, actors: e.target.value }))
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Release Date"
          type="date"
          value={movie.releaseDate}
          onChange={(e) =>
            setMovie((prev) => ({ ...prev, releaseDate: e.target.value }))
          }
          fullWidth
          margin="normal"
        />
        <ScheduleEditor
          schedule={movie.schedule}
          onChange={handleScheduleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "red", // Αντικαταστήστε το χρώμα με το επιθυμητό
            color: "#ffffff", // Λευκό χρώμα για το κείμενο
            ":hover": {
              backgroundColor: "#990000", // Χρώμα on hover
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          sx={{
            backgroundColor: "#0a1c3a", // Αντικαταστήστε το χρώμα με το επιθυμητό
            color: "#ffffff", // Λευκό χρώμα για το κείμενο
            ":hover": {
              backgroundColor: "green", // Χρώμα on hover
            },
          }}
        >
          Update Movie
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieDialog;
