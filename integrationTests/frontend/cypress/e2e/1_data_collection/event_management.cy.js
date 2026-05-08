const URL = "http://localhost:3000";

describe("Club Event Management", () => {
  const clubEmail = "the.dialogue.society@utdallas.edu";
  const password = "Password123!";

  beforeEach(() => {
    // Sign In before each test
    cy.visit(`${URL}/account/club`);
    cy.get('input[name="email"]').type(clubEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[name="login"]').click();
    cy.url().should("include", "/club-home");
  });

  it("should successfully add a new event and increase the event count", () => {
    // Get the initial count of events
    cy.get('div[class*="event"]').then(($events) => {
      // If there are no events initially, the count is 0
      const initialCount = $events.length;

      // Open the Add Event Modal
      cy.get('a[class*="add_event"]').click();

      // Fill out the Add Event Form
      const futureStart = new Date();
      futureStart.setDate(futureStart.getDate() + 1); // Tomorrow
      const futureEnd = new Date(futureStart);
      futureEnd.setHours(futureEnd.getHours() + 2); // 2 hours later

      // Format for datetime-local input (YYYY-MM-DDThh:mm)
      const formatToLocalHTML = (date) => date.toISOString().slice(0, 16);

      cy.get('input[name="event_title"]').type("Cypress Automated Event");
      cy.get('input[name="description"]').type(
        "This is a test event created by Cypress testing suite. It has more than 20 characters.",
      );
      cy.get('input[name="start_time"]').type(formatToLocalHTML(futureStart));
      cy.get('input[name="end_time"]').type(formatToLocalHTML(futureEnd));

      // Submit the form
      cy.get("button").contains("Add").click();

      // Verify the Modal closed (Redirected back to /club-home)[cite: 10]
      cy.url().should("not.include", "add-event");

      // Verify the event count increased by 1
      cy.get('div[class*="event"]').should("have.length", initialCount + 1);

      // Verify the specific event is now visible
      cy.contains("Cypress Automated Event").should("be.visible");
    });
  });

  it("should successfully delete an event and decrease the event count", () => {
    // IMPORTANT: Stub the window.confirm dialog to automatically click "OK"
    // The deleteEventHandler uses window.confirm("Are you sure...")
    cy.on("window:confirm", () => true);

    // Get the initial count of events
    cy.get('div[class*="event"]').then(($events) => {
      const initialCount = $events.length;

      // Ensure there is at least one event to delete
      if (initialCount === 0) {
        cy.log("No events to delete, skipping test.");
        return;
      }

      // Click the specific RemoveButton on the FIRST event
      // We target the icon inside the delete_div class
      cy.get('div[class*="delete_div"]').first().find("svg").click();

      // Verify the event count decreased by 1
      cy.get('div[class*="event"]').should("have.length", initialCount - 1);
    });
  });
});
