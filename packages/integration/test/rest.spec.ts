import {PlatformTest} from "@tsed/common";
import {getSpec} from "@tsed/schema/src";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {EventCtrl} from "../src/controllers/calendars/EventCtrl";
import {FakeServer} from "./helpers/FakeServer";

describe("Rest", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(PlatformTest.bootstrap(FakeServer));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);
  describe("integration", () => {
    describe("spec", () => {
      it("should have the right spec", () => {
        // require("fs").writeFileSync(__dirname + "/data/event-ctrl.spec.json", JSON.stringify(getSpec(EventCtrl), null, 2), "utf8");
        expect(getSpec(EventCtrl)).to.deep.eq(require("./data/event-ctrl.spec.json"));
      });
    });
    describe("GET /rest/calendars", () => {
      it("should return an object (without annotation)", done => {
        request
          .get("/rest/calendars/classic/1")
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }
            const obj = JSON.parse(response.text);

            expect(obj).to.be.an("object");
            expect(obj.id).to.equal("1");
            expect(obj.name).to.equal("test");

            done();
          });
      });

      it("should return an object (PathParamsType annotation)", (done: Function) => {
        request
          .get("/rest/calendars/annotation/test/1")
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }

            const obj = response.body;
            expect(obj).to.be.an("object");
            expect(obj.id).to.equal("1");
            expect(obj.name).to.equal("test");

            done();
          });
      });

      it("should return an object (Via promised response)", (done: Function) => {
        request
          .get("/rest/calendars/annotation/promised/1")
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }
            const obj = JSON.parse(response.text);

            expect(obj).to.be.an("object");
            expect(obj.id).to.equal("1");
            expect(obj.name).to.equal("test");

            done();
          });
      });

      it("should return an object status (Via promised response)", (done: Function) => {
        request
          .get("/rest/calendars/annotation/status/1")
          .expect(202)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }

            const obj = JSON.parse(response.text);

            expect(obj).to.be.an("object");
            expect(obj.id).to.equal("1");
            expect(obj.name).to.equal("test");

            done();
          });
      });

      it("should use middleware to provide user info", (done: Function) => {
        request
          .get("/rest/calendars/middleware")
          .set({
            Authorization: "tokenauth"
          })
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }

            const obj = JSON.parse(response.text);

            expect(obj).to.be.an("object");
            expect(obj.user).to.equal(1);
            expect(obj.token).to.equal("tokenauth");

            done();
          });
      });

      it("should set token", (done: Function) => {
        request
          .get("/rest/calendars/token/newTOKENXD")
          // .send({id: 1})
          .set("Cookie", "authorization=auth")
          .expect(200)
          .end((err: any, response: any) => {
            const token = response.text;

            expect(token).to.be.an("string");
            expect(token).to.equal("token updated");
            done();
          });
      });

      it("should return get updated token", (done: Function) => {
        request
          .get("/rest/calendars/token")
          // .send({id: 1})
          .set("Cookie", "authorization=auth")
          .expect(200)
          .end((err: any, response: any) => {
            const token = response.text;

            expect(token).to.be.an("string");
            expect(token).to.equal("newTOKENXD");
            done();
          });
      });

      it("should return query", (done: Function) => {
        request
          .get("/rest/calendars/query?search=ts-express-decorators")
          .expect(200)
          .end((err: any, response: any) => {
            const token = response.text;
            expect(token).to.be.an("string");
            expect(token).to.equal("ts-express-decorators");
            done();
          });
      });

      it("should use mvc to provide info (Use)", (done: Function) => {
        request
          .get("/rest/calendars/mvc")
          .set({authorization: "token"})
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }

            const obj = JSON.parse(response.text);

            expect(obj).to.be.an("object");
            expect(obj.id).to.equal("1-local-10909-ctx-10909");

            done();
          });
      });

      it("should use mvc to provide info (UseAfter)", (done: Function) => {
        request
          .get("/rest/calendars/middlewares2")
          .set({authorization: "token"})
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }

            const obj = JSON.parse(response.text);

            expect(obj).to.be.an("object");
            expect(obj.id).to.equal(10909);

            done();
          });
      });

      it("should set all headers", (done: Function) => {
        request
          .get("/rest/calendars/headers")
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }

            expect(response.headers["x-token-test"]).to.equal("test");
            expect(response.headers["x-token-test-2"]).to.equal("test2");
            expect(response.headers["content-type"]).to.equal("application/xml; charset=utf-8");

            done();
          });
      });
    });

    describe("PUT /rest/calendars", () => {
      it("should throw a BadRequest", (done: Function) => {
        request
          .put("/rest/calendars")
          .expect(400)
          .end((err: any, response: any) => {
            expect(response.error.text).to.eq("Bad request on parameter \"request.body.name\".<br />It should have required parameter 'name'");
            done();
          });
      });

      it("should return an object", (done: Function) => {
        request
          .put("/rest/calendars")
          .send({name: "test"})
          .expect(200)
          .end((err: any, response: any) => {
            const obj = JSON.parse(response.text);

            expect(obj).to.be.an("object");
            expect(obj.name).to.equal("test");
            done();
          });
      });
    });

    describe("HEAD /rest/calendars/events", () => {
      it("should return headers", done => {
        request
          .head("/rest/calendars/events")
          .expect(200)
          .end((err: any, response: any) => {
            expect(response.text).to.eq(undefined);

            done();
          });
      });
    });
    describe("GET /rest/calendars/events", () => {
      it("should return array", async () => {
        const response = await request.get("/rest/calendars/events").expect(200);

        expect(response.body).to.deep.eq([{id: "1"}, {id: "2"}]);
      });
    });

    describe("PATCH /rest/calendars/events/:id", () => {
      it("should return headers", async () => {
        const response = await request
          .patch("/rest/calendars/events/1")
          .send({
            startDate: new Date(),
            endDate: new Date(),
            Name: "test"
          });

        expect(response.status).to.eq(200);
      });
    });
  });
});
