const { validateRequestData } = require("../../../backend/userRoutes/user/login.js");

describe("validateRequestData (login)", () => {
  // ---- VALID INPUT ----
  test("returns no errors for valid email and password", () => {
    const errors = validateRequestData({
      email: "student@utdallas.edu",
      password: "securepassword",
    });
    expect(errors).toHaveLength(0);
  });

  // ---- EMAIL VALIDATION ----
  test("returns error for missing email", () => {
    const errors = validateRequestData({ email: "", password: "securepassword" });
    expect(errors).toContain("Please enter a valid email address.");
  });

  test("returns error for email missing @ symbol", () => {
    const errors = validateRequestData({ email: "invalidemail.com", password: "securepassword" });
    expect(errors).toContain("Please enter a valid email address.");
  });

  test("returns error for email missing domain", () => {
    const errors = validateRequestData({ email: "user@", password: "securepassword" });
    expect(errors).toContain("Please enter a valid email address.");
  });

  // ---- PASSWORD VALIDATION ----
  test("returns error for missing password", () => {
    const errors = validateRequestData({ email: "student@utdallas.edu", password: "" });
    expect(errors).toContain("Password must be at least 8 characters long.");
  });

  test("returns error for password shorter than 8 characters", () => {
    const errors = validateRequestData({ email: "student@utdallas.edu", password: "short" });
    expect(errors).toContain("Password must be at least 8 characters long.");
  });

  test("returns no error for password exactly 8 characters", () => {
    const errors = validateRequestData({ email: "student@utdallas.edu", password: "exactly8" });
    expect(errors).not.toContain("Password must be at least 8 characters long.");
  });

  // ---- MULTIPLE ERRORS ----
  test("returns multiple errors when both email and password are invalid", () => {
    const errors = validateRequestData({ email: "", password: "" });
    expect(errors).toHaveLength(2);
  });

  // ---- DEFAULT VALUES (no crash on empty body) ----
  test("returns errors without crashing when called with empty object", () => {
    expect(() => validateRequestData({})).not.toThrow();
    const errors = validateRequestData({});
    expect(errors.length).toBeGreaterThan(0);
  });
});
