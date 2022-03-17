const endpoint = Cypress.env("endpoint");
describe("Test Scenario 1: DID Resolution Result overview: " + endpoint, () => {
  beforeEach(() => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:WRfXPg8dantKVubE3HX8pw",
    }).as("request");
  });

  it("MUST return HTTP code 200", () => {
    cy.get("@request").then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('Should have header with Content-Type with value application/ld+json;profile="https://w3id.org/did-resolution" ', () => {
    cy.get("@request").then((response) => {
      expect(response.headers["content-type"]).to.contain(
        'application/ld+json;profile="https://w3id.org/did-resolution'
      );
    });
  });

  it("Must contain property didDocument", () => {
    cy.get("@request").then((response) => {
      expect(response.body).to.have.property("didDocument");
    });
  });
  it("Must contain property didResolutionMetadata", () => {
    cy.get("@request").then((response) => {
      expect(response.body).to.have.property("didResolutionMetadata");
    });
  });
  it("Must contain property didDocumentMetadata", () => {
    cy.get("@request").then((response) => {
      expect(response.body).to.have.property("didDocumentMetadata");
    });
  });
});

describe("Test Scenario 2: JSON-LD DID document", () => {
  beforeEach(() => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:WRfXPg8dantKVubE3HX8pw",
      headers: { Accept: "application/did+ld+json" },
    }).as("headers");
  });

  it("Should have response status 200", () => {
    cy.get("@headers").then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Should have header with content type", () => {
    cy.get("@headers").then((response) => {
      expect(response.headers["content-type"]).to.contain(
        "application/did+ld+json"
      );
    });
  });

  it("Should not have property didDocument", () => {
    cy.get("@headers").then((response) => {
      expect(response.body).not.to.have.property("didDocument");
    });
  });

  it("Should have property @context", () => {
    cy.get("@headers").then((response) => {
      expect(response.body).to.have.property("@context");
    });
  });
});

describe("Test Scenario 3: Representation not supported", () => {
  it("MUST return HTTP code 406", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:WRfXPg8dantKVubE3HX8pw",
      failOnStatusCode: false,
      headers: { Accept: "image/png" },
    }).then((response) => {
      expect(response.status).to.eq(406);
    });
  });
});

describe("Test Scenario 4: Deactivated", () => {
  it("MUST return HTTP code 410", () => {
    cy.request({
      method: "GET",
      url:
        endpoint + "did:kilt:4r6RdVMNes2eEobxyxH7aVsesUqR2X175sUAXJfo7dEWxHUS",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(410);
    });
  });
  it("MUST return HTTP header Content-Type", () => {
    cy.request({
      method: "GET",
      url:
        endpoint + "did:kilt:4r6RdVMNes2eEobxyxH7aVsesUqR2X175sUAXJfo7dEWxHUS",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers["content-type"]).to.contain(
        'application/ld+json;profile="https://w3id.org/did-resolution"'
      );
    });
  });
  it("JSON object MUST contain property didDocumentMetadata.deactivated = true", () => {
    cy.request({
      method: "GET",
      url:
        endpoint + "did:kilt:4r6RdVMNes2eEobxyxH7aVsesUqR2X175sUAXJfo7dEWxHUS",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.didDocumentMetadata.deactivated).to.eq(true);
    });
  });
});

describe("Test Scenario 5: Not found", () => {
  it("MUST return HTTP code 404", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:0000000000000000000000",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
  it('MUST return HTTP header Content-Type with value application/ld+json;profile="https://w3id.org/did-resolution"', () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:0000000000000000000000",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers["content-type"]).to.contain(
        'application/ld+json;profile="https://w3id.org/did-resolution"'
      );
    });
  });
  it('JSON object MUST contain property didResolutionMetadata.error = "notFound"', () => {
    cy.request({
      method: "GET",
      url: "https://dev.uniresolver.io/1.0/identifiers/did:sov:0000000000000000000000",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.didResolutionMetadata.error).to.eq("notFound");
    });
  });
});

describe("Test Scenario 6: Invalid DID", () => {
  it("MUST return HTTP code 400", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:example_222",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
  it('MUST return HTTP header Content-Type with value application/ld+json;profile="https://w3id.org/did-resolution"', () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:example_222",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers["content-type"]).to.contain(
        'application/ld+json;profile="https://w3id.org/did-resolution"'
      );
    });
  });
  it('JSON object MUST contain property didResolutionMetadata.error = "invalidDid"', () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:example_222",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.didResolutionMetadata.error).to.eq("invalidDid");
    });
  });
});

// FAILS
describe("Test Scenario 7: DID URLs with fragments", () => {
  beforeEach(() => {
    cy.request({
      method: "GET",
      url: endpoint + "did%3Asov%3AWRfXPg8dantKVubE3HX8pw%23key-1",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).as("headers");
  });

  it("Must return HTTP code 200", () => {
    cy.get("@headers").then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return HTTP header Content-Type with value application/did+ld+json", () => {
    cy.get("@headers").then((response) => {
      expect(response.headers["content-type"]).to.contain(
        "did:sov:WRfXPg8dantKVubE3HX8pw#key-1"
      );
    });
  });
  it("JSON object MUST NOT contain property didDocument", () => {
    cy.get("@headers").then((response) => {
      expect(response.body).not.to.have.property("didDocument");
    });
  });

  it("JSON object MUST contain property @context", () => {
    cy.get("@headers").then((response) => {
      expect(response.body).to.have.property("@context");
    });
  });

  it("JSON object MUST contain property type", () => {
    cy.get("@headers").then((response) => {
      expect(response.body).to.have.property("type");
    });
  });
  it("JSON object MUST contain property id with value application/did+ld+json", () => {
    cy.get("@headers").then((response) => {
      expect(response.body).to.have.property("id");
      expect(response.body["id"]).to.contain("application/did+ld+json");
    });
  });
});
