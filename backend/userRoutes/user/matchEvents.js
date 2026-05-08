/* The matchEventsHandler is the handler method responsible for accepting a POST request with a schedule
    and matching events from a student's favorite clubs to that schedule */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../../db/main"); // Adjust path to your DB utility

// HELPERS
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const matchEventsHandler = async (req, res) => {
  const { id: studentId } = req.user; // Extract userId provided by middleware
  const { start = "", end = "" } = req.body; // Extract data from request body

  try {
    // Validate request data
    const errors = validateRequestDates({ start_date: start, end_date: end });

    if (errors.length) {
      const validationError = new Error(
        "Bad Request: Invalid or missing request data.",
      );
      validationError.statusCode = 400; // Return 400 (Bad request) status code
      validationError.messages = errors;
      throw validationError;
    }

    // SQL query for finding events for the Student's favorite clubs that fall into the Student's schedule
    const query = `
      SELECT 
        e.id, 
        e.title, 
        e.description, 
        e.start_time, 
        e.end_time
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      JOIN student_favorite_clubs sfc ON sfc.club_id = c.id
      WHERE sfc.student_id = $1
        AND e.start_time >= $2
        AND e.start_time <= $3
      ORDER BY e.start_time ASC;
    `;

    // Execute the SQL query
    const values = [studentId, start, end];
    const result = await dbQuery(query, values);

    // If query succeeds
    // Return 200 (OK) status code, and the events
    return res.status(200).json({
      message: "Success!",
      events: result.rows,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// THE REQUEST DATA VALIDATION FUNCTION
const validateRequestDates = (data) => {
  const { start_date = "", end_date = "" } = data;
  const errors = [];

  // Time Presence Validation
  if (!start_date) errors.push("Provide a start date/time.");
  if (!end_date) errors.push("Provide an end date/time.");

  // Only validate further if both dates are present
  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);

    // Data is of "Date" type validation
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
      errors.push("One or both of the dates provided are invalid.");
    // Chronological Validation for the date/time inputs
    else if (end <= start)
      errors.push("End time must be after the start time.");
  }

  return errors;
};

module.exports = matchEventsHandler;
module.exports.validateRequestDates = validateRequestDates;
