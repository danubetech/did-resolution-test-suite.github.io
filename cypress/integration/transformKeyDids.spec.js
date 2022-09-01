const endpoint = Cypress.env("ENDPOINT");
const exampleDids = "../fixtures/testData.json";

describe("Test Scenario 9: DID URLs with transformKeys", () => {
    it("MUST return HTTP response status 200", () => {
        cy.fixture(exampleDids)
            .its("transformKeyDids")
            .then((list) => {
                Object.keys(list).forEach((key) => {
                    const transformKeyDid = list[key];

                    cy.request({
                        method: "GET",
                        url: endpoint + transformKeyDid,
                        headers: {
                            Accept: "application/did+ld+json",
                            Authorization: "Bearer b082c420-df67-4b06-899c-b7c51d75fba0",
                        },
                        failOnStatusCode: false,
                    }).as("request");

                    cy.get("@request").then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response).to.be.a("object");
                        response.body.verificationMethod.forEach((out) => {
                            expect(out)
                                .has.property("type")
                                .to.be.oneOf([
                                "JsonWebKey2020",
                                "Ed25519VerificationKey2018",
                                "X25519KeyAgreementKey2019",
                            ]);
                        });
                        expect(response.headers["content-type"]).contains(
                            "application/did+ld+json"
                        );
                        expect(response.body).has.property(
                            "id",
                            decodeURIComponent(transformKeyDid.split("?")[0].split("#")[0])
                        );
                    });
                });
            });
    });
});