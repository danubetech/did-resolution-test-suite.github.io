const { softExpect } = chai;

const endpoint = Cypress.env("ENDPOINT");

describe("Test Scenario 2b: CBOR DID document: " + endpoint, () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:WRfXPg8dantKVubE3HX8pw",
      headers: { Accept: "application/did+cbor" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

describe("Test Scenario 8: Service and relativeRef parameters", () => {
  it("Fetches DID", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:web:danubetech.com?service=github&relativeRef=did-method-dns",
      headers: { Accept: "text/uri-list" },
      failOnStatusCode: false,
    }).as("response");

    it("MUST return HTTP response status equals 303", () => {
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
      url:
        endpoint +
        "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return a JSON object", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response).to.be.a("object");
    });
  });

  it("MUST return property verificationMethod of type JsonWebKey2020", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.verificationMethod[0]).has.property(
        "type",
        "JsonWebKey2020"
      );
    });
  });

  it("MUST return HTTP header with Content-Type", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers).has.property(
        "content-type",
        "application/did+ld+json;charset=utf-8"
      );
    });
  });

  it("MUST return property id with value did:sov:WRfXPg8dantKVubE3HX8pw", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).has.property(
        "id",
        "did:sov:WRfXPg8dantKVubE3HX8pw"
      );
    });
  });

  it("MUST return property assertionMethod with value did:sov:WRfXPg8dantKVubE3HX8pw#key-1", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.assertionMethod[0]).to.eq(
        "did:sov:WRfXPg8dantKVubE3HX8pw#key-1"
      );
    });
  });

  it("MUST return property authentication with value did:sov:WRfXPg8dantKVubE3HX8pw#key-1", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.authentication[0]).to.eq(
        "did:sov:WRfXPg8dantKVubE3HX8pw#key-1"
      );
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
      expect(response.headers["content-type"]).to.contain(
        "application/did+ld+json;charset=utf-8"
      );
    });
  });

  it("MUST return JSON object", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionTime=2018-12-10T02:22:49Z",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response).to.be.a("object");
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
      expect(response.body).to.have.property("@context");
    });
  });

  it("MUST contain property id with value ", () => {
    cy.request({
      method: "GET",
      url:
        endpoint +
        "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionTime=2018-12-10T02:22:49Z",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).has.property(
        "id",
        "did:sov:DjxRxnL4gXsncbH8jM8ySM"
      );
    });
  });
});

describe("Test Scenario 11: DID URLs with versionId parameter", () => {
  it("MUST return HTTP response status 200", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("MUST return JSON object", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response).to.be.a("object");
    });
  });

  it("JSON object MUST contain property @context", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "application/did+ld+json" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).to.have.property("@context");
    });
  });

  it("MUST return HTTP header with Content-Type", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "application/did+ld+json;charset=utf-8" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers["content-type"]).to.contain(
        "application/did+ld+json;charset=utf-8"
      );
    });
  });

  it("MUST contain property id", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
      headers: { Accept: "application/did+ld+json;charset=utf-8" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body).has.property(
        "id",
        "did:sov:DjxRxnL4gXsncbH8jM8ySM"
      );
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
      expect(response.headers).has.property(
        "content-type",
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
      expect(response.body).has.property(
        "id",
        "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx"
      );
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
      headers: {
        Accept:
          'application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/"',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("HTTP response must contain content-type property with value application/did+json;charset=utf-8", () => {
    cy.request({
      method: "GET",
      url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
      headers: {
        Accept:
          'application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/"',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.headers).has.property(
        "content-type",
        'application/ld+json; profile="https://w3c-ccg.github.io/did-resolution/"'
      );
    });
  });
});

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
      expect(response.headers).has.property(
        "content-type",
        "application/json;charset=utf-8"
      );
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
