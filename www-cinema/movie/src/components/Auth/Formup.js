import {
  Box,
  Button,
  Dialog,
  Divider,
  FormLabel,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const labelStyle = {
  mt: 1,
  mb: 1,
  color: "#bcc0d0",
  letterSpacing: ".5px",
  lineHeight: "24px",
};

const DividerStyle = {
  mb: 1,
  mt: 0.5,
  width: "15%",
  marginX: "auto",
  borderColor: "#a8a8a8",
};
const CustomPaperComponent = styled(Paper)({
  backgroundColor: "#0a1c3a",
  borderRadius: 4,
});

const Formup = ({ onSubmit, isAdmin }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ inputs, signup: isAdmin ? false : isSignup });
  };
  return (
    <Dialog open={true} PaperComponent={CustomPaperComponent}>
      <Box sx={{ ml: "auto", padding: 1 }}>
        <IconButton>
          <CloseIcon style={{ color: "blue" }} />
        </IconButton>
      </Box>
      <Box sx={{ ml: "auto", padding: 1 }}></Box>
      <Typography variant="h4" textAlign={"center"} sx={{ color: "white" }}>
        SIGN UP TO MYCINEMA{" "}
      </Typography>
      <Box>
        <Divider sx={DividerStyle} />
        <Divider sx={DividerStyle} />
      </Box>
      <form onSubmit={handleSubmit}>
        <Box
          padding={6}
          display={"flex"}
          justifyContent={"center"}
          flexDirection="column"
          width={400}
          margin="auto"
          alignContent={"center"}
        >
          <FormLabel sx={labelStyle}>Name</FormLabel>
          <TextField
            value={inputs.name}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"text"}
            name="name"
          />
          <FormLabel sx={labelStyle}>Email</FormLabel>
          <TextField
            value={inputs.email}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"email"}
            name="email"
          />
          <FormLabel sx={labelStyle}>Password</FormLabel>
          <TextField
            value={inputs.password}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"password"}
            name="password"
          />
          <Button
            sx={{ mt: 2, borderRadius: 1, bgcolor: "blue" }}
            type="submit"
            variant="contained"
          >
            {isSignup ? "Signup" : "Login"}
          </Button>

          <Button
            onClick={() => setIsSignup(!isSignup)}
            sx={{ mt: 1, borderRadius: 1 }}
          >
            {" "}
            {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default Formup;
