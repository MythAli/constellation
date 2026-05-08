/* The registerHandler is the handler method responsible for accepting a POST request from either a student
    or club, register their account in the database, generate tokens, and send them back to the sender */

// GENERAL IMPORTS
const sha256 = require("js-sha256").sha256;

// DATABASE ACCESS HELPERS
const { dbQuery, executeTransaction } = require("../../db/main.js");

// HELPERS
const { generateLogInData } = require("./helpers/generateLogInData.js");
const { UserType } = require("../../helpers/constants.js");
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const registerHandler = async (req, res) => {
  // Extract common data from request body
  const reqData = req.body;
  const {
    type: T = null,
    signup_email = "",
    signup_password: password = "",
  } = reqData;

  const type = isNaN(T) ? null : +T;

  try {
    // If type (Student or Club) is not provided, reject request
    if (!type || (+type !== 1 && +type !== 2)) {
      const validationError = new Error(
        "Bad Request: An account type must be provided: 1 for STUDENT, 2 for CLUB.",
      );
      validationError.statusCode = 403; // Return 403 (Bad request) status code
      throw validationError;
    }

    // Check type of register (Student or Club)
    const userType = type === 1 ? UserType.STUDENT : UserType.CLUB;

    // Decide target table depending on registration type
    const tableName =
      userType === UserType.STUDENT ? "student_users" : "club_users";

    // Lowercase email
    const email = signup_email && signup_email.toLowerCase();

    // Hashing password
    const hashedPassword = typeof password === "string" ? sha256(password) : "";

    // Query the database to see if the email is already registered
    const checkData = await dbQuery(
      `SELECT id, email FROM ${tableName} WHERE email = $1`,
      [email],
    );

    // If email is found, reject request
    if (checkData.rows?.length) {
      const conflictError = new Error(
        "Conflict: This email is already registered. Please try logging in.",
      );
      conflictError.statusCode = 409; // Return 409 (Conflict) status code
      throw conflictError;
    }

    // Open Transcation pool with the database
    const logInData = await executeTransaction(async (client) => {
      let userId;

      //**************************************/
      //** --- STUDENT PATH --- **//
      //**************************************/
      // Create the Student User
      if (userType === UserType.STUDENT) {
        // Validating request data
        const errors = validateStudentData(reqData);

        if (errors.length) {
          const validationError = new Error(
            "Bad Request: Invalid or missing request data.",
          );
          validationError.statusCode = 400; // Return 400 (Bad request) status code
          validationError.messages = errors;
          throw validationError;
        }

        // Extract student data from request body
        let { firstName = "", lastName = "" } = reqData;

        // Convert names to lowercase with only first letter uppercase
        firstName = firstName.toLowerCase();
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        lastName = lastName.toLowerCase();
        lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

        const query = `
        INSERT INTO student_users (
            email, first_name, last_name, password,
            calendar_start, calendar_end
        ) VALUES ($1, $2, $3, $4, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days') RETURNING id;
      `;

        // Extract response
        const studentRes = await client.query(query, [
          email,
          firstName,
          lastName,
          hashedPassword,
        ]);

        // Validate if DB query succeeded
        userId = studentRes.rows[0].id || "";

        if (!userId) {
          const serverError = new Error(
            "Internal Server Error: Database error.",
          );
          serverError.statusCode = 500; // Return 500 (Internal Server Error) status code
          throw serverError;
        }
      }

      //**************************************/
      //** --- CLUB PATH --- **//
      //**************************************/
      // Create the Club User
      else if (userType === UserType.CLUB) {
        // Collect Cloudinary created link for the uploaded image that is provided by the middleware function "upload"
        const logo_url = (req.file && req.file.path) || "";

        // Clean about field
        let about = reqData.about || "";
        about = about.trim();

        // Create officers array
        let officers = Array.isArray(reqData.officers) ? reqData.officers : [];
        if (typeof reqData.officers === "string") {
          officers = reqData.officers.split(",").map((s) => s.trim());
        }

        // Create tags array
        let tags = Array.isArray(reqData.tags) ? reqData.tags : [];
        if (reqData.tags && !Array.isArray(reqData.tags)) {
          tags = [reqData.tags];
        }

        // Extract rest of club data from request body
        let {
          name = "",
          contact_email = "",
          instagram_url = "",
          website_url = "",
          twitter_url = "",
        } = reqData;

        // Validating request data
        const errors = validateClubData({
          file: req.file,
          email,
          password,
          name,
          about,
          contact_email,
          instagram_url,
          website_url,
          twitter_url,
          officers,
          tags,
        });

        if (errors.length) {
          const validationError = new Error(
            "Bad Request: Invalid or missing request data.",
          );
          validationError.statusCode = 400; // Return 400 (Bad request) status code
          validationError.messages = errors;
          throw validationError;
        }

        // Adding period to about if it does not have one
        if (!about.endsWith(".")) {
          about = `${about}.`;
        }

        // Query database to create new club user
        const userRes = await client.query(
          `
          INSERT INTO club_users (club_name, email, password)
          VALUES ($1, $2, $3) RETURNING id;
        `,
          [name, email, hashedPassword],
        );

        // Store new user ID
        userId = userRes.rows[0].id || "";

        // Validate if DB query succeeded
        if (!userId) {
          const serverError = new Error(
            "Internal Server Error: Database error.",
          );
          serverError.statusCode = 500; // Return 500 (Internal Server Error) status code
          throw serverError;
        }

        // Query database to create new club
        const clubRes = await client.query(
          `
          INSERT INTO clubs (
            name, about, logo_url, contact_email,
            officers, instagram_url, website_url, twitter_url, owner_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id;
        `,
          [
            name,
            about,
            logo_url,
            contact_email,
            JSON.stringify(officers || []),
            instagram_url,
            website_url,
            twitter_url,
            userId,
          ],
        );

        // Store new club ID
        const newClubId = clubRes.rows[0].id || "";

        // Validate if DB query succeeded
        if (!newClubId) {
          const serverError = new Error(
            "Internal Server Error: Database error.",
          );
          serverError.statusCode = 500; // Return 500 (Internal Server Error) status code
          throw serverError;
        }

        // Handle attaching tags to club in their relational table "club_tags"
        const invalidTags = [];
        for (const rawTagName of tags) {
          const tagName = rawTagName.trim();

          // Check if the tag exists in the 'tags' table
          const tagCheck = await client.query(
            `SELECT id FROM tags WHERE tag_name = $1`,
            [tagName],
          );

          // Fill array for invalid tags
          if (tagCheck.rows.length === 0) {
            invalidTags.push(cleanTag);
          }
        }

        // If there is at least one invalid tag
        if (invalidTags.length) {
          const tagError = new Error(
            `Bad Request: Invalid or missing request data.`,
          );
          tagError.statusCode = 400;
          const singular = invalidTags.length == 1;
          tagError.messages = [
            "Validation Error: The " +
              (singular == 1 ? "tag '" : "tags [") +
              invalidTags.join(", ") +
              (singular == 1 ? "' is" : "] are") +
              " not " +
              (singular == 1 ? "a " : "") +
              "valid" +
              (singular == 1 ? " tag." : " tags."),
          ];
          throw tagError;
        }

        // If we reach here, all tags are valid. Proceed to map them.
        for (const rawTagName of tags) {
          const tagName = rawTagName.trim();
          // Map the tag using the standardized name
          await client.query(
            `
          INSERT INTO club_tags (club_id, tag_id)
          SELECT $1, id FROM tags WHERE tag_name = $2
          ON CONFLICT DO NOTHING;
        `,
            [newClubId, tagName],
          );
        }
      }

      // Generate the response tokens and return them to store in "logInData"
      return generateLogInData(userId, email, userType);
    });

    // If all succeeds
    // Return 201 (Created) status code
    res.status(201).json({ message: "Registration Successful!", ...logInData });
  } catch (error) {
    errorHandler(res, error);
  }
};

