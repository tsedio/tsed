import {it, expect, describe, beforeAll, afterAll} from "vitest";
import {PlatformTest} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../../../src/Server";

describe("Session", () => {
  let request: any;

  beforeAll(() => {
    PlatformTest.bootstrap(Server);
    request = SuperTest.agent(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Login / Logout", () => {
    it("should create session return hello world and connect a fake user", async () => {
      const request = SuperTest.agent(PlatformTest.callback());
      // WHEN
      const response1 = await request.get("/rest/whoami").expect(200);

      await request.post("/rest/login").send({name: "UserName"}).expect(204);

      const response2 = await request.get("/rest/whoami").expect(200);

      await request.post("/rest/logout").expect(204);

      const response3 = await request.get("/rest/whoami").expect(200);

      // THEN
      expect(response1.text).toEqual("Hello world");
      expect(response2.text).toEqual("Hello user UserName");
      expect(response3.text).toEqual("Hello world");
    });
  });
});
