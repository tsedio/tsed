import Chai = require("chai");
import {Promisify} from "../lib/promisify";
import {BodyParams} from "../index";
import * as Helper from "./helper/helper";
import Promise = require("bluebird");
import {BadRequest} from "httpexceptions/lib/badrequest";

let expect: Chai.ExpectStatic = Chai.expect;

describe("Promisify()", function() {

    it("should do create a function", function () {

        let foo = new Helper.TestPromisify();
        let fn = Promisify(foo, "myMethod");

        expect(fn).to.be.instanceOf(Function);
        expect(fn).to.not.equal(foo.myMethod);

    });

    describe("Promisify().decorator", function() {

        it("should return promise ", function (done) {

            let request = {};
            let response = {};
            let next =  function(){

            };

            let foo = new Helper.TestPromisify();
            let fn = Promisify(foo, foo.myMethod);
            let promise = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function, "Isn't instance of function");
            expect(fn).to.not.equal(foo.myMethod, "Not equal to method");

            expect(promise).to.be.an.instanceOf(Promise, "Isn't instance of Promise");
            expect(foo.called).to.be.true;

            promise.then(function(data){

                expect(data).to.equal(undefined);

                done();
            });

        });

        it("should run a method wich return value", function (done) {

            let request = {};
            let response = new Helper.TestResponse();
            let next =  function(){

            };

            let foo = new Helper.TestPromisify();
            let fn = Promisify(foo, foo.myMethodReturnValue);
            let promise = fn(request, response, next);

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

        it("should run a method wich return promise", function (done) {

            let request = {
                method: "POST",
                path: "rest/test"
            };

            let response = new Helper.TestResponse();
            let next = () => {};

            let foo = new Helper.TestPromisify();
            let fn = Promisify(foo, foo.myMethodPromised);
            let promise = fn(request, response, next);

            expect(fn).to.be.instanceOf(Function);
            expect(fn).to.not.equal(foo.myMethod);

            expect(promise).to.be.an.instanceOf(Promise);
            expect(foo.called).to.be.true;


            promise.then(function(data){

                expect(data).to.be.an("object");
                expect(data.data).to.equal("yes");

                // Response value
                expect(response._status).to.equal(201);
                expect(response._location).to.equal("rest/test/1");
                expect(response._headers).to.contain("Content-Type:text/json");
                expect(JSON.stringify(response._json)).to.equal("{\"data\":\"yes\",\"_id\":1}");

                done();
            });


            //

        });

        it("should run a method witch throw error", function (done) {

            let request =   {};
            let response =  new Helper.TestResponse();
            let next =      function(){};

            let foo = new Helper.TestPromisify();
            let fn = Promisify(foo, foo.myMethodThrowException);

            let promise = fn(request, response, next);

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