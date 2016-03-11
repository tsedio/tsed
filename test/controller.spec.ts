import * as Endpoints from "../lib/endpoints";
import * as Chai from "chai";
import * as Express from "express";
import * as Helper from "./helper/helper";

let expect: Chai.ExpectStatic = Chai.expect;

describe("Controller", function(){

    let testController, endpoints;

    beforeEach(function(){

        testController = new Helper.TestController();
        endpoints = Endpoints.get(Helper.TestController);

    });

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

});