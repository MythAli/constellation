/* A file containing the methods needed for database access and queries */

// GENERAL IMPORTS
const { Pool } = require("pg"); // Pool Class for accessing the database
require("dotenv").config(); // For allowing access to environment variables

// CREATE DATABASE POOL INSTANCE USING THE DB_CONFIG DATA STORED IN THE ENVIRONMENT FILE ".env"
const pool = new Pool({
  ...JSON.parse(process.env.DB_CONFIG),
});

// module.exports = {
//   pool,
// };

// THE MAIN METHOD USED FOR SIMPLE DATBASE QUERIES
module.exports.dbQuery = async (cmd, values) => {
  const res = await pool.query(cmd, values);
  return res;
};

// A SECONDARY METHOD FOR EXECUTING LONGER DATABASE TRANSACTIONS AND CONDUCTING MULTIPLE CHANGES CONSECUTIVELY
module.exports.executeTransaction = async (callback) => {
  const client = await pool.connect(); // Open DB connection
  try {
    await client.query("BEGIN");
    // "callback" function to pass the active client
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release(); // Close DB connection
  }
};
