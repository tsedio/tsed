import {
  CollectionOf,
  Email,
  GenericOf,
  Generics,
  Ignore,
  In,
  JsonHookContext,
  JsonSchemaStore,
  MinLength,
  Name,
  OperationPath,
  Property,
  Required
} from "@tsed/schema";
import {expect} from "chai";
import {Post} from "../../test/helpers/Post";
import {User} from "../../test/helpers/User";
import {OnDeserialize} from "../decorators/onDeserialize";
import {deserialize} from "./deserialize";

function mapToObject(value: any): any {
  expect(value).to.be.instanceOf(Map);

  return Array.from(value.entries()).reduce((obj: any, [key, value]) => {
    return {
      ...obj,
      [key]: value
    };
  }, {});
}

function setToObject(value: any): any {
  expect(value).to.be.instanceOf(Set);

  return Array.from(value.values());
}

describe("deserialize()", () => {
  describe("Primitive", () => {
    it("should convert value", () => {
      expect(deserialize(null)).to.equal(null);
      expect(deserialize(undefined)).to.equal(undefined);
      expect(deserialize(false)).to.equal(false);
      expect(deserialize(true)).to.equal(true);
      expect(deserialize(0)).to.equal(0);
      expect(deserialize(1)).to.equal(1);
      expect(deserialize("")).to.equal("");
      expect(deserialize("1")).to.equal("1");

      expect(deserialize(null, {type: Boolean})).to.equal(null);
      expect(deserialize(undefined, {type: Boolean})).to.equal(undefined);
      expect(deserialize(null, {type: Boolean})).to.equal(null);
      expect(deserialize(undefined, {type: Boolean})).to.equal(undefined);
      expect(deserialize(false, {type: Boolean})).to.equal(false);
      expect(deserialize(true, {type: Boolean})).to.equal(true);
      expect(deserialize(0, {type: Number})).to.equal(0);
      expect(deserialize(1, {type: Number})).to.equal(1);
      expect(deserialize("", {type: Number})).to.equal(0);
      expect(deserialize("0", {type: Number})).to.equal(0);
      expect(deserialize("1", {type: Number})).to.equal(1);
      expect(deserialize("", {type: String})).to.equal("");
      expect(deserialize("0", {type: String})).to.equal("0");
      expect(deserialize("1", {type: String})).to.equal("1");
    });
  });
  describe("Array<primitive>", () => {
    it("should transform value", () => {
      const options = {type: String, collectionType: Array};
      expect(deserialize(null, options)).to.equal(null);
      expect(deserialize(undefined, options)).to.equal(undefined);
      expect(deserialize(false, options)).to.deep.equal(["false"]);
      expect(deserialize(true, options)).to.deep.equal(["true"]);
      expect(deserialize(0, options)).to.deep.equal(["0"]);
      expect(deserialize(1, options)).to.deep.equal(["1"]);
      expect(deserialize("", options)).to.deep.equal([""]);
      expect(deserialize("1", options)).to.deep.equal(["1"]);
    });
  });
  describe("Map<string, primitive>", () => {
    it("should transform value", () => {
      const options = {type: String, collectionType: Map};
      expect(deserialize(null, options)).to.equal(null);
      expect(deserialize(undefined, options)).to.equal(undefined);
      expect(mapToObject(deserialize(false, options))).to.deep.equal({});
      expect(mapToObject(deserialize(true, options))).to.deep.equal({});
      expect(mapToObject(deserialize({test: 1}, options))).to.deep.equal({
        test: "1"
      });
    });
  });
  describe("Set<string, primitive>", () => {
    it("should transform value", () => {
      const options = {type: String, collectionType: Set};
      expect(deserialize(null, options)).to.equal(null);
      expect(deserialize(undefined, options)).to.equal(undefined);
      expect(setToObject(deserialize(false, options))).to.deep.equal([]);
      expect(setToObject(deserialize(true, options))).to.deep.equal([]);
      expect(setToObject(deserialize([1], options))).to.deep.equal(["1"]);
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

      expect(actualError.message).to.eq("WeakMap is not supported by JsonMapper.");
    });
  });
  describe("Model", () => {
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

        @OnDeserialize(value => String(value) + "test")
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

      expect(result).to.be.instanceOf(Model);
      expect(result).to.deep.eq({
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

        @OnDeserialize(value => String(value) + "test")
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

      expect(result).to.be.instanceOf(Model);
      expect(result).to.deep.eq({
        id: "id",
        mappedProp: "mappedProptest",
        password: "string",
        roles: new Map().set("role1", new Role({label: "role"})),
        add: true
      });
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

        @OnDeserialize(value => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;
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
        {type: Model}
      );

      expect(result).to.be.instanceOf(Model);
      expect(result).to.deep.eq({
        id: "id",
        mappedProp: "mappedProptest",
        password: "string",
        roles: new Map().set("role1", new Role({label: "role"}))
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

      expect(result).to.be.instanceOf(Post);
      expect(result.owner).to.be.instanceOf(User);
      expect(result.owner.posts[0]).to.be.instanceOf(Post);
      expect(result).to.deep.eq({
        id: "id",
        owner: {
          name: "name",
          posts: [
            {
              id: "id",
              owner: undefined
            }
          ]
        }
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

        @OnDeserialize(value => String(value) + "test")
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

      expect(result[0]).to.be.instanceOf(Model);
      expect(result).to.deep.eq([
        {
          id: "id",
          mappedProp: "mappedProptest",
          password: "string",
          roles: new Map().set("role1", new Role({label: "role"}))
        }
      ]);
    });
    xit("should transform object to class (array parameter)", () => {
      // WHEN
      class Product {
        @Property()
        title: string;
      }

      class Controller {
        @OperationPath("POST", "/")
        async method(@In("body") @CollectionOf(Product) products: Product[]) {
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
          store: JsonSchemaStore.from(Controller, "method", 0)
        }
      );

      expect(result[0]).to.be.instanceof(Product);
      expect(result).to.deep.eq([
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
        async method(@In("body") @GenericOf(Product) product: Submission<Product>) {
          return null;
        }
      }

      class Controller2 {
        @OperationPath("POST", "/")
        async method(@In("body") @GenericOf(Article) product: Submission<Article>) {
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
          store: JsonSchemaStore.from(Controller, "method", 0)
        }
      );

      expect(result).to.be.instanceof(Submission);
      expect(result.data).to.be.instanceof(Product);
      expect(result).to.deep.eq({
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
          store: JsonSchemaStore.from(Controller2, "method", 0)
        }
      );

      expect(result2).to.be.instanceof(Submission);
      expect(result2.data).to.be.instanceof(Article);
      expect(result2).to.deep.eq({
        _id: "id",
        data: {
          id: "id"
        }
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
        email: string;

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
        {store: JsonSchemaStore.from(Content)}
      );

      expect(result).to.be.instanceOf(Content);
      expect(result.payload).to.be.instanceOf(Model);
      expect(result.payload.role).to.be.instanceOf(Role);
      expect(result).to.deep.eq({
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
  });
});
