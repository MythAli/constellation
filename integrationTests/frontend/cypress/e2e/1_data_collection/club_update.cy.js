const URL = "http://localhost:3000";

const getRandomString = (length = 6) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

describe("Club Profile Management", () => {
  const clubEmail = "the.dialogue.society@utdallas.edu";
  const password = "Password123!";

  beforeEach(() => {
    // Sign In at /account/club
    cy.visit(`${URL}/account/club`);
    cy.get('input[name="email"]').type(clubEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[name="login"]').click();

    // Verify redirection to club home
    cy.url().should("include", "/club-home", { timeout: 10000 });
  });

  it("should fail to update with missing or invalid information", () => {
    // Enable the Club Name field for editing
    cy.get('div[class*="left"]')
      .find('button[class*="edit_club_name"]')
      .click();

    // Try to clear the name (Name is required)
    cy.get('textarea[name="name"]').clear();

    // Attempt to update (button should be enabled because state changed)
    cy.get("button").contains("Update").click();

    // Verify validation error
    cy.get("p.error_text")
      .contains("Club name is required")
      .should("be.visible");
  });

  it("should successfully update with valid information", () => {
    // Update Club Name
    // Targeting the EditButton next to the name
    cy.get('div[class*="left"]')
      .find('button[class*="edit_club_name"]')
      .click();
    cy.get('textarea[name="name"]')
      .clear()
      .type(`The Dialogue Society Updated, ${getRandomString()}`);

    // Update Logo (Using selectFile logic discussed previously)
    cy.get("input#logo-upload").selectFile(
      {
        contents: Cypress.Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
          "base64",
        ),
        fileName: "new_logo.png",
        mimeType: "image/png",
      },
      { force: true },
    );

    // Update Contact Email
    cy.get('div[class*="left"]')
      .find('button[class*="edit_contact_email"]')
      .click();
    cy.get("input#contact_Email")
      .clear()
      .type(`dialogue.society@gmail.com${getRandomString()}`);

    // Update About Section
    cy.get('div[class*="right"]').find('button[class*="edit_about"]').click();
    cy.get("textarea#about")
      .clear()
      .type(
        `This is a valid and sufficiently long description of the club., ${getRandomString()}`,
      );

    // Submit Update
    cy.get("button").contains("Update").should("not.be.disabled").click();

    // cy.wait(3000);

    // Verify UI reflects no errors (The "Update" button should disable after successful sync)
    cy.get("button").contains("Update").should("be.disabled");
  });
});
