import Chai = require("chai");
import InjectParams from '../src/metadata/inject-params';
import {EXPRESS_REQUEST} from '../src/constants/metadata-keys';
const expect: Chai.ExpectStatic = Chai.expect;

class TestInjectParams{
    method(arg1, arg2){}
}

describe('InjectParams :', () => {

    it('should get instance of injectParams', () => {

        const injectParams = InjectParams.get(TestInjectParams, 'method', 0);

        expect(injectParams).to.be.instanceOf(InjectParams);

    });

    it('should set info', () => {

        const injectParams = InjectParams.get(TestInjectParams, 'method', 0);

        expect(injectParams).to.be.instanceOf(InjectParams);

        injectParams.expression = "test";
        injectParams.service = EXPRESS_REQUEST;

        InjectParams.set(TestInjectParams, 'method', 0, injectParams);


        const injectParamsStored = InjectParams.get(TestInjectParams, 'method', 0);

        expect(injectParamsStored.service).to.equal(injectParams.service);
        expect(injectParamsStored.expression).to.equal(injectParams.expression);

    });

});