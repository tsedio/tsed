import {PlatformTest} from "@tsed/common";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import * as SuperTest from "supertest";
import {Server} from "../Server";

describe("Rest", () => {
  beforeAll(TestContainersMongo.bootstrap(Server)); // Create a server with mocked database
  afterAll(() => TestContainersMongo.reset()); // reset database and injector

  describe("GET /rest/calendars", () => {
    it("should do something", async () => {
      const request = SuperTest(PlatformTest.callback());
      const response = await request.get("/rest/calendars").expect(200);

      expect(typeof response.body).toEqual("array");
    });
  });
});
