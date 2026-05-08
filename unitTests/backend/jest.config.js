const path = require("path");

module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^.*db/main(\\.js)?$": path.resolve(__dirname, "__mocks__/db.js"),
  },
};
