import {ExpressApplication} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Path from "path";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";

describe("Upload", () => {

  // bootstrap the express application
  before(TestContext.bootstrap(Server));
  before(TestContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
    this.app = expressApplication;
  }));
  after(TestContext.reset);

  describe("PUT /rest/upload", () => { // work if you enable the MultipartFileMiddlewareOverrided ;)
    it("should return 400", (done) => {
      SuperTest(this.app)
        .put("/rest/upload")
        .attach("file", Path.join(__dirname, "/test.txt"))
        .expect(400)
        .end((err, res: any) => {
          if (err) {
            throw (err);
          }

          expect(res.text).to.eq("This should be thrown and seen on the test failure.");

          done();
        });
    });
  });
});
