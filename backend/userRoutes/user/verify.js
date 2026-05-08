/* The verifyHandler is the handler method responsible for accepting a GET request from either a
    student or club, and returning simple account display data with a flag indicating whether the
    user is authenticated or not */

// DATABASE ACCESS HELPERS
const { dbQuery } = require("../../db/main.js");

// HELPERS
const { UserType } = require("../../helpers/constants.js");
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const verifyHandler = async (req, res) => {
  try {
    const { email, userType, id } = req.user; // Extract data provided by middleware

    // Determine which table to query and what data to get
    let query;
    let displayName;

    if (userType === UserType.STUDENT) {
      // Query for Student names
      query = `SELECT first_name, last_name FROM student_users WHERE email = $1`;
      const dbData = await dbQuery(query, [email]);

      if (dbData.rows.length === 0) {
        const notFoundError = new Error("Student not found");
        notFoundError.statusCode = 404; // Return 404 (Not found) status code
        throw notFoundError;
      }

      // Formating student display name to return back
      const user = dbData.rows[0];
      const first =
        user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1);
      const last =
        user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1);
      displayName = `${first} ${last}`;

      // If queries succeed
      // Return 200 (OK) status code, along side simple data
      res.status(200).json({
        message: "Verified!",
        id,
        authenticated: true,
        name: displayName,
        email,
        userType,
      });
    } else if (userType === UserType.CLUB) {
      // Query for Club name
      query = `SELECT club_name FROM club_users WHERE email = $1`;
      const dbData = await dbQuery(query, [email]);

      if (dbData.rows.length === 0) {
        const notFoundError = new Error("Club not found");
        notFoundError.statusCode = 404; // Return 404 (Not found) status code
        throw notFoundError;
      }

      // Format club display name
      displayName = dbData.rows[0].club_name;

      // Query database to grab club id
      query = `SELECT id FROM clubs WHERE owner_id = $1`;
      const club = await dbQuery(query, [id]);

      if (club.rows.length === 0) {
        const serverError = new Error("Internal server error");
        serverError.statusCode = 500; // Return 500 (Internal Server Error) status code
        throw serverError;
      }

      const clubId = club.rows[0].id;

      // If queries succeed
      // Return 200 (OK) status code, along side simple data
      res.status(200).json({
        message: "Verified!",
        id,
        clubId,
        authenticated: true,
        name: displayName,
        email,
        userType,
      });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = verifyHandler;
