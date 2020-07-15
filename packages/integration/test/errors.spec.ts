import {PlatformTest} from "@tsed/common/src";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {ErrorsCtrl} from "../src/controllers/errors/ErrorsCtrl";
import {FakeServer} from "./helpers/FakeServer";

describe("Errors", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(PlatformTest.bootstrap(FakeServer, {
    mount: {
      "/rest": [ErrorsCtrl]
    }
  }));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("GET /rest/errors/custom-bad-request", done => {
    request
      .get("/rest/errors/custom-bad-request")
      .expect(400)
      .end((err: any, response: any) => {
        expect(response.headers.errors).to.eq("[\"test\"]");
        expect(response.headers["x-header-error"]).to.eq("deny");
        expect(response.text).to.eq("Custom Bad Request");
        done();
      });
  });

  it("POST /rest/errors/required-param", done => {
    request
      .post("/rest/errors/required-param")
      .expect(400)
      .end((err: any, response: any) => {
        expect(response.text).to.eq("Bad request on parameter \"request.body.name\".<br />It should have required parameter 'name'");

        expect(JSON.parse(response.headers.errors)).to.deep.eq([
          {
            dataPath: "",
            keyword: "required",
            message: "It should have required parameter 'name'",
            modelName: "body",
            params: {
              missingProperty: "name"
            },
            schemaPath: "#/required"
          }
        ]);
        done();
      });
  });

  it("POST /rest/errors/required-model", done => {
    request
      .post("/rest/errors/required-model")
      .expect(400)
      .end((err: any, response: any) => {
        expect(response.text).to.eq(
          "Bad request on parameter \"request.body\".<br />CustomModel should have required property 'name'. Given value: \"undefined\""
        );

        expect(JSON.parse(response.headers.errors)).to.deep.eq([
          {
            dataPath: "",
            keyword: "required",
            message: "should have required property 'name'",
            modelName: "CustomModel",
            params: {
              missingProperty: "name"
            },
            schemaPath: "#/required"
          }
        ]);
        done();
      });
  });

  it("POST /rest/errors/required-prop-name", done => {
    request
      .post(`/rest/errors/required-prop-name`)
      .send({})
      .expect(400)
      .end((err: any, response: any) => {
        expect(response.text).to.eq("Bad request on parameter \"request.body\".<br />CustomPropModel should have required property 'role_item'. Given value: \"undefined\"");
        done();
      });
  });

  it("GET /rest/errors/error (original error is not displayed", done => {
    request
      .get("/rest/errors/error")
      .expect(500)
      .end((err: any, response: any) => {
        expect(response.text).to.eq("Internal Error");
        done();
      });
  });

  it("GET /rest/errors/custom-internal-error", done => {
    request
      .get("/rest/errors/custom-internal-error")
      .expect(500)
      .end((err: any, response: any) => {
        expect(response.headers.errors).to.eq("[\"test\"]");
        expect(response.headers["x-header-error"]).to.eq("deny");
        expect(response.text).to.eq("My custom error");
        done();
      });
  });
});
