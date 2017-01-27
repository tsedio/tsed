import {Err} from "../src/decorators/error";
import {Location} from "../src/decorators/location";
import Chai = require("chai");
import InjectParams from "../src/services/inject-params";
import {EXPRESS_ERR, ENDPOINT_ARGS, ENDPOINT_USE_BEFORE} from "../src/constants/metadata-keys";
import Metadata from "../src/services/metadata";
import {Redirect} from "../src/decorators/redirect";
import {Header} from "../src/decorators/header";

let expect: Chai.ExpectStatic = Chai.expect;

class TestDecorator{
    method(){}
}

describe('Decorators :', () => {

    describe('@Err()', () => {
        
        it('should add metadata', () => {
            Err()(TestDecorator, 'method', 0);
            const params = InjectParams.get(TestDecorator, 'method', 0);

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

            const middlewares = Metadata.get(ENDPOINT_ARGS, TestDecorator, 'method');

            expect(middlewares.length).to.equal(1);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(response.l).to.equal('http://test');

            Metadata.set(ENDPOINT_ARGS, [], TestDecorator, 'method');
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

            const middlewares = Metadata.get(ENDPOINT_ARGS, TestDecorator, 'method');

            expect(middlewares.length).to.equal(1);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(response.l).to.equal('http://test');

            Metadata.set(ENDPOINT_ARGS, [], TestDecorator, 'method');
        });

    });

    describe('@Header()', () => {

        it('should add metadata (object)', () => {
            Header({'Content-Type': 'application/json'})(TestDecorator, 'method', {});

            const response = {
                l: {},
                set: (k, v) => {
                    response.l[k] = v;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_BEFORE, TestDecorator, 'method');

            expect(middlewares.length).to.equal(1);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(JSON.stringify(response.l)).to.equal('{"Content-Type":"application/json"}');

            Metadata.set(ENDPOINT_USE_BEFORE, [], TestDecorator, 'method');
        });

        it('should add metadata (params)', () => {
            Header('Content-Type', 'application/json')(TestDecorator, 'method', {});

            const response = {
                l: {},
                set: (k, v) => {
                    response.l[k] = v;
                }
            };

            const middlewares = Metadata.get(ENDPOINT_USE_BEFORE, TestDecorator, 'method');

            expect(middlewares.length).to.equal(1);

            const middleware = middlewares[0];

            middleware({}, response, () => {});

            expect(JSON.stringify(response.l)).to.equal('{"Content-Type":"application/json"}');

            Metadata.set(ENDPOINT_USE_BEFORE, [], TestDecorator, 'method');
        });

    });
});