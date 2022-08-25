const endpoint = Cypress.env("ENDPOINT") + "identifiers/";

if (Cypress.env("TEST_200") == true) {
    describe.only(
        "Test Scenario 1: DID Resolution Result fixtures: " + endpoint,
        () => {
            it("A correct DID can be resolved", () => {
                cy.fixture("../fixtures/example_dids.json")
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
                                console.log(response)
                            });

                            cy.get("@request").then((response) => {
                                expect(
                                    response.headers["content-type"].replace(/\s+/g, "")
                                ).contains(
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

                            cy.get("@request").then((response) => {
                                expect(response.body.didDocument.id).to.be.a('string').and.satisfy(msg => msg.startsWith('did:'));                            });
                        });
                    });
            });
        }
    );
}

if (Cypress.env("TEST_200_JLD") == true) {
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
                            failOnStatusCode: false,
                        }).as("request");
                        cy.get("@request").then((response) => {
                            expect(response.status).to.eq(200);
                            expect(response.headers["content-type"]).to.contain(
                                "application/did+ld+json"
                            );
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
            cy.fixture("../fixtures/example_dids.json")
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
}

if (Cypress.env("TEST_410") == true) {
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
                            expect(response.body.didResolutionMetadata.error).to.eq(
                                "notFound"
                            );
                        });
                    });
                });
            });
        });
    }

if (Cypress.env("TEST_400B") == true) {
    describe("Test Scenario 6A: Invalid DID", () => {
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
                            expect(response.body.didResolutionMetadata.error).contains(
                                "invalidDid"
                            );
                            // todo: modify
                            expect(response.statusText).to.eq("Bad Request")
                            console.log(response)
                        });
                    });
                });
            });
        });
    }

// todo: change env variable here
if (Cypress.env("TEST_400B") == true) {
    describe("Test Scenario 6B: method not supported DIDs", () => {
        it("Returns a HTTP code of 400 for an invalid DID", () => {
            cy.fixture("../fixtures/example_dids.json")
                .its("methodNotSupportedDids")
                .then((list) => {
                    Object.keys(list).forEach((key) => {
                        const invalidDid = list[key];
                        cy.request({
                            method: "GET",
                            url: endpoint + invalidDid,
                            failOnStatusCode: false,
                        }).then((response) => {
                            // todo: should this be 404 or 400? was 400 before
                            expect(response.status).to.eq(404);
                            expect(response.headers["content-type"]).to.contain(
                                'application/ld+json;profile="https://w3id.org/did-resolution"'
                            );
                            expect(response.body.didResolutionMetadata.error).contains(
                                "notFound"
                            );
                            // todo: is this the correct assertion?
                            expect(response.statusText).to.eq("Not Found")
                        });
                    });
                });
            });
        });
    }

// todo: invalid verificationmethod.id
if (Cypress.env("TEST_400B") == true) {
    describe("Test Scenario 6C: method not supported DIDs", () => {
        it("Returns a HTTP code of 400 for an invalid DID", () => {
            cy.fixture("../fixtures/example_dids.json")
                .its("invalidVerificationMethodId")
                .then((list) => {
                    Object.keys(list).forEach((key) => {
                        const invalidDid = list[key];
                        cy.request({
                            method: "GET",
                            url: endpoint + invalidDid,
                            failOnStatusCode: false,
                        }).then((response) => {
                            // todo: should this be 404 or 400? was 400 before
                            expect(response.status).to.eq(404);
                        });
                    });
                });
            });
        });
    }

// todo: invalid verificationmethod.controller
if (Cypress.env("TEST_400B") == true) {
    describe("Test Scenario 6D: method not supported DIDs", () => {
        it("Returns a HTTP code of 400 for an invalid DID", () => {
            cy.fixture("../fixtures/example_dids.json")
                .its("invalidVerificationMethodController")
                .then((list) => {
                    Object.keys(list).forEach((key) => {
                        const invalidDid = list[key];
                        cy.request({
                            method: "GET",
                            url: endpoint + invalidDid,
                            failOnStatusCode: false,
                        }).then((response) => {
                            // todo: should this be 404 or 400? was 400 before
                            expect(response.status).to.eq(404);
                        });
                    });
                });
            });
        });
    }



if (Cypress.env("TEST_200_F") == true) {
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
if (Cypress.env("TEST_200_RP") == true) {
    describe("Test Scenario 8: Service and relativeRef parameters", () => {
        it("Fetches DID", () => {
            cy.fixture("../fixtures/example_dids.json")
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
            cy.fixture("../fixtures/example_dids.json")
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
            cy.fixture("../fixtures/example_dids.json")
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
            cy.fixture("../fixtures/example_dids.json")
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
            cy.fixture("../fixtures/example_dids.json")
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

if (Cypress.env("TEST_200_DRURL") == true) {
    describe("Test Scenario 12B: Resolve a DID / dereference a DID URL", () => {
        it("MUST return HTTP response status 200", () => {
            cy.fixture("../fixtures/example_dids.json")
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
