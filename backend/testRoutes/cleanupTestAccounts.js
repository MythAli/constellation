const { executeTransaction } = require("../db/main");
require("dotenv").config();

const cleanUpTestAccountsHandler = async (_, res) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ error: "Only allowed in development" });
  }

  try {
    // Delete the club and student accounts created during Cypress tests
    await executeTransaction(async (client) => {
      await client.query("DELETE FROM student_users WHERE email LIKE 'test_%'");
      await client.query("DELETE FROM club_users WHERE email LIKE 'test_%'");
      await client.query("DELETE FROM clubs WHERE contact_email LIKE 'test_%'");
    });
    res.status(200).json({ message: "Test accounts purged." });
  } catch (err) {
    res.status(500).json({ error: "Cleanup failed" });
  }
};

module.exports = cleanUpTestAccountsHandler;
