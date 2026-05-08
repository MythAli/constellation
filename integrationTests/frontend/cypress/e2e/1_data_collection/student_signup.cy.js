const URL = "http://localhost:3000";

describe("Student Registration Suite", () => {
  const testEmail = "test_student@utdallas.edu";

  beforeEach(() => {});

  // Cleanup BEFORE and AFTER to ensure a clean slate
  const cleanup = () => {
    cy.request({
      method: "DELETE",
      url: "http://localhost:8080/test/cleanup-test-accounts",
      failOnStatusCode: false, // Don't crash if there's nothing to delete yet
    });
  };

  before(cleanup);
  after(cleanup);

  it("should block invalid inputs (Boundary Testing)", () => {
    cy.visit(`${URL}/account/student`);

    // Test Invalid Partition
    cy.get('input[name="signup_email"]').type("not-an-email");
    cy.get('input[name="signup_password"]').type("123");
    cy.get('button[name="sign_up"]').click({ force: true });

    // Verifying error messages from SignUpForm logic
    cy.get("p")
      .contains("Please enter a valid email address.")
      .should("be.visible");
    cy.get("p")
      .contains("Password must be at least 8 characters.")
      .should("be.visible");
  });

  it("should successfully register a test student", () => {
    cy.visit(`${URL}/account/student`);

    // Filling out all required fields from SignUpForm
    cy.get('input[name="firstName"]').type("Test");
    cy.get('input[name="lastName"]').type("User");
    cy.get('input[name="signup_email"]').type(testEmail);
    cy.get('input[name="signup_password"]').type("password123");

    cy.get('button[name="sign_up"]').click({ force: true });

    // Verify redirect after successful api.post
    cy.url().should("include", "/student-home");
  });
});
