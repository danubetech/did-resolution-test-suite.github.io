const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/testData.json";

describe("Test Scenario 6D: invalid verificationMethod.controller", () => {
    it("Raises error when verificationMethod.controller is invalid", () => {
        cy.fixture(exampleDids)
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