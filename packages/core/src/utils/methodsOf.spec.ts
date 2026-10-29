import {methodsOf} from "./methodsOf.js";

describe("methodsOf()", () => {
  it("should return methods", () => {
    class TestClass {
      method() {}

      property: string;
    }

    const methods = methodsOf(TestClass);
    expect(methods).toHaveLength(1);
    expect(methods[0]).toMatchObject({
      propertyKey: "method"
    });
  });
  it("should not return getters", () => {
    class TestClass {
      method() {}

      get property() {
        return "";
      }
    }

    const methods = methodsOf(TestClass);

    expect(methods).toHaveLength(1);
    expect(methods[0]).toMatchObject({
      propertyKey: "method"
    });
  });

  it("should return inherited methods in declaration order, owned by the last class that defines them", () => {
    class A {
      a() {}

      shared() {}
    }

    class B extends A {
      b() {}

      shared() {}

      [Symbol.iterator]() {}
    }

    expect(methodsOf(B)).toEqual([
      {target: A, propertyKey: "a"},
      {target: B, propertyKey: "shared"},
      {target: B, propertyKey: "b"}
    ]);
    expect(methodsOf(new B())).toEqual(methodsOf(B));
  });

  it("should keep setter only accessors", () => {
    class TestClass {
      set value(_: string) {}
    }

    expect(methodsOf(TestClass)).toEqual([{target: TestClass, propertyKey: "value"}]);
  });
});
