import {ExpressApplication} from "@tsed/platform-http";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../src/Server";

describe("Session", () => {
  let agent: any;

  before(TestContext.bootstrap(Server));
  before(
    TestContext.inject([ExpressApplication], async (expressApplication: ExpressApplication) => {
      agent = SuperTest.agent(expressApplication);
    })
  );
  after(TestContext.reset);

  describe("Login / Logout", () => {
    it("should create session return hello world and connect a fake user", async () => {
      // WHEN
      const response1 = await agent.get("/rest/whoami").expect(200);

      await agent.post("/rest/login").send({name: "UserName"}).expect(204);

      const response2 = await agent.get("/rest/whoami").expect(200);

      await agent.post("/rest/logout").expect(204);

      const response3 = await agent.get("/rest/whoami").expect(200);

      // THEN
      expect(response1.text).to.eq("Hello world");
      expect(response2.text).to.eq("Hello user UserName");
      expect(response3.text).to.eq("Hello world");
    });
  });
});
