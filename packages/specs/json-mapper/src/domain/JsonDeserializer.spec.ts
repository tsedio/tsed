import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {faker} from "@faker-js/faker";
import {QueryParams} from "@tsed/platform-params";
import {
  AdditionalProperties,
  CollectionOf,
  DiscriminatorKey,
  DiscriminatorValue,
  Email,
  Enum,
  GenericOf,
  Generics,
  Groups,
  Ignore,
  In,
  JsonEntityStore,
  JsonHookContext,
  JsonParameterStore,
  MinLength,
  Name,
  Nullable,
  OneOf,
  OperationPath,
  Property,
  Required
} from "@tsed/schema";

import {Post} from "../../test/helpers/Post.js";
import {User} from "../../test/helpers/User.js";
import {OnDeserialize} from "../decorators/onDeserialize.js";
import {JsonDeserializer} from "./JsonDeserializer.js";
import {JsonMapperSettings} from "./JsonMapperSettings.js";

const deserializer = new JsonDeserializer();

const deserialize = (...args: any[]) => (deserializer.map as any)(...args);

function mapToObject(value: any): any {
  expect(value).toBeInstanceOf(Map);

  return Array.from(value.entries()).reduce((obj: any, [key, value]: [string, any]) => {
    return {
      ...obj,
      [key]: value
    };
  }, {});
}

function setToObject(value: any): any {
  expect(value).toBeInstanceOf(Set);

  return Array.from(value.values());
}

