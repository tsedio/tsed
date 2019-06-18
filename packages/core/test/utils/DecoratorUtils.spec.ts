import {expect} from "chai";
import {
  applyDecorators,
  decorateMethodsOf,
  descriptorOf,
  getDecoratorType,
  Store, StoreFn,
  UnsupportedDecoratorType
} from "../../src";

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
      expect(createError([Test])).to.equal("Decorator cannot used as class decorator on Test");
    });

    it("should return property (static)", () => {
      expect(createError([Test, "props"])).to.equal("Decorator cannot used as property.static decorator on Test.props");
    });

    it("should return property (instance)", () => {
      expect(createError([Test.prototype, "props"])).to.equal("Decorator cannot used as property decorator on Test.props");
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
      ).to.equal("Decorator cannot used as property decorator on Test.props");
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
      ).to.equal("Decorator cannot used as property decorator on Test.props");
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
      ).to.equal("Decorator cannot used as method.static decorator on Test.props");
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
      ).to.equal("Decorator cannot used as method decorator on Test.props");
    });

    it("should return params (static)", () => {
      expect(createError([Test, "props", 0])).to.equal("Decorator cannot used as parameter.static decorator on Test.props");
    });

    it("should return params (instance)", () => {
      expect(createError([Test.prototype, "props", 0])).to.equal("Decorator cannot used as parameter decorator on Test.props.[0]");
    });

    it("should return params (constructor)", () => {
      expect(createError([Test.prototype, undefined, 0])).to.equal("Decorator cannot used as parameter.constructor decorator on Test");
    });
  });

  describe("decorateMethodsOf", () => {
    it("should decorate all methods", () => {
      function decorate() {
        return (target: any) => {
          decorateMethodsOf(target, (klass: any, property: any, descriptor: any) => {
            Store.from(klass, property, descriptor).set("test", property);
          });
        };
      }

      class TestParent {
        test2(a: any) {
          return "test" + a;
        }
      }

      // WHEN
      @decorate()
      class Test extends TestParent {
        test() {
        }
      }

      // THEN
      Store.from(Test, "test", descriptorOf(Test, "test")).get("test").should.eq("test");
      Store.from(Test, "test2", descriptorOf(Test, "test2")).get("test").should.eq("test2");

      new Test().test2("1").should.eq("test1");
    });
  });

  describe("applyDecorators", () => {

    function decorator1(value: any) {
      return StoreFn((store) => {
        store.set("decorator1", value);
      });
    }

    function decorator2(value: any) {
      return StoreFn((store) => {
        store.set("decorator2", value);
      });
    }

    function decorate() {
      return applyDecorators(
        decorator1("test1"),
        decorator2("test2")
      );
    }

    @decorate()
    class Test {
    }

    it("should apply all decorators", () => {
      Store.from(Test).get("decorator1").should.eq("test1");
      Store.from(Test).get("decorator2").should.eq("test2");
    });
  });
});
