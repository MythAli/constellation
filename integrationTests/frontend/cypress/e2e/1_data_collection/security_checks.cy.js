const URL = "http://localhost:3000";

describe("Route Guard & Security Testing", () => {
  const studentEmail = "james.smith61@utdallas.edu";
  const studentPassword = "password12345";
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("should redirect unauthenticated users from private student routes", () => {
    // Attempt to jump straight to the home page without logging in
    cy.visit(`${URL}/student-home`);

    // Should be intercepted by loader and kicked to login
    cy.url().should("include", "/account/student");
  });

  it("should prevent a Student from accessing Club-only pages", () => {
    // Log in as a student
    cy.visit(`${URL}/account/student`);
    cy.get('input[name="email"]').type(studentEmail);
    cy.get('input[name="password"]').type(studentPassword);
    cy.get('button[name="login"]').click();

    cy.wait(1000);

    // Try to force-navigate to a club page
    cy.visit(`${URL}/club-home`);

    // Should redirect back to student home or a neutral landing page
    // (Based on the loader logic: if (userType !== "student") return redirect("/");)
    cy.url().should("not.include", "/club-home");
  });

  it("should prevent a logged-in user from seeing the login/signup pages", () => {
    // Log in
    cy.visit(`${URL}/account/student`);
    cy.get('input[name="email"]').type(studentEmail);
    cy.get('input[name=\"password\"]').type(studentPassword);
    cy.get('button[name=\"login\"]').click();

    cy.wait(1000);

    // Attempt to go back to the signup form
    cy.visit(`${URL}/club-signup`);

    // Should redirect them back because they are already authenticated
    cy.url().should("eq", `${URL}/`);
  });
});
