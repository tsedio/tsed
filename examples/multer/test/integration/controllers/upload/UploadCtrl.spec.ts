import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Path from "path";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Upload", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  before(PlatformTest.bootstrap(Server));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("PUT /rest/upload", () => {
    it("should return 201", async () => {
      const response = await request.put("/rest/upload")
        .attach("file", Path.join(__dirname, "/test.txt"))
        .expect(201);

      expect(response.body).to.eq(true);
    });
  });
});
