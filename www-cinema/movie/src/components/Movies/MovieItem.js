import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { deleteMovieById } from "../../api-helpers/api.helpers";
import MovieDialog from "./MovieDialog";
import "../../Mystyles/Movieitem.css"; // Ενσωματώστε το CSS

const MovieItem = ({ title, releaseDate, posterUrl, id, role, admin }) => {
  const handleDeleteMovie = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      deleteMovieById(id)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
        });
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdate = (id) => {
    if (window.confirm("Are you sure you want to update this movie?")) {
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Card className="card">
      <img src={posterUrl} alt={title} />
      <CardContent className="card-content">
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(releaseDate).toDateString()}
        </Typography>
      </CardContent>
      <CardActions className="card-actions">
        {role === "admin" ? (
          <>
            {admin && (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    margin: "auto",
                    bgcolor: "#FF0000",
                    ":hover": {
                      bgcolor: "#990000",
                    },
                  }}
                  onClick={() => handleDeleteMovie(id)}
                  size="small"
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    margin: "auto",
                    bgcolor: "#2b2d42",
                    ":hover": {
                      bgcolor: "#009900",
                    },
                  }}
                  onClick={() => handleUpdate(id)}
                  size="small"
                >
                  Update
                </Button>
                <MovieDialog
                  isOpen={isDialogOpen}
                  handleClose={handleCloseDialog}
                  movieId={id}
                />
              </>
            )}
          </>
        ) : role === "user" ? (
          <Button
            variant="contained"
            fullWidth
            LinkComponent={Link}
            to={`/booking/${id}`}
            sx={{
              margin: "auto",
              bgcolor: "#2b2d42",
              ":hover": {
                bgcolor: "#121217",
              },
            }}
            size="small"
          >
            Book
          </Button>
        ) : (
          <Button
            variant="contained"
            fullWidth
            LinkComponent={Link}
            to={`/auth`}
            sx={{
              margin: "auto",
              bgcolor: "#2b2d42",
              ":hover": {
                bgcolor: "#121217",
              },
            }}
            size="small"
          >
            Book
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default MovieItem;
