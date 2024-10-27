import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MovieItem from "./Movies/MovieItem";
import { Link } from "react-router-dom";
import { getAdmin, getAllMovies } from "../api-helpers/api.helpers";
import { useSelector } from "react-redux";

import "../Mystyles/HomePage.css";
import Footer from "./Footer";
const DividerStyle = {
  mb: "0.5%",
  mt: "0.5%",
  width: "10%",
  marginX: "auto",
  borderColor: "blue",
};
const HomePage = () => {
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
    <>
      <Box className="Box-root">
        <Box className="Box-imageContainer">
          <img
            src="https://media.cinemacloud.co.uk/imageFilm/1705_1_1.jpg"
            alt=""
            className="Box-imageContainer"
          />
        </Box>
        <Box className="Box-titleContainer">
          <Typography variant="h4" textAlign={"center"} color={"white"}>
            Latest Releases
          </Typography>
          <Box>
            <Divider sx={DividerStyle} /> <Divider sx={DividerStyle} />{" "}
          </Box>
        </Box>
        <Box className="Box-moviesContainer">
          {movies &&
            movies
              .slice(0, 4)
              .map((movie, index) => (
                <MovieItem
                  id={movie._id}
                  key={index}
                  title={movie.title}
                  posterUrl={movie.posterUrl}
                  releaseDate={movie.releaseDate}
                  role={userRole}
                  admin={admincheck}
                />
              ))}
        </Box>
        <Box className="Box-buttonContainer">
          <Button
            variant="outlined"
            LinkComponent={Link}
            to="/movies"
            className="Button-viewAllMovies"
          >
            View All Movies
          </Button>
        </Box>{" "}
        <Footer />
      </Box>{" "}
    </>
  );
};

export default HomePage;
