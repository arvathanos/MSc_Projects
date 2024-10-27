import axios from "axios";

export const getAllMovies = async () => {
  const res = await axios
    .get("http://localhost:5000/movie")
    .catch((err) => console.log(err));

  if (!res || !res.status || res.status !== 200) {
    console.log("No Data");
    return null; // Ή άλλη κατάλληλη τιμή
  }

  const data = await res.data;
  return data;
};

export const sendUserAuthRequest = async (data, signup, isGoogleLogin) => {
  const url = `user/${signup ? "signup" : "login"}`;

  const res = await axios
    .post(url, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
      isGoogleLogin: isGoogleLogin,
    })
    .catch((err) => console.log(err));

  if (res.status !== 200 && res.status !== 201) {
    console.log("Unexpected Error ");
  }

  const resData = await res.data;
  return resData;
};

export const sendAdminAuthRequest = async (data) => {
  const res = await axios
    .post("admin/login", {
      email: data.email,
      password: data.password,
    })
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }

  const resData = await res.data;
  return resData;
};

export const getMovieDetails = async (id) => {
  const res = await axios.get(`/movie/${id}`).catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const newBooking = async (data) => {
  const res = await axios
    .post("/booking", {
      movie: data.movie,
      seatNumber: data.seatNumber,
      numUsers: data.numUsers,
      date: data.date,
      time: data.time,
      user: localStorage.getItem("userId"),
    })
    .catch((err) => console.log(err));

  if (res.status !== 201) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const updateSchedule = async (data) => {
  const res = await axios
    .put(`/movie/Schedule/${data.id}`, {
      date: data.date,
      time: data.time,
      seatNumbers: data.seatNumbers,
    })
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const getUserBooking = async () => {
  const id = localStorage.getItem("userId");
  const res = await axios
    .get(`/user/bookings/${id}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const deleteBooking = async (id) => {
  const res = await axios
    .delete(`/booking/${id}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unepxected Error");
  }

  const resData = await res.data;
  return resData;
};

export const getUserDetails = async () => {
  const id = localStorage.getItem("userId");
  const res = await axios.get(`/user/${id}`).catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
};

export const addMovie = async (data) => {
  const res = await axios
    .post(
      "/movie",
      {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        posterUrl: data.posterUrl,
        fetaured: data.fetaured,
        actors: data.actors,
        admin: localStorage.getItem("adminId"),
        schedule: data.schedule,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .catch((err) => console.log(err));

  if (res.status !== 201) {
    return console.log("Unexpected Error ");
  }

  const resData = await res.data;
  return resData;
};

export const getAdminById = async () => {
  const adminId = localStorage.getItem("adminId");
  const res = await axios
    .get(`/admin/${adminId}`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log("Unexpected Error ");
  }

  const resData = await res.data;
  return resData;
};

export const deleteMovieById = async (id) => {
  const res = await axios
    .delete(`/movie/${id}`)
    .catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("Unexpected Error ");
  }
  const resData = await res.data;
  return resData;
};

export const updateMovieById = async (id, data) => {
  const res = await axios
    .put(`/movie/update/${id}`, data)
    .catch((err) => console.log(err));
  if (res.status !== 200) {
    return console.log("Unexpected Error ");
  }
  const resData = await res.data;
  return resData;
};
////-////
export const getAdmin = async () => {
  const adminId = localStorage.getItem("adminId");
  const res = await axios
    .get(`/admin/${adminId}`)
    .catch((err) => console.log(err));

  const data = res.data;
  return data;
};

export const getAllUsers = async () => {
  const res = await axios.get(`/user/`).catch((err) => console.log(err));
  const data = res.data;
  return data;
};

export const Bookings = async () => {
  const res = await axios.get(`/booking`).catch((err) => console.log(err));
  const data = res.data;
  return data;
};

export const filterBookingsByUserEmail = async (bookings, id) => {
  try {
    const booking = bookings.find((booking) => booking._id === id);

    const res = await axios
      .get(`/user/${booking.user._id}`)
      .catch((err) => console.log(err));
    const user = res.data;
    if (user && user.email) {
      const userEmail = user.email;
      const filtered = bookings.filter(
        (booking) => booking.userEmail === userEmail
      );
      return filtered;
    } else {
      console.log("Ο χρήστης δεν βρέθηκε ή δεν υπάρχει email");
      return [];
    }
  } catch (error) {
    console.error("Σφάλμα κατά την επεξεργασία του φίλτρου:", error);
    return [];
  }
};

export const updateUsers = async (id, NumIn) => {
  const res = await axios
    .put(`/booking/updateNum/${id}`, { NumIn: NumIn })
    .catch((err) => console.log(err));
  const data = res.data;
  return data;
};

export const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      // Make a request to your backend for Google authentication
      const response = await axios.get("/auth/google");

      // Redirect to the authentication URL received from the server
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Google authentication error:", error);
    }
  };
};

export const findGoogleUser = async (email) => {
  try {
    const res = await axios
      .get(`/user/email/${email}`)
      .catch((err) => console.log(err));

    const data = res.data;
    console.log("gia na do:", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const pass = async (email) => {
  try {
    const res = await axios
      .get(`/user/Pas/${email}`)
      .catch((err) => console.log(err));

    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};
