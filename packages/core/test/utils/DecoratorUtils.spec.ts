import {expect} from "chai";
import {getDecoratorType, UnsupportedDecoratorType} from "../../src";

class Test {
}

describe("DecoratorUtils", () => {
  describe("getDecoratorType()", () => {
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
          getDecoratorType([
            Test.prototype,
            "props",
            {
              get: () => {
              }
            }
          ])
        ).to.equal("property");
      });

      it("should return method (instance, setter)", () => {
        expect(
          getDecoratorType([
            Test.prototype,
            "props",
            {
              set: () => {
              }
            }
          ])
        ).to.equal("property");
      });

      it("should return method (static)", () => {
        expect(
          getDecoratorType([
            Test,
            "props",
            {
              value: () => {
              }
            }
          ])
        ).to.equal("method");
      });

      it("should return method (instance)", () => {
        expect(
          getDecoratorType([
            Test.prototype,
            "props",
            {
              value: () => {
              }
            }
          ])
        ).to.equal("method");
      });

      it("should return params (static)", () => {
        expect(getDecoratorType([Test, "props", 0])).to.equal("parameter");
      });

      it("should return params (instance)", () => {
        expect(getDecoratorType([Test.prototype, "props", 0])).to.equal("parameter");
      });

      it("should return params (constructor)", () => {
        expect(getDecoratorType([Test.prototype, undefined, 0])).to.equal("parameter");
      });
    });
    describe("when long type", () => {
      it("should return class", () => {
        expect(getDecoratorType([Test], true)).to.equal("class");
      });

      it("should return property (static)", () => {
        expect(getDecoratorType([Test, "props"], true)).to.equal("property.static");
      });

      it("should return property (instance)", () => {
        expect(getDecoratorType([Test.prototype, "props"], true)).to.equal("property");
      });

      it("should return method (instance, getter)", () => {
        expect(
          getDecoratorType(
            [
              Test.prototype,
              "props",
              {
                get: () => {
                }
              }
            ],
            true
          )
        ).to.equal("property");
      });

      it("should return method (instance, setter)", () => {
        expect(
          getDecoratorType(
            [
              Test.prototype,
              "props",
              {
                set: () => {
                }
              }
            ],
            true
          )
        ).to.equal("property");
      });

      it("should return method (static)", () => {
        expect(
          getDecoratorType(
            [
              Test,
              "props",
              {
                value: () => {
                }
              }
            ],
            true
          )
        ).to.equal("method.static");
      });

      it("should return method (instance)", () => {
        expect(
          getDecoratorType(
            [
              Test.prototype,
              "props",
              {
                value: () => {
                }
              }
            ],
            true
          )
        ).to.equal("method");
      });

      it("should return params (static)", () => {
        expect(getDecoratorType([Test, "props", 0], true)).to.equal("parameter.static");
      });

      it("should return params (instance)", () => {
        expect(getDecoratorType([Test.prototype, "props", 0], true)).to.equal("parameter");
      });

      it("should return params (constructor)", () => {
        expect(getDecoratorType([Test.prototype, undefined, 0], true)).to.equal("parameter.constructor");
      });
    });
  });

  describe("UnsupportedDecoratorType", () => {
    const createError = (args: any[]) => {
      return new UnsupportedDecoratorType({name: "Decorator"}, args).message;
    };

    it("should return class", () => {
      expect(createError([Test])).to.equal("Decorator cannot used as class at Test");
    });

    it("should return property (static)", () => {
      expect(createError([Test, "props"])).to.equal("Decorator cannot used as property.static at Test.props");
    });

    it("should return property (instance)", () => {
      expect(createError([Test.prototype, "props"])).to.equal("Decorator cannot used as property at Test.props");
    });

    it("should return method (instance, getter)", () => {
      expect(
        createError([
          Test.prototype,
          "props",
          {
            get: () => {
            }
          }
        ])
      ).to.equal("Decorator cannot used as property at Test.props");
    });

    it("should return method (instance, setter)", () => {
      expect(
        createError([
          Test.prototype,
          "props",
          {
            set: () => {
            }
          }
        ])
      ).to.equal("Decorator cannot used as property at Test.props");
    });

    it("should return method (static)", () => {
      expect(
        createError([
          Test,
          "props",
          {
            value: () => {
            }
          }
        ])
      ).to.equal("Decorator cannot used as method.static at Test.props");
    });

    it("should return method (instance)", () => {
      expect(
        createError([
          Test.prototype,
          "props",
          {
            value: () => {
            }
          }
        ])
      ).to.equal("Decorator cannot used as method at Test.props");
    });

    it("should return params (static)", () => {
      expect(createError([Test, "props", 0])).to.equal("Decorator cannot used as parameter.static at Test.props");
    });

    it("should return params (instance)", () => {
      expect(createError([Test.prototype, "props", 0])).to.equal("Decorator cannot used as parameter at Test.props.[0]");
    });

    it("should return params (constructor)", () => {
      expect(createError([Test.prototype, undefined, 0])).to.equal("Decorator cannot used as parameter.constructor at Test");
    });
  });
});
