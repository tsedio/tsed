import * as Chai from "chai";
import Controller from "../src/controllers/controller";
import {FakeApplication} from "./helper/FakeApplication";
import {IControllerRoute} from '../src/interfaces/ControllerRoute';
import {FakeClass, FakeClassChildren} from './helper/FakeClass';
import Metadata from '../src/metadata/metadata';
import {CONTROLLER_URL, ENDPOINT_ARGS, CONTROLLER_DEPEDENCIES} from '../src/constants/metadata-keys';

let expect: Chai.ExpectStatic = Chai.expect;
//FakeApplication.getInstance();

describe("Controller", () => {

    describe("new Controller()", () => {

        //Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
        Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClass, "testMethod1");
        Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClass, "testMethod2");

        const ctrl: Controller = new (<any>Controller)(
            FakeClass,
            '/fake-class'
        );

        expect(ctrl.getName()).to.equal('FakeClass');
        expect(ctrl.hasEndpointUrl()).to.equal(true);
        expect(ctrl.getEndpointUrl()).to.equal('/fake-class');

        expect(ctrl.getInstance()).to.not.equal(FakeClass);
        expect(ctrl.getInstance()).to.be.instanceof(FakeClass);

    });

    describe("new Controller() with depedencies", () => {

        Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
        Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClass, "testMethod1");
        Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClass, "testMethod2");

        Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
        Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClassChildren, "testMethod1");
        Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClassChildren, "testMethod2");

        const ctrl: Controller = new (<any>Controller)(
            FakeClass,
            '/fake-class',
            [FakeClassChildren]
        );

        const children: Controller =  new (<any>Controller)(
            FakeClassChildren,
            '/children',
            []
        );

        Controller.controllers = [ctrl, children];

        expect(ctrl.getName()).to.equal('FakeClass');
        expect(ctrl.hasEndpointUrl()).to.equal(true);
        expect(ctrl.getEndpointUrl()).to.equal('/fake-class');

        expect(ctrl.getInstance()).to.not.equal(FakeClass);
        expect(ctrl.getInstance()).to.be.instanceof(FakeClass);

        //expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');

        (<any>ctrl).resolveDepedencies();

        expect((<any>children).parent).to.equal(ctrl);
        expect((<any>ctrl).parent).to.equal(undefined);

    });

    describe("new Controller() with depedencies (string)", () => {

        Metadata.set(CONTROLLER_URL, '/fake-class', FakeClass);
        Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClass, "testMethod1");
        Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClass, "testMethod2");

        Metadata.set(CONTROLLER_URL, '/children', FakeClassChildren);
        Metadata.set(ENDPOINT_ARGS, ['get', '/'], FakeClassChildren, "testMethod1");
        Metadata.set(ENDPOINT_ARGS, ['post', '/'], FakeClassChildren, "testMethod2");

        const ctrl: Controller = new (<any>Controller)(
            FakeClass,
            '/fake-class',
            ["FakeClassChildren"]
        );

        const children: Controller =  new (<any>Controller)(
            FakeClassChildren,
            '/children',
            []
        );

        Controller.controllers = [ctrl, children];

        expect(ctrl.getName()).to.equal('FakeClass');
        expect(ctrl.hasEndpointUrl()).to.equal(true);
        expect(ctrl.getEndpointUrl()).to.equal('/fake-class');

        expect(ctrl.getInstance()).to.not.equal(FakeClass);
        expect(ctrl.getInstance()).to.be.instanceof(FakeClass);

        //expect(Metadata.get(CONTROLLER_DEPEDENCIES, FakeClass)).to.be.an('array');

        (<any>ctrl).resolveDepedencies();

        expect((<any>children).parent).to.equal(ctrl);
        expect((<any>ctrl).parent).to.equal(undefined);

    });


    /* xdescribe("Controller.get()", () => {

         it("should return the metadata controller by his name", () => {

             let ctrl: Controller = Controller.getController('CalendarCtrl');

             expect(ctrl != undefined).to.be.true;
             expect(ctrl).to.be.an('object');
             expect((<any>ctrl).targetClass !== undefined).to.be.true;

         });

         it("should return the metadata controller by his class", () => {

             let ctrl: Controller = Controller.getController(CalendarCtrl);

             expect(ctrl != undefined).to.be.true;
             expect(ctrl).to.be.an('object');
             expect((<any>ctrl).targetClass !== undefined).to.be.true;

         });

         it("should return the metadata controller by his instance", () => {

             let ctrl: Controller = Controller.getController(<any> new CalendarCtrl());

             expect(ctrl != undefined).to.be.true;
             expect(ctrl).to.be.an('object');
             expect((<any>ctrl).targetClass !== undefined).to.be.true;

         });

         it("should not return the controller", () => {

             try{
                 Controller.getController('CalendarCtrl2');
             }catch(er){
                 expect(er.message).to.contains("Controller CalendarCtrl2 not found.");
             }

         });

     });

     xdescribe("Controller.has()", () => {

         xit("should return true, when it's called with controller name", () => {

             let has: boolean = Controller.hasController('CalendarCtrl');

             expect(has).to.be.true;

         });

         it("should return true, when it's called with class", () => {

             let has: boolean = Controller.hasController(CalendarCtrl);

             expect(has).to.be.true;

         });

         it("should return true, when it's called with instance", () => {

             let has: boolean = Controller.hasController(<any> new CalendarCtrl());

             expect(has).to.be.true;

         });

         it("should return false when wrong class is given", () => {
             let CalendarCtrl2 = function myClassTest(){};

             let has: boolean = Controller.hasController(CalendarCtrl2);

             expect(has).to.be.false;

         });

     });

     xdescribe("Controller.instanciate()", () => {

         it("should instanciate new controller", () => {

             let myClass = function myClassTest(){};

             Controller.setUrl(myClass, '/test/myclass');
             Controller.setDepedencies(myClass, []);

             let ctrl: Controller = Controller.getController(new myClass).instanciate();

             expect(ctrl).to.be.an('object');
             expect((<any>ctrl).targetClass !== undefined).to.be.true;
             expect((<any>ctrl).instance instanceof myClass).to.be.true;

         });

         it("should throw error when controller is unknow", () => {

             let myClass = function myClassTest2(){};

             try {

                 Controller.getController(myClass).instanciate();

             }catch(er){
                 expect(er.toString()).to.equal('Error: Controller myClassTest2 not found.');
             }


         });

         it("load route in app", () => {
             let routes: IControllerRoute[]  = Controller.getRoutes();

             expect(routes).to.be.an('array');
             expect(routes.length > 0).to.be.true;

         });
     });

     xdescribe("Controller.getCtrls()", () => {

         it("should return a metadata controllers list", () => {
             let ctrls: Controller[] = Controller.controllers;

             expect(ctrls).to.be.an("array");
             expect(ctrls.length > 0).to.be.true;

             expect(ctrls[0]).to.be.an('object');
             expect((<any>ctrls[0]).targetClass !== undefined).to.be.true;

         });

     });*/

    /*xdescribe("GET /rest/calendars", () => {

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


    });*/


});