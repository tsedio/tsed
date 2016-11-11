import Chai = require("chai");
import {TestInstance} from "./helper/TestInstance";
import Promise = require("bluebird");
import {BadRequest} from "ts-httpexceptions";
import {FakeRequest} from "./helper/FakeRequest";
import {FakeResponse} from "./helper/FakeResponse";
import {FakeNextFn} from "./helper/FakeNextFn";
import {Endpoint} from '../src/controllers/endpoint';
import {InjectorService} from '../src/services';
import assert = require('assert');

let expect: Chai.ExpectStatic = Chai.expect;

describe("Endpoint :", () => {

    let nextResult: any;
    let response: FakeResponse, request: FakeRequest, next = FakeNextFn;

    const fakeController = {
        instance: new TestInstance(),
        getInstance: function() {return this.instance}
    };

    beforeEach(() => {
        request =   new FakeRequest();
        response =  new FakeResponse();
        next.reset();
    });

    beforeEach(() => InjectorService.load());

    describe("Create new Endpoint", () => {

        it("should do create a function", () => {

            const endpoint = new Endpoint(fakeController, 'myMethod');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.myMethod);

        });

        it("should push information", () => {

            const endpoint = new Endpoint(fakeController, 'myMethod');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.myMethod);

            endpoint.push(['get', '/', undefined]);

            expect(endpoint.hasMethod()).to.be.true;
            expect(endpoint.getMethod()).to.equal('get');
            expect(endpoint.getRoute()).to.equal('/');

            expect(endpoint.toArray()).to.be.an('array');
            expect(endpoint.toArray()[0]).to.equal('get');
            expect(endpoint.toArray()[1]).to.equal('/');
        });

        it('should get parameters (without annotation)', () => {
            const instance = fakeController.getInstance();
            const endpoint: any = new Endpoint(instance, 'myMethod');

            const parameters = endpoint.getParameters(instance, {
                request: new FakeRequest,
                response: new FakeResponse,
                next: new FakeNextFn
            });

            expect(parameters[0]).to.be.an.instanceOf(FakeRequest);
            expect(parameters[1]).to.be.an.instanceOf(FakeResponse);
            expect(parameters[2]).to.be.an.instanceOf(FakeNextFn);
        });

        it('should get parameters (with annotation)', () => {
            const instance = fakeController.getInstance();
            const endpoint: any = new Endpoint(instance, 'myMethodAnnotated');

            const parameters = endpoint.getParameters(instance, {
                request: new FakeRequest,
                response: new FakeResponse,
                next: new FakeNextFn
            });

            expect(parameters[0]).to.be.an.instanceOf(FakeRequest);
            expect(parameters[1]).to.be.an.instanceOf(FakeResponse);
            expect(parameters[2]).to.be.an.instanceOf(FakeNextFn);
        });


        it('should get parameters (with annotation 2)', () => {
            const instance = fakeController.getInstance();
            const endpoint: any = new Endpoint(instance, 'myMethodAnnotated2');

            const parameters = endpoint.getParameters(instance, {
                request: new FakeRequest,
                response: new FakeResponse,
                next: new FakeNextFn
            });

            expect(parameters).to.be.an('array');
            expect(parameters.length).to.be.equal(4);
            expect(parameters[0]).to.be.equal('testValue');
        });

        it('should get parameters (with annotation 2)', () => {
            const instance = fakeController.getInstance();
            const endpoint: any = new Endpoint(instance, 'myMethodAnnotated3');

            try{
                const parameters = endpoint.getParameters(instance, {
                    request: new FakeRequest,
                    response: new FakeResponse,
                    next: new FakeNextFn
                });

                assert.ok(false);
            }catch(er){
                expect(er).to.be.instanceOf(BadRequest);
                expect(er.message).to.equal('Bad request, parameter request.body.testUnknow is required.');
            }

        });

        it('should invokeMethod', (done) => {
            const endpoint = new Endpoint(fakeController, 'myMethod');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.myMethod);

            endpoint.push(['get', '/', undefined]);

            const promise = middleware(<any>request, <any>response, <any>next);

            expect(promise.then).to.be.a('function');

            promise.then((result) => {
                expect(result).to.equal(undefined);
                done();
            });

        });


        it('should call method with promise', (done) => {
            const endpoint = new Endpoint(fakeController, 'myMethodPromised');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.myMethodPromised);

            endpoint.push(['get', '/', undefined]);

            const promise = middleware(<any>request, <any>response, <any>next);

            expect(promise.then).to.be.a('function');

            promise.then((result) => {
                expect(result).to.be.an('object');
                expect(result.data).to.equal('yes');
                done();
            });

        });

        it('should call method with explicite next calling', (done) => {
            const endpoint = new Endpoint(fakeController, 'expliciteNext');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.expliciteNext);

            endpoint.push(['get', '/', undefined]);

            const promise = middleware(<any>request, <any>response, <any>next);

            expect(promise.then).to.be.a('function');

            promise.then((result) => {
                expect(result).to.equal(undefined);
                done();
            });

        });


        it('should call method end catch exception', (done) => {
            const endpoint = new Endpoint(fakeController, 'myMethodThrowException');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.myMethodThrowException);

            endpoint.push(['get', '/', undefined]);

            const promise = middleware(<any>request, <any>response, <any>next);

            expect(promise.then).to.be.a('function');

            promise.then(() => {
                expect(next.get()).to.be.an.instanceOf(BadRequest);
                done();
            });

        });
    });

});