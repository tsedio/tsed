import {
  ancestorsOf,
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
} from "../../index.js";

class Base {
  test1() {}

  test3() {}
}

class Test extends Base {
  test1() {}

  test2() {}
}

const sym = Symbol("test2");

describe("ObjectUtils", () => {
  describe("getConstructor()", () => {
    it("should return the constructor when class is given", () => {
      expect(getConstructor(Test)).toBe(Test);
    });
    it("should return the constructor when instance is given", () => {
      expect(getConstructor(new Test())).toBe(Test);
    });
  });

  describe("getClass()", () => {
    it("should return the class when class is given", () => {
      expect(getClass(Test)).toBe(Test);
    });

    it("should return the class when instance is given", () => {
      expect(getClass(new Test())).toBe(Test);
    });

    it("should return the class when prototype is given", () => {
      expect(getClass(Test.prototype)).toBe(Test);
    });
  });

  describe("getClassOrSymbol()", () => {
    it("should return the class when class is given", () => {
      expect(getClassOrSymbol(Test)).toBe(Test);
    });
    it("should return the class when class is symbol", () => {
      expect(getClassOrSymbol(sym)).toBe(sym);
    });
  });

  describe("isPrimitiveOrPrimitiveClass()", () => {
    it("should return true when a primitive is given", () => {
      expect(isPrimitiveOrPrimitiveClass("test")).toBe(true);
    });
    it("should return true when a PrimitiveClass is given", () => {
      expect(isPrimitiveOrPrimitiveClass(String())).toBe(true);
    });

    it("should return false when a class is given", () => {
      expect(isPrimitiveOrPrimitiveClass(Test)).toBe(false);
    });
  });

  describe("isArrayOrArrayClass()", () => {
    it("should return true when Array is given", () => {
      expect(isArrayOrArrayClass(Array)).toBe(true);
    });

    it("should return true when [] is given", () => {
      expect(isArrayOrArrayClass([])).toBe(true);
    });

    it("should return false when {} is given", () => {
      expect(isArrayOrArrayClass({})).toBe(false);
    });
  });

  describe("isCollection()", () => {
    it("should return true when Array is given", () => {
      expect(isCollection(Array)).toBe(true);
    });

    it("should return true when [] is given", () => {
      expect(isCollection([])).toBe(true);
    });

    it("should return true when Map is given", () => {
      expect(isCollection(Map)).toBe(true);
    });

    it("should return true when Set is given", () => {
      expect(isCollection(Set)).toBe(true);
    });

    it("should return true when WeakMap is given", () => {
      expect(isCollection(WeakMap)).toBe(true);
    });

    it("should return true when WeakSet is given", () => {
      expect(isCollection(WeakSet)).toBe(true);
    });

    it("should return false when {} is given", () => {
      expect(isCollection({})).toBe(false);
    });
  });

  describe("isEmpty()", () => {
    it("should return true when empty string is given", () => {
      expect(isEmpty("")).toBe(true);
    });
    it("should return true when null is given", () => {
      expect(isEmpty(null)).toBe(true);
    });

    it("should return true when undefined is given", () => {
      expect(isEmpty(undefined)).toBe(true);
    });
    it("should return false when {} is given", () => {
      expect(isEmpty({})).toBe(false);
    });
    it("should return false when [] is given", () => {
      expect(isEmpty([])).toBe(false);
    });

    it("should return false when false is given", () => {
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe("isClass()", () => {
    it("should return true when is a class", () => {
      expect(isClass(class {})).toBe(true);
    });

    it("should return true when is a function", () => {
      expect(isClass(function t() {})).toBe(true);
    });

    it("should return false (arrow function)", () => {
      expect(isClass(() => {})).toBe(false);
    });

    it("should return false (date)", () => {
      expect(isClass(new Date())).toBe(false);
    });

    it("should return false (number)", () => {
      expect(isClass(1)).toBe(false);
    });

    it("should return false (obj)", () => {
      expect(isClass(Object)).toBe(false);
    });

    it("should return false (promise)", () => {
      expect(isClass(Promise.resolve())).toBe(false);
    });
  });

  describe("isPromise()", () => {
    it("should return true", () => {
      expect(isPromise(Promise)).toBe(true);
    });

    it("should return true when its promise resolved", () => {
      expect(isPromise(Promise.resolve())).toBe(true);
    });
  });

  describe("nameOf", () => {
    it("should return 'Test' when class is given", () => {
      expect(nameOf(Test)).toBe("Test");
    });
    it("should return 'test2' when symbol is given", () => {
      expect(nameOf(sym)).toBe("test2");
    });
    it("should return 'test' when string is given", () => {
      expect(nameOf("test")).toBe("test");
    });
    it("should return '1' when string is given", () => {
      expect(nameOf(1)).toBe("1");
    });
    it("should return 'true' when boolean is given", () => {
      expect(nameOf(true)).toBe("true");
    });
    it("should return 'null' when null is given", () => {
      expect(nameOf(null)).toBe("null");
    });
    it("should return 'undefined' when undefined is given", () => {
      expect(nameOf(undefined)).toBe("undefined");
    });
  });

  describe("nameOfClass", () => {
    it("should return name when class is given", () => {
      expect(nameOfClass(Test)).toBe("Test");
    });
    it("should return name when instance is given", () => {
      expect(nameOfClass(new Test())).toBe("Test");
    });
  });

  describe("primitiveOf", () => {
    it("should return string", () => {
      expect(primitiveOf(String)).toBe("string");
    });

    it("should return number", () => {
      expect(primitiveOf(Number)).toBe("number");
    });

    it("should return boolean", () => {
      expect(primitiveOf(Boolean)).toBe("boolean");
    });

    it("should return any", () => {
      expect(primitiveOf(Object)).toBe("any");
    });
  });

  describe("constructorOf()", () => {
    it("should return the constructor when class is given", () => {
      expect(constructorOf(Test)).toBe(Test);
    });
    it("should return the constructor when instance is given", () => {
      expect(constructorOf(new Test())).toBe(Test);
    });
  });

  describe("classOf()", () => {
    it("should return the class when class is given", () => {
      expect(classOf(Test)).toBe(Test);
    });

    it("should return the class when instance is given", () => {
      expect(classOf(new Test())).toBe(Test);
    });

    it("should return the class when prototype is given", () => {
      expect(classOf(Test.prototype)).toBe(Test);
    });
  });
  describe("ancestorsOf()", () => {
    it("should returns ancestors", () => {
      class Base {}

      class Test extends Base {}

      expect(ancestorsOf(Test)).toEqual([Base, Test]);
      expect(ancestorsOf(Test).reverse()).toEqual([Test, Base]);
    });
  });

  describe("methodsOf", () => {
    it("should return all methods", () => {
      const methods = methodsOf(Test);
      expect(methods).toEqual([
        {propertyKey: "test1", target: Test},
        {propertyKey: "test3", target: Base},
        {propertyKey: "test2", target: Test}
      ]);
    });
  });
  describe("isInheritedFrom", () => {
    it("should return true when class inherit from another", () => {
      class Test1 {}

      class Test2 extends Test1 {}

      expect(isInheritedFrom(Test2, Test1)).toBe(true);
    });
    it("should return false when deep is down", () => {
      class Test1 {}

      class Test2 extends Test1 {}

      class Test3 extends Test2 {}

      expect(isInheritedFrom(Test3, Test1, 1)).toBe(false);
    });

    it("should return true when deep is not down", () => {
      class Test1 {}

      class Test2 extends Test1 {}

      class Test3 extends Test2 {}

      expect(isInheritedFrom(Test3, Test1, 3)).toBe(true);
    });

    it("should return false when class isn't inherit from another", () => {
      class Test1 {}

      class Test3 {}

      expect(isInheritedFrom(Test3, Test1)).toBe(false);
    });

    it("should return false when undefined is given", () => {
      expect(isInheritedFrom(undefined, undefined)).toBe(false);
    });
  });
});
