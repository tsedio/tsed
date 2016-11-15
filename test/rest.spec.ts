import {expect} from "chai";

describe('Rest :', () => {
    describe("GET /rest/calendars", () => {
        const {FakeApplication} = require("./helper/FakeApplication");
        //FakeApplication.getInstance();

        it("should return an object (without annotation)", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/classic/1')
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('object');
                    expect(obj.id).to.equal('1');
                    expect(obj.name).to.equal('test');

                    done();
                });

        });

        it("should return an object (PathParams annotation)", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/annotation/test/1')
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('object');
                    expect(obj.id).to.equal('1');
                    expect(obj.name).to.equal('test');

                    done();
                });

        });

        it("should return an object (Via promised response)", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/annotation/promised/1')
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('object');
                    expect(obj.id).to.equal('1');
                    expect(obj.name).to.equal('test');

                    done();
                });

        });

        it("should return an object (Via promised response)", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/annotation/status/1')
                .expect(202)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('object');
                    expect(obj.id).to.equal('1');
                    expect(obj.name).to.equal('test');

                    done();
                });

        });

        it("should use middleware to provide user info", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/middleware')
                .set({
                    Authorization: 'tokenauth'
                })
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('object');
                    expect(obj.user).to.equal(1);
                    expect(obj.token).to.equal("tokenauth");

                    done();
                });

        });

        it("should set token", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/token/newTOKENXD')
                //.send({id: 1})
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

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/token')
                //.send({id: 1})
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

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/query?search=ts-express-decorators')
                .expect(200)
                .end((err, response: any) => {

                    let token = response.text;

                    expect(token).to.be.an("string");
                    expect(token).to.equal("ts-express-decorators");
                    done();
                });

        });

    });

    describe("PUT /rest/calendars", () => {

        const {FakeApplication} = require("./helper/FakeApplication");

        it("should throw a BadRequest", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .put('/rest/calendars')
                .expect(400)
                .end((err, response: any) => {
                    expect(response.error.text).to.equal("Bad request, parameter request.body.name is required.");
                    done();
                });

        });

        it("should return an object", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .put('/rest/calendars')
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
        const {FakeApplication} = require("./helper/FakeApplication");

        it("should throw a Forbidden", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .delete('/rest/calendars')
                .expect(403)
                .end((err, response: any) => {

                    expect(response.error.text).to.equal("Forbidden");
                    done();
                });

        });

        it("should throw a BadRequest", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .delete('/rest/calendars')
                .set({authorization: "token"})
                .expect(400)
                .end((err, response: any) => {

                    expect(response.error.text).to.equal("Bad request, parameter request.body.id is required.");
                    done();
                });

        });


    });

    describe("HEAD /rest/calendars/events", () => {
        const {FakeApplication} = require("./helper/FakeApplication");

        it("should return headers", (done) => {
            FakeApplication
                .getInstance()
                .request()
                .head('/rest/calendars/events')
                .expect(200)
                .end((err, response: any) => {



                    done();
                });
        });

    });


    describe("PATCH /rest/calendars/events/:id", () => {
        const {FakeApplication} = require("./helper/FakeApplication");

        it("should return headers", (done) => {
            FakeApplication
                .getInstance()
                .request()
                .patch('/rest/calendars/events/1')
                .expect(200)
                .end((err, response: any) => {



                    done();
                });
        });

    });

});