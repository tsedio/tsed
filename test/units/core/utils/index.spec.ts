import * as Chai from "chai";
import {getContructor, nameOfClass} from "../../../../src";

import {
    getClass, getClassOrSymbol, isArrayOrArrayClass, isCollection, isEmpty, isPrimitiveOrPrimitiveClass, nameOf
} from "../../../../src/core/utils/index";

const expect: Chai.ExpectStatic = Chai.expect;

class Test {

}

const sym = Symbol("test2");

describe("Utils", () => {

    describe("getContructor()", () => {
        it("should return the constructor when class is given", () => {
            expect(getContructor(Test)).to.eq(Test);
        });
        it("should return the constructor when instance is given", () => {
            expect(getContructor(new Test)).to.eq(Test);
        });
    });

    describe("getClass()", () => {
        it("should return the class when class is given", () => {
            expect(getClass(Test)).to.eq(Test);
        });

        it("should return the class when instance is given", () => {
            expect(getClass(new Test)).to.eq(Test);
        });

        it("should return the class when prototype is given", () => {
            expect(getClass(Test.prototype)).to.eq(Test);
        });
    });

    describe("getClassOrSymbol()", () => {
        it("should return the class when class is given", () => {
            expect(getClassOrSymbol(Test)).to.eq(Test);
        });
        it("should return the class when class is symbol", () => {
            expect(getClassOrSymbol(sym)).to.eq(sym);
        });
    });

    describe("isPrimitiveOrPrimitiveClass()", () => {
        it("should return true when a primitive is given", () => {
            expect(isPrimitiveOrPrimitiveClass("test")).to.eq(true);
        });
        it("should return true when a PrimitiveClass is given", () => {
            expect(isPrimitiveOrPrimitiveClass(new String())).to.eq(true);
        });

        it("should return false when a class is given", () => {
            expect(isPrimitiveOrPrimitiveClass(Test)).to.eq(false);
        });
    });

    describe("isArrayOrArrayClass()", () => {
        it("should return true when Array is given", () => {
            expect(isArrayOrArrayClass(Array)).to.eq(true);
        });

        it("should return true when Array is given", () => {
            expect(isArrayOrArrayClass(new Array())).to.eq(true);
        });

        it("should return true when [] is given", () => {
            expect(isArrayOrArrayClass([])).to.eq(true);
        });

        it("should return false when {} is given", () => {
            expect(isArrayOrArrayClass({})).to.eq(false);
        });
    });

    describe("isCollection()", () => {
        it("should return true when Array is given", () => {
            expect(isCollection(Array)).to.eq(true);
        });

        it("should return true when Array is given", () => {
            expect(isCollection(new Array())).to.eq(true);
        });

        it("should return true when [] is given", () => {
            expect(isCollection([])).to.eq(true);
        });

        it("should return true when Map is given", () => {
            expect(isCollection(Map)).to.eq(true);
        });

        it("should return true when Set is given", () => {
            expect(isCollection(Set)).to.eq(true);
        });

        it("should return true when WeakMap is given", () => {
            expect(isCollection(WeakMap)).to.eq(true);
        });

        it("should return true when WeakSet is given", () => {
            expect(isCollection(WeakSet)).to.eq(true);
        });

        it("should return false when {} is given", () => {
            expect(isCollection({})).to.eq(false);
        });

    });

    describe("isEmpty()", () => {
        it("should return true when empty string is given", () => {
            expect(isEmpty("")).to.eq(true);
        });
        it("should return true when null is given", () => {
            expect(isEmpty(null)).to.eq(true);
        });

        it("should return true when empty string is given", () => {
            expect(isEmpty(undefined)).to.eq(true);
        });
        it("should return false when {} is given", () => {
            expect(isEmpty({})).to.eq(false);
        });
        it("should return false when [] is given", () => {
            expect(isEmpty([])).to.eq(false);
        });

        it("should return false when false is given", () => {
            expect(isEmpty(false)).to.eq(false);
        });
    });

    describe("nameOf", () => {
        it("should return name when class is given", () => {
            expect(nameOf(Test)).to.eq("Test");
        });
        it("should return name when symbol is given", () => {
            expect(nameOf(sym)).to.eq("test2");
        });
        it("should return name when string is given", () => {
            expect(nameOf("test")).to.eq("test");
        });
        it("should return name when string is given", () => {
            expect(nameOf(1)).to.eq("1");
        });
        it("should return name when string is given", () => {
            expect(nameOf(true)).to.eq("true");
        });
        it("should return name when null is given", () => {
            expect(nameOf(null)).to.eq("null");
        });
        it("should return name when undefined is given", () => {
            expect(nameOf(undefined)).to.eq("undefined");
        });
    });

    describe("nameOfClass", () => {
        it("should return name when class is given", () => {
            expect(nameOfClass(Test)).to.eq("Test");
        });
        it("should return name when instance is given", () => {
            expect(nameOfClass(new Test)).to.eq("Test");
        });
    });

});