const URL = "http://localhost:3000";

describe("Club & Event Persistence Validation", () => {
  const testClubUrl = `${URL}/clubs/12`; // Adjust to a valid ID from seed data

  beforeEach(() => {
    // Log in as student to set the auth cookie/token
    cy.visit(`${URL}/account/student`);
    cy.get('input[name="email"]').type("james.smith61@utdallas.edu");
    cy.get('input[name="password"]').type("password12345");
    cy.get('button[name="login"]').click();

    cy.url({ timeout: 10000 }).should("include", `${URL}/student-home`);
  });

  it("should sync Club Follow status to Stuent's My Clubs", () => {
    cy.visit(`${URL}/my-clubs`);

    cy.get('div[class*="image_div"]').then(($initialElements) => {
      const initialCount = $initialElements.length;

      // Visit Club Page and Follow
      cy.visit(testClubUrl);

      // Targeting the heart icon in the Club header
      cy.get('div[class*="left"]').find('button[class*="follow"]').click();

      // Wait for follow to finish
      cy.get('div[class*="left"]')
        .find('button[class*="follow"]')
        .should("contain.text", "unfollow");

      // Verify in My Clubs page
      cy.visit(`${URL}/my-clubs`);
      cy.get('div[class*="image_div"]').should("have.length", initialCount + 1);

      // Cleanup: Unfollow and verify removal
      cy.visit(testClubUrl);
      cy.get('div[class*="left"]').find('button[class*="follow"]').click();

      // Wait for follow to finish
      cy.get('div[class*="left"]')
        .get('button[class*="follow"]')
        .invoke("text")
        .should("match", /^\s*follow\s*$/i);

      cy.visit(`${URL}/my-clubs`);

      cy.get('div[class*="image_div"]').should("have.length", initialCount);
    });
  });

  it("should sync Event Heart status to Student's and My Events", () => {
    cy.visit(`${URL}/my-events`);

    cy.get('div[class*="event"]').then(($initialElements) => {
      const initialCount = $initialElements.length;

      // Visit Club Page and Follow
      cy.visit(testClubUrl);

      // Targeting the heart icon in the Club header
      cy.get('div[class*="right"]')
        .find('svg[class*="attend"]')
        .first()
        .click();

      // Wait for follow to finish
      cy.get('div[class*="right"]')
        .find('svg[class*="attend_fill"]', { timeout: 10000 })
        .first()
        .should("be.visible");

      // Verify in My Clubs page
      cy.visit(`${URL}/my-events`);
      cy.get('div[class*="event"]').should("have.length", initialCount + 1);

      // Cleanup: Unfollow and verify removal
      cy.visit(testClubUrl);
      cy.get('div[class*="right"]')
        .find('svg[class*="attend_fill"]')
        .first()
        .click();

      cy.get('div[class*="right"]')
        .find('svg[class*="attend"]', { timeout: 10000 })
        .first()
        .should("be.visible");

      cy.wait(1000);

      cy.visit(`${URL}/my-events`, { timeout: 10000 });

      cy.get('div[class*="event"]').should("have.length", initialCount);
    });
  });
});
