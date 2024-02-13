import {Controller, Get, PlatformTest} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import filedirname from "filedirname";
import {createReadStream} from "fs";
import {join} from "path";
import SuperTest from "supertest";
import {PlatformTestingSdkOpts} from "../interfaces";
// FIXME remove when esm is ready
const [, rootDir] = filedirname();

@Controller("/stream")
class TestStreamCtrl {
  @Get("/scenario1")
  @ContentType("application/json")
  testScenario1() {
    return createReadStream(join(rootDir, "../data/response.data.json"), "utf-8");
  }

  @Get("/scenario1b")
  @ContentType("application/json")
  testScenario2() {
    return Promise.resolve(createReadStream(join(rootDir, "../data/response.data.json"), "utf-8"));
  }
}

export function testStream(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestStreamCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario1: when endpoint return a stream", () => {
    describe("GET /rest/stream/scenario1", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/stream/scenario1");

        expect(response.headers["content-type"]).toEqual("application/json");
        expect(response.body).toEqual({id: "1"});
      });
    });

    describe("GET /rest/stream/scenario1b", () => {
      it("should return a body", async () => {
        const response = await request.get("/rest/stream/scenario1b");

        expect(response.body).toEqual({id: "1"});
      });
    });
  });
}
