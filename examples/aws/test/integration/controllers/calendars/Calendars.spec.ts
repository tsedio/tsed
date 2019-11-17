import {ExpressApplication} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Calendars", () => {
  let request;
  // bootstrap your expressApplication in first
  before(TestContext.bootstrap(Server));
  before(TestContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
    request = SuperTest(expressApplication);
  }));
  after(TestContext.reset);

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(response.body).to.be.an("array");
    });
  });
});
