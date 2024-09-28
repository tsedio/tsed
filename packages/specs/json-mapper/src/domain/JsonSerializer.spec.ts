import "../components/DateMapper.js";
import "../components/PrimitiveMapper.js";
import "../components/SymbolMapper.js";

import {cleanObject, isBoolean, isNumber, isObjectID, useDecorators} from "@tsed/core";
import {
  AdditionalProperties,
  Allow,
  CollectionOf,
  Default,
  DiscriminatorKey,
  DiscriminatorValue,
  Email,
  Groups,
  Ignore,
  JsonHookContext,
  MinLength,
  Name,
  Nullable,
  Property,
  Required,
  Uri
} from "@tsed/schema";
import {snakeCase} from "change-case";
import {parse} from "querystring";

import {Post} from "../../test/helpers/Post.js";
import {User} from "../../test/helpers/User.js";
import {OnDeserialize} from "../decorators/onDeserialize.js";
import {OnSerialize} from "../decorators/onSerialize.js";
import {deserialize} from "../utils/deserialize.js";
import {JsonMapperSettings} from "./JsonMapperSettings.js";
import {getJsonMapperTypes} from "./JsonMapperTypesContainer.js";
import {JsonSerializer} from "./JsonSerializer.js";

const serializer = new JsonSerializer();

const serialize = (...args: any[]) => (serializer.map as any)(...args);

function createMap(value: any) {
  return new Map([["test", value]]);
}

class ObjectId {
  _bsontype = true;

  constructor(public id: string) {}

  toString() {
    return this.id;
  }
}

