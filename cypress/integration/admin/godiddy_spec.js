describe("Test Scenario 13: Retrieve configuration properties", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/properties",
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return JSON object", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/properties",
    }).then((response) => {
      expect(response).to.be.a("object");
    });
  });

  it("HTTP response must contain content-type property with value", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/properties",
    }).then((response) => {
      expect(response.headers).has.property("content-type", "application/json");
    });
  });
});

describe("Test Scenario 14: Retrieve supported DID methods", () => {
  it("Test HTTP response", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/methods",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return a JSON object", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/methods",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response).to.be.a("object");
    });
  });

  it("MUST contain body of type array", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/methods",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).to.be.a("array");
    });
  });

  it("Test HTTP response", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/methods",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).to.deep.equal([
        "btcr",
        "sov",
        "v1",
        "web",
        "ethr",
        "jolo",
        "elem",
        "github",
        "key",
        "ion",
        "gatc",
        "ebsi",
        "tz",
        "pkh",
      ]);
    });
  });
});

describe("Test Scenario 15: Retrieve object of test identifiers", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/testIdentifiers",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return a JSON object", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/testIdentifiers",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response).to.be.a("object");
    });
  });

  it("MUST return a body of type object", () => {
    cy.request({
      method: "GET",
      url: "https://api.dev.godiddy.com/0.1.0/universal-resolver/testIdentifiers",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).to.be.a("object");
    });
  });
});
