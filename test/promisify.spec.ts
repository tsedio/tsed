import Chai = require("chai");
import {Promisify} from "../lib/promisify";
import {TestPromisify} from "./helper/TestPromisify";
import Promise = require("bluebird");
import {BadRequest} from "httpexceptions/lib/badrequest";
import {FakeRequest} from "./helper/FakeRequest";
import {FakeResponse} from "./helper/FakeResponse";

let expect: Chai.ExpectStatic = Chai.expect;

describe("Promisify()", function() {

    let response: FakeResponse, request: FakeRequest, next: Function;

    beforeEach(function () {
        request =   new FakeRequest();
        response =  new FakeResponse();
        next =      () => {};
    });

    it("should do create a function", function () {

        let foo = new TestPromisify();
        let fn = Promisify(foo, "myMethod");

        expect(fn).to.be.instanceOf(Function);
        expect(fn).to.not.equal(foo.myMethod);

    });


    describe("Promisify().decorator", () => {

        it("should return promise ", (done) => {

            let foo: TestPromisify =    new TestPromisify();
            let fn: Function =          Promisify(foo, 'myMethod');
            let promise: Promise<any> = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function, "Isn't instance of function");
            expect(fn).to.not.equal(foo.myMethod, "Not equal to method");

            expect(promise).to.be.an.instanceOf(Promise, "Isn't instance of Promise");
            expect(foo.called).to.be.true;

            promise.then(function(data){

                expect(data).to.equal(undefined);

                done();
            });

        });

        it("should run a method wich return value", (done) => {

            let foo: TestPromisify =    new TestPromisify();
            let fn: Function =          Promisify(foo, foo.myMethodReturnValue);
            let promise: Promise<any> = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function);
            expect(fn).to.not.equal(foo.myMethod);

            expect(promise).to.be.an.instanceOf(Promise);
            expect(foo.called).to.be.true;

            promise.then(function(data){

                expect(data).to.be.an("object");
                expect(data.data).to.equal("yes");


                // Response value
                expect(response._status).to.equal(200);
                expect(response._headers).to.contain("Content-Type:text/json");
                expect(JSON.stringify(response._json)).to.equal("{\"data\":\"yes\",\"_id\":1}");

                done();
            });

            //

        });

        it("should run a method wich return promise", (done) => {

            request.method = 'POST';
            request.path = "rest/test";

            let foo: TestPromisify =    new TestPromisify();
            let fn: Function =          Promisify(foo, 'myMethodPromised');
            let promise: Promise<any> = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function);
            expect(fn).to.not.equal(foo.myMethod);

            expect(promise).to.be.an.instanceOf(Promise);
            expect(foo.called).to.be.true;


            promise.then((data) => {

                expect(data).to.be.an("object");
                expect(data.data).to.equal("yes");

                // Response value
                expect(response._status).to.equal(201);
                //expect(response._location).to.equal("rest/test/1");
                expect(response._headers).to.contain("Content-Type:text/json");
                expect(JSON.stringify(response._json)).to.equal("{\"data\":\"yes\",\"_id\":1}");

                done();
            });


            //

        });

        it("should run a method witch throw error", (done) => {

            let foo: TestPromisify = new TestPromisify();
            let fn: Function = Promisify(foo, 'myMethodThrowException');
            let promise: Promise<any> = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function);
            expect(fn).to.not.equal(foo.myMethod);

            expect(promise).to.be.an.instanceOf(Promise);

            promise.then(
                function(data){
                    expect(true).to.be.false;
                    done();
                },
                function(err){
                    expect(err).to.be.an.instanceOf(BadRequest);
                    done();
                });


        });
    });

});