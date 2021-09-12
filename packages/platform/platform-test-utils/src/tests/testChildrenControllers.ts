import {Controller, Get, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

export function testChildrenControllers(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

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

      expect(response.text).to.equal("hello world");
    });
  });

  describe("scenario 2: GET /rest/controllers/children/scenario-2", () => {
    it("should return a response from method", async () => {
      const response = await request.get("/rest/controllers/children/scenario-2").expect(200);

      expect(response.text).to.equal("hello child");
    });
  });
}
