const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/testData.json";

describe("Test Scenario 12: Resolve a DID / dereference a DID URL", () => {
    it("MUST return HTTP response status 200", () => {
        cy.fixture(exampleDids)
            .its("dereferenceDids")
            .then((list) => {
                Object.keys(list).forEach((key) => {
                    const normalDid = list[key];

                    cy.request({
                        method: "GET",
                        url: endpoint + normalDid,
                        headers: {Accept: "application/json"},
                        failOnStatusCode: false,
                    }).as("request");

                    cy.get("@request").then((response) => {
                        console.log("normal did is:", normalDid);

                        expect(response.status).to.eq(200);
                        expect(response.headers["content-type"]).contains(
                            "application/did+json;charset=utf-8"
                        );
                        expect(response.body).has.property("id", normalDid);
                        // expect(response.body["keyAgreement"][0]).to.contain(normalDid);
                    });
                });
            });
    });
});

// todo: header is not accepted?
describe("Test Scenario 12B: Resolve a DID / dereference a DID URL", () => {
    it("MUST return HTTP response status 200", () => {
        cy.fixture(exampleDids)
            .its("dereferenceDids")
            .then((list) => {
                Object.keys(list).forEach((key) => {
                    const normalDid = list[key];

                    cy.request({
                        method: "GET",
                        url: endpoint + normalDid,
                        headers: {
                            Accept:
                                'application/ld+json;profile="https://w3c-ccg.github.io/did-resolution/"',
                        },
                        failOnStatusCode: false,
                    }).as("request");

                    cy.get("@request").then((response) => {
                        console.log("normal did is:", normalDid);
                        expect(response.status).to.eq(200);
                        expect(response.headers["content-type"]).contains(
                            'application/ld+json; profile="https://w3c-ccg.github.io/did-resolution/"'
                        );
                    });
                });
            });
    });
});