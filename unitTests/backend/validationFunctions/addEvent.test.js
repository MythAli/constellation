const { validateEventData } = require("../../../backend/userRoutes/user/addEvent.js");

// Helper: a future date string offset by given hours from now
const futureDate = (hoursFromNow) => {
  const d = new Date();
  d.setHours(d.getHours() + hoursFromNow);
  return d.toISOString();
};

const validData = () => ({
  event_title: "Annual Hackathon",
  start_time: futureDate(2),
  end_time: futureDate(5),
  description: "A full day of coding, collaboration, and creativity for all students.",
});

describe("validateEventData (addEvent)", () => {
  // ---- VALID INPUT ----
  test("returns no errors for valid event data", () => {
    const errors = validateEventData(validData());
    expect(errors).toHaveLength(0);
  });

  // ---- TITLE VALIDATION ----
  test("returns error for missing event title", () => {
    const errors = validateEventData({ ...validData(), event_title: "" });
    expect(errors).toContain("Event title must be at least 3 characters long.");
  });

  test("returns error for event title shorter than 3 characters", () => {
    const errors = validateEventData({ ...validData(), event_title: "Hi" });
    expect(errors).toContain("Event title must be at least 3 characters long.");
  });

  test("returns no error for event title exactly 3 characters", () => {
    const errors = validateEventData({ ...validData(), event_title: "Art" });
    expect(errors).not.toContain("Event title must be at least 3 characters long.");
  });

  // ---- TIME PRESENCE VALIDATION ----
  test("returns error for missing start time", () => {
    const errors = validateEventData({ ...validData(), start_time: "" });
    expect(errors).toContain("Provide a start date/time.");
  });

  test("returns error for missing end time", () => {
    const errors = validateEventData({ ...validData(), end_time: "" });
    expect(errors).toContain("Provide an end date/time.");
  });

  // ---- INVALID DATE FORMAT ----
  test("returns error for invalid start time format", () => {
    const errors = validateEventData({ ...validData(), start_time: "not-a-date" });
    expect(errors).toContain("One or both of the dates provided are invalid.");
  });

  test("returns error for invalid end time format", () => {
    const errors = validateEventData({ ...validData(), end_time: "not-a-date" });
    expect(errors).toContain("One or both of the dates provided are invalid.");
  });

  // ---- CHRONOLOGICAL VALIDATION ----
  test("returns error when start time is in the past", () => {
    const errors = validateEventData({ ...validData(), start_time: futureDate(-5) });
    expect(errors).toContain("Start time cannot be in the past.");
  });

  test("returns error when end time is before start time", () => {
    const errors = validateEventData({
      ...validData(),
      start_time: futureDate(5),
      end_time: futureDate(2),
    });
    expect(errors).toContain("End time must be after the start time.");
  });

  test("returns error when end time equals start time", () => {
    const same = futureDate(3);
    const errors = validateEventData({ ...validData(), start_time: same, end_time: same });
    expect(errors).toContain("End time must be after the start time.");
  });

  // ---- DESCRIPTION VALIDATION ----
  test("returns error for missing description", () => {
    const errors = validateEventData({ ...validData(), description: "" });
    expect(errors).toContain("Description cannot be empty.");
  });

  test("returns error for description shorter than 20 characters", () => {
    const errors = validateEventData({ ...validData(), description: "Too short." });
    expect(errors).toContain("Description must be at least 20 characters.");
  });

  test("returns error for description longer than 1000 characters", () => {
    const errors = validateEventData({ ...validData(), description: "a".repeat(1001) });
    expect(errors).toContain("Description must be under 1000 characters.");
  });

  test("returns no error for description exactly 20 characters", () => {
    const errors = validateEventData({ ...validData(), description: "a".repeat(20) });
    expect(errors).not.toContain("Description must be at least 20 characters.");
  });

  test("returns no error for description exactly 1000 characters", () => {
    const errors = validateEventData({ ...validData(), description: "a".repeat(1000) });
    expect(errors).not.toContain("Description must be under 1000 characters.");
  });

  // ---- MULTIPLE ERRORS ----
  test("returns multiple errors for completely empty input", () => {
    const errors = validateEventData({});
    expect(errors.length).toBeGreaterThan(1);
  });

  // ---- DEFAULT VALUES (no crash on empty body) ----
  test("does not crash when called with empty object", () => {
    expect(() => validateEventData({})).not.toThrow();
  });
});
