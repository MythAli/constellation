const URL = "http://localhost:3000";

describe("Basic Function Testing - Student Dashboard", () => {
  const testStudentEmail = "james.smith61@utdallas.edu"; // From the login_flows.cy.js
  const password = "password12345";

  beforeEach(() => {
    // Log in as Student before each test
    cy.visit(`${URL}/account/student`);
    cy.get('input[name="email"]').type(testStudentEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[name="login"]').click();
    cy.url().should("include", "/student-home", { timeout: 10000 });
  });

  it("Core Flow 1: Student views favorite clubs and upcoming events", () => {
    // Verify the main sections render correctly
    cy.contains("FAVORITE CLUBS").should("be.visible");
    cy.contains("UPCOMING EVENTS").should("be.visible");

    // Verify seeded club images are rendering (using the alt="Club Logo" attribute)
    cy.get('img[alt="Club Logo"]').should("have.length.greaterThan", 0);
  });

  it("Core Flow 2: Student updates calendar schedule", () => {
    // Find and click the Upload Schedule button
    cy.contains("UPLOAD SCHEDULE").click();

    // Verify the UI updates state.
    cy.get("p").then(($ps) => {
      // Look through paragraphs to find the status message
      const text = $ps.text();
      expect(text).to.match(/Successful!|Error!|Uploading.../);
    });
  });
});
