import {expect} from "chai";
import {ExpressApplication} from '../src/services';
import {Done} from '../src/testing/done';
import {inject} from '../src/testing/inject';

import {$log} from "ts-log-debug";

describe('Rest :', () => {

    describe("GET /rest", () => {
        const {FakeApplication} = require("./helper/FakeApplication");

        it("should create a fake application for test", (done) => {
            let result = FakeApplication.getInstance(done);

            expect(result !== undefined).to.equal(true);
        });

        it('should return all routes', inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Function) => {
            FakeApplication
                .getInstance()
                .request()
                .get('/rest/')
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('array');

                    done();
                });

        }));

        it('should return html content', inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Function) => {
            FakeApplication
                .getInstance()
                .request()
                .get('/rest/html')
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    expect(response.text).to.be.an('string');

                    done();
                });

        }));
    });

    describe("GET /rest/calendars", () => {
        const {FakeApplication} = require("./helper/FakeApplication");

        it("should return an object (without annotation)", inject([ExpressApplication, Done], (expressApplication: ExpressApplication, done: Function) => {

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

        }));

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

        it("should use middlewares to provide info (Use)", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/middlewares')
                .set({authorization: "token"})
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('object');
                    expect(obj.id).to.equal(1);

                    done();
                });

        });

        it("should use middlewares to provide info (UseAfter)", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/middlewares2')
                .set({authorization: "token"})
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('object');
                    expect(obj.uuid).to.equal(10909);

                    done();
                });

        });

        it("should set all headers", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/headers')
                .expect(200)
                .end((err, response: any) => {

                    if (err) {
                        throw (err);
                    }

                    expect(response.headers['x-token-test']).to.equal('test');
                    expect(response.headers['x-token-test-2']).to.equal('test2');
                    expect(response.headers['x-managed-by']).to.equal('TS-Express-Decorators');
                    expect(response.headers['content-type']).to.equal('application/xml; charset=utf-8');

                    done();
                });

        });
    });

    describe("PUT /rest/calendars", () => {

        const {FakeApplication} = require("./helper/FakeApplication");

        it("should throw a BadRequest", (done: Function) => {

            $log.setRepporting({
                error: false
            });

            FakeApplication
                .getInstance()
                .request()
                .put('/rest/calendars')
                .expect(400)
                .end((err, response: any) => {
                    expect(response.error.text).to.contains("Bad request, parameter request.body.name is required.");
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

            $log.setRepporting({
                error: false
            });

            FakeApplication
                .getInstance()
                .request()
                .delete('/rest/calendars')
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

            FakeApplication
                .getInstance()
                .request()
                .delete('/rest/calendars')
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