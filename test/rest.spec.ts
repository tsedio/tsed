import {expect} from "chai";

import {$log} from "ts-log-debug";
import {ExpressApplication} from "../src/services";
import {inject} from "../src/testing";
$log.stop();
describe("Rest :", () => {
    before((done) => {
        const {FakeApplication} = require("./helper/FakeApplication");

        this.fakeApplication = new FakeApplication();
        this.fakeApplication.initializeSettings().then(done);
    });

    before(inject([ExpressApplication], (expressApplication: ExpressApplication) => {
        this.expressApplication = expressApplication;
    }));

    describe("GET /rest", () => {
        it("should return all routes", (done) => {
            this.fakeApplication
                .request()
                .get("/rest/")
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

        it("should return html content", (done) => {
            this.fakeApplication
                .request()
                .get("/rest/html")
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    expect(response.text).to.be.an("string");

                    done();
                });

        });
    });

    describe("GET /rest with conflict routes", () => {
        it("should return id", (done: Function) => {
            this.fakeApplication
                .request()
                .get("/rest/test")
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    expect(response.text).to.eq("test");

                    done();
                });

        });
    });

    describe("GET /rest/calendars", () => {
        it("should return an object (without annotation)", (done) => {

            this.fakeApplication
                .request()
                .get("/rest/calendars/classic/1")
                .expect(200)
                .end((err, response: any) => {

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

        it("should return an object (PathParams annotation)", (done: Function) => {

            this.fakeApplication
                .request()
                .get("/rest/calendars/annotation/test/1")
                .expect(200)
                .end((err, response: any) => {

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

            this.fakeApplication
                .request()
                .get("/rest/calendars/annotation/promised/1")
                .expect(200)
                .end((err, response: any) => {

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

            this.fakeApplication
                .request()
                .get("/rest/calendars/annotation/status/1")
                .expect(202)
                .end((err, response: any) => {

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

            this.fakeApplication
                .request()
                .get("/rest/calendars/middleware")
                .set({
                    Authorization: "tokenauth"
                })
                .expect(200)
                .end((err, response: any) => {

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

            this.fakeApplication
                .request()
                .get("/rest/calendars/token/newTOKENXD")

                .set("Cookie", "authorization=auth")
                .expect(200)
                .end((err, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("token updated");
                    done();
                });

        });

        it("should return get updated token", (done: Function) => {

            this.fakeApplication
                .request()
                .get("/rest/calendars/token")
                .set("Cookie", "authorization=auth")
                .expect(200)
                .end((err, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("newTOKENXD");
                    done();
                });

        });

        it("should return query", (done: Function) => {

            this.fakeApplication
                .request()
                .get("/rest/calendars/query?search=ts-express-decorators")
                .expect(200)
                .end((err, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("ts-express-decorators");
                    done();
                });

        });

        it("should use middlewares to provide info (Use)", (done: Function) => {

            this.fakeApplication
                .request()
                .get("/rest/calendars/middlewares")
                .set({authorization: "token"})
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.id).to.equal(1);

                    done();
                });

        });

        it("should use middlewares to provide info (UseAfter)", (done: Function) => {

            this.fakeApplication
                .request()
                .get("/rest/calendars/middlewares2")
                .set({authorization: "token"})
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.uuid).to.equal(10909);

                    done();
                });

        });

        it("should set all headers", (done: Function) => {

            this.fakeApplication
                .request()
                .get("/rest/calendars/headers")
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    expect(response.headers["x-token-test"]).to.equal("test");
                    expect(response.headers["x-token-test-2"]).to.equal("test2");
                    expect(response.headers["x-managed-by"]).to.equal("TS-Express-Decorators");
                    expect(response.headers["content-type"]).to.equal("application/xml; charset=utf-8");

                    done();
                });

        });
    });

    describe("PUT /rest/calendars", () => {

        it("should throw a BadRequest", (done: Function) => {

            $log.setRepporting({
                error: false
            });

            this.fakeApplication
                .request()
                .put("/rest/calendars")
                .expect(400)
                .end((err, response: any) => {
                    expect(response.error.text).to.contains("Bad request, parameter request.body.name is required.");
                    done();
                });

        });

        it("should return an object", (done: Function) => {

            this.fakeApplication
                .request()
                .put("/rest/calendars")
                .send({name: "test"})
                .expect(200)
                .end((err, response: any) => {

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an("object");
                    expect(obj.name).to.equal("test");
                    done();
                });

        });
    });

    describe("DELETE /rest/calendars", () => {

        it("should throw a Forbidden", (done: Function) => {

            $log.setRepporting({
                error: false
            });

            this.fakeApplication
                .request()
                .delete("/rest/calendars")
                .expect(403)
                .end((err, response: any) => {

                    expect(response.error.text).to.contains("Forbidden");
                    done();
                });

        });

        it("should throw a BadRequest", (done: Function) => {

            $log.setRepporting({
                error: false
            });

            this.fakeApplication
                .request()
                .delete("/rest/calendars")
                .set({authorization: "token"})
                .expect(400)
                .end((err, response: any) => {

                    expect(response.error.text).to.contains("Bad request, parameter request.body.id is required.");

                    $log.setRepporting({
                        error: true
                    });
                    done();
                });

        });


    });

    describe("HEAD /rest/calendars/events", () => {

        it("should return headers", (done) => {
            this.fakeApplication
                .request()
                .head("/rest/calendars/events")
                .expect(200)
                .end((err, response: any) => {


                    done();
                });
        });

    });

    describe("PATCH /rest/calendars/events/:id", () => {

        it("should return headers", (done) => {
            this.fakeApplication
                .request()
                .patch("/rest/calendars/events/1")
                .expect(200)
                .end((err, response: any) => {


                    done();
                });
        });

    });
});