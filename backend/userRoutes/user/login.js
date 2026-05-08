/* The loginHandler is the handler method responsible for accepting a POST request from either a student
    or club to compare login data to the database, generate tokens, and send them back to the sender */

// GENERAL IMPORTS
const sha256 = require("js-sha256").sha256; // For hashing password

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../../db/main.js");

// HELPERS
const { generateLogInData } = require("./helpers/generateLogInData.js"); // For generating Access and Refresh tokens
const { UserType } = require("../../helpers/constants.js");
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const loginHandler = async (req, res) => {
  // Extracting request data
  let { email = "", password = "", type = null } = req.body;
  email = email?.toLowerCase();
  const userType = type === 1 ? UserType.STUDENT : UserType.CLUB; // Find user type
  const tableName =
    userType === UserType.STUDENT ? "student_users" : "club_users"; // Set table name to access
  const inpHashPassword = sha256(password); // Hashing password

  try {
    // Validate request data
    const errors = validateRequestData(req.body);

    if (errors.length) {
      const validationError = new Error(
        "Bad Request: Invalid or missing request data.",
      );
      validationError.statusCode = 400; // Return 400 (Bad request) status code
      validationError.messages = errors;
      throw validationError;
    }

    // Query the database for logging in
    const query = `SELECT id, email, password FROM ${tableName} WHERE email = $1`;
    const dbData = await dbQuery(query, [email]);

    // If the account is not found, or the password does not match
    if (!dbData.rows.length || !(dbData.rows[0].password === inpHashPassword)) {
      const badRequestError = new Error(
        "Bad Request: Your email or password are incorrect.",
      );
      badRequestError.statusCode = 400; // Return 400 (Bad Request) status code
      throw badRequestError;
    }

    // If success, grab the login data and generate the tokens:
    const logInData = generateLogInData(dbData.rows[0].id, email, userType);

    // If query succeeds
    // Return 200 (OK) status code, and account data
    res.status(200).json({ message: "Login Successful!", ...logInData });
  } catch (error) {
    errorHandler(res, error);
  }
};

// THE REQUEST DATA VALIDATION FUNCTION
const validateRequestData = (data) => {
  const { email = "", password = "" } = data;
  const errors = [];

  // Email Format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email))
    errors.push("Please enter a valid email address.");

  // Password validation
  if (!password || password.length < 8)
    errors.push("Password must be at least 8 characters long.");

  return errors;
};

module.exports = loginHandler;
module.exports.validateRequestData = validateRequestData;