// STUDENT VALIDATION FUNCTION
const validateStudentData = (data) => {
  const {
    firstName = "",
    lastName = "",
    signup_email = "",
    signup_password = "",
  } = data;
  const errors = [];

  // First and last name validation
  if (!firstName || firstName.length < 2)
    errors.push("First name is too short.");
  if (!lastName || lastName.length < 2) errors.push("Last name is too short.");

  // Email Format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!signup_email || !emailRegex.test(signup_email))
    errors.push("Please enter a valid email address.");

  // Password validation
  if (!signup_password || signup_password.length < 8)
    errors.push("Password must be at least 8 characters.");

  return errors;
};

// CLUB VALIDATION FUNCTION
const validateClubData = (data) => {
  const {
    file = null,
    email = "",
    password = "",
    name = "",
    about = "",
    contact_email = "",
    instagram_url = "",
    website_url = "",
    twitter_url = "",
    officers = [],
    tags = [],
  } = data;
  const errors = [];

  if (!file)
    errors.push("No image file was uploaded or the file format is invalid.");

  // Emails validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email))
    errors.push("Please enter a valid email address.");
  if (!contact_email || !emailRegex.test(contact_email))
    errors.push("Please enter a valid contact email address.");

  // Password validation
  if (!password || password.length < 8)
    errors.push("Password must be at least 8 characters.");

  // Club name validation
  if (!name || name.trim().length < 2)
    errors.push("Club name is required and must be at least 2 characters.");

  // About section validation (Character limit boundary, 10 to 500)
  const aboutTrimmed = about.trim();
  if (aboutTrimmed.length < 10 || aboutTrimmed.length > 500)
    errors.push('The "About" must be between 10 and 500 characters.');

  // Social media URLs validation (if they aren't empty because they are not required)
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const socials = [
    ["twitter_url", twitter_url],
    ["website_url", website_url],
    ["instagram_url", instagram_url],
  ];
  socials.forEach(([name, val]) => {
    if (val && !urlRegex.test(val))
      errors.push(`Please enter a valid ${name.split("_").join(" ")}.`);
  });

  // Officers Validation
  const parsedOfficers = officers
    .map((s) => s.trim())
    .filter((s) => s.trim() !== "");
  if (parsedOfficers.length === 0) {
    errors.push("Please list at least one officer.");
  } else {
    for (const name of parsedOfficers) {
      const parts = name.split(/\s+/);
      if (parts.length < 2) {
        errors.push("Please input first and last name for every officer.");
        break;
      }
      if (parts.length > 2) {
        errors.push("Please only input first and last name for any officer.");
        break;
      }
      if (parts.some((part) => part.length < 2)) {
        errors.push("First and last name must be at least 2 characters long.");
        break;
      }
    }
  }

  // Tags Validation
  if (!tags || tags.length === 0)
    errors.push("Please select at least one tag for your club.");

  return errors;
};

module.exports = registerHandler;
module.exports.validateClubData = validateClubData;
module.exports.validateStudentData = validateStudentData;
