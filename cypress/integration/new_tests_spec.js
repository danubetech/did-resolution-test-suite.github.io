const endpoint = Cypress.env("ENDPOINT");

describe.skip("Test Scenario 2b: CBOR DID document: " + endpoint, () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:WRfXPg8dantKVubE3HX8pw",
      headers: { Accept: "application/did+cbor" },
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response);
      expect(response.status).to.eq(200);
    });
  });
});

describe.skip("Test Scenario 8: Service and relativeRef parameters", () => {
  it("MUST return HTTP response status 303", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:web:danubetech.com?service=github&relativeRef=did-method-dns",
      headers: { Accept: "text/uri-list" },
      failOnStatusCode: false,
    }).as("response");

    it("MUST return HTTP response status equals 300", () => {
      cy.get("@response").then((response) => {
        expect(response.status).to.eq(303);
      });
    });
  });
});

describe("Test Scenario 9: DID URLs with transformKeys", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "text/uri-list" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return HTTP header with Content-Type", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "text/uri-list" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers["content-type"]).to.contain("application/json");
    });
  });

  it("MUST contain property @context", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "text/uri-list" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).to.have.property("@context");
    });
  });
});

describe("Test Scenario 10: DID URLs with versionTime parameter", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionTime=2018-12-10T02:22:49Z",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return HTTP header with Content-Type", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionTime=2018-12-10T02:22:49Z",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers["content-type"]).to.contain("application/json");
    });
  });
  it("MUST contain property @context", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionTime=2018-12-10T02:22:49Z",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response);
      expect(response.body).to.have.property("@context");
    });
  });
});

describe("Test Scenario 11: DID URLs with versionId parameter", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "application/did+ld+json;charset=utf-8" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return HTTP header with Content-Type", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "application/did+ld+json;charset=utf-8" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers["content-type"]).to.contain("application/json");
    });
  });
  it("MUST contain property id", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "application/did+ld+json;charset=utf-8" },
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response);
      expect(response.body).to.have.property("id");
    });
  });

  it("MUST contain property timestamp", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "application/did+ld+json;charset=utf-8" },
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response.body);
      expect(response.body).to.have.property("timestamp");
    });
  });
});

describe("Test Scenario 12: Resolve a DID / dereference a DID URL", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
      headers: { Accept: "application/json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return HTTP header with Content-Type", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
      headers: { Accept: "application/json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers["content-type"]).to.contain(
        "application/did+json;charset=utf-8"
      );
    });
  });
  it("MUST contain property id", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
      headers: { Accept: "application/json" },
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response);
      expect(response.body).to.have.property("id");
    });
  });

  it("MUST contain property authentication", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
      headers: { Accept: "application/json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body["authentication"][0]).to.contain(
        "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx"
      );
    });
  });

  it("MUST contain property assertionMethod", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
      headers: { Accept: "application/json" },
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response);
      expect(response.body["assertionMethod"][0]).to.contain(
        "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx"
      );
    });
  });

  it("MUST contain property keyAgreement", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
      headers: { Accept: "application/json" },
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response);
      expect(response.body["keyAgreement"][0]).to.contain(
        "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx"
      );
    });
  });
});

describe("Test Scenario 12B: Resolve a DID / dereference a DID URL", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

describe("Test Scenario 12C: Resolve a DID / dereference a DID URL", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
      headers: {
        Accept:
          'application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/"',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

describe.only("Test Scenario 13: Retrieve configuration properties", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "properties",
      headers: {
        Accept:
          'application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/"',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

describe.only("Test Scenario 14: Retrieve supported DID methods", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "methods",
      headers: {
        Accept: "application/did+json",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
