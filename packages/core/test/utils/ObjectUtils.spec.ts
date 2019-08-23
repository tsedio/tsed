import {expect} from "chai";
import {
  classOf,
  constructorOf,
  getClass,
  getClassOrSymbol,
  getConstructor,
  isArrayOrArrayClass,
  isClass,
  isCollection,
  isEmpty,
  isInheritedFrom,
  isPrimitiveOrPrimitiveClass,
  isPromise,
  methodsOf,
  nameOf,
  nameOfClass,
  primitiveOf
} from "../../src";

class Base {
  test1() {

  }

  test3() {
  }
}

class Test extends Base {
  test1() {

  }

  test2() {
  }
}

const sym = Symbol("test2");

describe("ObjectUtils", () => {
  describe("getConstructor()", () => {
    it("should return the constructor when class is given", () => {
      expect(getConstructor(Test)).to.eq(Test);
    });
    it("should return the constructor when instance is given", () => {
      expect(getConstructor(new Test())).to.eq(Test);
    });
  });

  describe("getClass()", () => {
    it("should return the class when class is given", () => {
      expect(getClass(Test)).to.eq(Test);
    });

    it("should return the class when instance is given", () => {
      expect(getClass(new Test())).to.eq(Test);
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
      expect(isPrimitiveOrPrimitiveClass(String())).to.eq(true);
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
      expect(isArrayOrArrayClass([])).to.eq(true);
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
      expect(isCollection([])).to.eq(true);
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

  describe("isClass()", () => {
    it("should return true", () => {
      expect(isClass(class {
      })).to.eq(true);
    });

    it("should return true", () => {
      expect(isClass(function t() {
      })).to.eq(true);
    });

    it("should return false (arrow function)", () => {
      expect(isClass(() => {
      })).to.eq(false);
    });

    it("should return false (date)", () => {
      expect(isClass(new Date())).to.eq(false);
    });

    it("should return false (number)", () => {
      expect(isClass(1)).to.eq(false);
    });

    it("should return false (obj)", () => {
      expect(isClass(Object)).to.eq(false);
    });

    it("should return false (promise)", () => {
      expect(isClass(Promise.resolve())).to.eq(false);
    });
  });

  describe("isPromise()", () => {
    it("should return true", () => {
      expect(isPromise(Promise)).to.eq(true);
    });

    it("should return true", () => {
      expect(isPromise(Promise.resolve())).to.eq(true);
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
      expect(nameOfClass(new Test())).to.eq("Test");
    });
  });

  describe("primitiveOf", () => {
    it("should return string", () => {
      expect(primitiveOf(String)).to.eq("string");
    });

    it("should return number", () => {
      expect(primitiveOf(Number)).to.eq("number");
    });

    it("should return boolean", () => {
      expect(primitiveOf(Boolean)).to.eq("boolean");
    });

    it("should return any", () => {
      expect(primitiveOf(Object)).to.eq("any");
    });
  });

  describe("constructorOf()", () => {
    it("should return the constructor when class is given", () => {
      expect(constructorOf(Test)).to.eq(Test);
    });
    it("should return the constructor when instance is given", () => {
      expect(constructorOf(new Test())).to.eq(Test);
    });
  });

  describe("classOf()", () => {
    it("should return the class when class is given", () => {
      expect(classOf(Test)).to.eq(Test);
    });

    it("should return the class when instance is given", () => {
      expect(classOf(new Test())).to.eq(Test);
    });

    it("should return the class when prototype is given", () => {
      expect(classOf(Test.prototype)).to.eq(Test);
    });
  });

  describe("methodsOf", () => {
    it("should return all methods", () => {
      const methods = methodsOf(Test);
      expect(methods).to.deep.eq([
        {propertyKey: "test1", target: Test},
        {propertyKey: "test3", target: Base},
        {propertyKey: "test2", target: Test}
      ]);
    });
  });
  describe("isInheritedFrom", () => {
    it("should return true when class inherit from another", () => {
      class Test1 {

      }

      class Test2 extends Test1 {
      }

      expect(isInheritedFrom(Test2, Test1)).to.eq(true);
    });
    it("should return false when deep is down", () => {
      class Test1 {

      }

      class Test2 extends Test1 {
      }

      class Test3 extends Test2 {
      }

      expect(isInheritedFrom(Test3, Test1, 1)).to.eq(false);
    });

    it("should return true when deep is not down", () => {
      class Test1 {

      }

      class Test2 extends Test1 {
      }

      class Test3 extends Test2 {
      }

      expect(isInheritedFrom(Test3, Test1, 3)).to.eq(true);
    });

    it("should return false when class isn't inherit from another", () => {
      class Test1 {
      }

      class Test3 {
      }

      expect(isInheritedFrom(Test3, Test1)).to.eq(false);
    });

    it("should return false when undefined is given", () => {
      expect(isInheritedFrom(undefined, undefined)).to.eq(false);
    });
  });
});
