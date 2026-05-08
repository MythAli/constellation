/* The changeScheduleHandler is the handler method responsible for accepting a PUT request from a STUDENT 
    user containing schedule data, and using that data to update the student's schedule in the database. */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../../db/main.js");

// HELPERS
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const changeScheduleHandler = async (req, res) => {
  const { id: userId = null } = req.user; // Extract userId provided by middleware
  const { calendar_start = "", calendar_end = "" } = req.body; // Extract data from request body

  try {
    // Validate request data
    const errors = validateScheduleData(req.body);

    if (errors.length) {
      const validationError = new Error(
        "Bad Request: Invalid or missing request data.",
      );
      validationError.statusCode = 400; // Return 400 (Bad request) status code
      validationError.messages = errors;
      throw validationError;
    }

    // SQL query for updating the new schedule
    const query = `
        UPDATE student_users 
        SET calendar_start = $1, calendar_end = $2 
        WHERE id = $3
    `;

    // Execute the SQL query
    await dbQuery(query, [calendar_start, calendar_end, userId]);

    // If query succeeds
    // Return 200 (OK) status code
    return res.status(200).json({
      message: "Schedule updated!",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// THE REQUEST DATA VALIDATION FUNCTION
const validateScheduleData = (data) => {
  const { calendar_start = "", calendar_end = "" } = data;
  const errors = [];

  // Time Presence Validation
  if (!calendar_start) errors.push("Provide a start date/time.");
  if (!calendar_end) errors.push("Provide an end date/time.");

  // Only validate further if both dates are present
  if (calendar_start && calendar_end) {
    const start = new Date(calendar_start);
    const end = new Date(calendar_end);

    // Data is of "Date" type validation
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
      errors.push("One or both of the dates provided are invalid.");
    // Chronological Validation for the date/time inputs
    else if (end <= start)
      errors.push("End time must be after the start time.");
  }

  return errors;
};

module.exports = changeScheduleHandler;
module.exports.validateScheduleData = validateScheduleData;
