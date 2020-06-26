import {expect} from "chai";
import {Controller, Post, Required, PlatformTest, BodyParams} from "@tsed/common";
import * as SuperTest from "supertest";
import {TestServer} from "./helpers/TestServer";

@Controller("/")
export class BodyCtrl {
  @Post("/test-scenario-1")
  testScenario1(@BodyParams("test") value: string[]): any {
    return {value};
  }

  @Post("/test-scenario-2")
  testScenario2(@BodyParams() value: string[]): any {
    return {value};
  }

  @Post("/test-scenario-3")
  testScenario3(@Required() @BodyParams("test") value: string[]): any {
    return {value};
  }
}

describe("Body spec", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(PlatformTest.bootstrap(TestServer, {
    mount: {
      "/rest": [
        BodyCtrl
      ]
    }
  }));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario1: with expression Array<string>", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/test-scenario-1")
        .send({
          test: ["value"]
        }).expect(200);

      expect(response.body).to.deep.equal({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/test-scenario-1").send().expect(200);

      expect(response.body).to.deep.equal({});
    });
    it("should return an empty value (2)", async () => {
      const response = await request.post("/rest/test-scenario-1").send({}).expect(200);

      expect(response.body).to.deep.equal({});
    });
  });
  describe("Scenario2: without expression Array<string>", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/test-scenario-2")
        .send(["value"]).expect(200);

      expect(response.body).to.deep.equal({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/test-scenario-2").send().expect(200);

      expect(response.body).to.deep.equal({value: [{}]});
    });
  });
  describe("Scenario3: with expression required Array<string>", () => {
    it("should return value", async () => {
      const response = await request.post("/rest/test-scenario-3")
        .send({test: ["value"]}).expect(200);

      expect(response.body).to.deep.equal({value: ["value"]});
    });
    it("should return an empty array (1)", async () => {
      const response = await request.post("/rest/test-scenario-3").send().expect(400);

      expect(response.text).to.deep.equal("Bad request on parameter \"request.body.test\".<br />It should have required parameter 'test'");
    });
  });
});
