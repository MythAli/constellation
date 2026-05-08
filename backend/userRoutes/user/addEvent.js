/* The addEventHandler is the handler method responsible for accepting a POST request from a ClUB user
    containing event data, and adding that event to the database. */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../../db/main.js");

// HELPERS
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const addEventHandler = async (req, res) => {
  // Grab id and data from the authenticated club user and request body
  const { id: userId } = req.user; // Extract userId provided by middleware
  const {
    club_id = 0,
    event_title = "",
    start_time = "",
    end_time = "",
    description = "",
  } = req.body; // Extract data from request body

  // Verify ownership by checking if this user owns the club they are posting for
  const ownershipQuery = `SELECT id FROM clubs WHERE id = $1 AND owner_id = $2`;
  const ownershipResult = await dbQuery(ownershipQuery, [club_id, userId]);

  try {
    // If the DB query returns empty, the request sender does not own the Club
    if (ownershipResult.rows.length === 0) {
      const accessError = new Error(
        "Forbidden Access: You are not the registered owner of this club.",
      );
      accessError.statusCode = 403; // Return 403 (Forbidden) status code
      throw accessError;
    }

    // Validate request data
    const errors = validateEventData(req.body);

    if (errors.length) {
      const validationError = new Error(
        "Bad Request: Invalid or missing request data.",
      );
      validationError.statusCode = 400; // Return 400 (Bad request) status code
      validationError.messages = errors;
      throw validationError;
    }

    // SQL query for inserting the new event
    const insertQuery = `
      INSERT INTO events (club_id, title, start_time, end_time, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    // Execute the SQL query
    const result = await dbQuery(insertQuery, [
      club_id,
      event_title,
      start_time,
      end_time,
      description,
    ]);

    // If query succeeds
    // Return 201 (Created) status code, and the new event's ID
    return res.status(201).json({
      message: "Event created successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = addEventHandler;

// THE REQUEST DATA VALIDATION FUNCTION
const validateEventData = (data) => {
  const {
    event_title = "",
    start_time = "",
    end_time = "",
    description = "",
  } = data;
  const errors = [];

  // Title Validation
  if (!event_title || event_title.trim().length < 3)
    errors.push("Event title must be at least 3 characters long.");

  // Time Presence Validation
  if (!start_time) errors.push("Provide a start date/time.");
  if (!end_time) errors.push("Provide an end date/time.");

  const now = new Date();
  const start = new Date(start_time);
  const end = new Date(end_time);

  // Data is of "Date" type validation
  if (isNaN(start.getTime()) || isNaN(end.getTime()))
    errors.push("One or both of the dates provided are invalid.");

  // Chronological Validation for the date/time inputs
  if (start < now) errors.push("Start time cannot be in the past.");
  if (end <= start) errors.push("End time must be after the start time.");

  // Description Validation
  if (!description) errors.push("Description cannot be empty.");
  else {
    if (description.length < 20)
      errors.push("Description must be at least 20 characters.");
    if (description.length > 1000)
      errors.push("Description must be under 1000 characters.");
  }

  return errors;
};
