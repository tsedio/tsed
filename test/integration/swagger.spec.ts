import {ExpressApplication} from "@tsed/common";
import {bootstrap, inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {FakeServer} from "./app/FakeServer";

describe("Swagger", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(bootstrap(FakeServer));
  before(inject([ExpressApplication], (expressApplication: ExpressApplication) => (request = SuperTest(expressApplication))));
  after(TestContext.reset);

  describe("GET /api-doc/swagger.json", () => {
    let spec: any;
    before(done => {
      request
        .get("/api-doc/swagger.json")
        .expect(200)
        .end((err: any, response: any) => {
          spec = JSON.parse(response.text);
          done();
        });
    });

    it("should have a swagger version", () => {
      expect(spec.swagger).to.be.eq("2.0");
    });

    it("should have informations field ", () => {
      expect(spec.swagger).to.be.eq("2.0");
    });

    it("should have paths field", () => {
      expect(spec.paths).to.be.a("object");
    });

    it("should have securityDefinitions field", () => {
      expect(spec.securityDefinitions).to.be.a("object");
    });

    it("should have definitions field", () => {
      expect(spec.definitions).to.be.a("object");
    });

    it("should have consumes field", () => {
      expect(spec.consumes).to.be.an("array");
      expect(spec.consumes[0]).to.be.eq("application/json");
    });

    it("should have produces field", () => {
      expect(spec.produces).to.be.an("array");
      expect(spec.produces[0]).to.be.eq("application/json");
    });

    it("should be equals to the expected swagger.spec.json", () => {
      // require("fs").writeFileSync(__dirname + "/data/swagger.spec.json", JSON.stringify(spec, null, 2), {});
      expect(spec).to.deep.eq(require("./data/swagger.spec.json"));
    });
  });
});
