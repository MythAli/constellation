const URL = "http://localhost:3000";

describe("UI Loading State and Submission Throttling", () => {
  beforeEach(() => {
    cy.clearLocalStorage(); // For logging out
    cy.visit(`${URL}/account/student`);
  });

  it("should show 'Logging in...' and disable the button during submission", () => {
    // Fill in valid credentials
    cy.get('input[name="email"]').type("james.smith61@utdallas.edu");
    cy.get('input[name="password"]').type("password12345");

    // Click login
    cy.get('button[name="login"]').click();

    // VERIFY LOADING STATE (The "Optimistic" UI)
    cy.get('button[name="login"]')
      .should("be.disabled")
      .and("contain", "Logging in...");

    // VERIFY TRANSITION
    // After the 3 seconds, the action completes and redirects
    cy.url().should("include", "/student-home", { timeout: 10000 });
  });
});
