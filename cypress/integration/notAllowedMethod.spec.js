const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/example_dids.json";

//todo: is this the same as methodNotSupported?
describe("Test Scenario 6J: notAllowedMethod error/warning", () => {
    it("Raises notAllowedMethod error when did is incorrect", () => {
        cy.fixture(exampleDids)
            .its("notAllowedMethod")
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
                            "notAllowedMethod"
                        );
                    });
                });
            });
    });
});