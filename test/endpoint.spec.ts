import Chai = require("chai");
import {TestInstance} from "./helper/TestInstance";
import {BadRequest} from "ts-httpexceptions";
import {FakeRequest} from "./helper/FakeRequest";
import {FakeResponse} from "./helper/FakeResponse";
import {Endpoint} from '../src/controllers/endpoint';
import {InjectorService} from '../src/services';
import assert = require('assert');
import ControllerService from '../src/services/controller';

let expect: Chai.ExpectStatic = Chai.expect;

describe("Endpoint :", () => {

    let response: FakeResponse, request: FakeRequest;

    beforeEach(() => {
        request =   new FakeRequest();
        response =  new FakeResponse();
        //next.reset();
    });

    beforeEach(() => InjectorService.load());

    describe("Create new Endpoint", () => {

        beforeEach(() => ControllerService.set(TestInstance, "/", []));

        it("should do create a function", () => {

            const endpoint = new Endpoint(TestInstance, 'myMethod');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.myMethod);

        });

        it("should push information", () => {

            const endpoint = new Endpoint(TestInstance, 'myMethod');
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

            const endpoint: any = new Endpoint(TestInstance, 'myMethod');
            const testInstance = ControllerService.invoke(TestInstance);

            const parameters = endpoint.getParameters(testInstance, {
                request: new FakeRequest,
                response: new FakeResponse,
                next: () => {}
            });

            expect(parameters[0]).to.be.an.instanceOf(FakeRequest);
            expect(parameters[1]).to.be.an.instanceOf(FakeResponse);
            expect(typeof parameters[2]).to.be.equals("function");
        });

        it('should get parameters (with annotation)', () => {
            const testInstance = ControllerService.invoke(TestInstance);
            const endpoint: any = new Endpoint(TestInstance, 'myMethodAnnotated');

            const parameters = endpoint.getParameters(testInstance, {
                request: new FakeRequest,
                response: new FakeResponse,
                next: () => {}
            });

            expect(parameters[0]).to.be.an.instanceOf(FakeRequest);
            expect(parameters[1]).to.be.an.instanceOf(FakeResponse);
            expect(typeof parameters[2]).to.be.equals("function");
        });


        it('should get parameters (with annotation 2)', () => {
            const testInstance = ControllerService.invoke(TestInstance);
            const endpoint: any = new Endpoint(TestInstance, 'myMethodAnnotated2');

            const parameters = endpoint.getParameters(testInstance, {
                request: new FakeRequest,
                response: new FakeResponse,
                next: () => {}
            });

            expect(parameters).to.be.an('array');
            expect(parameters.length).to.be.equal(5);
            expect(parameters[0]).to.be.equal('testValue');
        });

        it('should get parameters (with annotation 2)', () => {
            const testInstance = ControllerService.invoke(TestInstance);
            const endpoint: any = new Endpoint(TestInstance, 'myMethodAnnotated3');

            try{
                const parameters = endpoint.getParameters(testInstance, {
                    request: new FakeRequest,
                    response: new FakeResponse,
                    next: () => {}
                });

                assert.ok(false);
            }catch(er){
                expect(er).to.be.instanceOf(BadRequest);
                expect(er.message).to.equal('Bad request, parameter request.body.testUnknow is required.');
            }

        });

        it('should invokeMethod', (done) => {
            const endpoint = new Endpoint(TestInstance, 'myMethod');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.myMethod);

            endpoint.push(['get', '/', undefined]);

            const promise = middleware(<any>request, <any>response, () => {});

            expect(promise.then).to.be.a('function');

            promise.then((result) => {
                expect(result).to.equal(undefined);
                done();
            });

        });


        it('should call method with promise', (done) => {
            const endpoint = new Endpoint(TestInstance, 'myMethodPromised');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.myMethodPromised);

            endpoint.push(['get', '/', undefined]);

            const promise = middleware(<any>request, <any>response, () => {});

            expect(promise.then).to.be.a('function');

            promise.then((result) => {
                expect(result).to.be.an('object');
                expect(result.data).to.equal('yes');
                done();
            });

        });

        it('should call method with explicite next calling', (done) => {
            const endpoint = new Endpoint(TestInstance, 'expliciteNext');
            const middleware = endpoint.middleware;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.expliciteNext);

            endpoint.push(['get', '/', undefined]);

            const promise = middleware(<any>request, <any>response, () => {});

            expect(promise.then).to.be.a('function');

            promise.then((result) => {
                expect(result).to.equal(undefined);
                done();
            });

        });


        it('should call method end catch exception', (done) => {
            const endpoint = new Endpoint(TestInstance, 'myMethodThrowException');
            const middleware = endpoint.middleware;
            let nextValue;

            expect(middleware).to.be.instanceOf(Function);
            expect(middleware).to.not.equal(TestInstance.prototype.myMethodThrowException);

            endpoint.push(['get', '/', undefined]);

            const promise = middleware(<any>request, <any>response, (e) => nextValue = e);

            expect(promise.then).to.be.a('function');

            promise.then(() => {
                expect(nextValue).to.be.an.instanceOf(BadRequest);
                done();
            });

        });
    });

    describe('Endpoint.send()', () => {

        it('should send response (boolean)', () => {
            const testInstance = ControllerService.invoke(TestInstance);

            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            endpoint.send(testInstance, true, {
                request: fakeRequest,
                response: fakeResponse,
                next
            });

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._body).to.equal('true');
        });

        it('should send response (number)', () => {
            const testInstance = ControllerService.invoke(TestInstance);
            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            endpoint.send(testInstance, 1, {
                request: fakeRequest,
                response: fakeResponse,
                next
            });

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._body).to.equal('1');
        });

        it('should send response (null)', () => {
            const testInstance = ControllerService.invoke(TestInstance);

            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            endpoint.send(testInstance, null, {
                request: fakeRequest,
                response: fakeResponse,
                next
            });

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._body).to.equal('null');
        });

        it('should send response (date)', () => {
            const testInstance = ControllerService.invoke(TestInstance);
            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            const date = new Date();

            endpoint.send(testInstance, date, {
                request: fakeRequest,
                response: fakeResponse,
                next
            });

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._headers).to.contains('Content-Type:text/json');
            expect(fakeResponse._body).to.equal(JSON.stringify(date));

        });

        it('should send response (object)', () => {

            const testInstance = ControllerService.invoke(TestInstance);
            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            fakeRequest.method = 'POST';

            const fakeResponse = new FakeResponse();
            const next = () => {};

            const obj = {test:'1', test2: new Date()};

            endpoint.send(testInstance, obj, {
                request: fakeRequest,
                response: fakeResponse,
                next
            });

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._headers).to.contains('Content-Type:text/json');
            expect(fakeResponse._body).to.equal(JSON.stringify(obj));

        });

        it('should render response (html)', () => {
            const testInstance = ControllerService.invoke(TestInstance);

            const endpoint: any = new Endpoint(TestInstance, 'myMethodAnnotated4');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};
            const obj = {test: "test"};

            endpoint.send(testInstance, {test: "test"}, {
                request: fakeRequest,
                response: fakeResponse,
                next
            });

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._body).to.equal("home" + obj.toString());
        });
    })

});