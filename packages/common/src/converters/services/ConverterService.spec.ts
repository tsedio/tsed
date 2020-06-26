import {PlatformTest} from "@tsed/common";
import {catchError} from "@tsed/core";
import {Configuration, InjectorService} from "@tsed/di";
import {expect} from "chai";
import {JsonFoo, JsonFoo1, JsonFoo2, JsonFoo3, JsonFoo4} from "../../../../../test/helper/classes";
import {ConverterService, ModelStrict} from "../../../src/converters";
import {Default, PropertyDeserialize, PropertySerialize, PropertyType} from "../../../src/jsonschema/decorators";
import {Property} from "../../../src/jsonschema/decorators/property";

class JsonFoo5 {
  @Property()
  test: any;
  foo: any;
}

describe("ConverterService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("deserialize()", () => {
    describe("primitive", () => {
      let converterService: ConverterService;
      beforeEach(() => {
        converterService = PlatformTest.get<ConverterService>(ConverterService);
      });

      it("should convert boolean to Boolean", () => {
        expect(converterService.deserialize(true, Boolean)).to.be.equal(true);
        expect(converterService.deserialize(false, Boolean)).to.be.equal(false);
      });

      it("should convert boolean string to Boolean", () => {
        expect(converterService.deserialize("true", Boolean)).to.be.equal(true);
        expect(converterService.deserialize("false", Boolean)).to.be.equal(false);
      });

      it("should convert empty string to Boolean", () => {
        expect(converterService.deserialize("", Boolean)).to.be.equal(false);
      });

      it("should convert string to Boolean", () => {
        expect(converterService.deserialize("test", Boolean)).to.be.equal(true);
      });

      it("should convert number to Boolean", () => {
        expect(converterService.deserialize(0, Boolean)).to.be.equal(false);
        expect(converterService.deserialize(1, Boolean)).to.be.equal(true);
      });

      it("should convert null to Boolean", () => {
        expect(converterService.deserialize(null, Boolean)).to.be.equal(null);
      });

      it("should convert undefined to Boolean", () => {
        expect(converterService.deserialize(undefined, Boolean)).to.be.equal(undefined);
      });

      it("should convert a string to Number", () => {
        expect(converterService.deserialize("1", Number))
          .to.be.a("number")
          .and.to.equals(1);
      });

      it("should convert number to Number", () => {
        expect(converterService.deserialize(1, Number))
          .to.be.a("number")
          .and.to.equals(1);
      });

      it("should convert a string to String", () => {
        expect(converterService.deserialize("1", String))
          .to.be.a("string")
          .and.to.equals("1");
      });

      it("should convert number to String", () => {
        expect(converterService.deserialize(1, String))
          .to.be.a("string")
          .and.to.equals("1");
      });

      it("should convert a null/undefined to null/undefined", () => {
        expect(converterService.deserialize(null, Number)).to.equal(null);
        expect(converterService.deserialize(undefined, Number)).to.equal(undefined);
      });
    });

    describe("object", () => {
      it(
        "should convert object",
        PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
          expect(converterService.deserialize({}, Object)).to.be.an("object");
        })
      );

      it(
        "should convert a date",
        PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
          expect(converterService.deserialize(new Date().toISOString(), Date)).to.be.instanceof(Date);
        })
      );
    });

    it(
      "should deserialize Foo model",
      PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
        const foo = converterService.deserialize(
          {
            test: 1,
            foo: "test"
          },
          JsonFoo as any
        );
        expect(foo).to.be.instanceof(JsonFoo);
        expect(foo.method).to.be.a("function");

        expect(foo.test)
          .to.be.a("number")
          .and.to.equals(1);
        expect(foo.foo)
          .to.be.a("string")
          .and.to.equals("test");
      })
    );

    it(
      "should deserialize Map, Array and Set",
      PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
        // WHEN
        const foo2 = converterService.deserialize(
          {
            test: "testField",
            Name: "nameField",
            dateStart: new Date().toISOString(),
            object: {test: "2ez"},
            foo: {
              test: "2"
            },
            foos: [
              {
                test: "1"
              },
              {
                test: "2"
              }
            ],
            foos2: {
              test: "15"
            },
            theMap: {
              f1: {test: "1"}
            },
            theSet: [{test: "13"}, {test: "1re"}]
          },
          JsonFoo2
        );

        // THEN
        expect(foo2).to.be.instanceof(JsonFoo2);
        expect(foo2.method).to.be.a("function");
        expect(foo2.dateStart).to.be.instanceof(Date);
        expect(foo2.name).to.be.a("string");
        expect(foo2.name).to.equals("nameField");
        expect(foo2.foo).to.be.instanceof(JsonFoo);
        expect(foo2.foo.test).to.equals("2");
        expect(foo2.object.test).to.equals("2ez");
        expect(foo2.foos).to.be.an("array");
        expect(foo2.foos[0]).to.be.instanceof(JsonFoo);
        expect(foo2.foos2).to.be.an("array");
        expect(foo2.foos2[0]).to.be.instanceof(JsonFoo1);
        expect(foo2.theMap).to.be.instanceof(Map);
        expect(foo2.theMap.get("f1")).to.be.an("object");
        expect(foo2.theMap.get("f1").test).to.equals("1");
        expect(foo2.theSet).to.be.instanceof(Set);

        foo2.theSet.forEach((item: any) => {
          expect(item).to.be.an("object");
          expect(item.test).to.be.a("string");
        });
      })
    );

    it(
      "should use function onDeserialize to Deserialize property",
      PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
        class Test {
          @PropertyDeserialize(v => v + "to")
          test: string;
        }

        const result = converterService.deserialize({test: "test"}, Test);

        expect(result).to.be.instanceof(Test);
        expect(result.test).to.eq("testto");
      })
    );

    it(
      "should emit a BadRequest when the number parsing failed",
      PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
        const error: any = catchError(() => converterService.deserialize("NK1", Number));

        expect(error.message).to.eq("Cast error. Expression value is not a number.");
      })
    );

    describe("validationModelStrict options", () => {
      it(
        "should emit a BadRequest error when a property is not in the Model",
        PlatformTest.inject([Configuration], async (configuration: Configuration) => {
          // GIVEN
          const converterService = await invokeConverterService({
            validationModelStrict: true,
            configuration
          });

          // WHEN
          let actualError;
          try {
            converterService.deserialize(
              {
                test: 1,
                foo: "test",
                notPropertyAllowed: "tst"
              },
              JsonFoo4 as any
            );
          } catch (er) {
            actualError = er;
          }

          expect(actualError.message).to.equal("Property notPropertyAllowed on class JsonFoo4 is not allowed.");
        })
      );
      it(
        "should deserialize model",
        PlatformTest.inject([Configuration], async (configuration: Configuration) => {
          // GIVEN
          const converterService = await invokeConverterService({
            validationModelStrict: false,
            configuration
          });

          // WHEN
          const result = converterService.deserialize(
            {
              test: 1,
              foo: "test",
              notPropertyAllowed: "tst"
            },
            JsonFoo5 as any
          );
          // THEN
          expect(result).to.be.instanceof(JsonFoo5);
          expect(result).to.deep.equal({
            foo: "test",
            notPropertyAllowed: "tst",
            test: 1
          });
        })
      );
    });

    describe("converter.additionalProperties options", () => {
      it(
        "(error) should emit a BadRequest error when a property is not in the Model",
        PlatformTest.inject([Configuration], async (configuration: Configuration) => {
          // GIVEN
          const converterService = await invokeConverterService({
            additionalProperties: "error",
            configuration
          });

          // WHEN
          let actualError;
          try {
            converterService.deserialize(
              {
                test: 1,
                foo: "test",
                notPropertyAllowed: "tst"
              },
              JsonFoo4 as any
            );
          } catch (er) {
            actualError = er;
          }

          expect(actualError.message).to.equal("Property notPropertyAllowed on class JsonFoo4 is not allowed.");
        })
      );
      it(
        "(ignore) should deserialize model without additional property",
        PlatformTest.inject([Configuration], async (configuration: Configuration) => {
          // GIVEN
          const converterService = await invokeConverterService({
            additionalProperties: "ignore",
            configuration
          });

          // WHEN
          const result = converterService.deserialize(
            {
              test: 1,
              foo: "test",
              notPropertyAllowed: "tst"
            },
            JsonFoo5 as any
          );
          // THEN
          expect(result).to.be.instanceof(JsonFoo5);
          expect(result).to.deep.equal({
            test: 1
          });
        })
      );
      it(
        "(accept) should deserialize model with additional property",
        PlatformTest.inject([Configuration], async (configuration: Configuration) => {
          // GIVEN
          const converterService = await invokeConverterService({
            additionalProperties: "accept",
            configuration
          });

          // WHEN
          const result = converterService.deserialize(
            {
              test: 1,
              foo: "test",
              notPropertyAllowed: "tst"
            },
            JsonFoo5 as any
          );
          // THEN
          expect(result).to.be.instanceof(JsonFoo5);
          expect(result).to.deep.equal({
            foo: "test",
            notPropertyAllowed: "tst",
            test: 1
          });
        })
      );
    });

    describe("when an attribute is required", () => {
      it("should throw a bad request (undefined value)", async () => {
        // GIVEN
        const converterService = await PlatformTest.invoke<ConverterService>(ConverterService, []);

        // WHEN
        let actualError;
        try {
          converterService.deserialize(
            {
              test: undefined
            },
            JsonFoo2
          );
        } catch (er) {
          actualError = er;
        }

        expect(actualError.message).to.equal("Property test on class JsonFoo2 is required. Given value: undefined");
      });

      it("should throw a bad request (null value)", async () => {
        // GIVEN
        const converterService = await PlatformTest.invoke<ConverterService>(ConverterService, []);

        // WHEN
        let actualError;
        try {
          converterService.deserialize(
            {
              test: null
            },
            JsonFoo2
          );
        } catch (er) {
          actualError = er;
        }

        expect(actualError.message).to.equal("Property test on class JsonFoo2 is required. Given value: null");
      });

      it("should throw a bad request (empty value)", async () => {
        // GIVEN
        const converterService = await PlatformTest.invoke<ConverterService>(ConverterService, []);

        // WHEN
        let actualError;
        try {
          converterService.deserialize(
            {
              test: ""
            },
            JsonFoo2
          );
        } catch (er) {
          actualError = er;
        }

        expect(actualError.message).to.equal("Property test on class JsonFoo2 is required. Given value: ");
      });
    });

    describe("With model annotation", () => {
      it("should convert model", () => {
        class Model {
          @Default("foo")
          @PropertyType(String)
          public readonly foo: string = "foo";
        }

        const injector = new InjectorService();
        injector.invoke(ConverterService);

        const converter = injector.get<ConverterService>(ConverterService)!;

        const obj = {foo: "bar"};
        const result = converter.deserialize(obj, Model);

        expect(result).to.be.instanceof(Model);
        expect(result.foo).to.equal("bar");
      });
    });
  });
  describe("serialize()", () => {
    describe("primitive", () => {
      let converterService: ConverterService;
      beforeEach(
        PlatformTest.inject([ConverterService], (_converterService_: ConverterService) => {
          converterService = _converterService_;
        })
      );

      it("should convert empty string to string", () => {
        expect(converterService.serialize("")).to.be.a("string");
      });
      it("should convert undefined to undefined", () => {
        expect(converterService.serialize(undefined)).to.equals(undefined);
      });
      it("should convert boolean to a boolean", () => {
        expect(converterService.serialize(true))
          .to.be.a("boolean")
          .and.to.equal(true);
      });
      it("should convert number to a number", () => {
        expect(converterService.serialize(1))
          .to.be.a("number")
          .and.to.equal(1);
      });
      it("should convert string to a string", () => {
        expect(converterService.serialize("1"))
          .to.be.a("string")
          .and.to.equal("1");
      });
    });

    describe("object", () => {
      let converterService: ConverterService;
      beforeEach(
        PlatformTest.inject([ConverterService], (_converterService_: ConverterService) => {
          converterService = _converterService_;
        })
      );

      it("should convert object to an object", () => {
        expect(converterService.serialize({})).to.be.an("object");
      });

      it("should convert date to a string", () => {
        expect(converterService.serialize(new Date())).to.be.a("string");
      });
    });

    describe("array", () => {
      let converterService: ConverterService;
      beforeEach(
        PlatformTest.inject([ConverterService], (_converterService_: ConverterService) => {
          converterService = _converterService_;
        })
      );

      it("should convert array to an array (1)", () => {
        expect(converterService.serialize([null])).to.deep.eq([null]);
      });

      it("should convert array to an array (2)", () => {
        expect(converterService.serialize([1])).to.deep.eq([1]);
      });

      it("should convert array to an array (3)", () => {
        expect(converterService.serialize([{test: "1"}])).to.deep.eq([{test: "1"}]);
      });
    });

    describe("class Foo2", () => {
      let converterService: ConverterService;
      beforeEach(
        PlatformTest.inject([ConverterService], (_converterService_: ConverterService) => {
          converterService = _converterService_;
        })
      );

      let foo: any;
      let foo2: any;
      beforeEach(() => {
        foo2 = new JsonFoo2();
        foo2.dateStart = new Date();
        foo2.test = "Test";
        foo2.name = "Test";

        foo = new JsonFoo();
        foo.test = "test";

        foo2.foos = [foo];
        foo2.foo = foo;

        foo2.theMap = new Map<string, JsonFoo>();
        foo2.theMap.set("newKey", foo);

        foo2.theSet = new Set<JsonFoo>();
        foo2.theSet.add(foo);

        foo = converterService.serialize(foo2);
      });

      it("should have an attribut with date type", () => {
        expect(foo.dateStart)
          .to.be.a("string")
          .and.to.equals(foo2.dateStart.toISOString());
      });

      it("should have an attribut Name (because metadata said Name instead of name)", () => {
        expect(foo.Name)
          .to.be.a("string")
          .and.to.equals("Test");
      });

      it("should haven't an attribut name (because metadata said Name instead of name)", () => {
        expect(foo.name).to.equals(undefined);
      });

      it("should have an attribut with array type", () => {
        expect(foo.foos).to.be.an("array");
      });

      it("should have an attribut with array type and an item serialized", () => {
        expect(foo.foos[0]).to.be.an("object");
        expect(foo.foos[0].test).to.equals("test");
      });

      it("should have an attribut with Map type", () => {
        expect(foo.theMap).to.be.an("object");
      });

      it("should have an attribut with Map type and an item serialized", () => {
        expect(foo.theMap.newKey).to.be.an("object");
        expect(foo.theMap.newKey.test).to.equals("test");
      });

      it("should have an attribut with Set type", () => {
        expect(foo.theSet).to.be.an("array");
      });

      it("should have an attribut with Set type and an item serialized", () => {
        expect(foo.theSet[0]).to.be.an("object");
        expect(foo.theSet[0].test).to.equals("test");
      });
    });

    describe("class Foo3", () => {
      let converterService: ConverterService;
      beforeEach(
        PlatformTest.inject([ConverterService], (_converterService_: ConverterService) => {
          converterService = _converterService_;
        })
      );
      it("should use toJSON method", () => {
        expect(converterService.serialize(new JsonFoo3())).to.be.an("object");
      });
    });
    describe("@PropertySerialize", () => {
      it("should use function to Deserialize property", async () => {
        const converterService = await PlatformTest.invoke<ConverterService>(ConverterService, []);

        class Test {
          @PropertySerialize(v => v + "to")
          test: string;
        }

        const input = new Test();
        input.test = "test";

        const result = converterService.serialize(input);

        expect(result).to.be.not.instanceof(Test);
        expect(result.test).to.eq("testto");
      });
    });
  });

  describe("getAdditionalPropertyLevel()", () => {
    class Test {
    }

    it(
      "should return accept when there is no model",
      PlatformTest.inject([Configuration], async (configuration: Configuration) => {
        const converterService = await invokeConverterService({
          validationModelStrict: true,
          configuration
        });

        // @ts-ignore
        const result = converterService.getAdditionalPropertiesLevel(Object);
        expect(result).to.equals("accept");
      })
    );
    it(
      "should return error when validationModelStrict = true",
      PlatformTest.inject([Configuration], async (configuration: Configuration) => {
        const converterService = await invokeConverterService({
          validationModelStrict: true,
          configuration
        });

        // @ts-ignore
        const result = converterService.getAdditionalPropertiesLevel(Test);
        expect(result).to.equals("error");
      })
    );
    it(
      "should return accept when validationModelStrict = false",
      PlatformTest.inject([Configuration], async (configuration: Configuration) => {
        const converterService = await invokeConverterService({
          validationModelStrict: false,
          configuration
        });

        // @ts-ignore
        const result = converterService.getAdditionalPropertiesLevel(Test);
        expect(result).to.equals("accept");
      })
    );
    it(
      "should return error when converter.additionalProperties = error",
      PlatformTest.inject([Configuration], async (configuration: Configuration) => {
        const converterService = await invokeConverterService({
          additionalProperties: "error",
          configuration
        });

        // @ts-ignore
        const result = converterService.getAdditionalPropertiesLevel(Test);
        expect(result).to.equals("error");
      })
    );
    it(
      "should return accept when converter.additionalProperties = error",
      PlatformTest.inject([Configuration], async (configuration: Configuration) => {
        const converterService = await invokeConverterService({
          additionalProperties: "accept",
          configuration
        });

        // @ts-ignore
        const result = converterService.getAdditionalPropertiesLevel(Test);
        expect(result).to.equals("accept");
      })
    );
    it(
      "should return ignore when converter.additionalProperties = ignore",
      PlatformTest.inject([Configuration], async (configuration: Configuration) => {
        const converterService = await invokeConverterService({
          additionalProperties: "ignore",
          configuration
        });

        // @ts-ignore
        const result = converterService.getAdditionalPropertiesLevel(Test);
        expect(result).to.equals("ignore");
      })
    );
    it(
      "should return return return error when model is strict and global is acccept",
      PlatformTest.inject([Configuration], async (configuration: Configuration) => {
        @ModelStrict(true)
        class Test {
        }

        const converterService = await invokeConverterService({
          additionalProperties: "accept",
          configuration
        });

        // @ts-ignore
        const result = converterService.getAdditionalPropertiesLevel(Test);
        expect(result).to.equals("error");
      })
    );
    it(
      "should return return return error when model is strict and global is acccept",
      PlatformTest.inject([Configuration], async (configuration: Configuration) => {
        @ModelStrict(false)
        class Test {
        }

        const converterService = await invokeConverterService({
          additionalProperties: "error",
          configuration
        });

        // @ts-ignore
        const result = converterService.getAdditionalPropertiesLevel(Test);
        expect(result).to.equals("accept");
      })
    );
  });
});

async function invokeConverterService({validationModelStrict = true, additionalProperties, configuration}: any) {
  return PlatformTest.invoke<ConverterService>(ConverterService, [
    {
      token: Configuration,
      use: {
        get(key: string) {
          if (key === "validationModelStrict") {
            return validationModelStrict;
          }

          if (key === "converter") {
            return {
              additionalProperties
            };
          }

          return configuration.get(key);
        }
      }
    }
  ]);
}
