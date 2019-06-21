import {Store} from "@tsed/core";
import {inject, TestContext} from "@tsed/testing";
import {assert, expect} from "chai";
import {JsonFoo, JsonFoo1, JsonFoo2, JsonFoo3, JsonFoo4} from "../../../../../test/helper/classes";
import {ConverterService} from "../../../src/converters";
import {PropertyDeserialize, PropertySerialize} from "../../../src/jsonschema/decorators";
import {Property} from "../../../src/jsonschema/decorators/property";

class JsonFoo5 {
  @Property()
  test: any;
  foo: any;
}

describe("ConverterService", () => {
  let converterService: ConverterService;
  before(
    inject([ConverterService], (_converterService_: ConverterService) => {
      converterService = _converterService_;
    })
  );
  after(TestContext.reset);

  describe("deserialize()", () => {
    describe("primitive", () => {
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
        expect(converterService.deserialize(null, Boolean)).to.be.equal(false);
      });

      it("should convert undefined to Boolean", () => {
        expect(converterService.deserialize(undefined, Boolean)).to.be.equal(false);
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
    });

    describe("object", () => {
      it("should convert object", () => {
        expect(converterService.deserialize({}, Object)).to.be.an("object");
      });

      it("should convert a date", inject([ConverterService], (converterService: ConverterService) => {
        expect(converterService.deserialize(new Date().toISOString(), Date)).to.be.instanceof(Date);
      }));
    });

    describe("class Foo", () => {
      let foo: any;
      before(() => {
        foo = converterService.deserialize(
          {
            test: 1,
            foo: "test"
          },
          JsonFoo as any
        );
      });

      it("should be an instance of Foo", () => {
        expect(foo).to.be.instanceof(JsonFoo);
      });

      it("should have method named 'method'", () => {
        expect(foo.method).to.be.a("function");
      });

      it("should have some attributs", () => {
        expect(foo.test)
          .to.be.a("number")
          .and.to.equals(1);
        expect(foo.foo)
          .to.be.a("string")
          .and.to.equals("test");
      });
    });

    describe("class Foo2", () => {
      let foo2: any;
      before(() => {
        foo2 = converterService.deserialize(
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
      });

      it("should be an instance of Foo2", () => {
        expect(foo2).to.be.instanceof(JsonFoo2);
      });

      it("should preserve method", () => {
        expect(foo2.method).to.be.a("function");
      });

      it("should have some attributs", () => {
        expect(foo2.dateStart).to.be.instanceof(Date);
        expect(foo2.name).to.be.a("string");
        expect(foo2.name).to.equals("nameField");
      });

      it("should have an attribut that is deserialized as Foo instance", () => {
        expect(foo2.foo).to.be.instanceof(JsonFoo);
        expect(foo2.foo.test).to.equals("2");
        expect(foo2.object.test).to.equals("2ez");
      });

      describe("Array", () => {
        describe("when data is an array", () => {
          it("should have an attribut that is deserialized as an Array", () => {
            expect(foo2.foos).to.be.an("array");
          });

          it("should have an attribut that is deserialized as an Array with an item that is an instance of Foo", () => {
            expect(foo2.foos[0]).to.be.instanceof(JsonFoo);
          });
        });

        describe("when data is a object", () => {
          it("should have an attribut that is deserialized as an Array", () => {
            expect(foo2.foos2).to.be.an("array");
          });

          it("should have an attribut that is deserialized as an Array with an item that is an instance of Foo", () => {
            expect(foo2.foos2[0]).to.be.instanceof(JsonFoo1);
          });
        });
      });

      describe("Map", () => {
        it("should have an attribut that is deserialized as a Map", () => {
          expect(foo2.theMap).to.be.instanceof(Map);
        });

        it("should have an attribut that is deserialized as a Map and have a method", () => {
          expect(foo2.theMap.get("f1")).to.be.an("object");
          expect(foo2.theMap.get("f1").test).to.equals("1");
        });
      });

      describe("Set", () => {
        it("should have an attribut that is deserialized as a Set", () => {
          expect(foo2.theSet).to.be.instanceof(Set);
        });

        it("should have an attribut that is deserialized as a Set and have a method", () => {
          foo2.theSet.forEach((item: any) => {
            expect(item).to.be.an("object");
            expect(item.test).to.be.a("string");
          });
        });
      });
    });

    describe("when onDeserialize is used on property", () => {
      it("should use function to Deserialize property", () => {
        class Test {
          @PropertyDeserialize(v => v + "to")
          test: string;
        }

        const result = converterService.deserialize({test: "test"}, Test);

        result.should.instanceof(Test);
        result.test.should.eq("testto");
      });
    });

    describe("deserialization error", () => {
      it("should emit a BadRequest when the number parsing failed", () => {
        assert.throws(() => converterService.deserialize("NK1", Number), "Cast error. Expression value is not a number.");
      });
    });

    describe("when validationModelStrict is enabled", () => {
      before(() => {
        // @ts-ignore
        converterService.validationModelStrict = true;
      });
      it("should emit a BadRequest when a property is not in the Model", () => {
        assert.throws(
          () =>
            converterService.deserialize(
              {
                test: 1,
                foo: "test",
                notPropertyAllowed: "tst"
              },
              JsonFoo4 as any
            ),
          "Property notPropertyAllowed on class JsonFoo4 is not allowed."
        );
      });
    });

    describe("when validationModelStrict is disabled", () => {
      before(() => {
        // @ts-ignore
        converterService.validationModelStrict = false;
      });
      after(() => {
        // @ts-ignore
        converterService.validationModelStrict = true;
      });

      it("should not emit a BadRequest", () => {
        const foo = new JsonFoo5();
        Object.assign(foo, {
          foo: "test",
          notPropertyAllowed: "tst",
          test: 1
        });

        expect(
          converterService.deserialize(
            {
              test: 1,
              foo: "test",
              notPropertyAllowed: "tst"
            },
            JsonFoo5 as any
          )
        ).to.deep.eq(foo);
      });
    });

    describe("when an attribute is required", () => {
      it("should throw a bad request (undefined value)", () => {
        assert.throws(
          () =>
            converterService.deserialize(
              {
                test: undefined
              },
              JsonFoo2
            ),
          "Property test on class JsonFoo2 is required."
        );
      });

      it("should throw a bad request (null value)", () => {
        assert.throws(
          () =>
            converterService.deserialize(
              {
                test: null
              },
              JsonFoo2
            ),
          "Property test on class JsonFoo2 is required."
        );
      });

      it("should throw a bad request (empty value)", () => {
        assert.throws(
          () =>
            converterService.deserialize(
              {
                test: ""
              },
              JsonFoo2
            ),
          "Property test on class JsonFoo2 is required."
        );
      });
    });
  });

  describe("serialize()", () => {
    describe("primitive", () => {
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
      it("should convert object to an object", () => {
        expect(converterService.serialize({})).to.be.an("object");
      });

      it("should convert date to a string", () => {
        expect(converterService.serialize(new Date())).to.be.a("string");
      });
    });

    describe("array", () => {
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
      let foo: any;
      let foo2: any;
      before(() => {
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
      it("should use toJSON method", () => {
        expect(converterService.serialize(new JsonFoo3())).to.be.an("object");
      });
    });

    describe("serialization error", () => {
      it("should emit a BadRequest when attribute is required", () =>
        assert.throws(() => {
          const foo4: any = new JsonFoo4();
          converterService.serialize(foo4);
        }, "Property foo on class JsonFoo4 is required."));
    });

    describe("isStrictModelValidation()", () => {
      class Test {
      }

      describe("when model is an Object", () => {
        it("should return false", () => {
          // @ts-ignore
          converterService.validationModelStrict = true;
          // @ts-ignore
          const result = converterService.isStrictModelValidation(Object);
          expect(result).to.be.false;
        });
      });

      describe("when validationModelStrict = true", () => {
        describe("when modelStrict = true", () => {
          it("should return true", () => {
            Store.from(Test).set("modelStrict", true);
            // @ts-ignore
            converterService.validationModelStrict = true;
            // @ts-ignore
            const result = converterService.isStrictModelValidation(Test);

            return expect(result).to.be.true;
          });
        });

        describe("when modelStrict = false", () => {
          it("should return false", () => {
            Store.from(Test).set("modelStrict", false);
            // @ts-ignore
            converterService.validationModelStrict = true;
            // @ts-ignore
            const result = converterService.isStrictModelValidation(Test);

            return expect(result).to.be.false;
          });
        });

        describe("when modelStrict = undefined", () => {
          it("should return true", () => {
            Store.from(Test).set("modelStrict", undefined);
            // @ts-ignore
            converterService.validationModelStrict = true;
            // @ts-ignore
            const result = converterService.isStrictModelValidation(Test);

            return expect(result).to.be.true;
          });
        });
      });

      describe("when validationModelStrict = false", () => {
        describe("when modelStrict = true", () => {
          let result: any;
          before(() => {
            Store.from(Test).set("modelStrict", true);
            // @ts-ignore
            converterService.validationModelStrict = false;
            // @ts-ignore
            result = converterService.isStrictModelValidation(Test);
          });

          after(() => {
            // @ts-ignore
            converterService.validationModelStrict = true;
          });

          it("should return true", () => expect(result).to.be.true);
        });

        describe("when modelStrict = false", () => {
          let result: any;
          before(() => {
            Store.from(Test).set("modelStrict", false);
            // @ts-ignore
            converterService.validationModelStrict = false;
            // @ts-ignore
            result = converterService.isStrictModelValidation(Test);
          });

          after(() => {
            // @ts-ignore
            converterService.validationModelStrict = true;
          });

          it("should return false", () => expect(result).to.be.false);
        });

        describe("when modelStrict = undefined", () => {
          let result: any;
          before(() => {
            Store.from(Test).set("modelStrict", undefined);
            // @ts-ignore
            converterService.validationModelStrict = false;
            // @ts-ignore
            result = converterService.isStrictModelValidation(Test);
          });

          after(() => {
            // @ts-ignore
            converterService.validationModelStrict = true;
          });

          it("should return false", () => expect(result).to.be.false);
        });
      });
    });

    describe("when onSerialize is used on property", () => {
      it("should use function to Deserialize property", () => {
        class Test {
          @PropertySerialize(v => v + "to")
          test: string;
        }

        const input = new Test();
        input.test = "test";

        const result = converterService.serialize(input);

        result.should.not.instanceof(Test);
        result.test.should.eq("testto");
      });
    });
  });
});
