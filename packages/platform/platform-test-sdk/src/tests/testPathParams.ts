import {Controller} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context, PathParams} from "@tsed/platform-params";
import {Get, Pattern, Post} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

@Controller("/path-params")
class TestPathParamsCtrl {
  @Get("/scenario-1/:scope/:scopeId")
  testScenario1(@PathParams("scope") scope: string) {
    // Here scope will be {0: 'a', 1: 'b', 2: 'c'} instead of 'abc' in version 5.47.0
    expect(scope).toEqual("abc");

    return Promise.resolve(scope);
  }

  @Get("/scenario-2/:scope/:scopeId")
  testScenario2(@PathParams("scope") scope: any) {
    // This way it works in version 5.47.0
    expect(scope).toEqual("abc");

    return scope;
  }

  @Post("/scenario-3/:scope/:scopeId")
  testScenario3(@PathParams("scope") scope: string): Promise<any[]> {
    expect(scope).toEqual("abc");

    // Here the function will return  {0: 'a', 1: 'b', 2: 'c'} instead of ['a','b','c']  in version 5.44.13
    return Promise.resolve(["a", "b", "c"]);
  }

  @Post("/scenario-4/:scope/:scopeId")
  testScenario4(@PathParams("scope") scope: string, @Context() ctx: Context) {
    expect(scope).toEqual("abc");

    // This way it works  in version 5.44.13
    ctx.response.body(["a", "b", "c"]);
  }

  @Get("/scenario-5/:scopeId")
  testScenario5(@PathParams("scopeId") @Pattern(/^[0-9a-fA-F]{24}$/) scopeId: string, @Context() ctx: Context) {
    return "test";
  }

  @Get("/scenario-6/:id")
  testScenario6(@PathParams("id") id: number) {
    return {id};
  }

  // test path syntaxes
  @Get("/syntax-1/*")
  testSyntax1(@PathParams("*") wildcard: string, @Context() ctx: PlatformContext) {
    return {wildcard};
  }

  @Get("/syntax-2/(.*)")
  testSyntax2(@PathParams("*") wildcard: string, @Context() ctx: PlatformContext) {
    return {wildcard};
  }

  @Get("/syntax-3/:named*")
  testSyntax3(@PathParams("named") wildcard: string, @Context() ctx: PlatformContext) {
    return {wildcard};
  }

  @Get("/syntax-4/:named?")
  testSyntax4(@PathParams("named") named: string, @Context() ctx: PlatformContext) {
    return {named};
  }
}

export function testPathParams(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      logger: {
        level: "info"
      },
      mount: {
        "/rest": [TestPathParamsCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  it("Scenario 1: GET /rest/path-params/scenario-1/scope/scopeId", async () => {
    const response = await request.get("/rest/path-params/scenario-1/abc/1").expect(200);

    expect(response.text).toEqual("abc");
  });

  it("Scenario 2: GET /rest/path-params/scenario-2/scopeId", async () => {
    const response = await request.get("/rest/path-params/scenario-2/abc/1").expect(200);

    expect(response.text).toEqual("abc");
  });

  it("Scenario 3: POST /rest/path-params/scenario-3/scope/scopeId", async () => {
    const response = await request.post("/rest/path-params/scenario-3/abc/1").expect(200);

    expect(response.body).toEqual(["a", "b", "c"]);
  });

  it("Scenario 4: POST /rest/path-params/scenario-4/scope/scopeId", async () => {
    const response = await request.post("/rest/path-params/scenario-4/abc/1").expect(200);

    expect(response.body).toEqual(["a", "b", "c"]);
  });

  it("Scenario 5 a: GET /rest/path-params/scenario-5/scopeId", async () => {
    const response = await request.get("/rest/path-params/scenario-5/1").expect(400);

    expect(response.body).toEqual({
      errors: [
        {
          data: "1",
          requestPath: "path",
          dataPath: ".scopeId",
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

    expect(response.body).toEqual({id: 1});
  });

  describe("path syntaxes", () => {
    it("Syntax 1: GET /rest/path-params/syntax-1/*", async () => {
      const response = await request.get("/rest/path-params/syntax-1/abc/def").expect(200);

      expect(response.body).toEqual({wildcard: "abc/def"});
    });

    it("Syntax 2: GET /rest/path-params/syntax-2/(.*)", async () => {
      const response = await request.get("/rest/path-params/syntax-2/abc/def").expect(200);

      expect(response.body).toEqual({wildcard: "abc/def"});
    });

    it("Syntax 2: GET /rest/path-params/syntax-3/:named*", async () => {
      const response = await request.get("/rest/path-params/syntax-3/abc/def").expect(200);

      expect(response.body).toEqual({wildcard: "abc/def"});
    });

    it("Syntax 3: GET /rest/path-params/syntax-4/:named?", async () => {
      const response = await request.get("/rest/path-params/syntax-4/named").expect(200);

      expect(response.body).toEqual({named: "named"});
    });
  });
}
