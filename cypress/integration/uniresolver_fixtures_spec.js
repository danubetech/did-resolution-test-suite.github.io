const endpoint = Cypress.env("endpoint");
describe("Test Scenario 1: DID Resolution Result fixtures: " + endpoint, () => {
  it("A correct DID can be resolved", () => {
    cy.fixture("../fixtures/example_dids.json")
      .its("normalDids")
      .then((list) => {
        Object.keys(list).forEach((key) => {
          const normalDid = list[key];
          cy.request({
            method: "GET",
            url: endpoint + normalDid,
          }).as("request");

          cy.get("@request").then((response) => {
            expect(response.status).to.eq(200);
          });

          cy.get("@request").then((response) => {
            expect(response.headers["content-type"]).to.contain(
              'application/ld+json;profile="https://w3id.org/did-resolution'
            );
          });

          cy.get("@request").then((response) => {
            expect(response.body).to.have.property("didDocument");
          });

          cy.get("@request").then((response) => {
            expect(response.body).to.have.property("didResolutionMetadata");
          });

          cy.get("@request").then((response) => {
            expect(response.body).to.have.property("didDocumentMetadata");
          });
        });
      });
  });
});

describe("Test Scenario 2: JSON-LD DID document", () => {
  it("A correct DID can be resolved with header input", () => {
    cy.fixture("../fixtures/example_dids.json")
      .its("normalDids")
      .then((list) => {
        Object.keys(list).forEach((key) => {
          const normalDid = list[key];
          cy.request({
            method: "GET",
            url: endpoint + normalDid,
            headers: { Accept: "application/did+ld+json" },
          }).as("headers");
          cy.get("@headers").then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers["content-type"]).to.contain(
              "application/did+ld+json"
            );
            expect(response.body).not.to.have.property("didDocument");
            expect(response.body).to.have.property("@context");
          });
        });
      });
  });
});

describe("Test Scenario 3: Representation not supported", () => {
  it("Shows an error when a representation is prompted", () => {
    cy.fixture("../fixtures/example_dids.json")
      .its("normalDids")
      .then((list) => {
        Object.keys(list).forEach((key) => {
          const normalDid = list[key];

          cy.request({
            method: "GET",
            url: endpoint + normalDid,
            headers: { Accept: "image/png" },
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(406);
          });
        });
      });
  });
});

describe("Test Scenario 4: Deactivated", () => {
  it("Returns an HTTP code of 410 for deactivated DIDs", () => {
    cy.fixture("../fixtures/example_dids.json")
      .its("deacDids")
      .then((list) => {
        Object.keys(list).forEach((key) => {
          const deacDid = list[key];

          cy.request({
            method: "GET",
            url: endpoint + deacDid,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(410);
            expect(response.headers["content-type"]).to.contain(
              'application/ld+json;profile="https://w3id.org/did-resolution"'
            );
            //FAILS
            expect(response.body.didDocumentMetadata.deactivated).to.eq(true);
          });
        });
      });
  });
});

describe("Test Scenario 5: Not found", () => {
  it("Returns an HTTP code of 404 for non-existent DIDs", () => {
    cy.fixture("../fixtures/example_dids.json")
      .its("nonExisDids")
      .then((list) => {
        Object.keys(list).forEach((key) => {
          const nonExDid = list[key];

          cy.request({
            method: "GET",
            url: endpoint + nonExDid,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.headers["content-type"]).to.contain(
              'application/ld+json;profile="https://w3id.org/did-resolution"'
            );
            expect(response.body.didResolutionMetadata.error).to.eq("notFound");
          });
        });
      });
  });
});

describe("Test Scenario 6: Invalid DID", () => {
  it("Returns a HTTP code of 400 for an invalid DID", () => {
    cy.fixture("../fixtures/example_dids.json")
      .its("invalidDids")
      .then((list) => {
        Object.keys(list).forEach((key) => {
          const invalidDid = list[key];

          cy.request({
            method: "GET",
            url: endpoint + invalidDid,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.headers["content-type"]).to.contain(
              'application/ld+json;profile="https://w3id.org/did-resolution"'
            );
            expect(response.body.didResolutionMetadata.error).to.eq(
              "invalidDid"
            );
          });
        });
      });
  });
});

describe("Test Scenario 7: DID URLs with fragments", () => {
  it("Can resolve a DID with a fragment", () => {
    cy.fixture("../fixtures/example_dids.json")
      .its("fragmentDids")
      .then((list) => {
        Object.keys(list).forEach((key) => {
          const fragmentDid = list[key];

          cy.request({
            method: "GET",
            url: endpoint + fragmentDid,
            failOnStatusCode: false,
            headers: { Accept: "application/did+ld+json" },
          }).as("request");

          cy.get("@request").then((response) => {
            console.log(response);
            expect(response.status).to.eq(200);
            expect(response.headers["content-type"]).to.contain(
              "application/did+ld+json"
            );
            expect(response.body).not.to.have.property("didDocument");
            expect(response.body).to.have.property("@context");
            //FAILS
            expect(response.body).to.have.property("type");
            expect(response.body).to.have.property("id");
            // FAILS
            expect(response.body["id"]).to.contain(fragmentDid.split("#")[0]);
          });
        });
      });
  });
});
