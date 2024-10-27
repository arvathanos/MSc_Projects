// Import the sendEmail function
const sendEmail = require("./sendEmail");
const Bookings = require("../models/Bookings");
const User = require("../models/User");

// Function to update associated bookings and notify users
const updateBookingsAndNotifyUsers = async (updatedMovie, text) => {
  try {
    const bookings = await Bookings.find({ movie: updatedMovie._id });

    // Update each booking as needed
    for (const booking of bookings) {
      // You may need to adjust this logic based on your actual requirements
      // Update the booking details (e.g., showtime, movie details, etc.)
      booking.movieDetails = {
        title: updatedMovie.title,
        releaseDate: updatedMovie.releaseDate,
        schedule: updatedMovie.schedule,
      };
      booking.changes = true;

      // Save the updated booking
      await booking.save();

      // Notify the user via email about the changes
      await handleMovieChanges(updatedMovie, text);
    }
  } catch (error) {
    console.error("Error updating bookings:", error);
  }
};

// Function to handle movie changes and send emails to affected users
const handleMovieChanges = async (updatedMovie, text) => {
  let affectedUsers = await getAffectedUsers(updatedMovie);

  // Send emails to affected users
  for (let user of affectedUsers) {
    //let text = `Dear user, there has been changes in your booking with ID: ${updatedMovie._id}. Movie: ${updatedMovie.title} Please login to your account to see more details.`;
    await sendEmail(user.email, "Movie Changes", text);
  }
};

// Function to get affected users based on movie changes
const getAffectedUsers = async (updatedMovie) => {
  const affectedUserIds = await getAffectedUserIds(updatedMovie);
  const affectedUsers = await User.find({ _id: { $in: affectedUserIds } });
  return affectedUsers;
};

// Function to get affected user IDs based on movie changes
const getAffectedUserIds = async (updatedMovie) => {
  // Logic to determine affected user IDs based on movie changes
  try {
    const affectedUserIds = [];

    // Iterate through each updated movie
    //for (const updatedMovie of updatedMovies) {
    // Find bookings associated with the updated movie
    const bookings = await Bookings.find({ movie: updatedMovie._id });

    // Extract user IDs from the affected bookings
    const users = bookings.map((booking) => booking.user.toString());

    // Add unique user IDs to the affectedUserIds array
    users.forEach((userId) => {
      if (!affectedUserIds.includes(userId)) {
        affectedUserIds.push(userId);
      }
    });
    //}

    return affectedUserIds;
  } catch (error) {
    console.error("Error getting affected user IDs:", error);
    throw error;
  }
};

const deleteBookingsByMovieId = async (movieId) => {
  try {
    // Assuming Bookings is the model for bookings
    const result = await Bookings.deleteMany({ movieId });
    console.log(
      `Deleted ${result.deletedCount} bookings associated with movieId: ${movieId}`
    );
  } catch (error) {
    console.error(`Error deleting bookings: ${error}`);
    throw error;
  }
};

module.exports = { deleteBookingsByMovieId, updateBookingsAndNotifyUsers };
