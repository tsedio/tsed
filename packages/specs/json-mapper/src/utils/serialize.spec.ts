import {deserialize} from "@tsed/json-mapper";
import {AdditionalProperties, CollectionOf, Ignore, JsonHookContext, Name, Property} from "@tsed/schema";
import {expect} from "chai";
import {parse} from "querystring";
import {Post} from "../../test/helpers/Post";
import {User} from "../../test/helpers/User";
import "../components/ArrayMapper";
import "../components/PrimitiveMapper";
import {OnSerialize} from "../decorators/onSerialize";
import {serialize} from "./serialize";

function createMap(value: any) {
  return new Map([["test", value]]);
}

describe("serialize()", () => {
  describe("Primitives", () => {
    it("should serialize values", () => {
      expect(serialize(undefined)).to.eq(undefined);
      expect(serialize(null)).to.eq(null);
      expect(serialize("null")).to.eq("null");
      expect(serialize(Symbol.for("TEST"))).to.eq("TEST");
      expect(serialize(false)).to.eq(false);
      expect(serialize(true)).to.eq(true);
      expect(serialize("")).to.eq("");
      expect(serialize("1")).to.equal("1");
      expect(serialize(0)).to.equal(0);
      expect(serialize(1)).to.equal(1);
    });
  });
  describe("Object", () => {
    it("should serialize values", () => {
      expect(serialize({test: "test"}, {type: Object})).to.deep.eq({test: "test"});
      expect(serialize({test: "test"}, {type: false})).to.deep.eq({test: "test"});
      expect(serialize({test: "test"}, {type: null})).to.deep.eq({test: "test"});
      expect(serialize({test: "test"}, {type: undefined})).to.deep.eq({test: "test"});
    });
    it("should serialize parsed querystring", () => {
      expect(serialize({qs: parse("q[offset]=0&q[limit]=10&q[where][a]=0&q[where][b]=1")})).to.deep.eq({
        qs: {
          "q[limit]": "10",
          "q[offset]": "0",
          "q[where][a]": "0",
          "q[where][b]": "1"
        }
      });
    });
  });
  describe("Array<primitive>", () => {
    it("should serialize values", () => {
      expect(serialize([null])).to.deep.eq([null]);
      expect(serialize([false])).to.deep.eq([false]);
      expect(serialize([true])).to.deep.eq([true]);
      expect(serialize([""])).to.deep.eq([""]);
      expect(serialize(["1"])).to.deep.equal(["1"]);
      expect(serialize([1])).to.deep.equal([1]);

      class ArrayLike extends Array {}

      const arrayLike = new ArrayLike();
      arrayLike.push(1);

      expect(serialize(arrayLike)).to.deep.equal([1]);
    });
  });
  describe("Map<primitive>", () => {
    it("should serialize values", () => {
      expect(serialize(createMap(null))).to.deep.eq({test: null});
      expect(serialize(createMap(false))).to.deep.eq({test: false});
      expect(serialize(createMap(true))).to.deep.eq({test: true});
      expect(serialize(createMap(""))).to.deep.eq({test: ""});
      expect(serialize(createMap("1"))).to.deep.equal({test: "1"});
      expect(serialize(createMap(1))).to.deep.equal({test: 1});
    });
  });
  describe("toJson()", () => {
    it("should serialize obj from toJSON", () => {
      const result = serialize({
        toJSON() {
          return "hello";
        }
      });

      expect(result).to.deep.equal("hello");
    });
  });
  describe("Plain Object", () => {
    it("should serialize plain object (1)", () => {
      expect(serialize({prop: "1"})).to.deep.equal({prop: "1"});

      const result = serialize({
        prop: "1",
        roles: [{label: "Admin"}]
      });
      expect(result).to.deep.equal({
        prop: "1",
        roles: [
          {
            label: "Admin"
          }
        ]
      });
    });
    it("should serialize plain object (2)", () => {
      expect(serialize({prop: "1"})).to.deep.equal({prop: "1"});
      const roles = new Map();
      roles.set("ro", "le");

      const result = serialize({
        prop: "1",
        roles
      });
      expect(result).to.deep.equal({
        prop: "1",
        roles: {
          ro: "le"
        }
      });
    });
  });
  describe("Class", () => {
    it("should serialize model", () => {
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

        @OnSerialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const model = new Model();
      model.id = "id";
      model.password = "hellopassword";
      model.mappedProp = "hello";
      model.roles.set("olo", new Role({label: "label"}));

      expect(serialize(model)).to.deep.equal({
        id: "id",
        password: "hellopassword",
        mapped_prop: "hellotest",
        roles: {
          olo: {
            label: "label"
          }
        }
      });

      expect(serialize(model, {api: true, useAlias: false})).to.deep.equal({
        id: "id",
        mappedProp: "hellotest",
        roles: {
          olo: {
            label: "label"
          }
        }
      });
    });
    it("should serialize model and take the right type", () => {
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

        @OnSerialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      class ServerResponse {
        @Property()
        data: Model;
      }

      const model = new Model();
      model.id = "id";
      model.password = "hellopassword";
      model.mappedProp = "hello";
      model.roles.set("olo", new Role({label: "label"}));

      expect(serialize(model, {type: ServerResponse})).to.deep.equal({
        id: "id",
        password: "hellopassword",
        mapped_prop: "hellotest",
        roles: {
          olo: {
            label: "label"
          }
        }
      });
    });
    it("should serialize model Array", () => {
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

        @OnSerialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const model = new Model();
      model.id = "id";
      model.password = "hellopassword";
      model.mappedProp = "hello";
      model.roles.set("olo", new Role({label: "label"}));

      expect(serialize([model], {type: Model})).to.deep.equal([
        {
          id: "id",
          password: "hellopassword",
          mapped_prop: "hellotest",
          roles: {
            olo: {
              label: "label"
            }
          }
        }
      ]);
    });
    it("should serialize model (inherited class)", () => {
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

        @OnSerialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;
      }

      const model = new Model();
      model.id = "id";
      model.password = "hellopassword";
      model.mappedProp = "hello";
      model.roles.set("olo", new Role({label: "label"}));

      expect(serialize(model)).to.deep.equal({
        id: "id",
        password: "hellopassword",
        mapped_prop: "hellotest",
        roles: {
          olo: {
            label: "label"
          }
        }
      });

      expect(serialize(model, {api: true, useAlias: false})).to.deep.equal({
        id: "id",
        mappedProp: "hellotest",
        roles: {
          olo: {
            label: "label"
          }
        }
      });
    });
    it("should serialize model (recursive class)", () => {
      const post = new Post();
      post.id = "id";
      post.owner = new User();
      post.owner.name = "name";
      post.owner.posts = [new Post()];
      post.owner.posts[0].id = "id";

      const result = serialize(post);

      expect(result).to.deep.eq({
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
    it("should discover property dynamically when any schema decorators are used", () => {
      function log(): PropertyDecorator {
        return () => {};
      }

      class User {
        @log()
        id: string;

        test: string;

        [key: string]: any;

        constructor({id, test}: any = {}) {
          this.id = id;
          test && (this.test = test);
        }
      }

      const user1 = new User({id: "id"});
      const user2 = new User({id: "id", test: "test"});
      const user3 = new User({id: "id", test: "test"});

      user3.extra = "extra";

      expect(serialize(user1, {type: User})).to.deep.eq({id: "id"});
      expect(serialize(user2, {type: User})).to.deep.eq({id: "id", test: "test"});
      expect(serialize(user3, {type: User})).to.deep.eq({
        extra: "extra",
        id: "id",
        test: "test"
      });
    });
    it("should serialize model without props", () => {
      class Test {
        raw: any;
        affected?: number | null;
      }

      const t = new Test();

      t.raw = 1;
      t.affected = 1;

      const result = serialize(t, {type: Object});

      expect(result).to.deep.eq({
        affected: 1,
        raw: 1
      });
    });
  });
  describe("class with toJSON/toClass", () => {
    it("should serialize model", () => {
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

        @OnSerialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const model = new Model();
      // @ts-ignore
      model.$isMongooseModelPrototype = true;
      // @ts-ignore
      model["toJSON"] = (options: any) => {
        return serialize(
          deserialize(
            {
              id: "id",
              password: "hellopassword",
              mappedProp: "hello"
            },
            {useAlias: false, type: Model}
          ),
          options
        );
      };

      expect(serialize(model, {type: Model})).to.deep.equal({
        id: "id",
        mapped_prop: "hellotest",
        password: "hellopassword",
        roles: {}
      });

      expect(serialize(model, {api: true, useAlias: false})).to.deep.equal({
        id: "id",
        mappedProp: "hellotest",
        roles: {}
      });
    });
    it("should serialize model Array", () => {
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

        @OnSerialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const model = new Model();
      model.id = "id";
      model.password = "hellopassword";
      model.mappedProp = "hello";
      model.roles.set("olo", new Role({label: "label"}));

      expect(serialize([model], {type: Model})).to.deep.equal([
        {
          id: "id",
          password: "hellopassword",
          mapped_prop: "hellotest",
          roles: {
            olo: {
              label: "label"
            }
          }
        }
      ]);
    });
    it("should serialize model (inherited class)", () => {
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

        @OnSerialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;
      }

      const model = new Model();
      model.id = "id";
      model.password = "hellopassword";
      model.mappedProp = "hello";
      model.roles.set("olo", new Role({label: "label"}));

      expect(serialize(model)).to.deep.equal({
        id: "id",
        password: "hellopassword",
        mapped_prop: "hellotest",
        roles: {
          olo: {
            label: "label"
          }
        }
      });

      expect(serialize(model, {api: true, useAlias: false})).to.deep.equal({
        id: "id",
        mappedProp: "hellotest",
        roles: {
          olo: {
            label: "label"
          }
        }
      });
    });
    it("should serialize model (recursive class)", () => {
      const post = new Post();
      post.id = "id";
      post.owner = new User();
      post.owner.name = "name";
      post.owner.posts = [new Post()];
      post.owner.posts[0].id = "id";

      const result = serialize(post);

      expect(result).to.deep.eq({
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
    it("should serialize model with object props", () => {
      class Model {
        @Property()
        test: any;

        @Property()
        id: string;
      }

      const test = new Model();
      test.id = "id";
      test.test = {
        value: "test"
      };

      const result = serialize(test, {type: Model});

      expect(result).to.deep.eq({
        id: "id",
        test: {
          value: "test"
        }
      });
    });
    it("should serialize model with additonal object props", () => {
      @AdditionalProperties(true)
      class Model {
        @Property()
        id: string;

        @Ignore(true)
        ignored: boolean;

        @Name("renamed")
        name: string;

        [type: string]: any;
      }

      const test = new Model();
      test.id = "id";
      test.ignored = true;
      test.name = "myname";
      test.additional = {foo: "bar"};

      const result = serialize(test, {type: Model});

      expect(result).to.deep.eq({
        id: "id",
        renamed: "myname",
        additional: {
          foo: "bar"
        }
      });
    });
    it("should not serialize model with additonal object props", () => {
      class Model {
        @Property()
        id: string;

        @Ignore(true)
        ignored: boolean;

        @Name("renamed")
        name: string;

        [type: string]: any;
      }

      const test = new Model();
      test.id = "id";
      test.ignored = true;
      test.name = "myname";
      test.additional = {foo: "bar"};

      const result = serialize(test, {type: Model});

      expect(result).to.deep.eq({
        id: "id",
        renamed: "myname"
      });
    });
  });
});
