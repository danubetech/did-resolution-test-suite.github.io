const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/example_dids.json";

describe("Test Scenario 6E: invalid didDocument.id", () => {
    it("Raises error when didDocument.id is invalid", () => {
        cy.fixture(exampleDids)
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

describe("Test Scenario 6H: notAllowedLocalDuplicateKey error/warning", () => {
    it("Raises notAllowedLocalDuplicateKey error when did is incorrect", () => {
        cy.fixture(exampleDids)
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

describe("Test Scenario 6I: notAllowedKeyType error/warning", () => {
    it("Raises notAllowedKeyType error when did is incorrect", () => {
        cy.fixture(exampleDids)
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