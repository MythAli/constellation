const URL = "http://localhost:3000";

describe("Club Registration Comprehensive Testing", () => {
  const testClubEmail = `test_club_${Date.now()}@utdallas.edu`;

  beforeEach(() => {
    // Set a large viewport to ensure all long form elements are visible
    cy.visit(`${URL}/club-signup`);
  });

  it("should enforce validation rules for mandatory fields and character limits", () => {
    // Test empty submission
    cy.get('button[name="sign_up"]').click({ force: true });

    cy.get("p").contains("Invalid account email format.").should("be.visible");
    cy.get("p")
      .contains("Club name must be at least 3 characters.")
      .should("be.visible");
    cy.get("p")
      .contains("Description must be between 10 and 500 characters.")
      .should("be.visible");
    cy.get("p").contains("A club logo is required.").should("be.visible");

    // Test Boundary: Short Description
    cy.get('textarea[name="about"]').type("Too short");
    cy.get('button[name="sign_up"]').click({ force: true });
    cy.get("p")
      .contains("Description must be between 10 and 500 characters.")
      .should("be.visible");
  });

  it("should validate the Officers input partitioning (First and Last name)", () => {
    // Test a single name (Invalid partition)
    cy.get('input[name="officers"]').type("Temoc");
    cy.get('button[name="sign_up"]').click({ force: true });
    cy.get("p")
      .contains("Please input first and last name")
      .should("be.visible");

    // Test multiple names with missing last names
    cy.get('input[name="officers"]').clear().type("John Doe, Jane");
    cy.get('button[name="sign_up"]').click({ force: true });
    cy.get("p")
      .contains("Please input first and last name")
      .should("be.visible");
  });

  it("should successfully register a club and redirect to dashboard", () => {
    // Fill Account Info
    cy.get('input[name="signup_email"]').type(testClubEmail);
    cy.get('input[name="signup_password"]').type("strongpassword123");

    // Fill Club Details
    cy.get('input[name="name"]').type("Cypress Testing Club");
    cy.get('textarea[name="about"]').type(
      "This is a detailed description of the Cypress Testing Club at UTD.",
    );

    // Generate a tiny valid PNG transparent pixel as a buffer
    const fileName = "logo.png";
    cy.get('input[name="logo_url"]').selectFile(
      {
        contents: Cypress.Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
          "base64",
        ),
        fileName: fileName,
        mimeType: "image/png",
      },
      { force: true },
    );

    cy.get('input[name="contact_email"]').type(testClubEmail);

    // Fill Optional URLs
    cy.get('input[name="instagram_url"]').type(
      "https://instagram.com/cypress_test",
    );

    // Fill Officers
    cy.get('input[name="officers"]').type("John Doe, Jane Smith");

    // Select Tags (Multi-select)
    // Note: This selects the first two available tags from the loader
    cy.get('select[name="tags"]').select([0, 1]);

    // Submit and verify redirection
    cy.get('button[name="sign_up"]').click({ force: true });

    // Verify successful registration redirect
    cy.url().should("include", "/club-home");

    // Verify JWT storage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("accessToken")).to.exist;
    });
  });

  it("should show an error message when registering an existing email", () => {
    // Clear session and try to register again with same email
    cy.clearLocalStorage();
    cy.visit(`${URL}/club-signup`);

    cy.get('input[name="signup_email"]').type(testClubEmail);
    cy.get('input[name="signup_password"]').type("strongpassword123");
    cy.get('input[name="name"]').type("Duplicate Club");
    cy.get('textarea[name="about"]').type(
      "This registration attempt should fail.",
    );

    // Generate a tiny valid PNG transparent pixel as a buffer
    const fileName = "logo.png";
    cy.get('input[name="logo_url"]').selectFile(
      {
        contents: Cypress.Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
          "base64",
        ),
        fileName: fileName,
        mimeType: "image/png",
      },
      { force: true },
    );

    cy.get('input[name="contact_email"]').type(testClubEmail);
    cy.get('input[name="officers"]').type("Duplicate Member");
    cy.get('select[name="tags"]').select([0]);

    cy.get('button[name="sign_up"]').click();

    // Verification: Check for backend error relay
    // This confirms the action correctly caught the 409
    cy.get(".error_text")
      .should("be.visible")
      .and("contain", "This email is already registered");

    // Ensure we are still on the signup page
    cy.url().should("include", "/club-signup");
  });

  after(() => {
    // Trigger the cleanup route
    cy.request("DELETE", "http://localhost:8080/test/cleanup-test-accounts");
  });
});
