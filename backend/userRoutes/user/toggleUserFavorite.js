/* The toggleUserFavoriteHandler is the handler method responsible for accepting a POST request from a 
    STUDENT user to toggles a club in or out of a student's favorite clubs list in the Database */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../../db/main.js");

// HELPERS
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const toggleUserFavoriteHandler = async (req, res) => {
  const { id: studentId } = req.user; // Extract userId provided by middleware
  const { id: clubId } = req.params || null; // Extract clubId injected into URL parameter

  try {
    // ClubId Validation
    let error = null;
    if (!clubId) {
      error = "Missing Club ID.";
    }

    if (isNaN(clubId)) {
      // Validate if it is a number
      error = "Club ID should be a number.";
    }

    if (error) {
      const validationError = new Error(`Bad Request: ${error}`);
      validationError.statusCode = 400; // Return 400 (Bad request) status code
      throw validationError;
    }

    // Verify club existence in the database
    const clubCheck = await dbQuery("SELECT id FROM clubs WHERE id = $1", [
      clubId,
    ]);

    if (clubCheck.rows.length === 0) {
      const notFoundError = new Error(
        "Not Found: The club with the given ID does not exist.",
      );
      notFoundError.statusCode = 404; // Return 404 (Not found) status code
      throw notFoundError;
    }

    // Query database to check if club is already marked as a favorite
    const exists = await dbQuery(
      "SELECT * FROM student_favorite_clubs WHERE student_id = $1 AND club_id = $2",
      [studentId, clubId],
    );

    // If it exists, REMOVE it (un-favorite)
    if (exists.rows.length > 0) {
      await dbQuery(
        "DELETE FROM student_favorite_clubs WHERE student_id = $1 AND club_id = $2",
        [studentId, clubId],
      );

      // If queries succeed
      // Return 200 (OK) status code
      return res
        .status(200)
        .json({ status: "removed", message: "No longer favorite." });
    }
    // If it doesn't exist, ADD it (favorite)
    else {
      await dbQuery(
        "INSERT INTO student_favorite_clubs (student_id, club_id) VALUES ($1, $2)",
        [studentId, clubId],
      );

      // If query succeeds
      // Return 201 (Created) status code
      return res
        .status(201)
        .json({ status: "added", message: "Added to favorites!" });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = toggleUserFavoriteHandler;
