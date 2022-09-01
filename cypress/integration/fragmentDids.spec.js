const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/testData.json";

describe("Test Scenario 7: DID URLs with fragments", () => {
    it("Can resolve a DID with a fragment", () => {
        cy.fixture(exampleDids)
            .its("fragmentDids")
            .then((list) => {
                Object.keys(list).forEach((key) => {
                    const fragmentDid = list[key];

                    cy.request({
                        method: "GET",
                        url: endpoint + fragmentDid,
                        failOnStatusCode: false,
                        headers: {
                            Accept: "application/did+ld+json",
                            Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
                        },
                    }).as("request");

                    cy.get("@request").then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.headers["content-type"]).to.contain(
                            "application/did+ld+json"
                        );
                        expect(response.body).not.to.have.property("didDocument");
                        expect(response.body).to.have.property("id");
                        expect(response.body["id"]).to.contain(
                            decodeURIComponent(fragmentDid.split("#")[0])
                        );
                    });
                });
            });
    });
});