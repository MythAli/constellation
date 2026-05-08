/* A middleware method for verifying if a request is coming from a validated user account */

// GENERAL IMPORTS
const jwt = require("jsonwebtoken"); // To generate, and decode/verify tokens
require("dotenv").config(); // For allowing access to environment variables

// HELPERS
const errorHandler = require("../helpers/errorHandler");

// THE VALIDATION METHOD
const authenticateToken = (allowedRoles = []) => {
  // This method accepts an "allowedRoles" array, that specifies the types of users allowed to access
  //    a specific route.
  return (req, res, next) => {
    const authHeader = req.headers["authorization"]; // Grab the "authorization" header from the request
    const token = authHeader && authHeader.split(" ")[1]; // Extracting the access token

    try {
      let accessError = null;

      // If no access token in the request
      if (!token) {
        accessError = new Error("Forbidden Access: No access token provided.");
      }

      // Verfiy the token: If the token is invalid or expired, an error will be thrown automatically
      if (!accessError) {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; // Extract data decoded inside token

        // Check if the user's type is not in the allowed list
        if (allowedRoles.length && !allowedRoles.includes(decoded.userType)) {
          accessError = new Error(
            `Forbidden Access: ${decoded.userType}s cannot perform this action.`,
          );
        }
      }

      // If there is an
      if (accessError) {
        accessError.statusCode = 403; // Return 403 (Forbidden) status code
        throw accessError;
      }

      next(); // If the request passes all validation, proceed to the the route handler function
    } catch (error) {
      // If the token is expired
      if (error.name === "TokenExpiredError") {
        error = new Error("Forbidden Access: Token expired.");
        error.statusCode = 403; // Return 403 (Forbidden) status code
      }
      errorHandler(res, error);
    }
  };
};

module.exports = authenticateToken;
