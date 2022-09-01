const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/example_dids.json";

describe("Test Scenario 8: Service and relativeRef parameters", () => {
    it("Fetches DID", () => {
        cy.fixture(exampleDids)
            .its("relativeParamDids")
            .then((list) => {
                Object.keys(list).forEach((key) => {
                    const fragmentDid = list[key];
                    console.log("FRAGMENT DID IS", fragmentDid);
                    cy.request({
                        method: "GET",
                        url: endpoint + fragmentDid,
                        headers: { Accept: "text/uri-list" },
                        failOnStatusCode: false,
                    }).as("response");
                    it("MUST return HTTP response status equals 303", () => {
                        cy.get("@response").then((response) => {
                            expect(response.status).to.eq(303);
                        });
                    });
                });
            });
    });
});