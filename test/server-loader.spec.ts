import {expect} from "chai";
import Promise = require("bluebird");
import {NotAcceptable} from "ts-httpexceptions";
import {ServerLoader} from '../server-loader';
import {FakeRequest} from './helper/FakeRequest';
import {FakeResponse} from './helper/FakeResponse';
import {FakeApplication, FakeServer} from './helper/FakeApplication';
import assert = require('assert');

//const expect: Chai.ExpectStatic = Chai.expect;

xdescribe("ServerLoader()", () => {

    describe('ServerLoader.AcceptMime', () => {


        it('Should throw exception', () =>{
            const middleware = ServerLoader.AcceptMime("application/json");
            const fakeRequest =  new FakeRequest();

            try{
                middleware(fakeRequest, new FakeResponse(), () => (undefined));
            }catch(er){

                expect(er instanceof NotAcceptable).to.be.true;

            }
        })



    });

    describe('ServerLoader.onError', () => {
        it('should do nothing if response is sent', () => {

            const server = new FakeServer();
            const response: any = new FakeResponse();
            let error;
            response.headersSent = true;

            server.onError(
                new Error('test'),
                <any>new FakeRequest(),
                <any>response,
                (err) => error = err
            );

            expect(error.message).is.equal('test');

        });

        it('should respond error 404 with his message', () => {

            const server = new FakeServer();
            const response: any = new FakeResponse();
            let error;

            server.onError(
                "Message not found",
                <any>new FakeRequest(),
                <any>response,
                (err) => error = err
            );

            expect(response._body).is.equal('Message not found');
            expect(response._status).is.equal(404);

        });

        it('should respond error 400 and BadRequest (CastError)', () => {

            const server = new FakeServer();
            const response: any = new FakeResponse();
            let error = new Error();
            error.name = "CastError";

            server.onError(
                error,
                <any>new FakeRequest(),
                <any>response,
                (err) => undefined
            );

            expect(response._body).is.equal('Bad Request');
            expect(response._status).is.equal(400);

        });


        it('should respond error 400 and BadRequest (ObjectID)', () => {

            const server = new FakeServer();
            const response: any = new FakeResponse();
            let error = new Error();
            error.name = "ObjectID";

            server.onError(
                error,
                <any>new FakeRequest(),
                <any>response,
                (err) => undefined
            );

            expect(response._body).is.equal('Bad Request');
            expect(response._status).is.equal(400);

        });

        it('should respond error 400 and BadRequest (ValidationError)', () => {

            const server = new FakeServer();
            const response: any = new FakeResponse();
            let error = new Error();
            error.name = "ValidationError";

            server.onError(
                error,
                <any>new FakeRequest(),
                <any>response,
                (err) => undefined
            );

            expect(response._body).is.equal('Bad Request');
            expect(response._status).is.equal(400);

        });

        it('should respond error 500 and Internal Error', () => {

            const server = new FakeServer();
            const response: any = new FakeResponse();
            let error = new Error();

            server.onError(
                error,
                <any>new FakeRequest(),
                <any>response,
                (err) => undefined
            );

            expect(response._body).is.equal('Internal Error');
            expect(response._status).is.equal(500);

        });

    });

    describe('ServerLoader.start', () => {

        it('should start httpServer', (done) => {

            const server:any = new FakeServer();

            server.createHttpServer(8000);

            server.setHttpPort(8000);

            const promise = server.start();

            expect(promise).to.be.an('object');
            expect(promise.then).to.be.an('function');

            promise.then(() => {
                done();
            });

            server.httpServer.fire('listening');

        });

        it('should start and catch error', (done) => {

            const server:any = new FakeServer();

            server.createHttpServer(8000);

            server.setHttpPort(8000);

            const promise = server.start();

            expect(promise).to.be.an('object');
            expect(promise.then).to.be.an('function');

            promise.then(() => {
                assert.ok(false);
            }, () => {
                done();
            });

            server.httpServer.fire('error');

        });

        it('should start httpsServer', (done) => {

            const server:any = new FakeServer();

            server.createHttpsServer(8000);

            server.setHttpsPort(8000);

            const promise = server.start();

            expect(promise).to.be.an('object');
            expect(promise.then).to.be.an('function');

            promise.then(() => {
                done();
            });

            server.httpsServer.fire('listening');

        });

        it('should start and catch error', (done) => {

            const server:any = new FakeServer();

            server.createHttpsServer(8000);

            server.setHttpsPort(8000);

            const promise = server.start();

            expect(promise).to.be.an('object');
            expect(promise.then).to.be.an('function');

            promise.then(() => {
                assert.ok(false);
            }, () => {
                done();
            });

            server.httpsServer.fire('error');

        });

    });


});
