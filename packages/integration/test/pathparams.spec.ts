import {PlatformTest, Controller, Get, Post, PathParams, Res} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {TestServer} from "./helpers/TestServer";

@Controller("/")
export class PathParamsCtrl {
  @Get("/scenario1/:scope/:scopeId")
  async testScenario1(@PathParams("scope") scope: string) {
    // Here scope will be {0: 'a', 1: 'b', 2: 'c'} instead of 'abc' in version 5.47.0
    expect(scope).to.eq("abc");

    return scope;
  }

  @Get("/scenario2/:scope/:scopeId")
  async testScenario2(@PathParams("scope") scope: any) {
    // This way it works in version 5.47.0
    expect(scope).to.eq("abc");

    return scope;
  }

  @Post("/scenario3/:scope/:scopeId")
  async testScenario3(
    @PathParams("scope") scope: string
  ): Promise<any[]> {
    expect(scope).to.eq("abc");

    // Here the function will return  {0: 'a', 1: 'b', 2: 'c'} instead of ['a','b','c']  in version 5.44.13
    return ["a", "b", "c"];
  }

  @Post("/scenario4/:scope/:scopeId")
  async testScenario4(
    @PathParams("scope") scope: string,
    @Res() response: any
  ): Promise<any[]> {
    expect(scope).to.eq("abc");

    // This way it works  in version 5.44.13
    return response.json(["a", "b", "c"]);
  }
}

describe("PathParams", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(PlatformTest.bootstrap(TestServer, {
    mount: {
      "/rest": PathParamsCtrl
    }
  }));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("scenario 1: GET /rest/scope/scopeId", async () => {
    const response = await request.get("/rest/scenario1/abc/1").expect(200);

    expect(response.text).to.deep.equal("abc");
  });

  it("scenario 2: GET /rest/scope/scopeId", async () => {
    const response = await request.get("/rest/scenario2/abc/1").expect(200);

    expect(response.text).to.deep.equal("abc");
  });

  it("scenario 3: POST /rest/scope/scopeId", async () => {
    const response = await request.post("/rest/scenario3/abc/1").expect(200);

    expect(response.body).to.deep.equal(["a", "b", "c"]);
  });

  it("scenario 4: POST /rest/scope/scopeId", async () => {
    const response = await request.post("/rest/scenario4/abc/1").expect(200);

    expect(response.body).to.deep.equal(["a", "b", "c"]);
  });
});
