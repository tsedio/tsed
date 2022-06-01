import {PlatformTest} from "@tsed/common";
import {catchError} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {CollectionOf, Default, Name, Property} from "@tsed/schema";
import {JsonFoo, JsonFoo1, JsonFoo2, JsonFoo3} from "../../../../../test/helper/classes";
import {ConverterService} from "./ConverterService";

describe("ConverterService", () => {
  let testContext: any;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("deserialize()", () => {
    describe("primitive", () => {
      let converterService: ConverterService;
      beforeEach(() => {
        converterService = PlatformTest.get<ConverterService>(ConverterService);
      });

      it("should convert boolean to Boolean", () => {
        expect(converterService.deserialize(true, {type: Boolean})).toEqual(true);
        expect(converterService.deserialize(false, {type: Boolean})).toEqual(false);
      });

      it("should convert boolean string to Boolean", () => {
        expect(converterService.deserialize("true", {type: Boolean})).toEqual(true);
        expect(converterService.deserialize("false", {type: Boolean})).toEqual(false);
      });

      it("should convert empty string to Boolean", () => {
        expect(converterService.deserialize("", {type: Boolean})).toEqual(false);
      });

      it("should convert string to Boolean", () => {
        expect(converterService.deserialize("test", {type: Boolean})).toEqual(true);
      });

      it("should convert number to Boolean", () => {
        expect(converterService.deserialize(0, {type: Boolean})).toEqual(false);
        expect(converterService.deserialize(1, {type: Boolean})).toEqual(true);
      });

      it("should convert null to Boolean", () => {
        expect(converterService.deserialize(null, {type: Boolean})).toEqual(null);
      });

      it("should convert undefined to Boolean", () => {
        expect(converterService.deserialize(undefined, {type: Boolean})).toBeUndefined();
      });

      it("should convert a string to Number", () => {
        expect(converterService.deserialize("1", {type: Number})).toEqual(1);
      });

      it("should convert number to Number", () => {
        expect(converterService.deserialize(1, {type: Number})).toEqual(1);
      });

      it("should convert a string to String", () => {
        expect(converterService.deserialize("1", {type: String})).toEqual("1");
      });

      it("should convert number to String", () => {
        expect(converterService.deserialize(1, {type: String})).toEqual("1");
      });

      it("should convert a null/undefined to null/undefined", () => {
        expect(converterService.deserialize(null, {type: Number})).toEqual(null);
        expect(converterService.deserialize(undefined, {type: Number})).toBeUndefined();
      });
    });

    describe("object", () => {
      it(
        "should convert object",
        PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
          expect(converterService.deserialize({}, {type: Object})).toBeInstanceOf(Object);
        })
      );

      it(
        "should convert a date",
        PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
          expect(converterService.deserialize(new Date().toISOString(), {type: Date})).toBeInstanceOf(Date);
        })
      );
      it(
        "should convert object with legacy options",
        PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
          const data = {
            id: "id",
            additionalProperties: "hello"
          };

          class Model {
            @Property()
            id: string;

            [key: string]: any;

            constructor({id, ...props}: any = {}) {
              testContext.id = id;
              Object.assign(this, props);
            }
          }

          expect(
            converterService.deserialize(data, {
              type: Model,
              additionalProperties: false
            })
          ).toEqual({
            id: "id",
            additionalProperties: "hello"
          });
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
          {type: JsonFoo}
        );
        expect(foo).toBeInstanceOf(JsonFoo);
        expect(foo.method).toBeInstanceOf(Function);

        expect(foo.test).toEqual(1);
        expect(foo.foo).toEqual("test");
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
          {type: JsonFoo2}
        );

        // THEN
        expect(foo2).toBeInstanceOf(JsonFoo2);
        expect(foo2.method).toBeInstanceOf(Function);
        expect(foo2.dateStart).toBeInstanceOf(Date);
        expect(typeof foo2.name).toBe("string");
        expect(foo2.name).toEqual("nameField");
        expect(foo2.foo).toBeInstanceOf(JsonFoo);
        expect(foo2.foo.test).toEqual("2");
        expect(foo2.object.test).toEqual("2ez");
        expect(Array.isArray(foo2.foos)).toBe(true);
        expect(foo2.foos[0]).toBeInstanceOf(JsonFoo);
        expect(Array.isArray(foo2.foos2)).toBe(true);
        expect(foo2.foos2[0]).toBeInstanceOf(JsonFoo1);
        expect(foo2.theMap).toBeInstanceOf(Map);
        expect(foo2.theMap.get("f1")).toBeInstanceOf(Object);
        expect(foo2.theMap.get("f1").test).toEqual("1");
        expect(foo2.theSet).toBeInstanceOf(Set);

        foo2.theSet.forEach((item: any) => {
          expect(item).toBeInstanceOf(Object);
          expect(typeof item.test).toBe("string");
        });
      })
    );

    it(
      "should emit a BadRequest when the number parsing failed",
      PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
        const error: any = catchError(() => converterService.deserialize("NK1", {type: Number}));

        expect(error.message).toEqual("Cast error. Expression value is not a number.");
      })
    );

    it("should convert model with model annotation", () => {
      class Model {
        @Default("foo")
        @CollectionOf(String)
        public readonly foo: string = "foo";
      }

      const injector = new InjectorService();
      injector.invoke(ConverterService);

      const converter = injector.get<ConverterService>(ConverterService)!;

      const obj = {foo: "bar"};
      const result = converter.deserialize(obj, {type: Model});

      expect(result).toBeInstanceOf(Model);
      expect(result.foo).toEqual("bar");
    });

    it("should convert model with model annotation (legacy signature)", () => {
      class Model {
        @Default("foo")
        @CollectionOf(String)
        public readonly foo: string = "foo";
      }

      const injector = new InjectorService();
      injector.invoke(ConverterService);

      const converter = injector.get<ConverterService>(ConverterService)!;

      const obj = {foo: "bar"};
      const result = converter.deserialize([obj], {collectionType: Array, type: Model});

      expect(result[0]).toBeInstanceOf(Model);
      expect(result[0].foo).toEqual("bar");
    });

    it("should convert object", () => {
      const injector = new InjectorService();
      injector.invoke(ConverterService);

      const converter = injector.get<ConverterService>(ConverterService)!;

      const result = converter.deserialize({test: "test"});

      expect(result).toEqual({test: "test"});
    });

    it("should convert object to model with alias", () => {
      class UserInfo {
        @Property()
        id: string;

        @Property()
        email: string;

        @Name("first_name")
        firstName: string;

        @Name("last_name")
        lastName: string;

        @Name("clubmed_id")
        clubmedId: string;

        @CollectionOf(String)
        scopes: string[] = [];

        hasScope(scope: string) {
          return testContext.scopes.includes(scope);
        }
      }

      const converter = PlatformTest.get<ConverterService>(ConverterService)!;
      const data = {
        sub: "sub",
        name: "name family_name",
        family_name: "family_name",
        email: "email",
        id: "sub",
        first_name: "name",
        last_name: "family_name",
        scopes: ["go", "api_admin"]
      };

      const result1 = converter.deserialize(data, {type: UserInfo, useAlias: true, additionalProperties: false});
      const result2 = converter.deserialize(data, {
        type: UserInfo,
        useAlias: true,
        additionalProperties: false
      });

      expect(result1).toEqual({
        email: "email",
        firstName: "name",
        id: "sub",
        lastName: "family_name",
        scopes: ["go", "api_admin"]
      });
      expect(result2).toEqual({
        email: "email",
        firstName: "name",
        id: "sub",
        lastName: "family_name",
        scopes: ["go", "api_admin"]
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
        expect(typeof converterService.serialize("")).toBe("string");
      });
      it("should convert undefined to undefined", () => {
        expect(converterService.serialize(undefined)).toBeUndefined();
      });
      it("should convert boolean to a boolean", () => {
        expect(converterService.serialize(true)).toEqual(true);
      });
      it("should convert number to a number", () => {
        expect(converterService.serialize(1)).toEqual(1);
      });
      it("should convert string to a string", () => {
        expect(converterService.serialize("1")).toEqual("1");
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
        expect(converterService.serialize({})).toBeInstanceOf(Object);
      });

      it("should convert date to a string", () => {
        expect(typeof converterService.serialize(new Date())).toBe("string");
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
        expect(converterService.serialize([null])).toEqual([null]);
      });

      it("should convert array to an array (2)", () => {
        expect(converterService.serialize([1])).toEqual([1]);
      });

      it("should convert array to an array (3)", () => {
        expect(converterService.serialize([{test: "1"}])).toEqual([{test: "1"}]);
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
        expect(foo.dateStart).toEqual(foo2.dateStart.toISOString());
      });

      it("should have an attribut Name (because metadata said Name instead of name)", () => {
        expect(foo.Name).toEqual("Test");
      });

      it("should haven't an attribut name (because metadata said Name instead of name)", () => {
        expect(foo.name).toBeUndefined();
      });

      it("should have an attribut with array type", () => {
        expect(Array.isArray(foo.foos)).toBe(true);
      });

      it("should have an attribut with array type and an item serialized", () => {
        expect(foo.foos[0]).toBeInstanceOf(Object);
        expect(foo.foos[0].test).toEqual("test");
      });

      it("should have an attribut with Map type", () => {
        expect(foo.theMap).toBeInstanceOf(Object);
      });

      it("should have an attribut with Map type and an item serialized", () => {
        expect(foo.theMap.newKey).toBeInstanceOf(Object);
        expect(foo.theMap.newKey.test).toEqual("test");
      });

      it("should have an attribut with Set type", () => {
        expect(Array.isArray(foo.theSet)).toBe(true);
      });

      it("should have an attribut with Set type and an item serialized", () => {
        expect(foo.theSet[0]).toBeInstanceOf(Object);
        expect(foo.theSet[0].test).toEqual("test");
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
        expect(converterService.serialize(new JsonFoo3())).toBeInstanceOf(Object);
      });
    });
  });
});
