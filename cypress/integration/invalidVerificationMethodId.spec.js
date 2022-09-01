const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/example_dids.json";

describe("Test Scenario 6C: invalid verificationMethod.id", () => {
    it("Raises error when verificationMethod.id is invalid", () => {
        cy.fixture(exampleDids)
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