import * as SuperTest from "supertest";
import {ExpressApplication} from "../../src/mvc/decorators";
import {bootstrap} from "../../src/testing";
import {Done} from "../../src/testing/done";
import {inject} from "../../src/testing/inject";
import {expect} from "../tools";
import {FakeServer} from "./FakeServer";


describe("Rest", () => {

    before(bootstrap(FakeServer));
    before(inject([ExpressApplication], (expressApplication: ExpressApplication) =>
        this.app = SuperTest(expressApplication)
    ));

    describe("GET /rest", () => {
        it("should return html content", inject([Done], (done: Function) => {
            this.app
                .get("/rest/html")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    expect(response.text).to.be.an("string");

                    done();
                });

        }));
    });

    describe("GET /rest/calendars", () => {

        it("should return an object (without annotation)", inject([Done], (done: Function) => {

            this.app
                .get("/rest/calendars/classic/1")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }
                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal("1");
                    expect(obj.name).to.equal("test");

                    done();
                });

        }));

        it("should return an object (PathParamsType annotation)", (done: Function) => {

            this.app
                .get("/rest/calendars/annotation/test/1")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal("1");
                    expect(obj.name).to.equal("test");

                    done();
                });

        });

        it("should return an object (Via promised response)", (done: Function) => {

            this.app
                .get("/rest/calendars/annotation/promised/1")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }
                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal("1");
                    expect(obj.name).to.equal("test");

                    done();
                });

        });

        it("should return an object status (Via promised response)", (done: Function) => {

            this.app
                .get("/rest/calendars/annotation/status/1")
                .expect(202)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal("1");
                    expect(obj.name).to.equal("test");

                    done();
                });

        });

        it("should use middleware to provide user info", (done: Function) => {

            this.app
                .get("/rest/calendars/middleware")
                .set({
                    Authorization: "tokenauth"
                })
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.user).to.equal(1);
                    expect(obj.token).to.equal("tokenauth");

                    done();
                });

        });

        it("should set token", (done: Function) => {

            this.app
                .get("/rest/calendars/token/newTOKENXD")
                // .send({id: 1})
                .set("Cookie", "authorization=auth")
                .expect(200)
                .end((err: any, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("token updated");
                    done();
                });

        });

        it("should return get updated token", (done: Function) => {

            this.app
                .get("/rest/calendars/token")
                // .send({id: 1})
                .set("Cookie", "authorization=auth")
                .expect(200)
                .end((err: any, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("newTOKENXD");
                    done();
                });

        });

        it("should return query", (done: Function) => {

            this.app
                .get("/rest/calendars/query?search=ts-express-decorators")
                .expect(200)
                .end((err: any, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("ts-express-decorators");
                    done();
                });

        });

        it("should use mvc to provide info (Use)", (done: Function) => {

            this.app
                .get("/rest/calendars/mvc")
                .set({authorization: "token"})
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal(1);

                    done();
                });

        });

        it("should use mvc to provide info (UseAfter)", (done: Function) => {

            this.app
                .get("/rest/calendars/middlewares2")
                .set({authorization: "token"})
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal(10909);

                    done();
                });

        });

        it("should set all headers", (done: Function) => {

            this.app
                .get("/rest/calendars/headers")
                .expect(200)
                .end((err: any, response: any) => {

                    if (err) {
                        throw (err);
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

            this.app
                .put("/rest/calendars")
                .expect(400)
                .end((err: any, response: any) => {
                    expect(response.error.text).to.contains("Bad request, parameter request.body.name is required.");
                    done();
                });

        });

        it("should return an object", (done: Function) => {

            this.app
                .put("/rest/calendars")
                .send({name: "test"})
                .expect(200)
                .end((err: any, response: any) => {

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.name).to.equal("test");
                    done();
                });

        });
    });

    describe("DELETE /rest/calendars", () => {

        it("should throw a Forbidden", (done: Function) => {

            this.app
                .delete("/rest/calendars")
                .expect(403)
                .end((err: any, response: any) => {

                    expect(response.error.text).to.contains("Forbidden");
                    done();
                });

        });

        it("should throw a BadRequest", (done: Function) => {

            this.app
                .delete("/rest/calendars")
                .set({authorization: "token"})
                .expect(400)
                .end((err: any, response: any) => {

                    expect(response.error.text).to.contains("Bad request, parameter request.body.id is required.");

                    done();
                });

        });


    });

    describe("HEAD /rest/calendars/events", () => {

        it("should return headers", (done) => {
            this.app
                .head("/rest/calendars/events")
                .expect(200)
                .end((err: any, response: any) => {

                    expect(response.text).to.eq(undefined);

                    done();
                });
        });

    });

    describe("PATCH /rest/calendars/events/:id", () => {

        it("should return headers", (done) => {
            this.app
                .patch("/rest/calendars/events/1")
                .expect(200)
                .end((err: any, response: any) => {


                    done();
                });
        });

    });
});