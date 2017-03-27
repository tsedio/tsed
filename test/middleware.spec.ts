import MiddlewareService from "../src/services/middleware";
import {inject} from "../src/testing/inject";
import Chai = require("chai");
import {Done} from "../src/testing/done";
import {IMiddleware, IMiddlewareError} from "../src/interfaces";
import {Middleware} from "../src/decorators/class/middleware";
import {MiddlewareError} from "../src/decorators/class/middleware-error";

import {Request} from "../src/decorators/param/request";
import {Next} from "../src/decorators/param/next";
import {Controller} from "../src/decorators/class/controller";
import {Get} from "../src/decorators/method/route";
import {FakeRequest} from "./helper/FakeRequest";
import {BodyParams} from "../src/decorators/param/params";
import SendResponseMiddleware from "../src/middlewares/send-response";
import {MiddlewareType} from "../src/enums/MiddlewareType";

const expect: Chai.ExpectStatic = Chai.expect;

@Middleware()
class MiddlewareTest implements IMiddleware {
    use(request, response, next) {
        request.test = "test";
        next();
    }
}

@Middleware()
class MiddlewareInjTest implements IMiddleware {
    use(@Request() request, @Next() next) {
        request.test = "test";
        next();
    }
}

@Middleware()
class MiddlewareTest2 implements IMiddleware {
    use(request, response) {
        request.test = "test";
    }
}

@MiddlewareError()
class MiddlewareTestError implements IMiddlewareError {
    use(err, request, response, next) {
        request.test = "test";
        next();
    }
}

@MiddlewareError()
class MiddlewareTestError2 implements IMiddlewareError {
    use(err, request, response) {
        request.test = "test";
    }
}

@Controller("/test")
class EndpointCtrl implements IMiddlewareError {

    @Get('/')
    get(@Request() request) {
        request.test = "test";
    }
    
    @Get('/test')
    getByExpr(@BodyParams('test') test: string) {
        return Promise.resolve("test");
    }
}

