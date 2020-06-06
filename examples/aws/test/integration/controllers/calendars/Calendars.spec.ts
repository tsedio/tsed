import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Calendars", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  before(PlatformTest.bootstrap(Server));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(response.body).to.be.an("array");
    });
  });
});
