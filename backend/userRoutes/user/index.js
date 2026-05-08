/* This file is responsible for managing all the private routes that follow the "/api/user/" route, 
    these route include:
    - Login (For both ctudent and club users)
    - Register (For both student and club users)
    - Refresh (Refreshes any user's access token)
    - Verify (Verifies any user's access token)
    - Profile (Retrieves a student's profile data)
    - Change Schedule (Change a student's saved schedule)
    - Toggle Favorite (Toggles a club in or out of a student's favorite clubs list)
    - Toggle Event (Toggles an event in or out of a student's attending events list)
    - Match Event (Matches events from a student's favorite clubs to their set schedule)
    - Edit Club (Edits a club user's club data)
    - Add Event (Adds an event to a club)
    - Delete Event (Deletes an event from a club)
*/

// IMPORTS
const userRoutes = require("express").Router(); // The express router class for setting up routes

// REQUEST HANDLER IMPORTS
const loginHandler = require("./login.js");
const registerHandler = require("./register.js");
const refreshHandler = require("./refresh.js");
const verifyHandler = require("./verify.js");
const profileHandler = require("./profile.js");
const changeScheduleHandler = require("./changeSchedule.js");
const editClubHandler = require("./editClub.js");
const toggleUserFavoriteHandler = require("./toggleUserFavorite.js");
const toggleEventAttendanceHandler = require("./toggleEventAttendance.js");
const addEventHandler = require("./addEvent.js");
const deleteEventHandler = require("./deleteEvent.js");
const matchEventsHandler = require("./matchEvents.js");

// MIDDLEWARE AND HELPER IMPORTS
const authenticateToken = require("../../middleware/authenticateToken.js");
const upload = require("../../middleware/cloudinaryConfig.js");
const { UserType } = require("../../helpers/constants.js");

// ASSIGNING ROUTES TO THEIR SPECIFIED TASK HANDLER FUNCTION
userRoutes.post("/login", loginHandler);

// Attaching upload middlware to provide the register hanlder function with the URL of the image uploaded to Cloudinary
userRoutes.post("/refresh", refreshHandler);

userRoutes.post("/register", upload.single("logo_url"), registerHandler);

userRoutes.get(
  "/verify",
  authenticateToken([UserType.STUDENT, UserType.CLUB]), // Private access to club and student users
  verifyHandler,
);

userRoutes.post(
  "/toggleFavorite/:id",
  authenticateToken([UserType.STUDENT]), // Private access to student users
  toggleUserFavoriteHandler,
);

userRoutes.post(
  "/toggleEvent/:id",
  authenticateToken([UserType.STUDENT]), // Private access to student users
  toggleEventAttendanceHandler,
);

userRoutes.post(
  "/events/addEvent",
  authenticateToken([UserType.CLUB]), // Private access to club users
  addEventHandler,
);

userRoutes.post(
  "/matching-events",
  authenticateToken([UserType.STUDENT]), // Private access to student users
  matchEventsHandler,
);

userRoutes.get(
  "/profile",
  authenticateToken([UserType.STUDENT]), // Private access to student users
  profileHandler,
);

userRoutes.put(
  "/club",
  authenticateToken([UserType.CLUB]), // Private access to club users
  upload.single("logo_url"),
  editClubHandler,
);

userRoutes.put(
  "/schedule",
  authenticateToken([UserType.STUDENT]), // Private access to student users
  changeScheduleHandler,
);

userRoutes.delete(
  "/events/:id",
  authenticateToken([UserType.CLUB]), // Private access to club users
  deleteEventHandler,
);

module.exports = userRoutes;