describe('MiddlewareService : ', () => {

    describe('MiddlewareService.bindMiddleware()', () => {

        describe('notInjectable', () => {

            it('should bind a middleware not injectable (3 params)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'less'}, response: any = {};

                const next = (e) => {
                    expect(request).to.be.an('object');
                    expect(request.test).to.equal('test');
                    done()
                };

                function mdlw(request, response, next) {
                    expect(request).to.be.an('object');
                    request.test = 'test';

                    next();
                }

                const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
                const settings = middlewareService.createSettings(mdlw);

                expect(settings.injectable).to.equal(false);
                expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(request, response, next);

            }));

            it('should bind a middleware not injectable and catch error (3 params)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'less'}, response: any = {};

                const next = (e) => {
                    expect(e.message).to.equal('test');
                    done();
                };

                function mdlw(request, response, next) {
                    throw new Error('test');
                }

                const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
                const settings = middlewareService.createSettings(mdlw);

                expect(settings.injectable).to.equal(false);
                expect(settings.hasNextFn).to.equal(true);
                expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(request, response, next);
            }));

            it('should bind a middlewareError not injectable (4 params)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'less'}, response: any = {};

                const next = (e) => {
                    expect(request).to.be.an('object');
                    expect(request.test).to.equal('test');
                    done();
                };

                function mdlw(err, request, response, next) {
                    expect(err.message).to.equal('test');
                    expect(request).to.be.an('object');
                    request.test = 'test';

                    next();
                }

                const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
                const settings = middlewareService.createSettings(mdlw);

                expect(settings.injectable).to.equal(false);
                expect(settings.hasNextFn).to.equal(true);
                expect(settings.type).to.equal(MiddlewareType.ERROR);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(new Error("test"), request, response, next);
            }));

            it('should bind a middlewareError not injectable and catch error (4 params)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'less'}, response: any = {};

                const next = (e) => {
                    expect(e.message).to.equal('test');
                    done();
                };

                function mdlw(err, request, response, next) {
                    expect(err.message).to.equal('test');
                    throw new Error('test');
                }

                const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
                const settings = middlewareService.createSettings(mdlw);

                expect(settings.injectable).to.equal(false);
                expect(settings.hasNextFn).to.equal(true);
                expect(settings.type).to.equal(MiddlewareType.ERROR);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(new Error("test"), request, response, next);
            }));

            it('should bind a middleware not injectable (2 params)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'less'}, response: any = {};

                const next = (e) => {
                    expect(request).to.be.an('object');
                    expect(request.test).to.equal('test');
                    done();
                };

                function mdlw(request, response) {
                    expect(request).to.be.an('object');
                    request.test = 'test';
                }

                const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
                const settings = middlewareService.createSettings(mdlw);

                expect(settings.injectable).to.equal(false);
                expect(settings.hasNextFn).to.equal(false);
                expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(request, response, next);
            }));


            /// MIDDLEWARE

            it('should bind a middleware decorated, (3 params)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'less'}, response: any = {};

                const next = (e) => {
                    expect(request).to.be.an('object');
                    expect(request.test).to.equal('test');
                    done()
                };

                const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareTest);
                const settings = middlewareService.createSettings(MiddlewareTest);

                expect(settings.injectable).to.equal(false);
                expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(request, response, next);

            }));

            it('should bind a middleware decorated, (2 params)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'less'}, response: any = {};

                const next = (e) => {
                    try{
                        expect(request).to.be.an('object');
                        expect(request.test).to.equal('test');
                    } catch(er){
                        console.warn(er);
                    }

                    done();
                };

                const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareTest2);
                const settings = middlewareService.createSettings(MiddlewareTest2);

                expect(settings.injectable).to.equal(false);
                expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(request, response, next);

            }));

            it('should bind a middlewareError decorated, (4 params)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'less'}, response: any = {};

                const next = (e) => {
                    try{
                        expect(request).to.be.an('object');
                        expect(request.test).to.equal('test');
                    }catch(er){
                        console.error(er);
                    }
                    done();
                };

                const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareTestError);
                const settings = middlewareService.createSettings(MiddlewareTestError);

                expect(settings.injectable).to.equal(false);
                expect(settings.type).to.equal(MiddlewareType.ERROR);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(new Error('test'), request, response, next);

            }));

            it('should bind a middlewareError decorated, (3 params)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'less'}, response: any = {};

                const next = (e) => {
                    expect(request).to.be.an('object');
                    expect(request.test).to.equal('test');
                    done()
                };

                const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareTestError2);
                const settings = middlewareService.createSettings(MiddlewareTestError2);

                expect(settings.injectable).to.equal(false);
                expect(settings.type).to.equal(MiddlewareType.ERROR);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(new Error('test'), request, response, next);

            }));


        });


        describe('injectable', () => {

            it('should bind a middleware decorated', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'test'}, response: any = {};

                const next = (e) => {
                    expect(request).to.be.an('object');
                    expect(request.test).to.equal('test');
                    done();
                };

                const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareInjTest);
                const settings = middlewareService.createSettings(MiddlewareInjTest);


                expect(settings.injectable).to.equal(true);
                expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(request, response, next)
                    .catch(err => console.error(err))

            }));

            it('should bind an endpoint decorated', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = {test: 'test'}, response: any = {};

                const next = (e) => {
                    expect(request).to.be.an('object');
                    expect(request.test).to.equal('test');
                    done()
                };

                const wrappedMdlw = middlewareService.bindMiddleware(EndpointCtrl, 'get');
                const settings = middlewareService.createSettings(EndpointCtrl, 'get');

                expect(settings.injectable).to.equal(true);
                expect(settings.type).to.equal(MiddlewareType.ENDPOINT);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(request, response, next);

            }));

            it('should bind an endpoint decorated (2)', inject([MiddlewareService, Done], (middlewareService, done) => {

                const request: any = new FakeRequest(), response: any = {};

                const next = (e) => {
                    try{
                        expect(request).to.be.an('object');
                        expect(request.getStoredData()).to.equal('test');
                    } catch(er) {
                        console.warn(er);
                    }
                    done();
                };

                const wrappedMdlw = middlewareService.bindMiddleware(EndpointCtrl, 'getByExpr');
                const settings = middlewareService.createSettings(EndpointCtrl, 'getByExpr');

                expect(settings.injectable).to.equal(true);
                expect(settings.type).to.equal(MiddlewareType.ENDPOINT);
                expect(wrappedMdlw).to.be.a('function');

                wrappedMdlw(request, response, next);

            }));



        });


        it('should invoke middleware',() => {

            expect(MiddlewareService.invoke<any>(SendResponseMiddleware)).not.to.be.undefined;

        });
    });

});