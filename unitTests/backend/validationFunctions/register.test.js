const {
  validateStudentData,
  validateClubData,
} = require("../../../backend/userRoutes/user/register.js");

// ============================================================
// validateStudentData
// ============================================================
describe("validateStudentData (register)", () => {
  const validStudent = () => ({
    firstName: "Jane",
    lastName: "Doe",
    signup_email: "jane.doe@utdallas.edu",
    signup_password: "securepassword",
  });

  // ---- VALID INPUT ----
  test("returns no errors for valid student data", () => {
    const errors = validateStudentData(validStudent());
    expect(errors).toHaveLength(0);
  });

  // ---- FIRST NAME ----
  test("returns error for missing first name", () => {
    const errors = validateStudentData({ ...validStudent(), firstName: "" });
    expect(errors).toContain("First name is too short.");
  });

  test("returns error for first name shorter than 2 characters", () => {
    const errors = validateStudentData({ ...validStudent(), firstName: "J" });
    expect(errors).toContain("First name is too short.");
  });

  test("returns no error for first name exactly 2 characters", () => {
    const errors = validateStudentData({ ...validStudent(), firstName: "Jo" });
    expect(errors).not.toContain("First name is too short.");
  });

  // ---- LAST NAME ----
  test("returns error for missing last name", () => {
    const errors = validateStudentData({ ...validStudent(), lastName: "" });
    expect(errors).toContain("Last name is too short.");
  });

  test("returns error for last name shorter than 2 characters", () => {
    const errors = validateStudentData({ ...validStudent(), lastName: "D" });
    expect(errors).toContain("Last name is too short.");
  });

  // ---- EMAIL ----
  test("returns error for missing email", () => {
    const errors = validateStudentData({ ...validStudent(), signup_email: "" });
    expect(errors).toContain("Please enter a valid email address.");
  });

  test("returns error for invalid email format", () => {
    const errors = validateStudentData({ ...validStudent(), signup_email: "notanemail" });
    expect(errors).toContain("Please enter a valid email address.");
  });

  // ---- PASSWORD ----
  test("returns error for missing password", () => {
    const errors = validateStudentData({ ...validStudent(), signup_password: "" });
    expect(errors).toContain("Password must be at least 8 characters.");
  });

  test("returns error for password shorter than 8 characters", () => {
    const errors = validateStudentData({ ...validStudent(), signup_password: "short" });
    expect(errors).toContain("Password must be at least 8 characters.");
  });

  test("returns no error for password exactly 8 characters", () => {
    const errors = validateStudentData({ ...validStudent(), signup_password: "exactly8" });
    expect(errors).not.toContain("Password must be at least 8 characters.");
  });

  // ---- MULTIPLE ERRORS ----
  test("returns multiple errors for completely empty input", () => {
    const errors = validateStudentData({});
    expect(errors.length).toBeGreaterThan(1);
  });

  // ---- DEFAULT VALUES (no crash on empty body) ----
  test("does not crash when called with empty object", () => {
    expect(() => validateStudentData({})).not.toThrow();
  });
});

