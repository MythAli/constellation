/* The refreshHandler is the handler method responsible for accepting a POST request from either a
    student or club, and refreshing their access token using a provided refresh token */

// GENERAL IMPORTS
const jwt = require("jsonwebtoken"); // To generate, and decode/verify tokens
require("dotenv").config(); // For allowing access to environment variables

// HELPERS
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANNDLER
const refreshHandler = (req, res) => {
  const refreshToken = req.body.token || ""; // Extracting request data

  try {
    // If the token is missing
    if (!refreshToken) {
      const badRequestError = new Error(
        "Bad Request: Refresh token is missing.",
      );
      badRequestError.statusCode = 400; // Return 400 (Bad Request) status code
      throw badRequestError;
    }

    // Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET, // From ".env" file
      (error, decoded) => {
        // If the verification failed
        if (error) {
          const accessError = new Error(
            "Forbidden Access: Invalid or expired refresh token.",
          );
          accessError.statusCode = 403; // Return 403 (Forbidden) status code
          throw accessError;
        }

        // Extract data from the decoded refresh token
        const { id, email, userType } = decoded;

        // Generate a new access token using the data from the decoded refresh token
        const accessToken = jwt.sign(
          { id, email, userType },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60m" }, // Set expiration to 60 minutes
        );

        // If all succeeds
        // Return 200 (OK) status code, new access token, and user type
        res.status(200).json({
          message: "New Access Token generated!",
          accessToken,
          userType,
        });
      },
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = refreshHandler;
