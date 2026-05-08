/* This file is responsible for managing all public routes that follow the "/clubs" route, these route include:
    - Fetch Clubs (For getting partial data from all clubs, this data is used for club list display)
    - Fetch Club (For getting all data for a single club)
    - Fetch Tags (For getting the list of all the available tags)
*/

// IMPORTS
const userRoutes = require("express").Router(); // The express router class for setting up routes

// REQUEST HANDLER IMPORTS
const fetchClubsHandler = require("./fetchClubs.js");
const fetchTagsHandler = require("./fetchTags.js");
const fetchClubHandler = require("./fetchClub.js");

// MIDDLEWARE AND HELPER IMPORTS
const authenticateToken = require("../middleware/authenticateToken.js");

// ASSIGNING ROUTES TO THEIR SPECIFIED TASK HANDLER FUNCTION
userRoutes.get("/", fetchClubsHandler);

userRoutes.get("/tags", fetchTagsHandler);

userRoutes.get("/:id", fetchClubHandler);

module.exports = userRoutes;
