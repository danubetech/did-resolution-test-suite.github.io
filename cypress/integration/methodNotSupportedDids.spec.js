const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/testData.json";

describe("Test Scenario 6B: method not supported DIDs", () => {
    it("Raises an error for unsupported DID methods", () => {
        cy.fixture(exampleDids)
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