

import Chai = require("chai");
import * as Helper from "./helper/helper";
import {invoke} from "../../lib/injector";
import {BodyParamsRequired} from "../index";
import {QueryParamsRequired} from "../index";
import {PathParamsRequired} from "../index";
import {ParamsRequired} from "../index";
import {CookiesParamsRequired} from "../index";
import {FakeResponse} from "./helper/FakeResponse";
import {FakeRequest} from "./helper/FakeRequest";
import {checkParamsRequired} from "../../lib/params";

let expect: Chai.ExpectStatic = Chai.expect;

describe("Params", function(){

    let response: FakeResponse, request: FakeRequest, next: Function;

    beforeEach(function () {
        request =   new FakeRequest();
        response =  new FakeResponse();
        next =      () => {};
    });

    describe("checkParamsRequired()", function(){
        it("should return required params", function(){
            let list = checkParamsRequired(["test", "test2"], {
                test2: true
            });

            expect(list).to.be.an("array");
            expect(list.length).to.equal(1);

        });
    });

    describe("ParamsRequiredFactory()", function() {

        it("ParamsRequired should do create a function", function(){

            let fn = ParamsRequired("body", "test", "test2");

            expect(fn).to.be.instanceOf(Function);
            
            fn(request, response, next);

        });

        it("BodyParamsRequired should do create a function", function(){

            let fn = BodyParamsRequired("test", "test2");

            expect(fn).to.be.instanceOf(Function);

        });

        it("CookiesParamsRequired should do create a function", function(){

            let fn = CookiesParamsRequired("test", "test2");

            expect(fn).to.be.instanceOf(Function);

        });

        it("PathParamsRequired should do create a function", function(){

            let fn = PathParamsRequired("test", "test2");

            expect(fn).to.be.instanceOf(Function);

        });

        it("QueryParamsRequired should do create a function", function(){

            let fn = QueryParamsRequired("test", "test2");

            expect(fn).to.be.instanceOf(Function);

        });


/*
        it("should return error", function(){

            let foo = new Helper.TestParamsRequiredFactory();
            let fn = ParamsRequiredFactory(["test2"], "params");

            let descriptor = fn(foo, "myMethod", {});

            expect(descriptor).to.be.an("object");
            expect(foo.middlewares.myMethod).to.be.instanceOf(MiddlewaresRegistry);
            expect(foo.middlewares.myMethod.handlers).to.be.an("array");
            expect(foo.middlewares.myMethod.handlers.length).to.equal(1);


            let called = false;
            let request = {
                params: {
                    test: "hello"
                }
            };

            let next = function(value){
                called = true;
                expect(value).to.be.an.instanceOf(BadRequest); // Error
            };


            foo.middlewares.myMethod.handlers[0].callback(request, {}, next);

            expect(called).to.be.true;

        });*/

    });

    describe("Params", function(){
        let testParams: any;

        beforeEach(function(){
            testParams = new Helper.TestParams();
        });

        it("should have a $inject list", function(){

            expect(testParams.getParams.$inject).to.be.an("array");
            expect(testParams.getParams.$inject.length).to.equal(5);
        });
/*
        it("should invoke function", function(){

            let returnedValue: any = invoke(testParams, testParams.getParams, {
                request:    new FakeRequest(),
                response:   new FakeResponse(),
                next:       () => {}
            });

            expect(returnedValue).to.be.undefined;
            expect(testParams.name).to.be.equal("testValue");
            expect(testParams.value).to.be.equal("testValue");
            expect(testParams.request).to.an.instanceOf(FakeRequest);
            expect(testParams.response).to.an.instanceOf(FakeResponse);
            expect(testParams.next).to.be.a("function");
        });*/
    });

    describe("BodyParams", function(){
        let testParams: any;

        beforeEach(function(){
            testParams = new Helper.TestParams();
        });

        it("should have a $inject list", function(){

            expect(testParams.getBodyParams.$inject).to.be.an("array");
            expect(testParams.getBodyParams.$inject.length).to.equal(5);
        });

        it("should invoke function", function(){

            let returnedValue: any = invoke(testParams, testParams.getBodyParams, {
                request:    new FakeRequest(),
                response:   new FakeResponse(),
                next:       () => {}
            });

            expect(returnedValue).to.be.undefined;
            expect(testParams.name).to.be.equal("testValue");
            expect(testParams.value).to.be.equal("testValue");
            expect(testParams.request).to.an.instanceOf(FakeRequest);
            expect(testParams.response).to.an.instanceOf(FakeResponse);
            expect(testParams.next).to.be.a("function");
        });
    });

    describe("CookiesParams", function(){
        let testParams: any;

        beforeEach(function(){
            testParams = new Helper.TestParams();
        });

        it("should have a $inject list", function(){

            expect(testParams.getCookies.$inject).to.be.an("array");
            expect(testParams.getCookies.$inject.length).to.equal(5);
        });

        it("should invoke function", function(){

            let returnedValue: any = invoke(testParams, testParams.getCookies, {
                request:    new FakeRequest(),
                response:   new FakeResponse(),
                next:       () => {}
            });

            expect(returnedValue).to.be.undefined;
            expect(testParams.name).to.be.equal("testValue");
            expect(testParams.value).to.be.equal("testValue");
            expect(testParams.request).to.an.instanceOf(FakeRequest);
            expect(testParams.response).to.an.instanceOf(FakeResponse);
            expect(testParams.next).to.be.a("function");
        });
    });

    describe("PathParams", function(){
        let testParams: any;

        beforeEach(function(){
            testParams = new Helper.TestParams();
        });

        it("should have a $inject list", function(){

            expect(testParams.getPathParams.$inject).to.be.an("array");
            expect(testParams.getPathParams.$inject.length).to.equal(5);
        });

        it("should invoke function", function(){

            let returnedValue: any = invoke(testParams, testParams.getPathParams, {
                request:    new FakeRequest(),
                response:   new FakeResponse(),
                next:       () => {}
            });

            expect(returnedValue).to.be.undefined;
            expect(testParams.name).to.be.equal("testValue");
            expect(testParams.value).to.be.equal("testValue");
            expect(testParams.request).to.an.instanceOf(FakeRequest);
            expect(testParams.response).to.an.instanceOf(FakeResponse);
            expect(testParams.next).to.be.a("function");
        });
    });

    describe("QueryParams", function(){
        let testParams: any;

        beforeEach(function(){
            testParams = new Helper.TestParams();
        });

        it("should have a $inject list", function(){

            expect(testParams.getQueryParams.$inject).to.be.an("array");
            expect(testParams.getQueryParams.$inject.length).to.equal(5);
        });

        it("should invoke function", function(){

            let returnedValue: any = invoke(testParams, testParams.getQueryParams, {
                request:    new FakeRequest(),
                response:   new FakeResponse(),
                next:       () => {}
            });

            expect(returnedValue).to.be.undefined;
            expect(testParams.name).to.be.equal("testValue");
            expect(testParams.value).to.be.equal("testValue");
            expect(testParams.request).to.an.instanceOf(FakeRequest);
            expect(testParams.response).to.an.instanceOf(FakeResponse);
            expect(testParams.next).to.be.a("function");
        });
    });

});
