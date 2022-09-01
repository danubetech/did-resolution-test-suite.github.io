const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/example_dids.json";

describe("Test Scenario 6A: Invalid DID", () => {
    it("Returns a HTTP code of 400 for an invalid DID", () => {
        cy.fixture(exampleDids)
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