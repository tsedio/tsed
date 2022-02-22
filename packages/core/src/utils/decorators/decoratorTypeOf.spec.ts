import {decoratorTypeOf} from "./decoratorTypeOf";

class Test {}

describe("decoratorTypeOf()", () => {
  it("should return class", () => {
    expect(decoratorTypeOf([Test])).toBe("class");
  });

  it("should return property (static)", () => {
    expect(decoratorTypeOf([Test, "props"])).toBe("property.static");
  });

  it("should return property (instance)", () => {
    expect(decoratorTypeOf([Test.prototype, "props"])).toBe("property");
  });

  it("should return property (instance with descriptor from babel)", () => {
    expect(
      decoratorTypeOf([
        Test.prototype,
        "props",
        {
          configurable: true,
          enumerable: true,
          writable: true,
          initializer: null
        }
      ])
    ).toBe("property");
  });

  it("should return method (instance, getter)", () => {
    expect(
      decoratorTypeOf([
        Test.prototype,
        "props",
        {
          get: () => {}
        }
      ])
    ).toBe("property");
  });

  it("should return method (instance, setter)", () => {
    expect(
      decoratorTypeOf([
        Test.prototype,
        "props",
        {
          set: () => {}
        }
      ])
    ).toBe("property");
  });

  it("should return method (static)", () => {
    expect(
      decoratorTypeOf([
        Test,
        "props",
        {
          value: () => {}
        }
      ])
    ).toBe("method.static");
  });

  it("should return method (instance)", () => {
    expect(
      decoratorTypeOf([
        Test.prototype,
        "props",
        {
          value: () => {}
        }
      ])
    ).toBe("method");
  });

  it("should return params (static)", () => {
    expect(decoratorTypeOf([Test, "props", 0])).toBe("parameter.static");
  });

  it("should return params (instance)", () => {
    expect(decoratorTypeOf([Test.prototype, "props", 0])).toBe("parameter");
  });

  it("should return params (constructor)", () => {
    expect(decoratorTypeOf([Test.prototype, undefined, 0])).toBe("parameter.constructor");
  });
});
