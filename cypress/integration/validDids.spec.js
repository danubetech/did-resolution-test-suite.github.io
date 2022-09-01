const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/testData.json";

describe(
    "Test Scenario 1: DID Resolution Result fixtures: " + endpoint,
    () => {
        it("A correct DID can be resolved", () => {
            cy.clearCookies();
            cy.fixture(exampleDids)
                .its("validDids")
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
    });

describe("Test Scenario 2: JSON-LD DID document", () => {
    it("A correct DID can be resolved with header input", () => {
        cy.fixture(exampleDids)
            .its("validDids")
            .then((list) => {
                Object.keys(list).forEach((key) => {
                    const normalDid = list[key];
                    cy.request({
                        method: "GET",
                        url: endpoint + normalDid,
                        headers: {Accept: "application/did+ld+json"},
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

describe("Test Scenario 2b: CBOR DID document: " + endpoint, () => {
    it("MUST return HTTP response status 200", () => {
        cy.fixture(exampleDids)
            .its("validDids")
            .then((list) => {
                Object.keys(list).forEach((key) => {
                    const normalDid = list[key];
                    cy.request({
                        method: "GET",
                        url: endpoint + normalDid,
                        headers: {Accept: "application/did+cbor"},
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

describe("Test Scenario 3: Representation not supported", () => {
    it("Shows an error when a representation is prompted", () => {
        cy.fixture(exampleDids)
            .its("validDids")
            .then((list) => {
                Object.keys(list).forEach((key) => {
                    const normalDid = list[key];
                    cy.request({
                        method: "GET",
                        url: endpoint + normalDid,
                        headers: {Accept: "image/png"},
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
