import {ExpressApplication} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Path from "path";
import * as SuperTest from "supertest";
import {Test} from "supertest";
import {Server} from "../../../../src/Server";

describe("Upload", () => {
  let request: SuperTest.SuperTest<Test>;
  // bootstrap the express application
  before(TestContext.bootstrap(Server));
  before(TestContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
    request = SuperTest(expressApplication);
  }));
  after(TestContext.reset);

  describe("PUT /rest/upload", () => {
    it("should return 201", async () => {
      const response = await request.put("/rest/upload")
        .attach("file", Path.join(__dirname, "/test.txt"))
        .expect(201);

      expect(response.body).to.eq(true);
    });
  });
});
