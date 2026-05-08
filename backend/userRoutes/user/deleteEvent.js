/* The deleteEventHandler is the handler method responsible for accepting a DELETE request from a ClUB user
    with an event ID attached to the URL parameter, and then deleting the event from the database */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../../db/main.js");

// HELPERS
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

const deleteEventHandler = async (req, res) => {
  const { id: eventId } = req.params || null; // Extract eventId injected into URL parameter
  const { id: userId } = req.user; // Extract userId provided by middleware

  try {
    // Verify Ownership Query: Join the events table with the clubs table to check if the user is the
    //    owner of the club that owns this event
    const checkQuery = `
      SELECT e.id 
      FROM events e
      JOIN clubs c ON e.club_id = c.id
      WHERE e.id = $1 AND c.owner_id = $2;
    `;
    const checkResult = await dbQuery(checkQuery, [eventId, userId]);

    // If the DB query returns empty, the request sender does not own the Event
    if (checkResult.rows.length === 0) {
      const accessError = new Error(
        "Forbidden Access: You do not own the club associated with this event.",
      );
      accessError.statusCode = 403; // Return 403 (Forbidden) status code
      throw accessError;
    }

    // Execute SQL query
    await dbQuery(`DELETE FROM events WHERE id = $1`, [eventId]);

    // If query succeeds
    // Return 200 (OK) status code
    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = deleteEventHandler;
