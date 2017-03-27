import {Err} from "../src/decorators/param/error";
import {Location} from "../src/decorators/method/location";
import Chai = require("chai");
import {
    EXPRESS_ERR, ENDPOINT_USE, ENDPOINT_USE_BEFORE, ENDPOINT_USE_AFTER, CONTROLLER_SCOPE
} from "../src/constants/metadata-keys";
import Metadata from "../src/services/metadata";
import {Redirect} from "../src/decorators/method/redirect";
import {Header} from "../src/decorators/header";
import {Scope} from "../src/decorators/class/controller";
import {CookiesParams, BodyParams, QueryParams, PathParams, Session, HeaderParams} from "../src/decorators/param/params";
import {Next} from "../src/decorators/param/next";
import {Request} from "../src/decorators/param/request";
import {Response} from "../src/decorators/param/response";
import {Required} from "../src/decorators/required";
import {MultipartFile} from "../src/decorators/param/multipart-file";
import {EndpointInfo} from "../src/decorators/param/endpoint-info";
import EndpointParam from "../src/controllers/endpoint-param";

let expect: Chai.ExpectStatic = Chai.expect;

class TestDecorator{
    method(){}
    methodNothing(){}
    methodNotNumber(){}
}

describe('Decorators :', () => {

    describe('@Err()', () => {
        
        it('should add metadata', () => {
            Err()(TestDecorator, 'method', 0);
            const params = EndpointParam.get(TestDecorator, 'method', 0);

            expect(params.service).to.equal(EXPRESS_ERR);
        });
        
    });

    describe('@Location()', () => {

        it('should add metadata', () => {
            Location('http://test')(TestDecorator, 'method', {});
            const response = {
                l: '',
                location: (e) => {
                    response.l = e;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(middlewares.length).to.equal(1);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(response.l).to.equal('http://test');

            Metadata.set(ENDPOINT_USE_AFTER, [], TestDecorator, 'method');
        });



    });

    describe('@Redirect()', () => {

        it('should add metadata', () => {
            Redirect('http://test')(TestDecorator, 'method', {});

            const response = {
                l: '',
                redirect: (e) => {
                    response.l = e;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(middlewares.length).to.equal(1);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(response.l).to.equal('http://test');

            Metadata.set(ENDPOINT_USE, [], TestDecorator, 'method');
        });

        it('should add metadata', () => {
            Redirect(200, 'http://test')(TestDecorator, 'method', {});

            const response = {
                l: '',
                redirect: (e) => {
                    response.l = e;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(middlewares.length).to.equal(2);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(response.l).to.equal(200);

            Metadata.set(ENDPOINT_USE, [], TestDecorator, 'method');
        });

    });

    describe('@Header()', () => {

        it('should do nothing', () => {
            Header({'Content-Type': 'application/json'})(TestDecorator, 'methodNothing', {});

            const response = {
                headersSent: true
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'methodNothing');
            const middleware = middlewares[0];

            let called = false;

            middleware({}, response, () => {called = true});

            expect(called).to.be.true;

            Metadata.set(ENDPOINT_USE_AFTER, [], TestDecorator, 'methodNothing');
        });

        it('should add metadata (object)', () => {
            Header({'Content-Type': 'application/json'})(TestDecorator, 'method', {});

            const response = {
                l: {},
                set: (k, v) => {
                    response.l[k] = v;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(middlewares.length).to.equal(3);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(JSON.stringify(response.l)).to.equal('{"Content-Type":"application/json"}');

            Metadata.set(ENDPOINT_USE_AFTER, [], TestDecorator, 'method');
        });

        it('should add metadata (params)', () => {
            Header('Content-Type', 'application/json')(TestDecorator, 'method', {});

            const response = {
                l: {},
                set: (k, v) => {
                    response.l[k] = v;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_AFTER, TestDecorator, 'method');

            expect(!!middlewares.length).to.equal(true);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(JSON.stringify(response.l)).to.equal('{"Content-Type":"application/json"}');

            Metadata.set(ENDPOINT_USE_AFTER, [], TestDecorator, 'method');
        });

    });

    describe('@Scope()', () => {
        it('should add metadata', () => {

            Scope(TestDecorator);
            expect(Metadata.get(CONTROLLER_SCOPE, TestDecorator)).to.be.true;

        });
    });


    describe('all decorators', () => {
        it('should nothing when index parameters not a number', () => {

            CookiesParams()(TestDecorator, 'methodNotNumber', undefined);
            BodyParams()(TestDecorator, 'methodNotNumber', undefined);
            QueryParams()(TestDecorator, 'methodNotNumber', undefined);
            PathParams()(TestDecorator, 'methodNotNumber', undefined);
            Session()(TestDecorator, 'methodNotNumber', undefined);
            HeaderParams('test')(TestDecorator, 'methodNotNumber', undefined);
            Next()(TestDecorator, 'methodNotNumber', undefined);
            Request()(TestDecorator, 'methodNotNumber', undefined);
            Response()(TestDecorator, 'methodNotNumber', undefined);
            Required()(TestDecorator, 'methodNotNumber', undefined);
            Err()(TestDecorator, 'methodNotNumber', undefined);
            MultipartFile()(TestDecorator, 'methodNotNumber', undefined);
            EndpointInfo()(TestDecorator, 'methodNotNumber', undefined);

        });
    });
});