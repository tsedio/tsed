import {PlatformApplication, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../src/Server";

describe("PlatformExpress integration", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(PlatformTest.bootstrap(Server));
  before(
    PlatformTest.inject([PlatformApplication], (app: PlatformApplication) => {
      request = SuperTest(app.callback());
    })
  );
  after(PlatformTest.reset);

  describe("GET /rest/resources/{:id}", () => {
    it("should get resource", async () => {
      // GIVEN
      const response = await request.get("/rest/resources/1").expect(200);

      expect(response.body).to.deep.eq({
        "id": "1",
        "name": "Test"
      });
    });
  });

  describe("POST /rest/resources/", () => {
    it("should post resource", async () => {
      // GIVEN
      const response = await request.post("/rest/resources").send({
        name: "NewTest"
      }).expect(201);

      expect(response.body.id).to.be.a("string");
      expect(response.body.name).to.be.eq("NewTest");
    });
  });

  describe("PUT /rest/resources/", () => {
    it("should PUT resource", async () => {
      // GIVEN
      const response = await request.put("/rest/resources/1").send({
        id: "1",
        name: "NewTest"
      }).expect(200);

      expect(response.body.id).to.be.a("string");
      expect(response.body.name).to.be.eq("NewTest");
    });
  });

  describe("DELETE /rest/resources/:id", () => {
    it("should PUT resource", async () => {
      await request.delete("/rest/resources/1").expect(204);
    });
  });
});
