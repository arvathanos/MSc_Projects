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

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { findGoogleUser } from "../../api-helpers/api.helpers";

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
function generateRandomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 10;
  let randomCode = "";
  for (let i = 0; i < length; i++) {
    randomCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomCode;
}
//--------------------------------------//
const Form = ({ onSubmit, isAdmin }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [isGoogleLogin, setGoogleLogin] = useState(false);
  useEffect(() => {
    console.log("Signup:", isSignup);
  }, [isSignup]);
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ inputs, signup: isAdmin ? false : isSignup, isGoogleLogin });
  };
  const handleGoogleLoginSuccess = (response) => {
    let randomCode = generateRandomCode();

    setGoogleLogin(true);
    const decoded = jwtDecode(response.credential);
    findGoogleUser(decoded.email)
      .then((userExists) => {
        if (!userExists.found) {
          setIsSignup(true);
        } else {
          setIsSignup(false);
        }
        console.log("Signup:", isSignup);

        setInputs((prevInputs) => ({
          ...prevInputs,
          name: decoded.name,
          email: decoded.email,
          password: randomCode,
        }));
        onSubmit({
          inputs: {
            name: decoded.name,
            email: decoded.email,
            password: randomCode,
          },
          signup: isSignup,
          isGoogleLogin: true,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <Dialog open={true} PaperComponent={CustomPaperComponent}>
      <Box sx={{ ml: "auto", padding: 1 }}>
        <IconButton LinkComponent={Link} to="/">
          <CloseIcon style={{ color: "blue" }} />
        </IconButton>
      </Box>
      <Box sx={{ ml: "auto", padding: 1 }}></Box>
      <Typography variant="h4" textAlign={"center"} sx={{ color: "white" }}>
        {isSignup ? "Signup" : "Login"}
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
          {!isAdmin && isSignup && (
            <>
              {" "}
              <FormLabel sx={labelStyle}>Name</FormLabel>
              <TextField
                value={inputs.name}
                onChange={handleChange}
                margin="normal"
                variant="standard"
                type={"text"}
                name="name"
                InputProps={{
                  style: { color: "white" },
                }}
              />
            </>
          )}
          <FormLabel sx={labelStyle}>Email</FormLabel>
          <TextField
            value={inputs.email}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"email"}
            name="email"
            InputProps={{
              style: { color: "white" },
            }}
          />
          <FormLabel sx={labelStyle}>Password</FormLabel>
          <TextField
            value={inputs.password}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"password"}
            name="password"
            InputProps={{
              style: { color: "white" },
            }}
          />
          <Button
            sx={{ mt: 2, borderRadius: 1, bgcolor: "blue" }}
            type="submit"
            variant="contained"
          >
            {isSignup ? "Signup" : "Login"}
          </Button>
          {!isAdmin && (
            <Button
              onClick={() => setIsSignup(!isSignup)}
              sx={{ mt: 1, borderRadius: 1 }}
            >
              {isSignup ? "Login" : "Signup"}
            </Button>
          )}
        </Box>
        {!isAdmin && (
          <Box
            marginTop={"-15%"}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="body1" sx={{ my: 2, color: "white" }}>
              OR
            </Typography>
            <GoogleLogin
              clientId="18847070283-j3mimrj5jphi44b8gc6gealo6ltdsnke.apps.googleusercontent.com"
              onSuccess={handleGoogleLoginSuccess}
              onFailure={() => {
                console.log("Login Failed");
              }}
              cookiePolicy={"single_host_origin"}
              scope="profile email"
            ></GoogleLogin>
          </Box>
        )}
      </form>
    </Dialog>
  );
};

export default Form;
