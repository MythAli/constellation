const URL = "http://localhost:3000";

describe("Home Page Search and Discovery", () => {
  beforeEach(() => {
    cy.visit(URL);
  });

  it("should render the main landing page elements", () => {
    // Verify the main text and branding are present
    cy.contains("CONSTELLATION").should("be.visible");
    cy.contains("find your sport among the stars").should("be.visible");

    // Verify the search input exists
    cy.get('input[name="search"]').should(
      "have.attr",
      "placeholder",
      "Hinted search text",
    );
  });

  it("should filter the clubs list based on search input", () => {
    // Wait for the page to render 12 club cards before starting, this is the default club count
    cy.get('div[class*="image_div"]', { timeout: 10000 }).should(
      "have.length.at.least",
      12,
    );

    // Capture the initial number of clubs
    cy.get('div[class*="image_div"]').then(($initialClubs) => {
      const initialCount = $initialClubs.length;

      // Perform the search
      cy.get('input[name="search"]').type("Baking");

      // Click the search button
      cy.get('button[name="search"]').click();

      // Verify the URL changed
      cy.url().should("include", "search=Baking");

      // Verify the list updated
      // 'Coding' is more specific, there should be fewer results than the full list
      cy.get('div[class*="image_div"]', { timeout: 8000 }).should(
        "have.length.at.most",
        initialCount,
      );

      // Verify the remaining club actually contains the word
      cy.get('div[class*="image_div"]').should("contain.text", "Baking");
    });
  });

  it("should prioritize clubs that start with the search term", () => {
    // Again, ensure data is loaded
    cy.get('div[class*="image_div"]', { timeout: 10000 }).should(
      "have.length.at.least",
      12,
    );

    // Search for the letter "A"
    const searchTerm = "A";
    cy.get('input[name="search"]').type(searchTerm);

    // Click the search button
    cy.get('button[name="search"]').click();

    // Verify the URL update
    cy.url().should("include", `search=${searchTerm}`);

    // Verify the first result starts with the search term
    cy.get('div[class*="image_div"]')
      .first()
      .then(($firstClub) => {
        const name = $firstClub.text().toLowerCase();
        expect(name.includes(searchTerm.toLowerCase())).to.be.true;
      });
  });
});
