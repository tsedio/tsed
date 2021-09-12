import {Context, Controller, Get, PathParams, PlatformTest, Post} from "@tsed/common";
import {Pattern} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

@Controller("/path-params")
class TestPathParamsCtrl {
  @Get("/scenario-1/:scope/:scopeId")
  async testScenario1(@PathParams("scope") scope: string) {
    // Here scope will be {0: 'a', 1: 'b', 2: 'c'} instead of 'abc' in version 5.47.0
    expect(scope).to.eq("abc");

    return scope;
  }

  @Get("/scenario-2/:scope/:scopeId")
  async testScenario2(@PathParams("scope") scope: any) {
    // This way it works in version 5.47.0
    expect(scope).to.eq("abc");

    return scope;
  }

  @Post("/scenario-3/:scope/:scopeId")
  async testScenario3(@PathParams("scope") scope: string): Promise<any[]> {
    expect(scope).to.eq("abc");

    // Here the function will return  {0: 'a', 1: 'b', 2: 'c'} instead of ['a','b','c']  in version 5.44.13
    return ["a", "b", "c"];
  }

  @Post("/scenario-4/:scope/:scopeId")
  async testScenario4(@PathParams("scope") scope: string, @Context() ctx: Context) {
    expect(scope).to.eq("abc");

    // This way it works  in version 5.44.13
    ctx.response.body(["a", "b", "c"]);
  }

  @Get("/scenario-5/:scopeId")
  async testScenario5(@PathParams("scopeId") @Pattern(/^[0-9a-fA-F]{24}$/) scopeId: string, @Context() ctx: Context) {
    return "test";
  }

  @Get("/scenario-6/:id")
  async testScenario6(@PathParams("id") id: number) {
    return {id};
  }
}

export function testPathParams(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestPathParamsCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("Scenario 1: GET /rest/path-params/scenario-1/scope/scopeId", async () => {
    const response = await request.get("/rest/path-params/scenario-1/abc/1").expect(200);

    expect(response.text).to.deep.equal("abc");
  });

  it("Scenario 2: GET /rest/path-params/scenario-2/scopeId", async () => {
    const response = await request.get("/rest/path-params/scenario-2/abc/1").expect(200);

    expect(response.text).to.deep.equal("abc");
  });

  it("Scenario 3: POST /rest/path-params/scenario-3/scope/scopeId", async () => {
    const response = await request.post("/rest/path-params/scenario-3/abc/1").expect(200);

    expect(response.body).to.deep.equal(["a", "b", "c"]);
  });

  it("Scenario 4: POST /rest/path-params/scenario-4/scope/scopeId", async () => {
    const response = await request.post("/rest/path-params/scenario-4/abc/1").expect(200);

    expect(response.body).to.deep.equal(["a", "b", "c"]);
  });

  it("Scenario 5 a: GET /rest/path-params/scenario-5/scopeId", async () => {
    const response = await request.get("/rest/path-params/scenario-5/1").expect(400);

    expect(response.body).to.deep.equal({
      errors: [
        {
          data: "1",
          dataPath: "",
          instancePath: "",
          keyword: "pattern",
          message: 'must match pattern "^[0-9a-fA-F]{24}$"',
          params: {
            pattern: "^[0-9a-fA-F]{24}$"
          },
          schemaPath: "#/pattern"
        }
      ],
      message: 'Bad request on parameter "request.path.scopeId".\nValue must match pattern "^[0-9a-fA-F]{24}$". Given value: "1"',
      name: "AJV_VALIDATION_ERROR",
      status: 400
    });
  });
  it("Scenario 5b: GET /rest/path-params/scenario-5/scopeId", async () => {
    await request.get("/rest/path-params/scenario-5/5ce4ee471495836c5e2e4cb0").expect(200);
  });

  it("Scenario 6: GET /rest/path-params/scenario-6/id", async () => {
    const response = await request.get("/rest/path-params/scenario-6/1").expect(200);

    expect(response.body).to.deep.equal({id: 1});
  });
}
