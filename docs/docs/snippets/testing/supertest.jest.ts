import {PlatformApplication, PlatformTest} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../Server";

describe("Rest", () => {
  // bootstrap your Server to load all endpoints before run your test
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(PlatformTest.bootstrap(Server));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("GET /rest/calendars", () => {
    it("should do something", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(typeof response.body).toEqual("array");
    });
  });
});