// ============================================================
// validateClubData (register)
// ============================================================
describe("validateClubData (register)", () => {
  const validClub = () => ({
    file: { path: "https://cloudinary.com/logo.png" },
    email: "chess@utdallas.edu",
    password: "securepassword",
    name: "Chess Club",
    about: "A club for chess enthusiasts who want to improve their game.",
    contact_email: "contact@chess.com",
    instagram_url: "",
    website_url: "",
    twitter_url: "",
    officers: ["Jane Doe", "John Smith"],
    tags: ["Academic"],
  });

  // ---- VALID INPUT ----
  test("returns no errors for valid club data", () => {
    const errors = validateClubData(validClub());
    expect(errors).toHaveLength(0);
  });

  // ---- FILE ----
  test("returns error when no file is uploaded", () => {
    const errors = validateClubData({ ...validClub(), file: null });
    expect(errors).toContain(
      "No image file was uploaded or the file format is invalid."
    );
  });

  // ---- EMAIL ----
  test("returns error for invalid login email", () => {
    const errors = validateClubData({ ...validClub(), email: "bademail" });
    expect(errors).toContain("Please enter a valid email address.");
  });

  test("returns error for invalid contact email", () => {
    const errors = validateClubData({ ...validClub(), contact_email: "bademail" });
    expect(errors).toContain("Please enter a valid contact email address.");
  });

  // ---- PASSWORD ----
  test("returns error for password shorter than 8 characters", () => {
    const errors = validateClubData({ ...validClub(), password: "short" });
    expect(errors).toContain("Password must be at least 8 characters.");
  });

  // ---- CLUB NAME ----
  test("returns error for missing club name", () => {
    const errors = validateClubData({ ...validClub(), name: "" });
    expect(errors).toContain(
      "Club name is required and must be at least 2 characters."
    );
  });

  test("returns error for club name shorter than 2 characters", () => {
    const errors = validateClubData({ ...validClub(), name: "X" });
    expect(errors).toContain(
      "Club name is required and must be at least 2 characters."
    );
  });

  // ---- ABOUT ----
  test("returns error for about section shorter than 10 characters", () => {
    const errors = validateClubData({ ...validClub(), about: "Too short" });
    expect(errors).toContain('The "About" must be between 10 and 500 characters.');
  });

  test("returns error for about section longer than 500 characters", () => {
    const errors = validateClubData({ ...validClub(), about: "a".repeat(501) });
    expect(errors).toContain('The "About" must be between 10 and 500 characters.');
  });

  test("returns no error for about section exactly 10 characters", () => {
    const errors = validateClubData({ ...validClub(), about: "a".repeat(10) });
    expect(errors).not.toContain('The "About" must be between 10 and 500 characters.');
  });

  test("returns no error for about section exactly 500 characters", () => {
    const errors = validateClubData({ ...validClub(), about: "a".repeat(500) });
    expect(errors).not.toContain('The "About" must be between 10 and 500 characters.');
  });

  // ---- SOCIAL URLS ----
  test("returns error for invalid instagram URL", () => {
    const errors = validateClubData({ ...validClub(), instagram_url: "not a url!!!" });
    expect(errors).toContain("Please enter a valid instagram url.");
  });

  test("returns no error when social URLs are empty (they are optional)", () => {
    const errors = validateClubData({
      ...validClub(),
      instagram_url: "",
      website_url: "",
      twitter_url: "",
    });
    expect(errors).toHaveLength(0);
  });

  // ---- OFFICERS ----
  test("returns error when no officers are provided", () => {
    const errors = validateClubData({ ...validClub(), officers: [] });
    expect(errors).toContain("Please list at least one officer.");
  });

  test("returns error for officer with only one name", () => {
    const errors = validateClubData({ ...validClub(), officers: ["Jane"] });
    expect(errors).toContain(
      "Please input first and last name for every officer."
    );
  });

  test("returns error for officer with more than two names", () => {
    const errors = validateClubData({
      ...validClub(),
      officers: ["Jane Mary Doe"],
    });
    expect(errors).toContain(
      "Please only input first and last name for any officer."
    );
  });

  test("returns error for officer name part shorter than 2 characters", () => {
    const errors = validateClubData({ ...validClub(), officers: ["J Doe"] });
    expect(errors).toContain(
      "First and last name must be at least 2 characters long."
    );
  });

  // ---- TAGS ----
  test("returns error when no tags are provided", () => {
    const errors = validateClubData({ ...validClub(), tags: [] });
    expect(errors).toContain(
      "Please select at least one tag for your club."
    );
  });

  // ---- MULTIPLE ERRORS ----
  test("returns multiple errors for completely empty input", () => {
    const errors = validateClubData({});
    expect(errors.length).toBeGreaterThan(1);
  });

  // ---- DEFAULT VALUES (no crash on empty body) ----
  test("does not crash when called with empty object", () => {
    expect(() => validateClubData({})).not.toThrow();
  });
});
