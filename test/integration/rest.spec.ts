import {ExpressApplication} from "@tsed/common";
import {bootstrap, inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {FakeServer} from "./app/FakeServer";

describe("Rest", () => {
  let app: SuperTest.SuperTest<SuperTest.Test>;
  before(bootstrap(FakeServer));
  before(
    inject([ExpressApplication], (expressApplication: ExpressApplication) => {
      app = SuperTest(expressApplication);
    })
  );
  after(TestContext.reset);
  describe("integration", () => {
    describe("GET /rest", () => {
      it("should return html content", done => {
        app
          .get("/rest/html")
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }

            expect(response.text).to.be.an("string");

            done();
          });
      });
    });

    describe("GET /rest/calendars", () => {
      it("should return an object (without annotation)", done => {
        app
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
        app
          .get("/rest/calendars/annotation/test/1")
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

      it("should return an object (Via promised response)", (done: Function) => {
        app
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
        app
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
        app
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
        app
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
        app
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
        app
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
        app
          .get("/rest/calendars/mvc")
          .set({authorization: "token"})
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              throw err;
            }

            const obj = JSON.parse(response.text);

            expect(obj).to.be.an("object");
            expect(obj.id).to.equal(1);

            done();
          });
      });

      it("should use mvc to provide info (UseAfter)", (done: Function) => {
        app
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
        app
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
        app
          .put("/rest/calendars")
          .expect(400)
          .end((err: any, response: any) => {
            expect(response.error.text).to.contains("Bad request, parameter \"request.body.name\" is required.");
            done();
          });
      });

      it("should return an object", (done: Function) => {
        app
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

    describe("DELETE /rest/calendars", () => {
      it("should throw a Forbidden", (done: Function) => {
        app
          .delete("/rest/calendars")
          .expect(403)
          .end((err: any, response: any) => {
            expect(response.error.text).to.contains("Forbidden");
            done();
          });
      });

      it("should throw a BadRequest", (done: Function) => {
        app
          .delete("/rest/calendars")
          .set({authorization: "token"})
          .expect(400)
          .end((err: any, response: any) => {
            expect(response.error.text).to.contains("Bad request, parameter \"request.body.id\" is required.");

            done();
          });
      });
    });

    describe("HEAD /rest/calendars/events", () => {
      it("should return headers", done => {
        app
          .head("/rest/calendars/events")
          .expect(200)
          .end((err: any, response: any) => {
            expect(response.text).to.eq(undefined);

            done();
          });
      });
    });

    describe("PATCH /rest/calendars/events/:id", () => {
      it("should return headers", done => {
        app
          .patch("/rest/calendars/events/1")
          .send({
            startDate: new Date(),
            endDate: new Date(),
            name: "test"
          })
          .expect(200)
          .end(done);
      });
    });

    describe("POST /rest/user/", () => {
      it("should allow creation", done => {
        app
          .post(`/rest/user/`)
          .send({name: "test", email: null, password: null})
          .expect(201)
          .end((err: any, response: any) => {
            if (err) {
              return done(err);
            }
            expect(JSON.parse(response.text)).to.deep.eq({name: "test", email: null, password: null});
            done();
          });
      });

      it("should return an error when email is empty", done => {
        app
          .post(`/rest/user/`)
          .send({name: "test", email: "", password: null})
          .expect(400)
          .end((err: any, response: any) => {
            expect(JSON.parse(response.headers.errors)).to.deep.eq([
              {
                dataPath: ".email",
                keyword: "format",
                message: "should match format \"email\"",
                modelName: "User",
                params: {
                  format: "email"
                },
                schemaPath: "#/properties/email/format"
              }
            ]);

            expect(response.text).to.eq("Bad request on parameter \"request.body\".<br />At User.email should match format \"email\"");
            done();
          });
      });

      it("should return an error when password is empty", done => {
        app
          .post(`/rest/user/`)
          .send({name: "test", email: "test@test.fr", password: ""})
          .expect(400)
          .end((err: any, response: any) => {
            expect(response.text).to.eq(
              "Bad request on parameter \"request.body\".<br />At User.password should NOT be shorter than 6 characters"
            );

            expect(JSON.parse(response.headers.errors)).to.deep.eq([
              {
                keyword: "minLength",
                dataPath: ".password",
                schemaPath: "#/properties/password/minLength",
                params: {limit: 6},
                message: "should NOT be shorter than 6 characters",
                modelName: "User"
              }
            ]);
            done();
          });
      });

      it("should allow creation (2)", done => {
        app
          .post(`/rest/user/`)
          .send({name: "test", email: "test@test.fr", password: "test1267"})
          .expect(400)
          .end((err: any, response: any) => {
            expect(JSON.parse(response.text)).to.deep.eq({name: "test", email: "test@test.fr", password: "test1267"});
            done();
          });
      });
    });

    describe("GET /rest/user/:id", () => {
      const send = (id: string) =>
        new Promise((resolve, reject) => {
          app
            .get(`/rest/user/${id}`)
            .expect(200)
            .end((err: any, response: any) => {
              if (err) {
                reject(err);
              } else {
                resolve({id, ...JSON.parse(response.text)});
              }
            });
        });

      it("should respond with the right userid", () => {
        const promises = [];

        promises.push(send("0"));
        promises.push(send("1"));
        promises.push(send("2"));

        return Promise.all(promises).then(responses => {
          expect(responses).to.deep.eq([
            {
              id: "0",
              idCtrl: "0",
              idSrv: "0",
              userId: "0"
            },
            {
              id: "1",
              idCtrl: "1",
              idSrv: "1",
              userId: "1"
            },
            {
              id: "2",
              idCtrl: "2",
              idSrv: "2",
              userId: "2"
            }
          ]);
        });
      });
    });
  });

  describe("GET /rest/products", () => {
    it("should respond with the right userid", done => {
      app
        .get(`/rest/products`)
        .expect(200)
        .end((err: any, response: any) => {
          expect(JSON.parse(response.text)).to.deep.eq([{id: "1", name: "test"}]);
          done();
        });
    });
  });

  describe("Errors", () => {
    it("GET /rest/errors/custom-bad-request", done => {
      app
        .get("/rest/errors/custom-bad-request")
        .expect(400)
        .end((err: any, response: any) => {
          expect(response.headers.errors).to.eq("[\"test\"]");
          expect(response.headers["x-header-error"]).to.eq("deny");
          expect(response.text).to.eq("Custom Bad Request");
          done();
        });
    });

    it("POST /rest/errors/required-param", done => {
      app
        .post("/rest/errors/required-param")
        .expect(400)
        .end((err: any, response: any) => {
          expect(response.text).to.eq("Bad request, parameter \"request.body.name\" is required.");

          expect(JSON.parse(response.headers.errors)).to.deep.eq([
            {
              dataPath: "",
              keyword: "required",
              message: "should have required param 'name'",
              modelName: "body",
              params: {
                missingProperty: "name"
              },
              schemaPath: "#/required"
            }
          ]);
          done();
        });
    });

    it("POST /rest/errors/required-model", done => {
      app
        .post("/rest/errors/required-model")
        .expect(400)
        .end((err: any, response: any) => {
          expect(response.text).to.eq(
            "Bad request on parameter \"request.body\".<br />At CustomModel should have required property 'name'"
          );

          expect(JSON.parse(response.headers.errors)).to.deep.eq([
            {
              dataPath: "",
              keyword: "required",
              message: "should have required property 'name'",
              modelName: "CustomModel",
              params: {
                missingProperty: "name"
              },
              schemaPath: "#/required"
            }
          ]);
          done();
        });
    });

    it("POST /rest/errors/required-model-2", done => {
      app
        .post("/rest/errors/required-model-2")
        .expect(400)
        .end((err: any, response: any) => {
          expect(response.text).to.eq("Property name on class CustomModel is required.");

          expect(JSON.parse(response.headers.errors)).to.deep.eq([
            {
              dataPath: "",
              keyword: "required",
              message: "should have required property 'name'",
              modelName: "CustomModel",
              params: {
                missingProperty: "name"
              },
              schemaPath: "#/required"
            }
          ]);
          done();
        });
    });

    it("GET /rest/errors/error (original error is not displayed", done => {
      app
        .get("/rest/errors/error")
        .expect(500)
        .end((err: any, response: any) => {
          expect(response.text).to.eq("Internal Error");
          done();
        });
    });

    it("GET /rest/errors/custom-internal-error", done => {
      app
        .get("/rest/errors/custom-internal-error")
        .expect(500)
        .end((err: any, response: any) => {
          expect(response.headers.errors).to.eq("[\"test\"]");
          expect(response.headers["x-header-error"]).to.eq("deny");
          expect(response.text).to.eq("My custom error");
          done();
        });
    });
  });
});
