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

    describe("new Endpoint", () => {
        beforeEach(() => ControllerService.set(TestInstance, "/", []));

        it("should push information", () => {

            const endpoint = new Endpoint(TestInstance, 'myMethod');

            endpoint.push(['get', '/', false]);

            expect(endpoint.hasMethod()).to.be.true;
            expect(endpoint.getMethod()).to.equal('get');
            expect(endpoint.getRoute()).to.equal('/');

            expect(endpoint.toArray()).to.be.an('array');
            expect(endpoint.toArray()[0]).to.equal('get');
            expect(endpoint.toArray()[1]).to.equal('/');
            expect((endpoint as any).middlewares.length).to.equal(0);
        });

        it("should push information", () => {

            const endpoint = new Endpoint(TestInstance, 'myMethod');
            // const middleware = endpoint.middleware;

            // expect(middleware).to.be.instanceOf(Function);
            // expect(middleware).to.not.equal(TestInstance.prototype.myMethod);

            endpoint.push(['get', '/', (request, response, next) =>(next())]);

            expect(endpoint.hasMethod()).to.be.true;
            expect(endpoint.getMethod()).to.equal('get');
            expect(endpoint.getRoute()).to.equal('/');

            expect(endpoint.toArray()).to.be.an('array');
            expect(endpoint.toArray()[0]).to.equal('get');
            expect(endpoint.toArray()[1]).to.equal('/');
            expect((endpoint as any).middlewares.length).to.equal(1);
        });

    });

    describe("Endpoint.toArray()", () => {


        beforeEach(() => ControllerService.set(TestInstance, "/", []));

        it('should return all middlewares', () => {
            const endpoint = new Endpoint(TestInstance, 'myMethod');

            endpoint.push(['get', '/', new Function]);

            expect(endpoint.hasMethod()).to.be.true;
            expect(endpoint.getMethod()).to.equal('get');
            expect(endpoint.getRoute()).to.equal('/');

            const middlewares = endpoint.toArray();

            expect(middlewares).to.be.an('array');
            expect(middlewares.length).to.equal(6);

            expect(middlewares[0]).to.equal('get');
            expect(middlewares[1]).to.equal('/');

        });

    });

    describe('Endpoint.send()', () => {

        it('should send response (boolean)', () => {
            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            fakeRequest['responseData'] = true;

            endpoint.send(
                fakeRequest,
                fakeResponse,
                next
            );

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._body).to.equal('true');
        });

        it('should send response (number)', () => {
            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            fakeRequest['responseData'] = 1;

            endpoint.send(
                fakeRequest,
                fakeResponse,
                next
            );

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._body).to.equal('1');
        });

        it('should send response (null)', () => {
            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            fakeRequest['responseData'] = null;

            endpoint.send(
                fakeRequest,
                fakeResponse,
                next
            );

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._body).to.equal('null');
        });

        it('should send response (date)', () => {
            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            fakeRequest['responseData'] = new Date();

            endpoint.send(
                fakeRequest,
                fakeResponse,
                next
            );

            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._headers).to.contains('Content-Type:text/json');
            expect(fakeResponse._body).to.equal(JSON.stringify(fakeRequest['responseData']));

        });

        it('should send nothing (undefined)', () => {
            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            fakeRequest['responseData'] = undefined;

            endpoint.send(
                fakeRequest,
                fakeResponse,
                next
            );

            expect(fakeResponse._body).to.equal('');

        });

        it('should send nothing (headersSent)', () => {
            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            fakeRequest['responseData'] = {};
            fakeResponse['headersSent'] = true;

            endpoint.send(
                fakeRequest,
                fakeResponse,
                next
            );

            expect(fakeResponse._body).to.equal('');

        });

        it('should send response (object)', () => {

            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const fakeRequest = new FakeRequest();
            const fakeResponse = new FakeResponse();
            const next = () => {};

            fakeRequest['responseData'] = {};
            fakeResponse['headersSent'] = false;

            endpoint.send(
                fakeRequest,
                fakeResponse,
                next
            );


            expect(fakeResponse._body).to.be.a('string');
            expect(fakeResponse._headers).to.contains('Content-Type:text/json');
            expect(fakeResponse._body).to.equal(JSON.stringify(fakeRequest['responseData']));

        });

        /*xit('should render response (html)', () => {
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
        });*/
    })

});