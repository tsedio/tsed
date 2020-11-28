import {expect} from "chai";
import {decoratorTypeOf, getDecoratorType} from "./decoratorTypeOf";

class Test {}

describe("decoratorTypeOf()", () => {
  describe("when short type", () => {
    it("should return class", () => {
      expect(getDecoratorType([Test])).to.equal("class");
    });

    it("should return property (static)", () => {
      expect(getDecoratorType([Test, "props"])).to.equal("property");
    });

    it("should return property (instance)", () => {
      expect(getDecoratorType([Test.prototype, "props"])).to.equal("property");
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
      ).to.equal("property");
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
      ).to.equal("property");
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
      ).to.equal("method.static");
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
      ).to.equal("method");
    });

    it("should return params (static)", () => {
      expect(decoratorTypeOf([Test, "props", 0])).to.equal("parameter.static");
    });

    it("should return params (instance)", () => {
      expect(decoratorTypeOf([Test.prototype, "props", 0])).to.equal("parameter");
    });

    it("should return params (constructor)", () => {
      expect(decoratorTypeOf([Test.prototype, undefined, 0])).to.equal("parameter.constructor");
    });
  });

  it("should return class", () => {
    expect(decoratorTypeOf([Test])).to.equal("class");
  });

  it("should return property (static)", () => {
    expect(decoratorTypeOf([Test, "props"])).to.equal("property.static");
  });

  it("should return property (instance)", () => {
    expect(decoratorTypeOf([Test.prototype, "props"])).to.equal("property");
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
    ).to.equal("property");
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
    ).to.equal("property");
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
    ).to.equal("property");
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
    ).to.equal("method.static");
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
    ).to.equal("method");
  });

  it("should return params (static)", () => {
    expect(decoratorTypeOf([Test, "props", 0])).to.equal("parameter.static");
  });

  it("should return params (instance)", () => {
    expect(decoratorTypeOf([Test.prototype, "props", 0])).to.equal("parameter");
  });

  it("should return params (constructor)", () => {
    expect(decoratorTypeOf([Test.prototype, undefined, 0])).to.equal("parameter.constructor");
  });
});
