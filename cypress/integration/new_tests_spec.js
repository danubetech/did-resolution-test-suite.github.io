const endpoint = Cypress.env("endpoint");

describe("Test Scenario X: " + endpoint, () => {
  it("does a test", () => {
    cy.request({
      method: "GET",
      url: "https://dev.uniresolver.io/1.0/identifiers/did:sov:0000000000000000000000",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eq(200);
    });
  });
});
