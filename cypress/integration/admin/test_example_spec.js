const endpoint = Cypress.env("ENDPOINT");

describe("Test example DIDs on endpoint: api.dev.godiddy.com", () => {
  it("Tests if all example DIDs return HTTP status 200", () => {
    function getExamples() {
      cy.request({
        method: "GET",
        url: endpoint + "testIdentifiers",
        failOnStatusCode: false,
      }).then((response) => {
        const methods = response.body;
        cy.wrap(methods).as("examplesGodiddy");
      });
    }

    getExamples();
    cy.get("@examplesGodiddy").then((response) => {
      console.log(response);
      Object.keys(response).forEach((key) => {
        response[key].forEach((did) => {
          cy.request({
            method: "GET",
            url: endpoint + "testIdentifiers/" + did,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).eq(200);
          });
        });
      });
    });
  });
});
