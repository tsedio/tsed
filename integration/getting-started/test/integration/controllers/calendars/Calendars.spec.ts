import {ExpressApplication} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "../../../../src/Server";


describe("Calendars", () => {

  // bootstrap your expressApplication in first
  before(TestContext.bootstrap(Server));
  before(TestContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
    this.app = expressApplication;
  }));
  after(TestContext.reset);

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars", (done) => {
      SuperTest(this.app)
        .get("/rest/calendars")
        .expect(200)
        .end((err, response: any) => {
          if (err) {
            throw (err);
          }

          let obj = JSON.parse(response.text);

          expect(obj).to.be.an("array");

          done();
        });

    });
  });

});
