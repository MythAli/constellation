/* This file only serves attaching the "user" route to the backend URL. (This leaves room for attaching
        alternative routes like "admin" in the future) */

// IMPORTS
const router = require("express").Router(); // The express router class for setting up routes
const userRoutes = require("./user"); // Importing our private user routes (Managed by user/index.js)

router.use("/user", userRoutes); // Appending "/user" to the user routes

module.exports = router;
