const URL = "http://localhost:3000";

describe("Session Persistence and Logout Lifecycle", () => {
  const studentEmail = "james.smith61@utdallas.edu";
  const clubEmail = "the.dialogue.society@utdallas.edu";
  const studentPassword = "password12345";
  const clubPassword = "Password123!";

  it("should persist session on refresh and clear it on logout", () => {
    testUser(studentEmail, studentPassword, "student");
    testUser(clubEmail, clubPassword, "club");
  });
});

const testUser = (email, password, url) => {
  // LOGIN
  cy.visit(`${URL}/account/${url}`);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[name="login"]').click();
  cy.url().should("include", `/${url}-home`);

  // REFRESH (Persistence Check)
  cy.reload();
  // Verify loader still allows access because token is in localStorage
  cy.url().should("include", `/${url}-home`);
  cy.window().then((win) => {
    expect(win.localStorage.getItem("accessToken")).to.exist;
  });

  // LOGOUT
  // Log out
  cy.get("button").contains("Log out").click();

  // VERIFY LOGOUT
  cy.url().should("include", `/account/${url}`);
  cy.window().then((win) => {
    expect(win.localStorage.getItem("accessToken")).to.be.null; //
  });

  // ATTEMPT UNUATHORIZED ACCESS
  cy.visit(`${URL}/${url}-home`);
  // Loader logic should catch the missing token and redirect
  cy.url().should("include", `/account/${url}`);
};
