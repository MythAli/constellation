const testRoutes = require("express").Router();

const cleanUpTestAccountsHandler = require("./cleanupTestAccounts.js");

testRoutes.delete("/cleanup-test-accounts", cleanUpTestAccountsHandler);

module.exports = testRoutes;
