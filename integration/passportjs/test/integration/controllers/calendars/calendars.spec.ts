import {ExpressApplication} from "@tsed/common";
import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Calendars", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  before(TestContext.bootstrap(Server));
  beforeEach(inject([ExpressApplication], async (expressApplication: ExpressApplication) => {
    request = SuperTest(expressApplication);
  }));
  after(() => TestContext.reset());

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      let obj = JSON.parse(response.text);

      expect(obj).to.be.an("array");
    });
  });
});
