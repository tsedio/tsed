import {CollectionOf, Ignore, JsonHookContext, Name, Property} from "@tsed/schema";
import {expect} from "chai";
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
      expect(serialize(Symbol.for("TEST"))).to.eq("TEST");
      expect(serialize(false)).to.eq(false);
      expect(serialize(true)).to.eq(true);
      expect(serialize("")).to.eq("");
      expect(serialize("1")).to.equal("1");
      expect(serialize(0)).to.equal(0);
      expect(serialize(1)).to.equal(1);
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

        @OnSerialize(value => String(value) + "test")
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

        @OnSerialize(value => String(value) + "test")
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
              id: "id",
              owner: undefined
            }
          ]
        }
      });
    });
  });
});
