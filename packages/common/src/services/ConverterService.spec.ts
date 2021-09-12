import {PlatformTest} from "@tsed/common";
import {catchError} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {CollectionOf, Default, Name, Property} from "@tsed/schema";
import {expect} from "chai";
import {JsonFoo, JsonFoo1, JsonFoo2, JsonFoo3} from "../../../../test/helper/classes";
import {ConverterService} from "./ConverterService";

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
        expect(converterService.deserialize(true, {type: Boolean})).to.be.equal(true);
        expect(converterService.deserialize(false, {type: Boolean})).to.be.equal(false);
      });

      it("should convert boolean string to Boolean", () => {
        expect(converterService.deserialize("true", {type: Boolean})).to.be.equal(true);
        expect(converterService.deserialize("false", {type: Boolean})).to.be.equal(false);
      });

      it("should convert empty string to Boolean", () => {
        expect(converterService.deserialize("", {type: Boolean})).to.be.equal(false);
      });

      it("should convert string to Boolean", () => {
        expect(converterService.deserialize("test", {type: Boolean})).to.be.equal(true);
      });

      it("should convert number to Boolean", () => {
        expect(converterService.deserialize(0, {type: Boolean})).to.be.equal(false);
        expect(converterService.deserialize(1, {type: Boolean})).to.be.equal(true);
      });

      it("should convert null to Boolean", () => {
        expect(converterService.deserialize(null, {type: Boolean})).to.be.equal(null);
      });

      it("should convert undefined to Boolean", () => {
        expect(converterService.deserialize(undefined, {type: Boolean})).to.be.equal(undefined);
      });

      it("should convert a string to Number", () => {
        expect(converterService.deserialize("1", {type: Number}))
          .to.be.a("number")
          .and.to.equals(1);
      });

      it("should convert number to Number", () => {
        expect(converterService.deserialize(1, {type: Number}))
          .to.be.a("number")
          .and.to.equals(1);
      });

      it("should convert a string to String", () => {
        expect(converterService.deserialize("1", {type: String}))
          .to.be.a("string")
          .and.to.equals("1");
      });

      it("should convert number to String", () => {
        expect(converterService.deserialize(1, {type: String}))
          .to.be.a("string")
          .and.to.equals("1");
      });

      it("should convert a null/undefined to null/undefined", () => {
        expect(converterService.deserialize(null, {type: Number})).to.equal(null);
        expect(converterService.deserialize(undefined, {type: Number})).to.equal(undefined);
      });
    });

    describe("object", () => {
      it(
        "should convert object",
        PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
          expect(converterService.deserialize({}, {type: Object})).to.be.an("object");
        })
      );

      it(
        "should convert a date",
        PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
          expect(converterService.deserialize(new Date().toISOString(), {type: Date})).to.be.instanceof(Date);
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
              this.id = id;
              Object.assign(this, props);
            }
          }

          expect(
            converterService.deserialize(data, {
              type: Model,
              additionalProperties: false
            })
          ).to.deep.eq({
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
        expect(foo).to.be.instanceof(JsonFoo);
        expect(foo.method).to.be.a("function");

        expect(foo.test).to.be.a("number").and.to.equals(1);
        expect(foo.foo).to.be.a("string").and.to.equals("test");
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
      "should emit a BadRequest when the number parsing failed",
      PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
        const error: any = catchError(() => converterService.deserialize("NK1", {type: Number}));

        expect(error.message).to.eq("Cast error. Expression value is not a number.");
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

      expect(result).to.be.instanceof(Model);
      expect(result.foo).to.equal("bar");
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

      expect(result[0]).to.be.instanceof(Model);
      expect(result[0].foo).to.equal("bar");
    });

    it("should convert object", () => {
      const injector = new InjectorService();
      injector.invoke(ConverterService);

      const converter = injector.get<ConverterService>(ConverterService)!;

      const result = converter.deserialize({test: "test"});

      expect(result).to.deep.equal({test: "test"});
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
          return this.scopes.includes(scope);
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

      expect(result1).to.deep.eq({
        email: "email",
        firstName: "name",
        id: "sub",
        lastName: "family_name",
        scopes: ["go", "api_admin"]
      });
      expect(result2).to.deep.eq({
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
        expect(converterService.serialize("")).to.be.a("string");
      });
      it("should convert undefined to undefined", () => {
        expect(converterService.serialize(undefined)).to.equals(undefined);
      });
      it("should convert boolean to a boolean", () => {
        expect(converterService.serialize(true)).to.be.a("boolean").and.to.equal(true);
      });
      it("should convert number to a number", () => {
        expect(converterService.serialize(1)).to.be.a("number").and.to.equal(1);
      });
      it("should convert string to a string", () => {
        expect(converterService.serialize("1")).to.be.a("string").and.to.equal("1");
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
        expect(foo.dateStart).to.be.a("string").and.to.equals(foo2.dateStart.toISOString());
      });

      it("should have an attribut Name (because metadata said Name instead of name)", () => {
        expect(foo.Name).to.be.a("string").and.to.equals("Test");
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
  });
});
