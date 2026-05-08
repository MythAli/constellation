/* The fetchClubHandler is the handler method responsible for accepting a GET request from a public user,
    and returns back all the club data with its events */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../db/main.js");

// HELPERS
const errorHandler = require("../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const fetchClubHandler = async (req, res) => {
  const clubId = req.params.id || null; // Extracting clubId injected into URL parameter

  // The query for fetching all the club's data
  const clubQuery = `
        SELECT 
            c.*, 
            json_agg(t.tag_name) AS tags
        FROM clubs c
        LEFT JOIN club_tags ct ON c.id = ct.club_id
        LEFT JOIN tags t ON ct.tag_id = t.id
        WHERE c.id = $1
        GROUP BY c.id;
    `;

  // The query for fetching all the club's events
  const eventsQuery = `
      SELECT 
        id, 
        title, 
        start_time, 
        end_time, 
        description 
      FROM events 
      WHERE club_id = $1 
      ORDER BY start_time ASC;
    `;

  try {
    // Query database for club data
    const result = await dbQuery(clubQuery, [clubId]);

    // Query database for club events
    const dbData = await dbQuery(eventsQuery, [clubId]);

    if (result.rows.length === 0) {
      const notFoundError = new Error("Club not found");
      notFoundError.statusCode = 404; // Return 404 (Not found) status code
      throw notFoundError;
    }

    // Formating return data
    const club = { ...result.rows[0], events: dbData.rows };

    // Return a single club object with the added events
    // If queries succeed
    // Return 200 (OK) status code
    res.status(200).json({ message: "Club Data Retrieved!", ...club });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = fetchClubHandler;