describe("deserialize()", () => {
  describe("Primitive", () => {
    it("should convert value", () => {
      expect(deserialize(null)).toEqual(null);
      expect(deserialize(null, {type: String})).toEqual(null);
      expect(deserialize(undefined)).toBeUndefined();
      expect(deserialize(false)).toEqual(false);
      expect(deserialize(true)).toEqual(true);
      expect(deserialize(0)).toEqual(0);
      expect(deserialize(1)).toEqual(1);
      expect(deserialize("")).toEqual("");
      expect(deserialize("1")).toEqual("1");

      expect(deserialize(null, {type: Boolean})).toEqual(null);
      expect(deserialize(undefined, {type: Boolean})).toBeUndefined();
      expect(deserialize(null, {type: Boolean})).toEqual(null);
      expect(deserialize(undefined, {type: Boolean})).toBeUndefined();
      expect(deserialize(false, {type: Boolean})).toEqual(false);
      expect(deserialize(true, {type: Boolean})).toEqual(true);
      expect(deserialize(0, {type: Number})).toEqual(0);
      expect(deserialize(1, {type: Number})).toEqual(1);
      expect(deserialize("", {type: Number})).toEqual(0);
      expect(deserialize("0", {type: Number})).toEqual(0);
      expect(deserialize("1", {type: Number})).toEqual(1);
      expect(deserialize("", {type: String})).toEqual("");
      expect(deserialize("0", {type: String})).toEqual("0");
      expect(deserialize("1", {type: String})).toEqual("1");
      expect(deserialize(["1"], {type: String})).toEqual(["1"]);
    });
  });
  describe("BigInt", () => {
    it("should deserialize a big int", () => {
      expect(deserialize(1n, {type: BigInt})).toEqual(BigInt(1n));
      expect(deserialize(null, {type: BigInt})).toEqual(null);
    });
  });
  describe("Array<primitive>", () => {
    it("should transform value", () => {
      const options = {type: String, collectionType: Array};
      expect(deserialize(null, options)).toEqual(null);
      expect(deserialize(undefined, options)).toBeUndefined();
      expect(deserialize(false, options)).toEqual(["false"]);
      expect(deserialize(true, options)).toEqual(["true"]);
      expect(deserialize(0, options)).toEqual(["0"]);
      expect(deserialize(1, options)).toEqual(["1"]);
      expect(deserialize("", options)).toEqual([""]);
      expect(deserialize("1", options)).toEqual(["1"]);
    });
    it("should cast object to array", () => {
      expect(
        deserialize(
          {},
          {
            collectionType: Array,
            type: Object
          }
        )
      ).toEqual([{}]);
    });
  });
  describe("Object", () => {
    it("should transform value", () => {
      expect(deserialize({test: "test"}, {type: Object})).toEqual({test: "test"});
      expect(deserialize({test: "test"}, {type: undefined})).toEqual({test: "test"});
      expect(deserialize({test: "test"}, {type: null})).toEqual({test: "test"});
      expect(deserialize({test: "test"}, {type: false})).toEqual({test: "test"});
    });
  });
  describe("Map<string, primitive>", () => {
    it("should transform value", () => {
      const options = {type: String, collectionType: Map};
      expect(deserialize(null, options)).toEqual(null);
      expect(deserialize(undefined, options)).toBeUndefined();
      expect(mapToObject(deserialize(false, options))).toEqual({});
      expect(mapToObject(deserialize(true, options))).toEqual({});
      expect(mapToObject(deserialize({test: 1}, options))).toEqual({
        test: "1"
      });
    });
  });
  describe("Set<string, primitive>", () => {
    it("should transform value", () => {
      const options = {type: String, collectionType: Set};
      expect(deserialize(null, options)).toEqual(null);
      expect(deserialize(undefined, options)).toBeUndefined();
      expect(setToObject(deserialize(false, options))).toEqual([]);
      expect(setToObject(deserialize(true, options))).toEqual([]);
      expect(setToObject(deserialize([1], options))).toEqual(["1"]);
    });
  });
  describe("Unsupported collection", () => {
    it("should transform value", () => {
      const options = {type: String, collectionType: WeakMap};

      let actualError: any;
      try {
        deserialize([], options);
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).toEqual("WeakMap is not supported by JsonMapper.");
    });
  });
  describe("Model", () => {
    it("should do nothing when a prop is undefined", () => {
      class Role {
        @Property()
        label: string;

        constructor({label}: any = {}) {
          this.label = label;
        }
      }

      class Model {
        @Property()
        id: string;

        @Ignore((ignored, ctx: JsonHookContext) => ctx.api)
        password: string;

        @OnDeserialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const result = deserialize(
        {
          id: "id",
          password: "string",
          mapped_prop: "mappedProp",
          roles: undefined,
          add: true
        },
        {type: Model, additionalProperties: false}
      );

      expect(result).toBeInstanceOf(Model);
      expect(result).toEqual({
        id: "id",
        mappedProp: "mappedProptest",
        password: "string",
        roles: new Map()
      });
    });
    it("should do nothing when a prop is ArrayOf Number", () => {
      class Model {
        @CollectionOf(Number)
        prop: number[] = [];
      }

      const result = deserialize(
        {
          prop: ["1", "2", "3", "5"]
        },
        {type: Model, additionalProperties: false}
      );

      expect(result).toBeInstanceOf(Model);
      expect(result).toEqual({
        prop: [1, 2, 3, 5]
      });
    });
    it("should do nothing when a prop is ArrayOf enum as number", () => {
      enum TestEnum {
        TEST = 1,
        TEST2 = 2
      }

      class Model {
        @Enum(TestEnum)
        @CollectionOf(Number)
        prop: TestEnum[] = [];
      }

      const result = deserialize(
        {
          prop: ["1", "2", "3", "5"]
        },
        {type: Model, additionalProperties: false}
      );

      expect(result).toBeInstanceOf(Model);
      expect(result).toEqual({
        prop: [1, 2, 3, 5]
      });
    });
    it("should transform object to class (reserved keyword)", () => {
      class Role {
        @Property()
        enum: string;

        constructor({enum: en}: any = {}) {
          this.enum = en;
        }
      }

      class Model {
        @Property()
        id: string;

        @Ignore((ignored, ctx: JsonHookContext) => ctx.api)
        password: string;

        @OnDeserialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const result = deserialize(
        {
          id: "id",
          password: "string",
          mapped_prop: "mappedProp",
          roles: {
            role1: {
              enum: "role"
            }
          },
          add: true
        },
        {type: Model, additionalProperties: false}
      );

      expect(result).toBeInstanceOf(Model);
      expect(result).toEqual({
        id: "id",
        mappedProp: "mappedProptest",
        password: "string",
        roles: new Map().set("role1", new Role({enum: "role"}))
      });
    });
    it("should transform object to class (additionalProperties = false)", () => {
      class Role {
        @Property()
        label: string;

        constructor({label}: any = {}) {
          this.label = label;
        }
      }

      class Model {
        @Property()
        id: string;

        @Ignore((ignored, ctx: JsonHookContext) => ctx.api)
        password: string;

        @OnDeserialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const result = deserialize(
        {
          id: "id",
          password: "string",
          mapped_prop: "mappedProp",
          roles: {
            role1: {
              label: "role"
            }
          },
          add: true
        },
        {type: Model, additionalProperties: false}
      );

      expect(result).toBeInstanceOf(Model);
      expect(result).toEqual({
        id: "id",
        mappedProp: "mappedProptest",
        password: "string",
        roles: new Map().set("role1", new Role({label: "role"}))
      });
    });
    it("should transform object to class (additionalProperties = true)", () => {
      class Role {
        @Property()
        label: string;

        constructor({label}: any = {}) {
          this.label = label;
        }
      }

      class Model {
        @Property()
        id: string;

        @Ignore((ignored, ctx: JsonHookContext) => ctx.api)
        password: string;

        @OnDeserialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const result = deserialize(
        {
          id: "id",
          password: "string",
          mapped_prop: "mappedProp",
          roles: {
            role1: {
              label: "role"
            }
          },
          add: true
        },
        {type: Model, additionalProperties: true}
      );

      expect(result).toBeInstanceOf(Model);
      expect(result).toEqual({
        id: "id",
        mappedProp: "mappedProptest",
        password: "string",
        roles: new Map().set("role1", new Role({label: "role"})),
        add: true
      });
    });

    it("should transform object to class (additionalProperties = true, with group)", () => {
      class Role {
        @Property()
        label: string;

        constructor({label}: any = {}) {
          this.label = label;
        }
      }

      @AdditionalProperties(true)
      class Model {
        @Property()
        id: string;

        @Groups("!update")
        password: string;
      }

      const result = deserialize(
        {
          id: "id",
          password: "string"
        },
        {type: Model, groups: ["update"]}
      );

      expect(result).toBeInstanceOf(Model);
      expect(result).toEqual({id: "id"});
    });
    it("should transform object to class (additionalProperties = model)", () => {
      class SubModel {
        @Property()
        id: string;
      }

      @AdditionalProperties(SubModel)
      class Model {
        [key: string]: SubModel;
      }

      class Container {
        @CollectionOf(Model)
        list: Model[];
      }

      const result = deserialize({test: {id: "1"}}, {type: Model});

      expect(result).toEqual({
        test: {
          id: "1"
        }
      });
      expect(result.test).toBeInstanceOf(SubModel);
      expect(result.test.id).toEqual("1");

      const result2 = deserialize(
        {
          list: [{test: {id: "1"}}]
        },
        {type: Container}
      );

      expect(result2).toBeInstanceOf(Container);
      expect(result2.list).toBeInstanceOf(Array);
      expect(result2.list[0].test).toBeInstanceOf(SubModel);
      expect(result2.list[0].test.id).toEqual("1");
    });
    it("should transform object to class (inherited class)", () => {
      class Role {
        @Property()
        label: string;

        constructor({label}: any = {}) {
          this.label = label;
        }
      }

      class Base {
        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      class Model extends Base {
        @Property()
        id: string;

        @Ignore((ignored, ctx: JsonHookContext) => ctx.api)
        password: string;

        @OnDeserialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @OnDeserialize((b) => b.filter((v: string) => v === "test"))
        list: string[];
      }

      const result = deserialize(
        {
          id: "id",
          password: "string",
          mapped_prop: "mappedProp",
          roles: {
            role1: {
              label: "role"
            }
          },
          add: true,
          list: ["test", "value"]
        },
        {type: Model}
      );

      expect(result).toBeInstanceOf(Model);
      expect(result).toEqual({
        id: "id",
        mappedProp: "mappedProptest",
        password: "string",
        roles: new Map().set("role1", new Role({label: "role"})),
        list: ["test"]
      });
    });
    it("should transform object to class (recursive class)", () => {
      const result = deserialize(
        {
          id: "id",
          owner: {
            name: "name",
            posts: [
              {
                id: "id"
              }
            ]
          }
        },
        {type: Post}
      );

      expect(result).toBeInstanceOf(Post);
      expect(result.owner).toBeInstanceOf(User);
      expect(result.owner.posts[0]).toBeInstanceOf(Post);
      expect(result).toEqual({
        id: "id",
        owner: {
          name: "name",
          posts: [
            {
              id: "id"
            }
          ]
        }
      });
    });
    it("should transform keep array, map, set without nullable value", () => {
      class Model {
        @CollectionOf(String)
        public bars?: string[];

        @CollectionOf(String)
        public barsSet?: Set<string>;

        @CollectionOf(String)
        public barsMap?: Map<string, string>;
      }

      const payload = {
        bars: null,
        barsSet: null,
        barsMap: null
      };

      const result = deserialize(payload, {type: Model});

      expect(result).toBeInstanceOf(Model);
      expect(result).toEqual({
        bars: null,
        barsSet: null,
        barsMap: null
      });
    });
    it("should transform object to class (date/nullable)", () => {
      class Product {
        @Nullable(Date)
        updated: Date | null;
      }

      const product = {
        updated: faker.date.past().toISOString()
      };

      const result = deserialize(product, {type: Product});

      expect(result).toBeInstanceOf(Product);
      expect(result.updated).toBeInstanceOf(Date);
    });
    it("should transform object to class (with null values on props)", () => {
      class NullModel {
        @Property()
        prop1: string;

        @Property()
        prop2: number;

        @Property()
        prop3: Date;
      }

      const result = deserialize(
        {
          prop1: null,
          prop2: null,
          prop3: null
        },
        {type: NullModel}
      );

      expect(result).toBeInstanceOf(NullModel);
      expect(result).toEqual({
        prop1: null,
        prop2: null,
        prop3: null
      });
    });
    it("should transform object to class (with any props)", () => {
      class TestModel {
        @Property()
        prop3: any;
      }

      const result = deserialize(
        {
          prop3: {
            test: "test"
          }
        },
        {type: TestModel}
      );

      expect(result).toBeInstanceOf(TestModel);
      expect(result).toEqual({
        prop3: {
          test: "test"
        }
      });
    });
    it("should transform object to class (with any[] props)", () => {
      class TestModel {
        @Property()
        prop3: any[];
      }

      const result = deserialize(
        {
          prop3: [
            {
              test: "test"
            }
          ]
        },
        {type: TestModel}
      );

      expect(result).toBeInstanceOf(TestModel);
      expect(result).toEqual({
        prop3: [
          {
            test: "test"
          }
        ]
      });
    });
    it("should transform object to class (ignore props)", () => {
      class AvailableDatesParams {
        @Ignore()
        locationId: number;

        @Name("start_date")
        startDate: string;

        @Name("end_date")
        endDate: string;

        @Ignore((value, ctx) => {
          return !ctx.endpoint;
        })
        @OnDeserialize((value) => value + 1)
        careCode: number;
      }

      const result = deserialize(
        {
          locationId: 5427,
          careCode: 39699,
          startDate: "20220606",
          endDate: "20220707"
        },
        {type: AvailableDatesParams, useAlias: false}
      );
      expect(result).toEqual({
        startDate: "20220606",
        endDate: "20220707"
      });
    });

    describe("jsonMapper.strictGroups = false", () => {
      it("should transform object to class", () => {
        class AvailableDatesParams {
          @Groups("summary")
          locationId: number;

          @Name("start_date")
          startDate: string;

          @Name("end_date")
          endDate: string;

          @Groups("!endpoint")
          @OnDeserialize((value) => value + 1)
          careCode: number;
        }

        const result = deserialize(
          {
            locationId: 5427,
            careCode: 39699,
            startDate: "20220606",
            endDate: "20220707"
          },
          {type: AvailableDatesParams, useAlias: false}
        );
        expect(result).toEqual({
          careCode: 39700,
          locationId: 5427,
          startDate: "20220606",
          endDate: "20220707"
        });
      });
    });

    describe("jsonMapper.strictGroups = true", () => {
      beforeEach(() => {
        JsonMapperSettings.strictGroups = true;
      });
      afterEach(() => {
        JsonMapperSettings.strictGroups = false;
      });
      it("should transform object to class", () => {
        class AvailableDatesParams {
          @Groups("summary")
          locationId: number;

          @Name("start_date")
          startDate: string;

          @Name("end_date")
          endDate: string;

          @Groups("!endpoint")
          @OnDeserialize((value) => value + 1)
          careCode: number;
        }

        const result = deserialize(
          {
            locationId: 5427,
            careCode: 39699,
            startDate: "20220606",
            endDate: "20220707"
          },
          {type: AvailableDatesParams, useAlias: false}
        );
        expect(result).toEqual({
          careCode: 39700, // not concerned because deserializer options must have a groups list configured
          startDate: "20220606",
          endDate: "20220707"
        });
      });
      it("should transform object to class (groups options defined)", () => {
        class AvailableDatesParams {
          @Groups("summary")
          locationId: number;

          @Name("start_date")
          startDate: string;

          @Name("end_date")
          endDate: string;

          @Groups("!endpoint")
          @OnDeserialize((value) => value + 1)
          careCode: number;
        }

        const result = deserialize(
          {
            locationId: 5427,
            careCode: 39699,
            startDate: "20220606",
            endDate: "20220707"
          },
          {type: AvailableDatesParams, useAlias: false, groups: ["endpoint"]}
        );
        expect(result).toEqual({
          startDate: "20220606",
          endDate: "20220707"
        });
      });
    });
  });
  describe("Array<Model>", () => {
    it("should transform object to class (additionalProperties = false)", () => {
      class Role {
        @Property()
        label: string;

        constructor({label}: any = {}) {
          this.label = label;
        }
      }

      class Model {
        @Property()
        id: string;

        @Ignore((ignored, ctx: JsonHookContext) => ctx.api)
        password: string;

        @OnDeserialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const result = deserialize(
        [
          {
            id: "id",
            password: "string",
            mapped_prop: "mappedProp",
            roles: {
              role1: {
                label: "role"
              }
            },
            add: true
          }
        ],
        {type: Model, collectionType: Array, additionalProperties: false}
      );

      expect(result[0]).toBeInstanceOf(Model);
      expect(result).toEqual([
        {
          id: "id",
          mappedProp: "mappedProptest",
          password: "string",
          roles: new Map().set("role1", new Role({label: "role"}))
        }
      ]);
    });
    it("should transform object to class (array parameter)", () => {
      // WHEN
      class Product {
        @Property()
        title: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        method(@In("body") @CollectionOf(Product) products: Product[]) {
          return null;
        }
      }

      // THEN
      const result = deserialize(
        [
          {
            title: "title"
          }
        ],
        {
          store: JsonEntityStore.from(Controller, "method", 0)
        }
      );

      expect(result[0]).toBeInstanceOf(Product);
      expect(result).toEqual([
        {
          title: "title"
        }
      ]);
    });
  });
  describe("Generics", () => {
    it("should transform object to class (generics parameter)", () => {
      // WHEN
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @Property("T")
        data: T;
      }

      class Product {
        @Property()
        title: string;
      }

      class Article {
        @Property()
        id: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        method(@In("body") @GenericOf(Product, Article) product: Submission<Product>) {
          return null;
        }
      }

      class Controller2 {
        @OperationPath("POST", "/")
        method(@In("body") @GenericOf(Article) product: Submission<Article>) {
          return null;
        }
      }

      // THEN
      const result = deserialize(
        {
          _id: "id",
          data: {
            title: "title"
          }
        },
        {
          store: JsonEntityStore.from(Controller, "method", 0)
        }
      );

      expect(result).toBeInstanceOf(Submission);
      expect(result.data).toBeInstanceOf(Product);
      expect(result).toEqual({
        _id: "id",
        data: {
          title: "title"
        }
      });

      const result2 = deserialize(
        {
          _id: "id",
          data: {
            id: "id"
          }
        },
        {
          store: JsonEntityStore.from(Controller2, "method", 0)
        }
      );

      expect(result2).toBeInstanceOf(Submission);
      expect(result2.data).toBeInstanceOf(Article);
      expect(result2).toEqual({
        _id: "id",
        data: {
          id: "id"
        }
      });
    });
    it("should transform object to class (generics parameter + array data)", () => {
      // WHEN
      @Generics("T")
      class Submission<T> {
        @Property()
        _id: string;

        @CollectionOf("T")
        data: T[];
      }

      class Product {
        @Property()
        title: string;
      }

      class Article {
        @Property()
        id: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        method(@In("body") @GenericOf(Product, Article) product: Submission<Product>) {
          return null;
        }
      }

      class Controller2 {
        @OperationPath("POST", "/")
        method(@In("body") @GenericOf(Article) product: Submission<Article>) {
          return null;
        }
      }

      // THEN
      const result = deserialize(
        {
          _id: "id",
          data: [
            {
              title: "title"
            }
          ]
        },
        {
          store: JsonEntityStore.from(Controller, "method", 0)
        }
      );

      expect(result).toBeInstanceOf(Submission);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data[0]).toBeInstanceOf(Product);
      expect(result).toEqual({
        _id: "id",
        data: [
          {
            title: "title"
          }
        ]
      });

      const result2 = deserialize(
        {
          _id: "id",
          data: [
            {
              id: "id"
            }
          ]
        },
        {
          store: JsonEntityStore.from(Controller2, "method", 0)
        }
      );

      expect(result2).toBeInstanceOf(Submission);
      expect(result2.data[0]).toBeInstanceOf(Article);
      expect(result2).toEqual({
        _id: "id",
        data: [
          {
            id: "id"
          }
        ]
      });
    });
    it("should transform object to class (generics property)", () => {
      @Generics("T")
      class Base<T> {
        @Property()
        id: string;

        @Required()
        @Email()
        email: string;

        @Property("T")
        role: T;
      }

      class Model<T> extends Base<T> {
        @MinLength(0)
        declare email: string;

        @Property()
        name: string;
      }

      class Role {
        @Property()
        level: string;
      }

      class Content {
        @GenericOf(Role)
        payload: Model<Role>;
      }

      const result = deserialize(
        {
          payload: {
            email: "email",
            name: "name",
            id: "id",
            role: {
              level: "level"
            }
          }
        },
        {type: Content}
      );

      expect(result).toBeInstanceOf(Content);
      expect(result.payload).toBeInstanceOf(Model);
      expect(result.payload.role).toBeInstanceOf(Role);
      expect(result).toEqual({
        payload: {
          email: "email",
          id: "id",
          name: "name",
          role: {
            level: "level"
          }
        }
      });
    });
    it("should transform object to class (generics property + array)", () => {
      @Generics("T")
      class Base<T> {
        @Property()
        id: string;

        @Required()
        @Email()
        email: string;

        @CollectionOf("T")
        roles: T[];
      }

      class Model<T> extends Base<T> {
        @MinLength(0)
        declare email: string;

        @Property()
        name: string;
      }

      class Role {
        @Property()
        level: string;
      }

      class Content {
        @GenericOf(Role)
        payload: Model<Role>;
      }

      const result = deserialize(
        {
          payload: {
            email: "email",
            name: "name",
            id: "id",
            roles: [
              {
                level: "level"
              }
            ]
          }
        },
        {type: Content}
      );

      expect(result).toBeInstanceOf(Content);
      expect(result.payload).toBeInstanceOf(Model);
      expect(result.payload.roles[0]).toBeInstanceOf(Role);
      expect(result).toEqual({
        payload: {
          email: "email",
          id: "id",
          name: "name",
          roles: [
            {
              level: "level"
            }
          ]
        }
      });
    });
  });
  describe("Discriminator", () => {
    class Event {
      @DiscriminatorKey() // declare this property as discriminator key
      type: string;

      @Property()
      value: string;
    }

    class SubEvent extends Event {
      @Property()
      metaSub: string;
    }

    @DiscriminatorValue("page_view") // or @DiscriminatorValue() value can be inferred by the class name
    class PageView extends SubEvent {
      @Required()
      url: string;
    }

    @DiscriminatorValue("action", "click_action")
    class Action extends SubEvent {
      @Required()
      event: string;
    }

    @DiscriminatorValue()
    class CustomAction extends Event {
      @Required()
      event: string;

      @Property()
      meta: string;
    }

    type OneOfEvents = PageView | Action | CustomAction;

    class Tracking {
      @OneOf(PageView, Action)
      data: PageView | Action;
    }

    class TrackingWithArray {
      @OneOf(PageView, Action)
      data: (PageView | Action)[];
    }

    it("should deserialize object according to the discriminator key", () => {
      const list = [
        {
          type: "base",
          value: "value"
        },
        {
          type: "action",
          value: "value",
          event: "event"
        },
        {
          type: "click_action",
          value: "value",
          event: "event"
        },
        {
          type: "custom_action",
          value: "custom",
          event: "event",
          meta: "meta"
        }
      ];
      const result = deserialize(
        {
          type: "page_view",
          value: "value",
          url: "https://url"
        },
        {
          type: Event
        }
      );

      expect(result).toEqual({
        type: "page_view",
        url: "https://url",
        value: "value"
      });
      expect(result).toBeInstanceOf(PageView);
    });
    it("should deserialize object according to the discriminator key (model with property discriminator)", () => {
      const list = {
        data: {
          type: "page_view",
          value: "value",
          url: "https://url",
          metaSub: "sub"
        }
      };
      const result = deserialize(list, {
        type: Tracking
      });

      expect(result).toEqual({
        data: {
          type: "page_view",
          metaSub: "sub",
          url: "https://url",
          value: "value"
        }
      });
      expect(result.data).toBeInstanceOf(PageView);
    });
    it("should deserialize object according to the discriminator key (model with property discriminator - array)", () => {
      const list = {
        data: [
          {
            type: "page_view",
            value: "value",
            url: "https://url",
            metaSub: "sub"
          },
          {
            type: "action",
            value: "value",
            event: "event"
          },
          {
            type: "click_action",
            value: "value",
            event: "event"
          },
          {
            type: "custom_action",
            value: "custom",
            event: "event",
            meta: "meta"
          }
        ]
      };
      const result = deserialize(list, {
        type: TrackingWithArray
      });

      expect(result).toEqual({
        data: [
          {
            type: "page_view",
            metaSub: "sub",
            url: "https://url",
            value: "value"
          },
          {
            event: "event",
            type: "action",
            value: "value"
          },
          {
            event: "event",
            type: "click_action",
            value: "value"
          },
          {
            event: "event",
            meta: "meta",
            type: "custom_action",
            value: "custom"
          }
        ]
      });
      expect(result.data[0]).toBeInstanceOf(PageView);
      expect(result.data[1]).toBeInstanceOf(Action);
      expect(result.data[2]).toBeInstanceOf(Action);
      expect(result.data[3]).toBeInstanceOf(CustomAction);
    });
    it("should deserialize object according to the discriminator key (list of item)", () => {
      const list = [
        {
          type: "base",
          value: "value"
        },
        {
          type: "page_view",
          value: "value",
          url: "https://url"
        },
        {
          type: "action",
          value: "value",
          event: "event"
        },
        {
          type: "click_action",
          value: "value",
          event: "event"
        },
        {
          type: "custom_action",
          value: "custom",
          event: "event",
          meta: "meta"
        }
      ];
      const result = deserialize(list, {
        type: Event,
        collectionType: Array
      });

      expect(result).toEqual([
        {
          type: "base",
          value: "value"
        },
        {
          type: "page_view",
          url: "https://url",
          value: "value"
        },
        {
          event: "event",
          type: "action",
          value: "value"
        },
        {
          event: "event",
          type: "click_action",
          value: "value"
        },
        {
          event: "event",
          meta: "meta",
          type: "custom_action",
          value: "custom"
        }
      ]);
      expect(result[0]).toBeInstanceOf(Event);
      expect(result[1]).toBeInstanceOf(PageView);
      expect(result[2]).toBeInstanceOf(Action);
      expect(result[3]).toBeInstanceOf(Action);
      expect(result[4]).toBeInstanceOf(CustomAction);
    });
  });
  describe("when a JsonParameterStore is given", () => {
    it("should deserialize data (string[])", () => {
      class Test {
        test(@QueryParams("test", String) input: string[]) {}
      }

      const param = JsonParameterStore.get(Test, "test", 0);

      // WHEN
      const result = deserialize(["test"], {store: param});

      expect(result).toEqual(["test"]);
    });
  });
});
