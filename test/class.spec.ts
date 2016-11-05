import * as Chai from "chai";
import {getClassName, getContructor} from '../src/utils/class';

const expect: Chai.ExpectStatic = Chai.expect;

class TestClass{}

describe('Class utils : ', () => {

    it('should return class name', () => {
        expect(getClassName(TestClass)).to.equal('TestClass');
        expect(getClassName(new TestClass)).to.equal('TestClass');
    });

    it('should return contructor', () => {
        expect(getContructor(TestClass)).to.equal(TestClass);
        expect(getContructor(new TestClass)).to.equal(TestClass);
    })

});