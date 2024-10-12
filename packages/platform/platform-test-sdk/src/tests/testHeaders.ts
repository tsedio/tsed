import {Controller} from "@tsed/di";
import {PlatformResponse, Res} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams} from "@tsed/platform-params";
import {Get, Returns} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

@Controller("/headers")
export class HeadersCtrl {
  @Get("/scenario-1")
  @(Returns(200, String).Header("test", "x-token"))
  testScenario1(@BodyParams("test") value: string[]): any {
    return "hello";
  }

  @Get("/scenario-2")
  @(Returns(200, String).Header("x-token-test", "test").Header("x-token-test-2", "test2").ContentType("application/xml"))
  testScenario2() {
    return "<xml></xml>";
  }

  @Get("/scenario-3")
  @(Returns(200, String).Headers({
    Location: {
      description: "URL to the new xxx",
      type: "string",
      value: "/v1/location/header"
    }
  }))
  testScenario3(@Res() response: PlatformResponse) {
    response.setHeader("Location", `/v1/location`);
    return "Hello";
  }
}

export function testHeaders(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      logger: {
        level: "off"
      },
      mount: {
        "/rest": [HeadersCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  it("Scenario1: GET /rest/headers/scenario-1", async () => {
    const response = await request.get("/rest/headers/scenario-1").expect(200);

    expect(response.text).toEqual("hello");
    expect(response.header["test"]).toEqual("x-token");
  });

  it("Scenario2: GET /rest/headers/scenario-2", async () => {
    const response = await request.get("/rest/headers/scenario-2").expect(200);

    expect(response.headers["x-token-test"]).toEqual("test");
    expect(response.headers["x-token-test-2"]).toEqual("test2");
    expect(response.headers["content-type"]).toContain("application/xml");
  });

  it("Scenario3: GET /rest/headers/scenario-3", async () => {
    const response = await request.get("/rest/headers/scenario-3").expect(200);

    expect(response.headers["location"]).toEqual("/v1/location");
  });
}
