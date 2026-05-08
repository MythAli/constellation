/* The main backend express server file, responsible for:
    - Setting up the express server.
    - Attaching all available routes.
    - Launching the server to accept requests at a given port number.
*/

// IMPORTS
const express = require("express"); // The main library used for API routing and server management
const cors = require("cors"); // Library used for allowing browser communication with express server
const userRouter = require("./userRoutes"); // Importing the user private routes
const clubsRouter = require("./clubsRoutes"); // Importing the public routes (For public club data)
const testRouter = require("./testRoutes"); // Created only for tesing purposes (Does not ship to final product)
require("dotenv").config(); // For allowing access to environment variables

// Staring our express app
const app = express();
const port = process.env.PORT; // Extracting port number from ".env" file

// Injecting cors
app.use(
  cors({
    origin: "http://localhost:3000", // Giving access to the browser at this URL
    allowedHeaders: ["Content-Type", "Authorization"], // The only headers allowed
  }),
);

app.use(express.json()); // To be able to read the JSON data being sent by requests

app.use("/api", userRouter); // Use "/api" route for user private routes
app.use("/clubs", clubsRouter); // Use "/clubs" route for public club data routes
app.use("/test", testRouter); // Use "/test" route for testing routes

// Optional response to verify server communication
app.get("/", (req, res) => {
  res.json("Hello There, it worked again & again!");
});

// Run the application on this specific port
app.listen(port, () => {
  console.log(`Server running at port http://localhost:${port}`); // Log to the console the full server URL
});
