/* The fetchTagsHandler is the handler method responsible for accepting a GET request from a public 
    user, and returns back all the club available tags */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../db/main.js");

// HELPERS
const errorHandler = require("../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const fetchTagsHandler = async (_, res) => {
  try {
    // Query database to fetch all tags from the tags table
    // Ordering by name makes it much easier for users to navigate the list
    const query = "SELECT tag_name FROM tags ORDER BY tag_name ASC;";
    const dbData = await dbQuery(query);

    // Convert rows from [{tag_name: 'Tech'}, {tag_name: 'Art'}] to am array: ['Art', 'Tech']
    const tagsArray = dbData.rows.map((row) => row.tag_name);

    // Send the array back
    // If queries succeed
    // Return 200 (OK) status code
    res.status(200).json({ message: "Tags Retrieved!", tags: tagsArray });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = fetchTagsHandler;
