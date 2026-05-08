/* The editClubHandler is the handler method responsible for accepting a PUT request from a CLUB user
    containing new club data, and using that data to update the club user's club data in the database. */

// DATABASE ACCESS HELPERS
const { executeTransaction } = require("../../db/main.js");

// HELPERS
const errorHandler = require("../../helpers/errorHandler.js"); // For handling return errors

// MAIN HANDLER
const editClubHandler = async (req, res) => {
  const userId = req.user.id; // Extract userId provided by middleware

  const {
    name = "",
    about = "",
    contact_email = "",
    instagram_url = "",
    website_url = "",
    twitter_url = "",
    officers = "",
    tags = [],
  } = req.body; // Extract data from request body

  try {
    let finalLogoUrl;

    // Open Transcation pool with the database
    await executeTransaction(async (client) => {
      // Fetch current data to verify ownership and get existing logo
      const checkRes = await client.query(
        `SELECT id, logo_url FROM clubs WHERE owner_id = $1`,
        [userId],
      );

      // Verify request by checking if this user owns a club
      if (checkRes.rows.length === 0) {
        const accessError = new Error(
          "Forbidden Access: You do not own a club.",
        );
        accessError.statusCode = 403; // Return 403 (Forbidden) status code
        throw accessError;
      }

      const clubId = checkRes.rows[0].id; // Extract clubId

      // Parse officers, it might arrive as a string
      const parsedOfficers = ensureArray(officers);

      // Validating request data
      const errors = validateClubData({
        name,
        about,
        contact_email,
        instagram_url,
        website_url,
        twitter_url,
        parsedOfficers,
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

      // If a new file was uploaded via multer, use req.file.path (The Cloudinary URL).
      // Otherwise, keep the one currently stored in the database.
      finalLogoUrl = req.file ? req.file.path : checkRes.rows[0].logo_url;

      // Update club data Query
      const updateClubQuery = `
        UPDATE clubs 
        SET name = $1, about = $2, logo_url = $3, contact_email = $4, 
            instagram_url = $5, website_url = $6, twitter_url = $7, officers = $8
        WHERE id = $9
      `;

      // Grouping request data
      const clubValues = [
        name,
        about,
        finalLogoUrl,
        contact_email,
        instagram_url,
        website_url,
        twitter_url,
        JSON.stringify(parsedOfficers || []),
        clubId,
      ];

      // Querying database
      await client.query(updateClubQuery, clubValues);

      // For updating the "club_users" table's "club_name" field
      const updateUserQuery = `
        UPDATE club_users 
        SET club_name = $1 
        WHERE id = $2
      `;
      await client.query(updateUserQuery, [name, userId]);

      // Update Tags (Since it is a separate relational table)
      if (tags && tags.length !== 0) {
        const tagsArray = ensureArray(tags);

        // Check if all provided tags exist in the 'tags' table
        const invalidTags = [];
        for (const tagName of tagsArray) {
          const cleanTag = tagName.trim();
          const tagExists = await client.query(
            "SELECT id FROM tags WHERE tag_name = $1",
            [cleanTag],
          );

          // If the tag does not exist
          if (tagExists.rows.length === 0) {
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

        // If all tags are valid, clear existing mappings and re-map
        await client.query(`DELETE FROM club_tags WHERE club_id = $1`, [
          clubId,
        ]);

        for (const tagName of tagsArray) {
          const mappingQuery = `
        INSERT INTO club_tags (club_id, tag_id)
        SELECT $1, id FROM tags WHERE tag_name = $2
        ON CONFLICT DO NOTHING;
      `;
          await client.query(mappingQuery, [clubId, tagName.trim()]);
        }
      }
    });

    // If all succeeds
    // Return 200 (OK) status code, and the new logo_url
    return res
      .status(200)
      .json({ message: "Club Updated!", logo_url: finalLogoUrl });
  } catch (error) {
    errorHandler(res, error);
  }
};

// A METHOD FOR PARSING THE OFFICERS AND TAGS ARRAYS
const ensureArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  try {
    return JSON.parse(input); // Handle if it was sent as a JSON string
  } catch {
    return [input]; // Handle if it was sent as a single plain string
  }
};

// THE REQUEST DATA VALIDATION FUNCTION
const validateClubData = (data) => {
  const {
    name = "",
    about = "",
    contact_email = "",
    instagram_url = "",
    website_url = "",
    twitter_url = "",
    parsedOfficers = [],
    tags = [],
  } = data;
  const errors = [];

  // Club name validation
  if (!name || name.trim().length < 2)
    errors.push("Club name is required and must be at least 2 characters.");

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!contact_email || !emailRegex.test(contact_email))
    errors.push("Please enter a valid email address.");

  // Social media URLs validation (if they aren't empty because they are not required)
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const socials = [
    ["instagram_url", instagram_url],
    ["website_url", website_url],
    ["twitter_url", twitter_url],
  ];
  socials.forEach(([name, val]) => {
    if (val && !urlRegex.test(val))
      errors.push(`Please enter a valid ${name.split("_").join(" ")}.`);
  });

  // Officers Validation
  const officers = parsedOfficers
    .map((s) => s.trim())
    .filter((s) => s.trim() !== "");
  if (officers.length === 0) {
    errors.push("Please list at least one officer.");
  } else {
    const invalidOfficers = officers.filter((name) => {
      const parts = name.split(/\s+/);
      return parts.length < 2 || parts.some((part) => part.length < 2);
    });
    if (invalidOfficers.length > 0)
      errors.push(
        "Each officer must have a first and last name (min. 2 characters each).",
      );
  }

  // Tags Validation
  if (!tags || tags.length === 0 || tags[0].length === 0)
    errors.push("Please select at least one tag for your club.");

  // About section validation (Character limit boundary, 10 to 500)
  const aboutTrimmed = about.trim();
  if (aboutTrimmed.length < 10 || aboutTrimmed.length > 500)
    errors.push("The 'About' section must be between 10 and 500 characters.");

  return errors;
};

module.exports = editClubHandler;
module.exports.validateClubData = validateClubData;
