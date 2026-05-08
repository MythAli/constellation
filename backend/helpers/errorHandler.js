/* A method dedicated to sit in the error catch block of all routes. It captures and formats any error,
    then send a response back and log it to the console. */

module.exports = errorHandler = (res, error) => {
  // Red color escape sequence
  const red = "\x1b[31m";
  const yellow = "\x1b[33m";
  const reset = "\x1b[0m";

  // If query fails
  if (error.statusCode === 500) {
    console.error(red + "Internal Server Error" + reset);

    // Return 500 (Internal Server Error) status code
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
  // If validation error, return messages array alongside the error
  else if (error.statusCode === 400) {
    console.error(yellow + error.message + reset);
    return res.status(400).json({
      error: "Bad Request: Invalid or missing request data.",
      messages: error.messages || [error.message],
    });
  }
  // Return custom errors
  else {
    console.error(yellow + error.message + reset);
    return res
      .status(error.statusCode || 400)
      .json({ error: error.message || "Something went wrong!" });
  }
};
