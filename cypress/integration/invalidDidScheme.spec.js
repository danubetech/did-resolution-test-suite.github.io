const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/example_dids.json";

describe("Test Scenario 6F: Invalid didDocument scheme", () => {
    it("Raises invalidDid error when if scheme is not did", () => {
        cy.fixture(exampleDids)
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