describe("JsonSerializer", () => {
  describe("Primitives", () => {
    it("should serialize values", () => {
      expect(serialize(undefined)).toBeUndefined();
      expect(serialize(null)).toEqual(null);
      expect(serialize("null")).toEqual("null");
      expect(serialize(Symbol.for("TEST"))).toEqual("TEST");
      expect(serialize(false)).toEqual(false);
      expect(serialize(true)).toEqual(true);
      expect(serialize("")).toEqual("");
      expect(serialize("1")).toEqual("1");
      expect(serialize(0)).toEqual(0);
      expect(serialize(1)).toEqual(1);
      expect(serialize(1)).toEqual(1);
      expect(serialize(BigInt(1n))).toEqual(BigInt(1));
    });
  });
  describe("Object", () => {
    it("should serialize values", () => {
      expect(serialize({test: "test"}, {type: Object})).toEqual({test: "test"});
      expect(serialize({test: "test"}, {type: false})).toEqual({test: "test"});
      expect(serialize({test: "test"}, {type: null})).toEqual({test: "test"});
      expect(serialize({test: "test"}, {type: undefined})).toEqual({test: "test"});
    });
    it("should serialize parsed querystring", () => {
      expect(serialize({qs: parse("q[offset]=0&q[limit]=10&q[where][a]=0&q[where][b]=1")})).toEqual({
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
      expect(serialize([null])).toEqual([null]);
      expect(serialize([false])).toEqual([false]);
      expect(serialize([true])).toEqual([true]);
      expect(serialize([""])).toEqual([""]);
      expect(serialize(["1"])).toEqual(["1"]);
      expect(serialize([1])).toEqual([1]);

      class ArrayLike extends Array {}

      const arrayLike = new ArrayLike();
      arrayLike.push(1);

      expect(serialize(arrayLike)).toEqual([1]);

      class SetLike extends Set {}

      const setLike = new SetLike();
      setLike.add(1);

      expect(serialize(setLike)).toEqual([1]);

      class MapLike extends Map {}

      const mapLike = new MapLike();
      mapLike.set("i", 1);

      expect(serialize(mapLike)).toEqual({i: 1});
    });
  });
  describe("Map<primitive>", () => {
    it("should serialize values", () => {
      expect(serialize(createMap(null))).toEqual({test: null});
      expect(serialize(createMap(false))).toEqual({test: false});
      expect(serialize(createMap(true))).toEqual({test: true});
      expect(serialize(createMap(""))).toEqual({test: ""});
      expect(serialize(createMap("1"))).toEqual({test: "1"});
      expect(serialize(createMap(1))).toEqual({test: 1});
    });
  });
  describe("toJson()", () => {
    it("should serialize obj from toJSON", () => {
      const result = serialize({
        toJSON() {
          return "hello";
        }
      });

      expect(result).toEqual("hello");
    });

    it("should serialize obj from toJSON (with type)", () => {
      class Model {}

      const result = serialize(
        {
          toJSON() {
            return "hello";
          }
        },
        {type: Model}
      );

      expect(result).toEqual("hello");
    });
  });
  describe("Plain Object", () => {
    it("should serialize plain object (1)", () => {
      expect(serialize({prop: "1"})).toEqual({prop: "1"});

      const result = serialize({
        prop: "1",
        roles: [{label: "Admin"}]
      });
      expect(result).toEqual({
        prop: "1",
        roles: [
          {
            label: "Admin"
          }
        ]
      });
    });
    it("should serialize plain object (2)", () => {
      expect(serialize({prop: "1"})).toEqual({prop: "1"});
      const roles = new Map();
      roles.set("ro", "le");

      const result = serialize({
        prop: "1",
        roles
      });
      expect(result).toEqual({
        prop: "1",
        roles: {
          ro: "le"
        }
      });
    });
  });
  describe("Class", () => {
    describe("ignore hook is configured on props", () => {
      it("should serialize model (api = true)", () => {
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
          roles: Role[] = [];

          @CollectionOf(Role)
          mapRoles: Map<string, Role> = new Map();

          @CollectionOf(String)
          setRoleNames: Set<string> = new Set();
        }

        const model = new Model();
        model.id = "id";
        model.password = "string";
        model.mappedProp = "mappedProp";
        model.roles = [new Role({label: "ADMIN"})];

        model.mapRoles = new Map([["ADMIN", new Role({label: "ADMIN"})]]);

        model.setRoleNames = new Set();
        model.setRoleNames.add("ADMIN");

        expect(
          serialize(model, {
            useAlias: false,
            api: true
          })
        ).toEqual({
          id: "id",
          mapRoles: {
            ADMIN: {
              label: "ADMIN"
            }
          },
          mappedProp: "mappedProptest",
          roles: [
            {
              label: "ADMIN"
            }
          ],
          setRoleNames: ["ADMIN"]
        });
      });
      it("should serialize model (api = false)", () => {
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
          roles: Role[] = [];

          @CollectionOf(Role)
          mapRoles: Map<string, Role> = new Map();

          @CollectionOf(String)
          setRoleNames: Set<string> = new Set();
        }

        const model = new Model();
        model.id = "id";
        model.password = "string";
        model.mappedProp = "mappedProp";
        model.roles = [new Role({label: "ADMIN"})];

        model.mapRoles = new Map([["ADMIN", new Role({label: "ADMIN"})]]);

        model.setRoleNames = new Set();
        model.setRoleNames.add("ADMIN");

        expect(
          serialize(model, {
            useAlias: false,
            api: false
          })
        ).toEqual({
          id: "id",
          mapRoles: {
            ADMIN: {
              label: "ADMIN"
            }
          },
          password: "string",
          mappedProp: "mappedProptest",
          roles: [
            {
              label: "ADMIN"
            }
          ],
          setRoleNames: ["ADMIN"]
        });
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

      expect(serialize(model, {type: ServerResponse})).toEqual({
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
    it("should serialize model with alias property", () => {
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
        roles: Role[] = [];

        @CollectionOf(Role)
        mapRoles: Map<string, Role> = new Map();

        @CollectionOf(String)
        setRoleNames: Set<string> = new Set();
      }

      const model = new Model();
      model.id = "id";
      model.password = "string";
      model.mappedProp = "mappedProp";
      model.roles = [new Role({label: "ADMIN"})];

      model.mapRoles = new Map([["ADMIN", new Role({label: "ADMIN"})]]);

      model.setRoleNames = new Set();
      model.setRoleNames.add("ADMIN");

      expect(
        serialize(model, {
          useAlias: true,
          api: false
        })
      ).toEqual({
        id: "id",
        mapRoles: {
          ADMIN: {
            label: "ADMIN"
          }
        },
        mapped_prop: "mappedProptest",
        password: "string",
        roles: [
          {
            label: "ADMIN"
          }
        ],
        setRoleNames: ["ADMIN"]
      });
    });
    it("should serialize model with nested object", () => {
      class Nested {
        @Property()
        label: string;

        @Name("additional_description")
        additionalDescription: string;

        constructor({label, additionalDescription}: any = {}) {
          this.label = label;
          this.additionalDescription = additionalDescription;
        }
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: any;

        @Property()
        nestedTyped: Nested;
      }

      const model = new Model();
      model.id = "id";
      model.nested = {
        other: "other",
        test: new Nested({
          additionalDescription: "additionalDescription",
          label: "label"
        })
      };

      model.nestedTyped = new Nested({
        additionalDescription: "additionalDescription",
        label: "label"
      });

      expect(
        serialize(model, {
          useAlias: true,
          api: false
        })
      ).toEqual({
        id: "id",
        nested: {
          other: "other",
          test: {
            additional_description: "additionalDescription",
            label: "label"
          }
        },
        nestedTyped: {
          additional_description: "additionalDescription",
          label: "label"
        }
      });
    });
    it("should serialize model with additional properties", () => {
      @AdditionalProperties(true)
      class Model {
        @Property()
        id: string;

        @OnSerialize((value) => String(value) + "test")
        @Name("mapped_prop")
        mappedProp: string;
      }

      expect(
        serialize(
          {
            id: "id",
            mappedProp: "mappedProp",
            additionalProperty: true
          },
          {
            type: Model,
            useAlias: false
          }
        )
      ).toEqual({
        additionalProperty: true,
        id: "id",
        mappedProp: "mappedProptest"
      });
    });
    it("should serialize model (recursive class)", () => {
      class User {
        @Property()
        name: string;

        @CollectionOf(() => Post)
        posts: any[];

        @Property(() => Post)
        @Name("main_post")
        mainPost: any;
      }

      class Post {
        @Property()
        id: string;

        @Property()
        owner: User;

        @Name("title")
        initializedTitle: string;
      }

      const post = new Post();
      post.id = "id";

      post.owner = new User();
      post.owner.name = "name";
      post.owner.posts = [new Post()];
      post.owner.posts[0].id = "id";
      post.owner.posts[0].initializedTitle = "initializedTitle";

      post.owner.mainPost = new Post();
      post.owner.mainPost.id = "idMain";
      post.owner.mainPost.initializedTitle = "initializedTitle";

      const result = serialize(post, {useAlias: true});

      expect(result).toEqual({
        id: "id",
        owner: {
          name: "name",
          main_post: {
            id: "idMain",
            title: "initializedTitle"
          },
          posts: [
            {
              id: "id",
              title: "initializedTitle"
            }
          ]
        }
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

      expect(result).toEqual({
        affected: 1,
        raw: 1
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

      expect(serialize(user1, {type: User})).toEqual({id: "id"});
      expect(serialize(user2, {type: User})).toEqual({id: "id", test: "test"});
      expect(serialize(user3, {type: User})).toEqual({
        extra: "extra",
        id: "id",
        test: "test"
      });
    });
    it("should serialize model with null values", () => {
      class NestedModel {
        @Property()
        id: string;
      }

      class NullModel {
        @Property()
        prop1: string;

        @Property()
        prop2: number;

        @Property()
        prop3: Date;

        @Nullable(NestedModel)
        prop4: NestedModel;
      }

      expect(
        serialize(
          {
            prop1: null,
            prop2: null,
            prop3: null,
            prop4: null
          },
          {type: NullModel}
        )
      ).toEqual({
        prop1: null,
        prop2: null,
        prop3: null,
        prop4: null
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

      const result = serialize(payload, {type: Model});

      expect(result).toEqual({
        bars: null,
        barsSet: null,
        barsMap: null
      });
    });
    it("should serialize array model with alias property", () => {
      class SpaBooking {
        @Required()
        @Name("booking_number")
        bookingNumber: string;

        @Required()
        status: string;

        @Required()
        @Name("order_id")
        orderId: number;

        @Required()
        @Name("appointment_id")
        appointmentId: number;

        @Name("customer_id")
        @Groups("!create", "!read")
        customerId: number;
      }

      const appointments = [
        {
          bookingNumber: "100566224434",
          status: "Booked",
          orderId: 711376505,
          appointmentId: 566224434,
          customerId: null
        }
      ];

      const serializedResult = serialize(appointments, {
        type: SpaBooking
      });

      expect(serializedResult).toEqual([
        {
          booking_number: "100566224434",
          status: "Booked",
          order_id: 711376505,
          appointment_id: 566224434,
          customer_id: null
        }
      ]);
    });
    it("should serialize model without decorator", () => {
      class Client {
        clientId: string;
        clientSecret: string;
      }

      const client = new Client();
      client.clientId = "id";
      client.clientSecret = "secret";

      const result = serialize(client, {useAlias: false, groups: ["render"]});

      expect(result === client).toBeFalsy();
      expect(result).toEqual({
        clientId: "id",
        clientSecret: "secret"
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
        const result = deserialize(
          {
            id: "id",
            password: "hellopassword",
            mappedProp: "hello"
          },
          {useAlias: false, type: Model}
        );

        return serialize(result, options);
      };

      expect(serialize(model, {type: Model})).toEqual({
        id: "id",
        mapped_prop: "hellotest",
        password: "hellopassword",
        roles: {}
      });

      expect(serialize(model, {api: true, useAlias: false})).toEqual({
        id: "id",
        mappedProp: "hellotest",
        roles: {}
      });

      expect(serialize([model], {type: Model})).toEqual([
        {
          id: "id",
          mapped_prop: "hellotest",
          password: "hellopassword",
          roles: {}
        }
      ]);
    });
    it("should serialize model (protected keyword)", () => {
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

        @Property()
        enum: string;

        @CollectionOf(Role)
        roles: Map<string, Role> = new Map();
      }

      const model = new Model();
      // @ts-ignore
      model.$isMongooseModelPrototype = true;
      // @ts-ignore
      model["toJSON"] = (options: any) => {
        const result = deserialize(
          {
            id: "id",
            password: "hellopassword",
            mappedProp: "hello",
            enum: "test"
          },
          {useAlias: false, type: Model}
        );

        return serialize(result, options);
      };

      expect(serialize(model, {type: Model})).toEqual({
        id: "id",
        enum: "test",
        mapped_prop: "hellotest",
        password: "hellopassword",
        roles: {}
      });

      expect(serialize(model, {api: true, useAlias: false})).toEqual({
        id: "id",
        enum: "test",
        mappedProp: "hellotest",
        roles: {}
      });

      expect(serialize([model], {type: Model})).toEqual([
        {
          id: "id",
          enum: "test",
          mapped_prop: "hellotest",
          password: "hellopassword",
          roles: {}
        }
      ]);
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

      expect(serialize([model], {type: Model})).toEqual([
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
    it("should serialize model with nested model and not populated data (mongoose)", () => {
      class Workspace {
        @Property()
        _id: string;

        @Property()
        name: string;
      }

      class MyWorkspace {
        @Property()
        workspaceId: Workspace;

        @Property()
        title: string;
      }

      class UserWorkspace {
        @Property()
        _id: string;

        @CollectionOf(MyWorkspace)
        workspaces: MyWorkspace[];
      }

      const userWorkspace = new UserWorkspace();
      userWorkspace._id = new ObjectId("64e061ba7356daf00a66c130") as unknown as string;
      userWorkspace.workspaces = [new MyWorkspace()];
      userWorkspace.workspaces[0].title = "MyTest";
      userWorkspace.workspaces[0].workspaceId = new ObjectId("64e061ba7356daf00a66c130") as unknown as Workspace;

      expect(serialize(userWorkspace, {type: UserWorkspace})).toEqual({
        _id: "64e061ba7356daf00a66c130",
        workspaces: [
          {
            title: "MyTest",
            workspaceId: "64e061ba7356daf00a66c130"
          }
        ]
      });
    });
    it("should serialize model with nested model and not populated data (Ref mongoose)", () => {
      class TestUser {
        @Required()
        email: string;

        @Required()
        @MinLength(6)
        @Groups("creation")
        password: string;
      }

      class TestProfile {
        @OnSerialize((value, ctx) => {
          if (isObjectID(value)) {
            return value.toString();
          }

          return serialize(value, {...ctx, type: TestUser});
        })
        user: any;
      }

      const profile = new TestProfile();
      profile.user = new ObjectId("64e061ba7356daf00a66c130");

      expect(serialize([profile])).toEqual([
        {
          user: "64e061ba7356daf00a66c130"
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

      expect(serialize(model)).toEqual({
        id: "id",
        password: "hellopassword",
        mapped_prop: "hellotest",
        roles: {
          olo: {
            label: "label"
          }
        }
      });

      expect(serialize(model, {api: true, useAlias: false})).toEqual({
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
        value: "test",
        nullProp: null
      };

      const result = serialize(test, {type: Model});

      expect(result).toEqual({
        id: "id",
        test: {
          value: "test",
          nullProp: null
        }
      });
    });
    it("should serialize model with additional object props", () => {
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

      expect(result).toEqual({
        id: "id",
        renamed: "myname",
        additional: {
          foo: "bar"
        }
      });
    });
    it("should not serialize model with additional object props", () => {
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

      expect(result).toEqual({
        id: "id",
        renamed: "myname"
      });
    });
    it("should serialize model to object (with default value - no assigned)", () => {
      class SpaCareCategory {
        @Required()
        @Groups("!details")
        id: string;

        @Required()
        label: string;

        @Required()
        @OnDeserialize((name: string) => snakeCase(name).toUpperCase())
        code: string;

        @Required()
        @Default(0)
        @OnSerialize((o) => {
          return o || 0;
        })
        weight: number = 0;

        constructor({id, label, code, weight}: Partial<SpaCareCategory> = {}) {
          Object.assign(
            this,
            cleanObject({
              id,
              label,
              code,
              weight
            })
          );
        }
      }

      expect(
        serialize(
          {
            label: "categoryLabel",
            code: "CATEGORY_CODE"
          },
          {type: SpaCareCategory}
        )
      ).toEqual({
        code: "CATEGORY_CODE",
        label: "categoryLabel",
        weight: 0
      });
    });
    it("should serialize model to object (with default value - no assigned - custom decorator)", () => {
      function AllowEmpty() {
        return useDecorators(
          Default(""),
          Allow(""),
          OnDeserialize((o: any) => (o === null || o === undefined ? "" : o)),
          OnSerialize((o: any) => (o === null || o === undefined ? "" : o))
        );
      }

      class SpaInformation {
        @Required()
        id: number;

        @Required()
        @AllowEmpty()
        label: string = "";

        @Required()
        @AllowEmpty()
        description: string = "";

        @AllowEmpty()
        currency: string = "EUR";

        @Email()
        @AllowEmpty()
        email: string;

        @AllowEmpty()
        phone: string;

        @Required()
        @Name("are_children_accepted")
        areChildrenAccepted: boolean = false;

        @AllowEmpty()
        website: string = "";

        @Uri()
        @AllowEmpty()
        logo: string;

        @Uri()
        @AllowEmpty()
        image: string;

        @AllowEmpty()
        location: string = "";

        @Name("cancellation_hours_limit")
        @Nullable(Number)
        @OnSerialize((o) => (isNumber(o) ? o : null))
        cancellationHoursLimit: number | null = null;

        constructor({
          id,
          label,
          description,
          currency,
          email,
          phone,
          areChildrenAccepted,
          website,
          logo,
          image,
          location,
          cancellationHoursLimit = null
        }: Partial<SpaInformation> = {}) {
          Object.assign(
            this,
            cleanObject({
              id,
              label,
              description,
              currency,
              email,
              phone,
              areChildrenAccepted,
              website,
              logo,
              image,
              location,
              cancellationHoursLimit
            })
          );
        }
      }

      const result = serialize(
        {
          id: 453,
          address: null,
          label: null,
          currency: null,
          description: null,
          email: null,
          phone: undefined,
          areChildrenAccepted: true,
          website: "website",
          logo: undefined,
          image: null,
          cares: [],
          cancellationHoursLimit: undefined
        },
        {type: SpaInformation}
      );

      expect(result).toEqual({
        are_children_accepted: true,
        currency: "",
        description: "",
        email: "",
        id: 453,
        image: "",
        label: "",
        location: "",
        logo: "",
        phone: "",
        website: "website",
        cancellation_hours_limit: null
      });
    });

    describe("when jsonMapper.strictGroups = false", () => {
      it("should serialize props", () => {
        class Model {
          @Property()
          id: string;

          @Groups("summary")
          ignored: boolean;

          @Name("renamed")
          name: string;
        }

        const test = new Model();
        test.id = "id";
        test.ignored = true;
        test.name = "myname";

        const result = serialize(test, {type: Model});

        expect(result).toEqual({
          id: "id",
          ignored: true,
          renamed: "myname"
        });
      });
    });
    describe("when jsonMapper.strictGroups = true", () => {
      beforeEach(() => {
        JsonMapperSettings.strictGroups = true;
      });
      afterEach(() => {
        JsonMapperSettings.strictGroups = false;
      });
      it("should serialize props", () => {
        class Model {
          @Property()
          id: string;

          @Groups("summary")
          ignored: boolean;

          @Name("renamed")
          name: string;
        }

        const test = new Model();
        test.id = "id";
        test.ignored = true;
        test.name = "myname";

        const result = serialize(test, {type: Model});

        expect(result).toEqual({
          id: "id",
          renamed: "myname"
        });
      });
    });
  });
  describe("custom date mapper", () => {
    it("should use a custom date mapper", () => {
      class Test {
        @Property() myDate: Date;
      }

      class CustomDateMapper {
        deserialize(data: string | number): Date;
        deserialize(data: boolean | null | undefined): boolean | null | undefined;
        deserialize(data: any): any {
          // don't convert unexpected data. In normal case, Ajv reject unexpected data.
          // But by default, we have to skip data deserialization and let user to apply
          // the right mapping
          if (isBoolean(data) || data === null || data === undefined) {
            return data;
          }

          return new Date(data);
        }

        serialize(object: Date): any {
          return new Date(object).toDateString();
        }
      }

      const obj = new Test();
      obj.myDate = new Date("2022-10-02");

      const types = new Map<any, any>(getJsonMapperTypes());
      types.set(Date, new CustomDateMapper());

      const result = serialize(obj, {
        types
      });
      expect(result).toEqual({
        myDate: "Sun Oct 02 2022"
      });
    });
  });
  describe("discriminator", () => {
    it("should serialize items", () => {
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

      const event = new Event();
      event.value = "value";

      const pageView = new PageView();
      pageView.value = "value";
      pageView.url = "url";

      const action = new Action();
      action.value = "value";
      action.event = "event";

      const list = [event, pageView, action];

      expect(serialize(list)).toEqual([
        {
          value: "value"
        },
        {
          type: "page_view",
          url: "url",
          value: "value"
        },
        {
          type: "action",
          event: "event",
          value: "value"
        }
      ]);
    });
  });
});
