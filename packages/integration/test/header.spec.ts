import {BodyParams, Controller, Get, Header, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {TestServer} from "./helpers/TestServer";

@Controller("/")
export class HeaderCtrl {
  @Get("/test-scenario-1")
  @Header("test", "x-token")
  testScenario1(@BodyParams("test") value: string[]): any {
    return "hello";
  }
}

describe("Body spec", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(PlatformTest.bootstrap(TestServer, {
    mount: {
      "/rest": [
        HeaderCtrl
      ]
    }
  }));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario1: with expression Array<string>", () => {
    it("should return value", async () => {
      const response = await request.get("/rest/test-scenario-1").expect(200);

      expect(response.text).to.deep.equal("hello");
      expect(response.header["test"]).to.deep.equal("x-token");
    });
  });
});
