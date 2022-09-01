const endpoint = Cypress.env("ENDPOINT") + "identifiers/";
const path_example_dids = "../fixtures/example_dids.json";

// todo: remove this repo and merge to did-resolution-test-suite
// todo: more descriptive names or split groups of tests into files?
if (Cypress.env("TEST_200") == true) {
  describe(
    "Test Scenario 1: DID Resolution Result fixtures: " + endpoint,
    () => {
      it("A correct DID can be resolved", () => {
        cy.clearCookies();
        cy.fixture(path_example_dids)
          .its("normalDids")
          .then((list) => {
            Object.keys(list).forEach((key) => {
              const normalDid = list[key];
              cy.request({
                method: "GET",
                url: endpoint + normalDid,
                failOnStatusCode: false,
              }).as("request");
              cy.get("@request").then((response) => {
                expect(response.status).to.eq(200);
              });
              cy.get("@request").then((response) => {
                expect(
                  response.headers["content-type"].replace(/\s+/g, "")
                ).contains(
                  'application/ld+json;profile="https://w3id.org/did-resolution'
                );
              });
              cy.get("@request").then((response) => {
                expect(response).to.be.a("object");
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
              cy.get("@request").then((response) => {
                expect(response.body.didDocument.id)
                  .to.be.a("string")
                  .and.satisfy((msg) => msg.startsWith("did:"));
              });
            });
          });
      });
    }
  );
}

if (Cypress.env("TEST_200_JLD") == true) {
  describe("Test Scenario 2: JSON-LD DID document", () => {
    it("A correct DID can be resolved with header input", () => {
      cy.fixture(path_example_dids)
        .its("normalDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const normalDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + normalDid,
              headers: { Accept: "application/did+ld+json" },
              failOnStatusCode: false,
            }).as("request");
            cy.get("@request").then((response) => {
              expect(response.status).to.eq(200);
              expect(response.headers["content-type"]).to.contain(
                "application/did+ld+json"
              );
              cy.get("@request").then((response) => {
                expect(response).to.be.a("object");
              });
              expect(response.body).not.to.have.property("didDocument");
              expect(response.body["id"]).to.contain(normalDid);
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_200JLD") == true) {
  describe("Test Scenario 2b: CBOR DID document: " + endpoint, () => {
    it("MUST return HTTP response status 200", () => {
      cy.fixture(path_example_dids)
        .its("normalDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const normalDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + normalDid,
              headers: { Accept: "application/did+cbor" },
              failOnStatusCode: false,
            }).as("request");
            cy.get("@request").then((response) => {
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
}

if (Cypress.env("TEST_406") == true) {
  describe("Test Scenario 3: Representation not supported", () => {
    it("Shows an error when a representation is prompted", () => {
      cy.fixture(path_example_dids)
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
              console.log(response);
              expect(response.body.dereferencingMetadata.error).to.eq(
                '"representationNotSupported"'
              );
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_410") == true) {
  describe("Test Scenario 4: Deactivated", () => {
    it("Returns an HTTP code of 410 for deactivated DIDs", () => {
      cy.fixture(path_example_dids)
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
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
              expect(response.body.didDocumentMetadata.deactivated).to.eq(true);
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_404") == true) {
  describe("Test Scenario 5: Not found", () => {
    it("Returns an HTTP code of 404 for non-existent DIDs", () => {
      cy.fixture(path_example_dids)
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
              expect(response).to.be.a("object");
              expect(response.body.didResolutionMetadata.error).to.eq(
                "notFound"
              );
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_400A") == true) {
  describe("Test Scenario 6A: Invalid DID", () => {
    it("Returns a HTTP code of 400 for an invalid DID", () => {
      cy.fixture(path_example_dids)
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
              expect(response).to.be.a("object");
              expect(response.body.didResolutionMetadata.error).contains(
                "invalidDid"
              );
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_400B") == true) {
  describe("Test Scenario 6B: method not supported DIDs", () => {
    it("Raises an error for unsupported DID methods", () => {
      cy.fixture(path_example_dids)
        .its("methodNotSupportedDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const invalidDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + invalidDid,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response.body.didResolutionMetadata.error).contains(
                "methodNotSupported"
              );
              expect(response).to.be.a("object");
              // todo: should this be 404 or 400?
              expect(response.status).to.eq(400); // returns 501
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
            });
          });
        });
    });
  });
}
// test
if (Cypress.env("TEST_400C") == true) {
  describe("Test Scenario 6C: invalid verificationMethod.id", () => {
    it("Raises error when verificationMethod.id is invalid", () => {
      cy.fixture(path_example_dids)
        .its("invalidVerificationMethodId")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const invalidDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + invalidDid,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
              // todo: should this be 404 or 400?
              expect(response.status).to.eq(400); // return 200
              expect(response.body.didResolutionMetadata.error).contains(
                "invalidDidUrl"
              ); // doesn't exist
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_400D") == true) {
  describe("Test Scenario 6D: invalid verificationMethod.controller", () => {
    it("Raises error when verificationMethod.controller is invalid", () => {
      cy.fixture(path_example_dids)
        .its("invalidVerificationMethodController")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const invalidDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + invalidDid,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
              // todo: should this be 404 or 400?
              expect(response.status).to.eq(400); // returns 200
              expect(response.body.didResolutionMetadata.error).contains(
                "invalidDid"
              ); // doesn't exist
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_400E") == true) {
  describe("Test Scenario 6E: invalid didDocument.id", () => {
    it("Raises error when didDocument.id is invalid", () => {
      cy.fixture(path_example_dids)
        .its("invalidDidDocumentId")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const invalidDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + invalidDid,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
              expect(response.status).to.eq(400);
              expect(response.body.didResolutionMetadata.error).contains(
                "invalidDid"
              );
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_400F") == true) {
  describe("Test Scenario 6F: Invalid didDocument scheme", () => {
    it("Raises invalidDid error when if scheme is not did", () => {
      cy.fixture(path_example_dids)
        .its("invalidDidScheme")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const invalidDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + invalidDid,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
              expect(response.status).to.eq(400);
              expect(response.body.didResolutionMetadata.error).contains(
                "invalidDid"
              );
            });
          });
        });
    });
  });
}
if (Cypress.env("TEST_400G") == true) {
  describe("Test Scenario 6G: notAllowedLocalDerivedKey error/warning", () => {
    it("Raises notAllowedLocalDerivedKey error when did is incorrect", () => {
      cy.fixture(path_example_dids)
        .its("notAllowedLocalDerivedKey")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const invalidDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + invalidDid,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
              expect(response.status).to.eq(400);
              expect(response.body.didResolutionMetadata.error).contains(
                "notAllowedLocalDerivedKey"
              );
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_400H") == true) {
  describe("Test Scenario 6H: notAllowedLocalDuplicateKey error/warning", () => {
    it("Raises notAllowedLocalDuplicateKey error when did is incorrect", () => {
      cy.fixture(path_example_dids)
        .its("invalidDidDocumentId")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const invalidDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + invalidDid,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
              expect(response.status).to.eq(400);
              expect(response.body.didResolutionMetadata.error).contains(
                "notAllowedLocalDuplicateKey"
              );
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_400I") == true) {
  describe("Test Scenario 6I: notAllowedKeyType error/warning", () => {
    it("Raises notAllowedKeyType error when did is incorrect", () => {
      cy.fixture(path_example_dids)
        .its("invalidDidDocumentId")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const invalidDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + invalidDid,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
              expect(response.status).to.eq(400);
              expect(response.body.didResolutionMetadata.error).contains(
                "notAllowedKeyType"
              );
            });
          });
        });
    });
  });
}

//todo: is this the same as methodNotSupported?
if (Cypress.env("TEST_400J") == true) {
  describe("Test Scenario 6J: notAllowedMethod error/warning", () => {
    it("Raises notAllowedMethod error when did is incorrect", () => {
      cy.fixture(path_example_dids)
        .its("notAllowedMethod")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const invalidDid = list[key];
            cy.request({
              method: "GET",
              url: endpoint + invalidDid,
              failOnStatusCode: false,
            }).then((response) => {
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).to.contain(
                'application/ld+json;profile="https://w3id.org/did-resolution"'
              );
              expect(response.status).to.eq(400);
              expect(response.body.didResolutionMetadata.error).contains(
                "notAllowedMethod"
              );
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_200_F") == true) {
  describe("Test Scenario 7: DID URLs with fragments", () => {
    it("Can resolve a DID with a fragment", () => {
      cy.fixture(path_example_dids)
        .its("fragmentDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const fragmentDid = list[key];

            cy.request({
              method: "GET",
              url: endpoint + fragmentDid,
              failOnStatusCode: false,
              headers: {
                Accept: "application/did+ld+json",
                Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
              },
            }).as("request");

            cy.get("@request").then((response) => {
              expect(response.status).to.eq(200);
              expect(response.headers["content-type"]).to.contain(
                "application/did+ld+json"
              );
              expect(response.body).not.to.have.property("didDocument");
              expect(response.body).to.have.property("id");
              expect(response.body["id"]).to.contain(
                decodeURIComponent(fragmentDid.split("#")[0])
              );
            });
          });
        });
    });
  });
}

// test
if (Cypress.env("TEST_200_RP") == true) {
  describe("Test Scenario 8: Service and relativeRef parameters", () => {
    it("Fetches DID", () => {
      cy.fixture(path_example_dids)
        .its("relativeParamDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const fragmentDid = list[key];
            console.log("FRAGMENT DID IS", fragmentDid);
            cy.request({
              method: "GET",
              url: endpoint + fragmentDid,
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
    });
  });
}

if (Cypress.env("TEST_200_TK") == true) {
  describe("Test Scenario 9: DID URLs with transformKeys", () => {
    it("MUST return HTTP response status 200", () => {
      cy.fixture(path_example_dids)
        .its("transformKeyDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const transformKeyDid = list[key];

            cy.request({
              method: "GET",
              url: endpoint + transformKeyDid,
              headers: {
                Accept: "application/did+ld+json",
                Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
              },
              failOnStatusCode: false,
            }).as("request");

            cy.get("@request").then((response) => {
              expect(response.status).to.eq(200);
              expect(response).to.be.a("object");
              response.body.verificationMethod.forEach((out) => {
                expect(out)
                  .has.property("type")
                  .to.be.oneOf([
                    "JsonWebKey2020",
                    "Ed25519VerificationKey2018",
                    "X25519KeyAgreementKey2019",
                  ]);
              });
              expect(response.headers["content-type"]).contains(
                "application/did+ld+json"
              );
              expect(response.body).has.property(
                "id",
                decodeURIComponent(transformKeyDid.split("?")[0].split("#")[0])
              );
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_200_VT") == true) {
  describe("Test Scenario 10: DID URLs with versionTime parameter", () => {
    it("MUST return HTTP response status 200", () => {
      cy.fixture(path_example_dids)
        .its("versionTimeDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const versionTimeDid = list[key];

            cy.request({
              method: "GET",
              url: endpoint + versionTimeDid,
              headers: {
                Accept: "application/did+ld+json",
                Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
              },
              failOnStatusCode: false,
            }).as("request");

            cy.get("@request").then((response) => {
              expect(response.status).to.eq(200);
              expect(response.headers["content-type"]).contains(
                "application/did+ld+json"
              );
              expect(response).to.be.a("object");
              expect(response.body)
                .has.property("id")
                .contains("did:sov:DjxRxnL4gXsncbH8jM8ySM");
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_200_VI") == true) {
  describe("Test Scenario 11: DID URLs with versionId parameter", () => {
    it("MUST return HTTP response status 200", () => {
      cy.fixture(path_example_dids)
        .its("versionIdDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const versionIdDid = list[key];

            cy.request({
              method: "GET",
              url: endpoint + versionIdDid,
              headers: {
                Accept: "application/did+ld+json",
                Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
              },
              failOnStatusCode: false,
            }).as("request");

            cy.get("@request").then((response) => {
              expect(response.status).to.eq(200);
              expect(response).to.be.a("object");
              expect(response.headers["content-type"]).contains(
                "application/did+ld+json"
              );
              expect(response.body)
                .has.property("id")
                .contains(decodeURIComponent(versionIdDid.split("?")[0]));
            });
          });
        });
    });
  });
}

if (Cypress.env("TEST_200_DURL") == true) {
  describe("Test Scenario 12: Resolve a DID / dereference a DID URL", () => {
    it("MUST return HTTP response status 200", () => {
      cy.fixture(path_example_dids)
        .its("normalDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const normalDid = list[key];

            cy.request({
              method: "GET",
              url: endpoint + normalDid,
              headers: { Accept: "application/json" },
              failOnStatusCode: false,
            }).as("request");

            cy.get("@request").then((response) => {
              console.log("normal did is:", normalDid);

              expect(response.status).to.eq(200);
              expect(response.headers["content-type"]).contains(
                "application/did+json;charset=utf-8"
              );
              expect(response.body).has.property("id", normalDid);
              // expect(response.body["keyAgreement"][0]).to.contain(normalDid);
            });
          });
        });
    });
  });
}

// todo: header is not accepted?
if (Cypress.env("TEST_200_DRURL") == true) {
  describe("Test Scenario 12B: Resolve a DID / dereference a DID URL", () => {
    it("MUST return HTTP response status 200", () => {
      cy.fixture(path_example_dids)
        .its("normalDids")
        .then((list) => {
          Object.keys(list).forEach((key) => {
            const normalDid = list[key];

            cy.request({
              method: "GET",
              url: endpoint + normalDid,
              headers: {
                Accept:
                  'application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/"',
              },
              failOnStatusCode: false,
            }).as("request");

            cy.get("@request").then((response) => {
              console.log("normal did is:", normalDid);
              expect(response.status).to.eq(200);
              expect(response.headers["content-type"]).contains(
                'application/ld+json; profile="https://w3c-ccg.github.io/did-resolution/"'
              );
            });
          });
        });
    });
  });
}
