import * as Chai from "chai";
import {getClassName, getContructor} from '../src/utils/class';
import {FakeClass} from './helper';

const expect: Chai.ExpectStatic = Chai.expect;

describe('Class utils : ', () => {

    it('should return class name', () => {
        expect(getClassName(FakeClass)).to.equal('FakeClass');
        expect(getClassName(new FakeClass())).to.equal('FakeClass');
    });

    it('should return contructor', () => {
        expect(getContructor(FakeClass)).to.equal(FakeClass);
        expect(getContructor(new FakeClass())).to.equal(FakeClass);
    })

});