const {
  validateClubData,
} = require("../../../backend/userRoutes/user/editClub.js");

const validClub = () => ({
  name: "Chess Club",
  about: "A club for chess enthusiasts who want to improve their game.",
  contact_email: "contact@chess.com",
  instagram_url: "",
  website_url: "",
  twitter_url: "",
  parsedOfficers: ["Jane Doe", "John Smith"],
  tags: ["Academic"],
});

describe("validateClubData (editClub)", () => {
  // ---- VALID INPUT ----
  test("returns no errors for valid club data", () => {
    const errors = validateClubData(validClub());
    expect(errors).toHaveLength(0);
  });

  // ---- CLUB NAME ----
  test("returns error for missing club name", () => {
    const errors = validateClubData({ ...validClub(), name: "" });
    expect(errors).toContain(
      "Club name is required and must be at least 2 characters.",
    );
  });

  test("returns error for club name shorter than 2 characters", () => {
    const errors = validateClubData({ ...validClub(), name: "X" });
    expect(errors).toContain(
      "Club name is required and must be at least 2 characters.",
    );
  });

  test("returns no error for club name exactly 2 characters", () => {
    const errors = validateClubData({ ...validClub(), name: "AI" });
    expect(errors).not.toContain(
      "Club name is required and must be at least 2 characters.",
    );
  });

  // ---- CONTACT EMAIL ----
  test("returns error for missing contact email", () => {
    const errors = validateClubData({ ...validClub(), contact_email: "" });
    expect(errors).toContain("Please enter a valid email address.");
  });

  test("returns error for invalid contact email format", () => {
    const errors = validateClubData({
      ...validClub(),
      contact_email: "notanemail",
    });
    expect(errors).toContain("Please enter a valid email address.");
  });

  // ---- SOCIAL URLS ----
  test("returns error for invalid instagram URL", () => {
    const errors = validateClubData({
      ...validClub(),
      instagram_url: "not a url!!!",
    });
    expect(errors).toContain("Please enter a valid instagram url.");
  });

  test("returns error for invalid website URL", () => {
    const errors = validateClubData({
      ...validClub(),
      website_url: "not a url!!!",
    });
    expect(errors).toContain("Please enter a valid website url.");
  });

  test("returns error for invalid twitter URL", () => {
    const errors = validateClubData({
      ...validClub(),
      twitter_url: "not a url!!!",
    });
    expect(errors).toContain("Please enter a valid twitter url.");
  });

  test("returns no error when all social URLs are empty (they are optional)", () => {
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
    const errors = validateClubData({ ...validClub(), parsedOfficers: [] });
    expect(errors).toContain("Please list at least one officer.");
  });

  test("returns error for officer with only one name", () => {
    const errors = validateClubData({
      ...validClub(),
      parsedOfficers: ["Jane"],
    });
    expect(errors).toContain(
      "Each officer must have a first and last name (min. 2 characters each).",
    );
  });

  test("returns error for officer name part shorter than 2 characters", () => {
    const errors = validateClubData({
      ...validClub(),
      parsedOfficers: ["J Doe"],
    });
    expect(errors).toContain(
      "Each officer must have a first and last name (min. 2 characters each).",
    );
  });

  test("returns no error for valid officers", () => {
    const errors = validateClubData({
      ...validClub(),
      parsedOfficers: ["Jane Doe", "John Smith"],
    });
    expect(errors).not.toContain(
      "Each officer must have a first and last name (min. 2 characters each).",
    );
  });

  // ---- TAGS ----
  test("returns error when no tags are provided", () => {
    const errors = validateClubData({ ...validClub(), tags: [] });
    expect(errors).toContain("Please select at least one tag for your club.");
  });

  test("returns no error when at least one tag is provided", () => {
    const errors = validateClubData({ ...validClub(), tags: ["Academic"] });
    expect(errors).not.toContain(
      "Please select at least one tag for your club.",
    );
  });

  // ---- ABOUT ----
  test("returns error for about section shorter than 10 characters", () => {
    const errors = validateClubData({ ...validClub(), about: "Too short" });
    expect(errors).toContain(
      "The 'About' section must be between 10 and 500 characters.",
    );
  });

  test("returns error for about section longer than 500 characters", () => {
    const errors = validateClubData({ ...validClub(), about: "a".repeat(501) });
    expect(errors).toContain(
      "The 'About' section must be between 10 and 500 characters.",
    );
  });

  test("returns no error for about section exactly 10 characters", () => {
    const errors = validateClubData({ ...validClub(), about: "a".repeat(10) });
    expect(errors).not.toContain(
      "The 'About' section must be between 10 and 500 characters.",
    );
  });

  test("returns no error for about section exactly 500 characters", () => {
    const errors = validateClubData({ ...validClub(), about: "a".repeat(500) });
    expect(errors).not.toContain(
      "The 'About' section must be between 10 and 500 characters.",
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
