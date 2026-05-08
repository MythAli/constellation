/* The fetchClubsHandler is the handler method responsible for accepting a GET request from a public user,
    and returns back partial data from all clubs, this data is used for club list display */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../db/main.js");

// HELPERS
const errorHandler = require("../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const fetchClubsHandler = async (req, res) => {
  try {
    // The query for fetching id, name, about, and logo_url fields for all clubs
    const query = `
            SELECT 
                c.id, 
                c.name, 
                c.about, 
                c.logo_url,
                json_agg(t.tag_name) AS tags
            FROM clubs c
            LEFT JOIN club_tags ct ON c.id = ct.club_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            GROUP BY c.id, c.name, c.about, c.logo_url
            ORDER BY c.id ASC;
        `;

    // Query database for the clubs
    const result = await dbQuery(query);

    // If queries succeed
    // Return 200 (OK) status code
    res.status(200).json({ message: "Clubs Retrieved!", clubs: result.rows });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = fetchClubsHandler;
