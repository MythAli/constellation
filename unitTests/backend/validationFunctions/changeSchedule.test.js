const { validateScheduleData } = require("../../../backend/userRoutes/user/changeSchedule.js");

describe("validateScheduleData (changeSchedule)", () => {
  // ---- VALID INPUT ----
  test("returns no errors for valid start and end dates", () => {
    const errors = validateScheduleData({
      calendar_start: "2026-04-01T08:00:00.000Z",
      calendar_end: "2026-04-30T08:00:00.000Z",
    });
    expect(errors).toHaveLength(0);
  });

  // ---- PRESENCE VALIDATION ----
  test("returns error for missing start date", () => {
    const errors = validateScheduleData({
      calendar_start: "",
      calendar_end: "2026-04-30T08:00:00.000Z",
    });
    expect(errors).toContain("Provide a start date/time.");
  });

  test("returns error for missing end date", () => {
    const errors = validateScheduleData({
      calendar_start: "2026-04-01T08:00:00.000Z",
      calendar_end: "",
    });
    expect(errors).toContain("Provide an end date/time.");
  });

  test("returns two errors when both dates are missing", () => {
    const errors = validateScheduleData({ calendar_start: "", calendar_end: "" });
    expect(errors).toHaveLength(2);
  });

  // ---- INVALID DATE FORMAT ----
  test("returns error for invalid start date format", () => {
    const errors = validateScheduleData({
      calendar_start: "not-a-date",
      calendar_end: "2026-04-30T08:00:00.000Z",
    });
    expect(errors).toContain("One or both of the dates provided are invalid.");
  });

  test("returns error for invalid end date format", () => {
    const errors = validateScheduleData({
      calendar_start: "2026-04-01T08:00:00.000Z",
      calendar_end: "not-a-date",
    });
    expect(errors).toContain("One or both of the dates provided are invalid.");
  });

  // ---- CHRONOLOGICAL VALIDATION ----
  test("returns error when end date is before start date", () => {
    const errors = validateScheduleData({
      calendar_start: "2026-04-30T08:00:00.000Z",
      calendar_end: "2026-04-01T08:00:00.000Z",
    });
    expect(errors).toContain("End time must be after the start time.");
  });

  test("returns error when end date equals start date", () => {
    const errors = validateScheduleData({
      calendar_start: "2026-04-01T08:00:00.000Z",
      calendar_end: "2026-04-01T08:00:00.000Z",
    });
    expect(errors).toContain("End time must be after the start time.");
  });

  // ---- DEFAULT VALUES (no crash on empty body) ----
  test("does not crash when called with empty object", () => {
    expect(() => validateScheduleData({})).not.toThrow();
    const errors = validateScheduleData({});
    expect(errors.length).toBeGreaterThan(0);
  });
});
