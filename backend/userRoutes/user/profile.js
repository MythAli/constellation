/* The profileHandler is the handler method responsible for accepting a GET request from a student
    and sending back their profile data */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../../db/main.js");

// HELPERS
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

const profileHandler = async (req, res) => {
  const { id: studentId } = req.user; // Extract userId provided by middleware
  const clubsFull = req.query.clubsFull; // Extract value of the param "clubsFull" from the URL
  const eventsFull = req.query.eventsFull; // Extract value of the param "eventsFull" from the URL

  try {
    // Query the database to find the student
    const studentQuery = `SELECT * FROM student_users WHERE id = $1`;
    const studentData = await dbQuery(studentQuery, [studentId]);

    // If no student was found
    if (studentData.rows.length === 0) {
      const notFoundError = new Error("Not Found: Student not found.");
      notFoundError.statusCode = 404; // Return 404 (Not found) status code
      throw notFoundError;
    }

    const user = studentData.rows[0]; // Grab user data

    // Fetch Favorite Club IDs (The "clubsFull" decides whether all clubs are requested or the default which is 2)
    const favoritesIDsRes = await dbQuery(
      `SELECT club_id FROM student_favorite_clubs WHERE student_id = $1 ${clubsFull ? "" : "LIMIT 2"}`,
      [studentId],
    );
    const favoritesIDs = favoritesIDsRes.rows.map((row) => row.club_id); // Extract IDs

    // Fetch the clubs that belong to these club IDs
    const favoritesClubsQuery = "SELECT * FROM clubs WHERE id = ANY($1)";
    const favoriteClubsRes = await dbQuery(favoritesClubsQuery, [favoritesIDs]);

    // Fetch Attending Event IDs (The "eventsFull" decides whether all events are requested or the default which is 2)
    const eventsIDsRes = await dbQuery(
      `SELECT event_id FROM student_event_attendance WHERE student_id = $1 ${eventsFull ? "" : "LIMIT 2"}`,
      [studentId],
    );
    const eventsIDs = eventsIDsRes.rows.map((row) => row.event_id);

    // Fetch the events that belong to these event IDs
    const eventsQuery = "SELECT * FROM events WHERE id = ANY($1)";
    const eventsRes = await dbQuery(eventsQuery, [eventsIDs]);

    // If queries succeed
    // Return 200 (OK) status code and profile data
    res.status(200).json({
      message: "Profile found!",
      first_name: user.first_name,
      last_name: user.last_name,
      calendarStart: user.calendar_start
        ? user.calendar_start.toISOString()
        : null,
      calendarEnd: user.calendar_end ? user.calendar_end.toISOString() : null,
      favorites: favoriteClubsRes.rows, // Array of Clubs
      attending: eventsRes.rows, // Array of Events});
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = profileHandler;
