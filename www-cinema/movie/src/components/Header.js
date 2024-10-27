import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Box,
  Tab,
  Tabs,
  TextField,
  Toolbar,
} from "@mui/material";
import { getAdmin, getAllMovies } from "../api-helpers/api.helpers";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminActions, userActions } from "../store";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [value, setValue] = useState(0);
  const [movies, setMovies] = useState([]);
  const [admincheck, setIsAdmin] = useState(false);
  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
    getAdmin().then((data) => {
      setIsAdmin(data.admin.isAdmin);
    });
  }, []);

  const logout = (isAdmin) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
  };
  const handleChange = (e, val) => {
    const movie = movies.find((m) => m.title === val);
    console.log(movie);
    if (isUserLoggedIn) {
      navigate(`/booking/${movie._id}`);
    }
  };
  return (
    <AppBar position="sticy" sx={{ bgcolor: "#0a1c3a" }}>
      <Toolbar>
        <Box width={"20%"}>
          <Link to="/">
            {" "}
            <span
              style={{
                fontFamily: "NunitoSans,Helvetica,Arial,sans-serif",
                color: "white",
                fontSize: "25px",
                letterSpacing: "1px",
                //line-height:"24px",
                marginLeft: "4px",
              }}
            >
              MYCINEMA
            </span>
          </Link>
        </Box>
        <Box width={"30%"} margin={"auto"}>
          <Autocomplete
            onChange={handleChange}
            freeSolo
            options={movies && movies.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                sx={{ input: { color: "white" } }}
                variant="standard"
                {...params}
                placeholder="search Movies"
              />
            )}
          />
        </Box>
        <Box display={"flex"}>
          <Tabs
            textColor="white"
            indicatorColor="secondary"
            value={value}
            onChange={(e, val) => setValue(val)}
          >
            <Tab LinkComponent={Link} to="/movies" label="Films" />
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Tab LinkComponent={Link} label="Admin" to="/admin" />
                <Tab LinkComponent={Link} label="Auth" to="/auth" />
              </>
            )}
            {isUserLoggedIn && (
              <>
                <Tab LinkComponent={Link} label="Profile" to="/user" />
                <Tab
                  onClick={() => logout(false)}
                  LinkComponent={Link}
                  to="/"
                  label="Logout"
                />
              </>
            )}

            {isAdminLoggedIn && (
              <>
                <Tab LinkComponent={Link} label="Profile" to="/user-admin" />
                {admincheck && (
                  <Tab LinkComponent={Link} label="Add Movie" to="/add" />
                )}
                <Tab
                  onClick={() => logout(true)}
                  LinkComponent={Link}
                  to="/"
                  label="Logout"
                />
              </>
            )}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
