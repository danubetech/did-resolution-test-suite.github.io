const { softExpect } = chai;

it("Tests if all example DIDs return HTTP status 200", () => {
  function getExamples() {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/testIdentifiers",
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
          url:
            "https://api.dev.godiddy.com/0.1.0/universal-resolver/identifiers/" +
            did,
          failOnStatusCode: false,
        }).then((response) => {
          softExpect(response.status).to.eq(200);
        });
      });
    });
  });
});
