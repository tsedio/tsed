import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import * as SuperTest from "supertest";
import {Server} from "../Server";

describe("Rest", () => {
  // bootstrap your Server to load all endpoints before run your test
  let request: SuperTest.Agent;

  before(TestMongooseContext.bootstrap(Server)); // Create a server with mocked database
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });

  after(TestMongooseContext.reset); // reset database and injector

  describe("GET /rest/calendars", () => {
    it("should do something", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(typeof response.body).toEqual("array");
    });
  });
});
