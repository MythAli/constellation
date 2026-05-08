// IMPORTS
const jwt = require("jsonwebtoken"); // To generate, and decode/verify tokens
require("dotenv").config(); // For allowing access to environment variables

// THE MAIN METHOD USED FOR GENERATING THE ACCESS AND REFRESH TOKENS
module.exports.generateLogInData = (id, email, userType) => {
  const payload = { id, email, userType }; // Encode this information into the token for future decoding

  // Generate Access token that gives requests access to perform private tasks
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60m", // Set Access token expiration to 60m
  });

  // Generate Refresh token to allow signed in user to refresh their Access token instead of logging in every 60m
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // Sett Refresh token expiration to 7d
  });

  return { accessToken, refreshToken, userType };
};
