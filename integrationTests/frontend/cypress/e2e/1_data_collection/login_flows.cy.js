const URL = "http://localhost:3000";

describe("Login Flow Testing", () => {
  // Use existing accounts or ones created by the previous registration tests
  const studentEmail = "james.smith61@utdallas.edu";
  const clubEmail = "the.dialogue.society@utdallas.edu";
  const studentPassword = "password12345";
  const clubPassword = "Password123!";

  it("should successfully log in a student", () => {
    cy.visit(`${URL}/account/student`);

    // Target the specific Login fields
    cy.get('input[name="email"]').type(studentEmail);
    cy.get('input[name="password"]').type(studentPassword);

    // Click the button with name="login" to trigger the submitter logic
    cy.get('button[name="login"]').click();

    // Verify JWT storage and redirection
    cy.url().should("include", "/student-home");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("accessToken")).to.exist;
    });
  });

  it("should successfully log in a club", () => {
    cy.visit(`${URL}/account/club`);

    cy.get('input[name="email"]').type(clubEmail);
    cy.get('input[name="password"]').type(clubPassword);

    cy.get('button[name="login"]').click();

    // Clubs should be redirected to the club dashboard
    cy.url().should("include", "/club-home");
  });

  it("should show an error for incorrect credentials", () => {
    cy.visit(`${URL}/account/student`);

    cy.get('input[name="email"]').type(studentEmail);
    cy.get('input[name="password"]').type("wrong_password");
    cy.get('button[name="login"]').click();

    // Check for the backend error message
    // Assuming the login handler returns a 401 or 404 for bad credentials
    cy.get(".error_text").should("be.visible");
  });
});
