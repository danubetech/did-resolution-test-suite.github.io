const endpoint = Cypress.env("ENDPOINT") + "identifiers/";


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
            'application/ld+json;profile="https://w3id.org/did-resolution"'
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

      // todo: already implemented in fixtures
      it("The scheme MUST be the value did", () => {
        cy.get("@request").then((response) => {
          expect(response.body.didDocument.id).to.be.a('string').and.satisfy(msg => msg.startsWith('did:'));
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

// todo: rewrite for fixtures!!
if (Cypress.env("TEST_410") == true) {
  describe("Test Scenario 4: Deactivated", () => {
    beforeEach(() => {
      cy.request({
        method: "GET",
        url:
            endpoint +
            "did:sov:indicio:test:16vv8izCToK4svjYjvsp4r",
        failOnStatusCode: false,
      }).as("request")
    });

    it("MUST return HTTP code 410", () => {
      cy.get("@request").then((response) => {
        expect(response.status).to.eq(410);
      });
    });

    it("MUST return a JSON object", () => {
      cy.get("@request").then((response) => {
        expect(response).to.be.a("object");
      });
    });

    it("MUST return HTTP header Content-Type", () => {
      cy.get("@request").then((response) => {
        expect(response.headers["content-type"]).to.contain(
            'application/ld+json;profile="https://w3id.org/did-resolution"'
        );
      });
    });

    it("JSON object MUST contain property didDocumentMetadata.deactivated = true", () => {
      cy.get("@request").then((response) => {
        expect(response.body.didDocumentMetadata.deactivated).to.eq(true);
      });
    });
  })
}


if (Cypress.env("TEST_404") == true) {
  describe("Test Scenario 5: Not found", () => {
    beforeEach(() => {
      cy.request({
        method: "GET",
        url: endpoint + "did:sov:0000000000000000000000",
        failOnStatusCode: false,
      }).as("request")
    });

    it("MUST return HTTP code 404", () => {
      cy.get("@request").then((response) => {
        expect(response.status).to.eq(404);
      })
    });

    it('MUST return HTTP header Content-Type with value application/ld+json;profile="https://w3id.org/did-resolution"', () => {
      cy.get("@request").then((response) => {
        expect(response.headers["content-type"]).to.contain(
            'application/ld+json;profile="https://w3id.org/did-resolution"'
        );
      })
    });

    it("MUST return a JSON object", () => {
      cy.get("@request").then((response) => {
        expect(response).to.be.a("object");
      })
    });

    it('JSON object MUST contain property didResolutionMetadata.error = "notFound"', () => {
      cy.get("@request").then((response) => {
        expect(response.body.didResolutionMetadata.error).to.eq("notFound");
      })
    });
  })
};


if (Cypress.env("TEST_400") == true) {
  describe("Test Scenario 6: Invalid DID " + endpoint, () => {
    beforeEach(() => {
      cy.request({
        method: "GET",
        url: endpoint + "did:example_222",
        failOnStatusCode: false,
      }).as("request")
    });


    it("MUST return HTTP code 400", () => {
      cy.get("@request").then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('MUST return HTTP header Content-Type with value application/ld+json;profile="https://w3id.org/did-resolution"', () => {
      cy.get("@request").then((response) => {
        expect(response.headers["content-type"]).to.contain(
            'application/ld+json;profile="https://w3id.org/did-resolution"'
        )
      });
    });


    it("MUST return a JSON object", () => {
      cy.get("@request").then((response) => {
        expect(response).to.be.a("object");
      });
    });


    it('JSON object MUST contain property didResolutionMetadata.error = "invalidDid"', () => {
      cy.get("@request").then((response) => {
        expect(response.body.didResolutionMetadata.error).to.contain(
                "invalidDid"
            );
      });
    });


    it("MUST raise invalidDid error if scheme is not did", () => {
      cy.get("@request").then((response) => {
        expect(response.statusText).to.eq("Bad Request")
      });
    });

    // todo: new!!! todo: how do we test for a verificationMethod.id? Can we just test for an invalid DID
    it.only("If verificationMethod.id is not a valid DID URL, an invalidDidUrl error MUST be raised", () => {
      cy.get("@request").then((response) => {
        expect(response.statusText).to.eq("Bad Request")
        console.log(response)
      });
    });

    // todo: new!!! todo: how do we test for an invalid controller? Can we just test for an invalid DID
    it.only("If verificationMethod.controller is not a valid DID, an invalidDid error MUST be raised.", () => {
      cy.get("@request").then((response) => {
        expect(response.statusText).to.eq("Bad Request")
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

      it("MUST return a JSON object", () => {
        cy.get("@request").then((response) => {
          expect(response).to.be.a("object");
        });
      });
    });
  });
}

if (Cypress.env("TEST_200_TK") == true) {
  describe("Test Scenario 9: DID URLs with transformKeys", () => {
    beforeEach(() => {
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
      }).as("request")
    })

    it("MUST return HTTP response status 200", () => {
      cy.get("@request").then(() => {
      }).then(response => {
        expect(response.status).to.eq(200);
      })
    });

    it("MUST return a JSON object", () => {
      cy.get("@request").then(() => {
      }).then(response => {
        expect(response).to.be.a("object");
      })
    });


    it("MUST return property verificationMethod of type JsonWebKey2020", () => {
      cy.get("@request").then(() => {
      }).then(response => {
        expect(response).to.be.a("object");
      })
    });


    it("MUST return HTTP header with Content-Type", () => {
      cy.get("@request").then(() => {
      }).then(response => {
        expect(response.headers["content-type"]).contains(
            "application/did+ld+json"
        );
      })
    });

    // todo: change in fixtures!!
    it("MUST return property id with value did:sov:WRfXPg8dantKVubE3HX8pw", () => {
      cy.get("@request").then(() => {
      }).then(response => {
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
    beforeEach(() => {
      cy.request({
        method: "GET",
        url:
            endpoint +
            "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionTime=2018-12-10T02:22:49Z",
        headers: {
          Accept: "application/did+ld+json",
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
        failOnStatusCode: false,
      }).as("request")
    });


    it("MUST return HTTP response status 200", () => {
      cy.get("@request").then(() => {
      }).then(response => {
        expect(response.status).to.eq(200);
      })
    });


    it("MUST return JSON object", () => {
      cy.get("@request").then(() => {
      }).then(response => {
        expect(response).to.be.a("object");
      })
    });


    it("MUST contain property @context", () => {
      cy.get("@request").then(() => {
      }).then(response => {
        expect(response.body).to.have.property("@context");
      })
    });

    // todo: remove hardcode
    it("MUST contain property id with value ", () => {
      cy.get("@request").then(() => {
      }).then(response => {
        expect(response.body).has.property(
            "id",
            "did:sov:DjxRxnL4gXsncbH8jM8ySM"
        );
      })
    });
  });
};

if (Cypress.env("TEST_200_VI") == true) {
  describe("Test Scenario 11: DID URLs with versionId parameter", () => {
    beforeEach(() => {
      cy.request({
        method: "GET",
        url:
            endpoint + "did:sov:DjxRxnL4gXsncbH8jM8ySM?versionId=105",
        headers: {
          Accept: "application/did+ld+json",
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
        failOnStatusCode: false,
      }).as("request")
    });


    it("MUST return HTTP response status 200", () => {
      cy.get("@request").then(() => {
      }).then(response => {
        expect(response.status).to.eq(200);
      })
    });

    it("MUST return JSON object", () => {
      cy.get("@request").then(() => {
      }).then((response) => {
        expect(response).to.be.a("object");
      });
    });

    it("JSON object MUST contain property @context", () => {
      cy.get("@request").then(() => {
      }).then((response) => {
        expect(response.body).to.have.property("@context");
      });
    });

    it("MUST return HTTP header with Content-Type", () => {
      cy.get("@request").then(() => {
      }).then((response) => {
        expect(response.headers["content-type"]).contains(
            "application/did+ld+json"
        );
      });
    });

    it("MUST contain property id", () => {
      cy.get("@request").then(() => {
      }).then((response) => {
        expect(response.body).has.property(
            "id",
            "did:sov:DjxRxnL4gXsncbH8jM8ySM"
        );
      });
    });
  });
};

if (Cypress.env("TEST_200_DURL") == true) {
  describe("Test Scenario 12: Resolve a DID / dereference a DID URL", () => {
    beforeEach(() => {
      cy.request({
        method: "GET",
        url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
        headers: { Accept: "application/json" },
        failOnStatusCode: false,
      }).as("request")
    });

    it("MUST return HTTP response status 200", () => {
      cy.get("@request").then(() => {
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

      it("MUST return HTTP header with Content-Type", () => {
        cy.get("@request").then(() => {
        }).then((response) => {
          expect(response.headers["content-type"]).contains(
            "application/did+json;charset=utf-8"
        );
      });
    });

    it("MUST contain property id", () => {
      cy.get("@request").then(() => {
      }).then((response) => {
        expect(response.body).has.property(
          "id",
          "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx"
        );
      });
    });

    it("MUST contain property keyAgreement", () => {
      cy.get("@request").then(() => {
      }).then((response) => {
        expect(response.body["keyAgreement"][0]).to.contain(
          "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx"
        );
      });
    });
  });
}

if (Cypress.env("TEST_200_DRURL") == true) {
  describe.only("Test Scenario 12B: Resolve a DID / dereference a DID URL", () => {
    beforeEach( () => {
      cy.request({
        method: "GET",
        url: endpoint + "did:sov:builder:VbPQNHsvoLZdaNU7fTBeFx",
        headers: {
          Accept:
            'application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/"',
          Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
        },
        failOnStatusCode: false,
      }).as("request")
    });

    it("MUST return HTTP response status 200", () => {
      cy.get("@request").then(() => {
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });


    it("HTTP response must contain content-type property with value application/did+json;charset=utf-8", () => {
      cy.get("@request").then(() => {
      }).then((response) => {
        expect(response.headers["content-type"]).contains(
          'application/ld+json; profile="https://w3c-ccg.github.io/did-resolution/"'
        );
      });
    });
  });
}
