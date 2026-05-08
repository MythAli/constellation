/* The toggleEventAttendanceHandler is the handler method responsible for accepting a POST request from a 
    STUDENT user to toggles an event in or out of a student's attending events list in the Database */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../../db/main.js");

// HELPERS
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const toggleEventAttendanceHandler = async (req, res) => {
  const { id: studentId } = req.user; // Extract userId provided by middleware
  const { id: eventId } = req.params || null; // Extract eventId injected into URL parameter

  try {
    // EventId Validation
    let error = null;
    if (!eventId) {
      error = "Missing Event ID.";
    }

    if (isNaN(eventId)) {
      // Validate if it is a number
      error = "Event ID should be a number.";
    }

    if (error) {
      const validationError = new Error(`Bad Request: ${error}`);
      validationError.statusCode = 400; // Return 400 (Bad request) status code
      throw validationError;
    }

    // Verify event existence in the database
    const eventCheck = await dbQuery("SELECT id FROM events WHERE id = $1", [
      eventId,
    ]);

    if (eventCheck.rows.length === 0) {
      const notFoundError = new Error(
        "Not Found: The event with the given ID does not exist.",
      );
      notFoundError.statusCode = 404; // Return 404 (Not found) status code
      throw notFoundError;
    }

    // Query database to check if the student is already marked as "attending"
    const existsQuery = `
            SELECT * FROM student_event_attendance 
            WHERE student_id = $1 AND event_id = $2
        `;
    const exists = await dbQuery(existsQuery, [studentId, eventId]);

    // If they exist, REMOVE them (Un-attend)
    if (exists.rows.length > 0) {
      await dbQuery(
        "DELETE FROM student_event_attendance WHERE student_id = $1 AND event_id = $2",
        [studentId, eventId],
      );

      // If queries succeed
      // Return 200 (OK) status code
      return res
        .status(200)
        .json({ status: "removed", message: "No longer attending." });
    }
    // If they don't exist, ADD them (Attend)
    else {
      await dbQuery(
        "INSERT INTO student_event_attendance (student_id, event_id) VALUES ($1, $2)",
        [studentId, eventId],
      );

      // If query succeeds
      // Return 201 (Created) status code
      return res
        .status(201)
        .json({ status: "added", message: "Marked as attending!" });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = toggleEventAttendanceHandler;
