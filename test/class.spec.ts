import * as Chai from "chai";
import {getClassName, getContructor} from '../src/utils';
import {FakeClass} from './helper';

const expect: Chai.ExpectStatic = Chai.expect;

describe('Class utils : ', () => {

    it('should return class name', () => {
        expect(getClassName(FakeClass)).to.equal('FakeClass');
        expect(getClassName(new FakeClass())).to.equal('FakeClass');
        expect(getClassName(Symbol('test:fakeClass'))).to.equal('Symbol(test:fakeClass)');
    });

    it('should return contructor', () => {
        expect(getContructor(FakeClass)).to.equal(FakeClass);
        expect(getContructor(new FakeClass())).to.equal(FakeClass);
    })

});