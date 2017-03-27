import Chai = require("chai");
import {TestInstance} from "./helper/TestInstance";
import {BadRequest} from "ts-httpexceptions";
import {FakeRequest} from "./helper/FakeRequest";
import {FakeResponse} from "./helper/FakeResponse";
import {Endpoint} from '../src/controllers/endpoint';
import {InjectorService} from '../src/services';
import assert = require('assert');
import ControllerService from '../src/services/controller';
import Metadata from "../src/services/metadata";

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

        it("should return nothing at first", () => {

            const endpoint = new Endpoint(TestInstance, 'myMethodNothing');

            expect(endpoint.getRoute()).to.equals(undefined);
        });

        it("should push information", () => {

            const endpoint = new Endpoint(TestInstance, 'myMethod');

            endpoint.push(['get', '/', false]);

            expect(endpoint.hasMethod()).to.be.true;
            expect(endpoint.getMethod()).to.equal('get');
            expect(endpoint.getRoute()).to.equal('/');

            expect(ControllerService.getMiddlewares(endpoint)).to.be.an('array');
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

            expect(ControllerService.getMiddlewares(endpoint)).to.be.an('array');
            expect((endpoint as any).middlewares.length).to.equal(1);
        });

    });

    describe("Endpoint.getMiddlewares()", () => {


        beforeEach(() => ControllerService.set(TestInstance, "/", []));

        it('should return all middlewares', () => {
            const endpoint = new Endpoint(TestInstance, 'myMethod');

            endpoint.push(['get', '/', new Function]);

            expect(endpoint.hasMethod()).to.be.true;
            expect(endpoint.getMethod()).to.equal('get');
            expect(endpoint.getRoute()).to.equal('/');

            const middlewares = ControllerService.getMiddlewares(endpoint);

            expect(middlewares).to.be.an('array');
            // expect(middlewares.length).to.equal(4);
        });

        it('should get metadata stored on endpoint method', () => {

            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');

            Endpoint.setMetadata('TEST', 'value', endpoint.targetClass, endpoint.methodClassName);

            expect(endpoint.getMetadata('TEST')).to.equal('value');
            expect(Endpoint.getMetadata('TEST', endpoint.targetClass, endpoint.methodClassName)).to.equal('value');

        });

        it('should get metadata stored on endpoint method', () => {

            const endpoint: any = new Endpoint(TestInstance, 'myMethodThrowException');
            const symb = Symbol('Test:Endpoint');

            Endpoint.setMetadata(symb, 'value', endpoint.targetClass, endpoint.methodClassName);

            expect(endpoint.getMetadata(symb)).to.equal('value');
            expect(Endpoint.getMetadata(symb, endpoint.targetClass, endpoint.methodClassName)).to.equal('value');

        });

    });



});