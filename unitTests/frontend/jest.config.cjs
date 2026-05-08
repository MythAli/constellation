const path = require("path");
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.cjs"],
  transform: {
    "^.+\\.(js|jsx|mjs)$": [
      "babel-jest",
      { configFile: "./babel.config.json" },
    ],
  },
  moduleNameMapper: {
    "\\.module\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "^react$": require.resolve("react"),
    "^react/jsx-runtime$": require.resolve("react/jsx-runtime"),
    "^react-dom$": require.resolve("react-dom"),
    "^react-dom/client$": require.resolve("react-dom/client"),
    "^react-router$": path.resolve(
      __dirname,
      "node_modules/react-router/dist/production/index.js",
    ),
    "^react-router-dom$": path.resolve(
      __dirname,
      "node_modules/react-router-dom/dist/index.js",
    ),
    "^@frontend/(.*)$": path.resolve(__dirname, "../frontend/src/$1"),
  },
  moduleDirectories: ["node_modules"],
};
