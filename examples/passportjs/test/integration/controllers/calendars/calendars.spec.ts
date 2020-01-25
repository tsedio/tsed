import {ExpressApplication} from "@tsed/common";
import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Calendars", () => {
  let agent: SuperTest.SuperTest<SuperTest.Test>;
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  before(TestContext.bootstrap(Server));
  beforeEach(inject([ExpressApplication], async (expressApplication: ExpressApplication) => {
    agent = SuperTest.agent(expressApplication);
    request = SuperTest(expressApplication);
    const res = await agent
      .post("/rest/auth/login")
      .send({email: "amy.riley@undefined.io", password: "583538ea97489c137ad54db5"})
      .expect(200);
  }));
  after(() => TestContext.reset());

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars with login process", async () => {
      const response = await agent.get("/rest/calendars").expect(200);

      expect(response.body).to.be.an("array");
    });

    it("should fail when the user is not authenticated", async () => {
      const response = await request.get("/rest/calendars").expect(401);

      expect(response.text).to.eq("Unauthorized");
    });
  });
});
