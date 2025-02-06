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
});
