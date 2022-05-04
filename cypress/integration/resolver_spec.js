const endpoint = Cypress.env("ENDPOINT");

if (Cypress.env("TEST_200") == true) {
  describe(
    "Test Scenario 1: DID Resolution Result overview: " + endpoint,
    () => {
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

      it("MUST return a JSON object", () => {
        cy.get("@request").then((response) => {
          expect(response).to.be.a("object");
        });
      });

      it('Should have header with Content-Type with value application/ld+json;profile="https://w3id.org/did-resolution" ', () => {
        cy.get("@request").then((response) => {
          expect(response.headers["content-type"].replace(/\s+/g, "")).contains(
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
    }
  );
}

if (Cypress.env("TEST_200_JLD") == true) {
  describe("Test Scenario 2: JSON-LD DID document", () => {
    beforeEach(() => {
      cy.request({
        method: "GET",
        url: endpoint + "did:sov:WRfXPg8dantKVubE3HX8pw",
        headers: { Accept: "application/did+ld+json" },
      }).as("request");
    });

    it("Should have response status 200", () => {
      cy.get("@request").then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("MUST return a JSON object", () => {
      cy.get("@request").then((response) => {
        expect(response).to.be.a("object");
      });
    });

    it("Should have header with content type", () => {
      cy.get("@request").then((response) => {
        expect(response.headers["content-type"]).to.contain(
          "application/did+ld+json"
        );
      });
    });

    it("Should not have property didDocument", () => {
      cy.get("@request").then((response) => {
        expect(response.body).not.to.have.property("didDocument");
      });
    });

    it("Should have property @context", () => {
      cy.get("@request").then((response) => {
        expect(response.body).to.have.property("@context");
      });
    });
  });
}
if (Cypress.env("TEST_200_CBOR") == true) {
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
}

if (Cypress.env("TEST_406") == true) {
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
}

//todo: fix bug here, when Cihan is back!
if (Cypress.env("TEST_410") == true) {
  describe("Test Scenario 4: Deactivated", () => {
    // DEBUG doesn't return 410 but 404 or 200
    it("MUST return HTTP code 410", () => {
      cy.request({
        method: "GET",
        url:
          endpoint +
          "did:kilt:4r6RdVMNes2eEobxyxH7aVsesUqR2X175sUAXJfo7dEWxHUS",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(410);
      });
    });

    it("MUST return a JSON object", () => {
      cy.request({
        method: "GET",
        url:
          endpoint +
          "did:kilt:4r6RdVMNes2eEobxyxH7aVsesUqR2X175sUAXJfo7dEWxHUS",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response).to.be.a("object");
      });
    });

    it("MUST return HTTP header Content-Type", () => {
      cy.request({
        method: "GET",
        url:
          endpoint +
          "did:kilt:4r6RdVMNes2eEobxyxH7aVsesUqR2X175sUAXJfo7dEWxHUS",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.headers["content-type"]).to.contain(
          'application/ld+json;profile="https://w3id.org/did-resolution"'
        );
      });
    });
    // DEBUG doesn't show didDocumentMetadata.deactivated
    it("JSON object MUST contain property didDocumentMetadata.deactivated = true", () => {
      cy.request({
        method: "GET",
        url:
          endpoint +
          "did:ion:test:EiCkgg9f7jPCwlALgUapUJgLI3UsS7cRAjENMjOpIvhMgg",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.didDocumentMetadata.deactivated).to.eq(true);
      });
    });
  });
}

if (Cypress.env("TEST_404") == true) {
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

    it("MUST return a JSON object", () => {
      cy.request({
        method: "GET",
        url: endpoint + "did:sov:0000000000000000000000",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response).to.be.a("object");
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
}

if (Cypress.env("TEST_400") == true) {
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

    it("MUST return a JSON object", () => {
      cy.request({
        method: "GET",
        url: endpoint + "did:example_222",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response).to.be.a("object");
      });
    });

    //todo: watch out made a softer assertion here
    it('JSON object MUST contain property didResolutionMetadata.error = "invalidDid"', () => {
      cy.request({
        method: "GET",
        url: endpoint + "did:example_222",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.didResolutionMetadata.error).to.contain(
          "invalidDid"
        );
      });
    });
  });
}

if (Cypress.env("TEST_200_F") == true) {
  describe("Test Scenario 7: DID URLs with fragments", () => {
    beforeEach(() => {
      cy.request({
        method: "GET",
        url: endpoint + "did%3Asov%3AWRfXPg8dantKVubE3HX8pw%23key-1",
        headers: { Accept: "application/did+ld+json" },
        failOnStatusCode: false,
      }).as("request");
    });

    it("Must return HTTP code 200", () => {
      cy.get("@request").then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("MUST return a JSON object", () => {
      cy.get("@request").then((response) => {
        expect(response).to.be.a("object");
      });
    });

    it("MUST return HTTP header Content-Type with value application/did+ld+json", () => {
      cy.get("@request").then((response) => {
        expect(response.headers["content-type"]).to.contain(
          "application/did+ld+json"
        );
      });
    });
    it("JSON object MUST NOT contain property didDocument", () => {
      cy.get("@request").then((response) => {
        expect(response.body).not.to.have.property("didDocument");
      });
    });

    it("JSON object MUST contain property @context", () => {
      cy.get("@request").then((response) => {
        expect(response.body).to.have.property("@context");
      });
    });

    it("JSON object MUST contain property type", () => {
      cy.get("@request").then((response) => {
        expect(response.body).to.have.property("type");
      });
    });
    it("JSON object MUST contain property id with value application/did+ld+json", () => {
      cy.get("@request").then((response) => {
        expect(response.body).to.have.property("id");
        expect(response.body["id"]).to.contain(
          "did:sov:WRfXPg8dantKVubE3HX8pw#key-1"
        );
      });
    });
  });
}

if (Cypress.env("TEST_200_RP") == true) {
  describe.only("Test Scenario 8: Service and relativeRef parameters", () => {
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

      it("MUST return a JSON object", () => {
        cy.get("@request").then((response) => {
          expect(response).to.be.a("object");
        });
      });
    });
  });
}

//todo: gives error in GODIDDY
if (Cypress.env("TEST_200_TK") == true) {
  describe("Test Scenario 9: DID URLs with transformKeys", () => {
    it("MUST return HTTP response status 200", () => {
      cy.request({
        method: "GET",
        url:
          endpoint +
          "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
        headers: {
          Accept: "application/did+ld+json",
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
        failOnStatusCode: false,
      }).then((response) => {
        console.log(response);
        expect(response.status).to.eq(200);
      });
    });

    it("MUST return a JSON object", () => {
      cy.request({
        method: "GET",
        url:
          endpoint +
          "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
        headers: {
          Accept: "application/did+ld+json",
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
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
        headers: {
          Accept: "application/did+ld+json",
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
        failOnStatusCode: false,
      }).then((response) => {
        response.body.verificationMethod.forEach((out) => {
          expect(out).has.property("type", "JsonWebKey2020");
        });
      });
    });

    it("MUST return HTTP header with Content-Type", () => {
      cy.request({
        method: "GET",
        url:
          endpoint +
          "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
        headers: {
          Accept: "application/did+ld+json",
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.headers["content-type"]).contains(
          "application/did+ld+json"
        );
      });
    });

    it("MUST return property id with value did:sov:WRfXPg8dantKVubE3HX8pw", () => {
      cy.request({
        method: "GET",
        url:
          endpoint +
          "did:sov:WRfXPg8dantKVubE3HX8pw?transformKeys=JsonWebKey2020",
        headers: {
          Accept: "application/did+ld+json",
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body).has.property(
          "id",
          "did:sov:WRfXPg8dantKVubE3HX8pw"
        );
      });
    });
  });
}

if (Cypress.env("TEST_200_VT") == true) {
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
        expect(response.headers["content-type"]).contains(
          "application/did+ld+json"
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
}

if (Cypress.env("TEST_200_VI") == true) {
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
        expect(response.headers["content-type"]).contains(
          "application/did+ld+json"
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
}

if (Cypress.env("TEST_200_DURL") == true) {
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
        expect(response.headers["content-type"]).contains(
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
}
//todo: HEADER IS NOT ACCEPTED WHY?
if (Cypress.env("TEST_200_DRURL") == true) {
  describe("Test Scenario 12B: Resolve a DID / dereference a DID URL", () => {
    it("MUST return HTTP response status 200", () => {
      cy.request({
        method: "GET",
        url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
        headers: {
          Accept:
            'application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/"',
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
        failOnStatusCode: false,
      }).then((response) => {
        console.log(response);
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
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.headers["content-type"]).contains(
          'application/ld+json; profile="https://w3c-ccg.github.io/did-resolution/"'
        );
      });
    });
  });
}
