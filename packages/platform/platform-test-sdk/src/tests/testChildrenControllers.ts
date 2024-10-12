import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Get} from "@tsed/schema";
import SuperTest from "supertest";
import {afterEach, beforeEach, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

export function testChildrenControllers(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  @Controller("/children")
  class TestChildController {
    @Get("/scenario-2")
    get() {
      return "hello child";
    }
  }

  @Controller({
    path: "/controllers",
    children: [TestChildController]
  })
  class TestController {
    @Get("/scenario-1")
    scenario1() {
      return "hello world";
    }
  }

  beforeEach(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestController]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  describe("scenario 1: GET /rest/controllers/scenario-1", () => {
    it("should return a response from method", async () => {
      const response = await request.get("/rest/controllers/scenario-1").expect(200);

      expect(response.text).toEqual("hello world");
    });
  });

  describe("scenario 2: GET /rest/controllers/children/scenario-2", () => {
    it("should return a response from method", async () => {
      const response = await request.get("/rest/controllers/children/scenario-2").expect(200);

      expect(response.text).toEqual("hello child");
    });
  });
}
