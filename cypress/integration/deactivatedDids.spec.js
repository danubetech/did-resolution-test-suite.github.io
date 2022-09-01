const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/example_dids.json";

describe("Test Scenario 4: Deactivated", () => {
    it("Returns an HTTP code of 410 for deactivated DIDs", () => {
        cy.fixture(exampleDids)
            .its("deactivatedDids")
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