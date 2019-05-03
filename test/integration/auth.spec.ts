import {ExpressApplication} from "@tsed/common";
import {bootstrap, inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {FakeServer} from "./app/FakeServer";

describe("Auth scenario", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(bootstrap(FakeServer));
  before(
    inject([ExpressApplication], (expressApplication: ExpressApplication) => {
      request = SuperTest(expressApplication);
    })
  );
  after(TestContext.reset);

  describe("DELETE /rest/calendars", () => {
    it("should throw a Unauthorized", async () => {
      const response = await request.delete("/rest/calendars").expect(401);

      expect(response.error.text).to.contains("Unauthorized");
    });

    it("should throw a BadRequest when token is malformed", async () => {
      const response = await request
        .delete("/rest/calendars")
        .set({authorization: "toke"})
        .expect(400);

      expect(response.error.text).to.contains("Bad token format");
    });

    it("should throw a Forbidden when right is not enough", async () => {
      const response = await request
        .delete("/rest/calendars")
        .set({authorization: "token-user"})
        .expect(403);

      expect(response.error.text).to.contains("Forbidden");
    });

    it("should throw a BadRequest when id isn't given", async () => {
      const response = await request
        .delete("/rest/calendars")
        .set({authorization: "token-admin"})
        .expect(400);

      expect(response.error.text).to.contains("Bad request, parameter \"request.body.id\" is required.");
    });

    it("should return a 204 response", async () => {
      await request
        .delete("/rest/calendars")
        .set({authorization: "token-admin"})
        .send({id: 1})
        .expect(204);
    });
  });

  describe("DELETE /rest/calendars/token", () => {
    it("should throw a Unauthorized", async () => {
      const response = await request.delete("/rest/calendars/token").expect(401);

      expect(response.error.text).to.contains("Unauthorized");
    });

    it("should throw a BadRequest when token is malformed", async () => {
      const response = await request
        .delete("/rest/calendars")
        .set({authorization: "toke"})
        .expect(400);

      expect(response.error.text).to.contains("Bad token format");
    });

    it("should throw a Forbidden when right is not enough", async () => {
      const response = await request
        .delete("/rest/calendars/token")
        .set({authorization: "token-user"})
        .expect(403);

      expect(response.error.text).to.contains("Forbidden");
    });

    it("should throw a BadRequest when id isn't given", async () => {
      const response = await request
        .delete("/rest/calendars/token")
        .set({authorization: "token-admin"})
        .expect(400);

      expect(response.error.text).to.contains("Bad request, parameter \"request.body.id\" is required.");
    });

    it("should return a 204 response", async () => {
      await request
        .delete("/rest/calendars/token")
        .set({authorization: "token-admin"})
        .send({id: 1})
        .expect(204);
    });
  });
});
