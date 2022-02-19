import {UnsupportedDecoratorType} from "./UnsupportedDecoratorType";

class Test {}

describe("UnsupportedDecoratorType", () => {
  const createError = (args: any[]) => {
    return new UnsupportedDecoratorType({name: "Decorator"}, args).message;
  };

  it("should return class", () => {
    expect(createError([Test])).toBe("Decorator cannot be used as class decorator on Test");
  });

  it("should return property (static)", () => {
    expect(createError([Test, "props"])).toBe("Decorator cannot be used as property.static decorator on Test.props");
  });

  it("should return property (instance)", () => {
    expect(createError([Test.prototype, "props"])).toBe("Decorator cannot be used as property decorator on Test.props");
  });

  it("should return method (instance, getter)", () => {
    expect(
      createError([
        Test.prototype,
        "props",
        {
          get: () => {}
        }
      ])
    ).toBe("Decorator cannot be used as property decorator on Test.props");
  });

  it("should return method (instance, setter)", () => {
    expect(
      createError([
        Test.prototype,
        "props",
        {
          set: () => {}
        }
      ])
    ).toBe("Decorator cannot be used as property decorator on Test.props");
  });

  it("should return method (static)", () => {
    expect(
      createError([
        Test,
        "props",
        {
          value: () => {}
        }
      ])
    ).toBe("Decorator cannot be used as method.static decorator on Test.props");
  });

  it("should return method (instance)", () => {
    expect(
      createError([
        Test.prototype,
        "props",
        {
          value: () => {}
        }
      ])
    ).toBe("Decorator cannot be used as method decorator on Test.props");
  });

  it("should return params (static)", () => {
    expect(createError([Test, "props", 0])).toBe("Decorator cannot be used as parameter.static decorator on Test.props");
  });

  it("should return params (instance)", () => {
    expect(createError([Test.prototype, "props", 0])).toBe("Decorator cannot be used as parameter decorator on Test.props.[0]");
  });

  it("should return params (constructor)", () => {
    expect(createError([Test.prototype, undefined, 0])).toBe("Decorator cannot be used as parameter.constructor decorator on Test");
  });
});
