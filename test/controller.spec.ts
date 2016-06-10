import * as Chai from "chai";
import * as Controllers from "./../lib/controllers";
import {FakeApplication} from "./helper/FakeApplication";
import {ICtrlRoute} from "../lib/controllers";

let expect: Chai.ExpectStatic = Chai.expect;
FakeApplication.getInstance();

describe("Controller", () => {

    it("load route in app", () => {
        let routes: ICtrlRoute[]  = Controllers.getRoutes();

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

    });


    describe("PUT /rest/calendars", () => {


        it("should throw a BadRequest", (done: Function) => {

            FakeApplication
                .getInstance()
                .request()
                .put('/rest/calendars')
                .expect(400)
                .end((err, response: any) => {

                   /* if (err){
                        throw (err);
                    }

                    let obj = JSON.parse(response.text);

                    expect(obj).to.be.an('object');
                    expect(obj.id).to.equal('1');
                    expect(obj.name).to.equal('test');*/

                    done();
                });

        });
    });

/*
    describe('GET annotation/method/get', function(){

        it('should respond status 403', function(done){
            let app = new FakeApplication();

            Controllers.load(app);
            
            app
                .request()
                .get('/annotation/method/get')
                .expect(200, done);
        });

    });
    
    /*
    it("should create an endpoints Map", function(){

        expect(endpoints).to.be.an.instanceOf(Map);
        expect(endpoints.size).to.equal(6);

    });

    it("endpoint (global) should have an item without route", function(){

        let endpointHandler:any = endpoints.get("useGlobal");

        expect(endpointHandler.route).to.be.undefined;
        expect(endpointHandler.handler).to.be.an.instanceOf(Function);

        let args = endpointHandler.toArray();

        expect(args).to.be.an("array");
        expect(args.length).to.equal(1);
        expect(args[0]).to.be.a("function");

    });

    it("endpoint (get global) should have an item without route", function(){

        let endpointHandler:any = endpoints.get("useGetGlobal");

        expect(endpointHandler.route).to.be.undefined;
        expect(endpointHandler.method).to.equal("get");
        expect(endpointHandler.handler).to.be.an.instanceOf(Function);

        let args = endpointHandler.toArray();

        expect(args).to.be.an("array");
        expect(args.length).to.equal(2);
        expect(args[0]).to.equal("get");
        expect(args[1]).to.be.a("function");

    });

    it("endpoint (middleware) should have an item with route", function(){

        let endpointHandler:any = endpoints.get("useAsMiddleware");

        expect(endpointHandler.route).to.equal('/test');
        expect(endpointHandler.method).to.be.undefined;
        expect(endpointHandler.handler).to.be.an.instanceOf(Function);

        let args = endpointHandler.toArray();

        expect(args).to.be.an("array");
        expect(args.length).to.equal(2);
        expect(args[0]).to.equal("/test");
        expect(args[1]).to.be.a("function");

    });

    it("endpoint (middleware + regExp) should have an item with route", function(){

        let endpointHandler:any = endpoints.get("useAsMiddleware2");

        expect(endpointHandler.route).to.be.an.instanceOf(RegExp);
        expect(endpointHandler.method).to.be.undefined;
        expect(endpointHandler.handler).to.be.an.instanceOf(Function);

        let args = endpointHandler.toArray();

        expect(args).to.be.an("array");
        expect(args.length).to.equal(2);
        expect(args[0]).to.be.an.instanceOf(RegExp);
        expect(args[1]).to.be.a("function");

    });

    it("endpoint (routing) should have an item with route", function(){

        let endpointHandler:any = endpoints.get("useGet");

        expect(endpointHandler.route).to.equal("/test");
        expect(endpointHandler.method).to.equal("get");
        expect(endpointHandler.handler).to.be.an.instanceOf(Function);

        let args = endpointHandler.toArray();

        expect(args).to.be.an("array");
        expect(args.length).to.equal(3);
        expect(args[0]).to.equal("get");
        expect(args[1]).to.equal("/test");
        expect(args[2]).to.be.an.instanceOf(Function);

    });

    it("endpoint (routing + middleware) should have an item with route", function(){

        let endpointHandler:any = endpoints.get("useGetAndMdl");

        expect(endpointHandler.route).to.equal("/test");
        expect(endpointHandler.method).to.equal("get");
        expect(endpointHandler.handler).to.be.an.instanceOf(Function);

        let args = endpointHandler.toArray();

        expect(args).to.be.an("array");
        expect(args.length).to.equal(4);
        expect(args[0]).to.equal("get");
        expect(args[1]).to.equal("/test");
        expect(args[2]).to.equal(Helper.Middleware);
        expect(args[3]).to.be.an.instanceOf(Function);

    });

    it("register all routes", function() {

        let router = Express.Router();

        //console.log(Endpoints)

        testController.register(router);

        //console.log("Router", router);


    });
*/
});