import {AdditionalProperties, CollectionOf, Ignore, JsonHookContext, Name, Property} from "@tsed/schema";
import "../components/PrimitiveMapper";
import {OnSerialize} from "../decorators/onSerialize";
import {serializeV2} from "./JsonSerializer";

describe("JsonSerializer", () => {
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
        serializeV2(model, {
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
        serializeV2(model, {
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
      serializeV2(model, {
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
      serializeV2(model, {
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
      serializeV2(
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

    const result = serializeV2(post, {useAlias: true});

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
});
