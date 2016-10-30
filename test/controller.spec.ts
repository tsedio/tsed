import * as Chai from "chai";
import Controller from "../src/controllers/controller";
import {FakeApplication} from "./helper/FakeApplication";
import {IControllerRoute} from '../src/interfaces/ControllerRoute';

let expect: Chai.ExpectStatic = Chai.expect;
FakeApplication.getInstance();

describe("Controller", () => {

    it("load route in app", () => {
        let routes: IControllerRoute[]  = Controller.getRoutes();

        expect(routes).to.be.an('array');
        expect(routes.length > 0).to.be.true;
        
    });

    describe("GET /rest/calendars", () => {

        it("should return an object (without annotation)", (done: Function) => {


            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/classic/1')
                .expect(200)
                .end((err, response: any) => {
                    
                    if (err){
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

                    if (err){
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

                    if (err){
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

                    if (err){
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

                    if (err){
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('object');
                    expect(obj.user).to.equal(1);
                    expect(obj.token).to.equal("tokenauth");

                    done();
                });

        });

        it("should return token", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .get('/rest/calendars/token')
                //.send({id: 1})
                .set({authorization: "token"})
                .set("Cookie", "authorization=token")
                .expect(200)
                .end((err, response: any) => {

                    let token = JSON.parse(response.text);

                    expect(token).to.be.an("string");
                    expect(token).to.equal("token");
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

                    let token = JSON.parse(response.text);

                    expect(token).to.be.an("string");
                    expect(token).to.equal("ts-express-decorators");
                    done();
                });

        });

    });

    xdescribe("PUT /rest/calendars", () => {

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

    xdescribe("DELETE /rest/calendars", () => {

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
});