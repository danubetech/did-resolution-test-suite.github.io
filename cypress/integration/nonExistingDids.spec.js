const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/example_dids.json";

describe("Test Scenario 5: Not found", () => {
    it("Returns an HTTP code of 404 for non-existent DIDs", () => {
        cy.fixture(exampleDids)
            .its("nonExistingDids")
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