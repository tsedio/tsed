import * as SuperTest from "supertest";
import {ExpressApplication} from "../../src/mvc/decorators";
import {bootstrap, inject} from "../../src/testing";
import {expect} from "../tools";
import {FakeServer} from "./FakeServer";

describe("Swagger", () => {

    before(bootstrap(FakeServer));
    before(inject([ExpressApplication], (expressApplication: ExpressApplication) =>
        this.app = SuperTest(expressApplication)
    ));

    describe("GET /api-doc/swagger.json", () => {

        before((done) => {
            this.app
                .get("/api-doc/swagger.json")
                .expect(200)
                .end((err: any, response: any) => {
                    this.spec = JSON.parse(response.text);
                    done();
                });
        });

        it("should have a swagger version", () => {
            expect(this.spec.swagger).to.be.eq("2.0");
        });

        it("should have informations field ", () => {
            expect(this.spec.swagger).to.be.eq("2.0");
        });

        it("should have paths field", () => {
            expect(this.spec.paths).to.be.a("object");
        });

        it("should have securityDefinitions field", () => {
            expect(this.spec.securityDefinitions).to.be.a("object");
        });

        it("should have definitions field", () => {
            expect(this.spec.definitions).to.be.a("object");
        });

        it("should have consumes field", () => {
            expect(this.spec.consumes).to.be.an("array");
            expect(this.spec.consumes[0]).to.be.eq("application/json");
        });

        it("should have produces field", () => {
            expect(this.spec.produces).to.be.an("array");
            expect(this.spec.produces[0]).to.be.eq("application/json");
        });

        it("should be equals to the expected swagger.spec.json", () => {
            expect(this.spec).to.deep.eq(require("./data/swagger.spec.json"));
        });
    });
});