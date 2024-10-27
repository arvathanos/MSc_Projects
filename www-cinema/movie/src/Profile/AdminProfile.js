import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { getAdminById } from "../api-helpers/api.helpers";
import { Typography } from "@mui/material";
import UserTablePage from "./UserTablePage"; // Εισάγετε τον πίνακα χρηστών
import HowToRegIcon from "@mui/icons-material/HowToReg";
import BookingSearchPage from "./BookingSearchPage";

const AdminProfile = () => {
  const [admin, setAdmin] = useState();
  useEffect(() => {
    getAdminById()
      .then((res) => setAdmin(res.admin))
      .catch((err) => console.log(err));
  }, []);
  return (
    <Box
      width={"100%"}
      display="flex"
      color="white"
      flexDirection={"column"}
      alignItems={"center"}
      marginBottom={"150px"}
    >
      <Fragment>
        {" "}
        {admin && (
          <Box
            flexDirection={"column"}
            justifyContent="center"
            alignItems={"center"}
            width={"30%"}
            padding={3}
          >
            <Box display={"flex"} justifyContent={"center"}>
              <HowToRegIcon
                sx={{
                  fontSize: "10rem",
                  display: "flex",
                  ml: 2,
                }}
              />
            </Box>

            <Typography
              mt={1}
              padding={1}
              width={"auto"}
              textAlign={"center"}
              border={"1px solid #ccc"}
              borderRadius={6}
            >
              Email: {admin.email}
            </Typography>
          </Box>
        )}
        <UserTablePage />
      </Fragment>
      <BookingSearchPage />
    </Box>
  );
};

export default AdminProfile;
