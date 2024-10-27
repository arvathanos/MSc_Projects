import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAdmin, getAllMovies } from "../../api-helpers/api.helpers";
import MovieItem from "./MovieItem";
import { useSelector } from "react-redux";
import "../../Mystyles/Movie.css";
import Footer from "../Footer";

const DividerStyle = {
  mb: "0.5%",
  mt: "0.5%",
  width: "10%",
  marginX: "auto",
  borderColor: "blue",
};
const Movies = () => {
  const [movies, setMovies] = useState();
  const [userRole, setUserRole] = useState("");
  const [admincheck, setIsAdmin] = useState(false);

  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isAdminLoggedIn) {
      setUserRole("admin");

      getAdmin().then((data) => {
        setIsAdmin(data.admin.isAdmin);
      });
    } else if (isUserLoggedIn) {
      setUserRole("user");
    }
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, [isAdminLoggedIn, isUserLoggedIn]);

  return (
    <Box margin={"auto"} marginTop={4}>
      <Typography className="heading" variant="h3">
        ALL FILMS
      </Typography>
      <Box>
        <Divider sx={DividerStyle} />
        <Divider sx={DividerStyle} />
      </Box>
      <Box className="Box-moviesContainer">
        {movies &&
          movies.map((movie, index) => (
            <MovieItem
              key={index}
              id={movie._id}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              title={movie.title}
              role={userRole}
              admin={admincheck}
            />
          ))}
      </Box>
      <Footer />
    </Box>
  );
};

export default Movies;
