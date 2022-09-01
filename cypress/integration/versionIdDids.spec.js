const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/example_dids.json";

describe("Test Scenario 11: DID URLs with versionId parameter", () => {
    it("MUST return HTTP response status 200", () => {
        cy.fixture(exampleDids)
            .its("versionIdDids")
            .then((list) => {
                Object.keys(list).forEach((key) => {
                    const versionIdDid = list[key];

                    cy.request({
                        method: "GET",
                        url: endpoint + versionIdDid,
                        headers: {
                            Accept: "application/did+ld+json",
                            Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
                        },
                        failOnStatusCode: false,
                    }).as("request");

                    cy.get("@request").then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response).to.be.a("object");
                        expect(response.headers["content-type"]).contains(
                            "application/did+ld+json"
                        );
                        expect(response.body)
                            .has.property("id")
                            .contains(decodeURIComponent(versionIdDid.split("?")[0]));
                    });
                });
            });
    });
});