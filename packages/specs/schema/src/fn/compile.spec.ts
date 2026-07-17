import {CollectionOf, Email, Format, Generics, getJsonEntityStore, MinLength, Name, Property, Required, s} from "../index.js";
import {ancestorsOf, nameOf, Type} from "@tsed/core";
import {Post} from "../../test/helpers/Post.js";
import {compile} from "./compile.js";

describe("compile", () => {
  @Generics("T")
  class ResponseWithData<T> {
    @Property("T")
    data: T;
  }

  class Data {
    @Property()
    id: string;
  }

  describe("with inlineRefs: false", () => {
    it("should expose compile as an alias of compile", () => {
      const schema = s.object({
        id: s.string().required()
      });

      expect(compile(schema)).toEqual(compile(schema));
      expect(compile(Post)).toEqual(compile(Post));
    });

    it("should map a Temporal.* property to a string schema (like Date)", () => {
      class Event {
        @Property(Temporal.Instant)
        @Required()
        instant: Temporal.Instant;

        @Property(Temporal.PlainDate)
        plainDate: Temporal.PlainDate;
      }

      expect(compile(Event)).toEqual({
        type: "object",
        required: ["instant"],
        properties: {
          instant: {
            minLength: 1,
            type: "string"
          },
          plainDate: {
            type: "string"
          }
        }
      });
    });

    it("should declare all schema correctly (basic)", () => {
      // WHEN
      class Model {
        @Property()
        @Required()
        prop1: string;

        @CollectionOf(String)
        prop2: string[];

        @CollectionOf(String)
        prop3: Set<string>;

        @CollectionOf(String)
        prop4: Map<string, string>;
      }

      // THEN
      expect(compile(Model)).toEqual({
        type: "object",
        required: ["prop1"],
        properties: {
          prop1: {
            minLength: 1,
            type: "string"
          },
          prop2: {
            type: "array",
            items: {
              type: "string"
            }
          },
          prop3: {
            type: "array",
            uniqueItems: true,
            items: {
              type: "string"
            }
          },
          prop4: {
            type: "object",
            additionalProperties: {
              type: "string"
            }
          }
        }
      });
    });
    it("should declare all schema correctly (alias)", () => {
      // WHEN
      class Model {
        @Name("prop_1")
        @Required()
        prop1: string;
      }

      // THEN
      const classSchema = getJsonEntityStore(Model);

      expect(classSchema.schema.toJSON()).toEqual({
        type: "object",
        required: ["prop_1"],
        properties: {
          prop_1: {
            minLength: 1,
            type: "string"
          }
        }
      });
    });
    it("should declare prop with a nested model", () => {
      // WHEN
      class NestedModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN

      expect(compile(NestedModel)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      expect(compile(Model)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/NestedModel"
          }
        },
        definitions: {
          NestedModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should declare prop with a nested model with named model", () => {
      // WHEN
      @Name("Nested")
      class NestedModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN

      expect(compile(NestedModel)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      const options = {components: {schemas: {}}};
      expect(getJsonEntityStore(Model).schema.clone().toJSON(options)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/Nested"
          }
        }
      });
      expect(options).toEqual({
        components: {
          schemas: {
            Nested: {
              properties: {
                id: {
                  type: "string"
                },
                prop1: {
                  type: "string"
                }
              },
              type: "object"
            }
          }
        }
      });
      expect(compile(Model)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/Nested"
          }
        },
        definitions: {
          Nested: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should declare prop with a nested of nested model (Array)", () => {
      // WHEN
      class ChildModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class NestedModel {
        @Property()
        id: string;

        @CollectionOf(ChildModel)
        children: ChildModel[];
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN
      expect(compile(ChildModel)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      expect(compile(NestedModel)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          children: {
            type: "array",
            items: {
              $ref: "#/definitions/ChildModel"
            }
          }
        },
        definitions: {
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });

      expect(compile(Model)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/NestedModel"
          }
        },
        definitions: {
          NestedModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              children: {
                type: "array",
                items: {
                  $ref: "#/definitions/ChildModel"
                }
              }
            }
          },
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should declare prop with a nested of nested model (Set)", () => {
      // WHEN
      class ChildModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class NestedModel {
        @Property()
        id: string;

        @CollectionOf(ChildModel)
        children: Set<ChildModel>;
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN
      expect(compile(ChildModel)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      expect(compile(NestedModel)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          children: {
            type: "array",
            uniqueItems: true,
            items: {
              $ref: "#/definitions/ChildModel"
            }
          }
        },
        definitions: {
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });

      expect(compile(Model)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/NestedModel"
          }
        },
        definitions: {
          NestedModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              children: {
                type: "array",
                uniqueItems: true,
                items: {
                  $ref: "#/definitions/ChildModel"
                }
              }
            }
          },
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should declare prop with a nested of nested model (Map)", () => {
      // WHEN
      class ChildModel {
        @Property()
        id: string;

        @Property()
        prop1: string;
      }

      class NestedModel {
        @Property()
        id: string;

        @CollectionOf(ChildModel)
        children: Map<string, ChildModel>;
      }

      class Model {
        @Property()
        id: string;

        @Property()
        nested: NestedModel;
      }

      // THEN
      expect(compile(ChildModel)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          prop1: {
            type: "string"
          }
        }
      });

      expect(compile(NestedModel)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          children: {
            type: "object",
            additionalProperties: {
              $ref: "#/definitions/ChildModel"
            }
          }
        },
        definitions: {
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });

      expect(compile(Model)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          nested: {
            $ref: "#/definitions/NestedModel"
          }
        },
        definitions: {
          NestedModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              children: {
                type: "object",
                additionalProperties: {
                  $ref: "#/definitions/ChildModel"
                }
              }
            }
          },
          ChildModel: {
            type: "object",
            properties: {
              id: {
                type: "string"
              },
              prop1: {
                type: "string"
              }
            }
          }
        }
      });
    });
    it("should accept circular ref", () => {
      // WHEN

      // THEN
      const classSchema = compile(Post);

      expect(classSchema).toEqual({
        definitions: {
          Post: {
            properties: {
              id: {
                type: "string"
              },
              owner: {
                $ref: "#/definitions/User"
              }
            },
            type: "object"
          },
          User: {
            properties: {
              name: {
                type: "string"
              },
              posts: {
                items: {
                  $ref: "#/definitions/Post"
                },
                type: "array"
              }
            },
            type: "object"
          }
        },
        properties: {
          id: {
            type: "string"
          },
          owner: {
            $ref: "#/definitions/User"
          }
        },
        type: "object"
      });
    });
    it("should return the json schema for an inherited model", () => {
      class Base {
        @Property()
        id: string;

        @Required()
        @Email()
        email: string;
      }

      class Model extends Base {
        @MinLength(0)
        declare email: string;

        @Property()
        name: string;
      }

      expect(compile(Model)).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          email: {
            type: "string",
            minLength: 0,
            format: "email"
          },
          name: {
            type: "string"
          }
        },
        required: ["email"]
      });
    });
    it("should keep required meta from inherited class", () => {
      // WHEN
      const AutoUUID = <T extends Type<any>>(Base: T) => {
        class AutoUUIDMixin extends Base {
          @Property() //showing up in swagger as a property
          @Format("uuid") //showing up as a uuid in swagger
          @Required(true)
          id: string;
        }

        return AutoUUIDMixin;
      };

      const WithDates = <T extends Type<any>>(Base: T) => {
        class WithDates extends Base {
          @Property() //showing up in swagger as a property
          @Format("datetime") //showing up as a uuid in swagger
          @Required(true)
          created_at: string;

          @Property() //showing up in swagger as a property
          @Format("datetime") //showing up as a uuid in swagger
          @Required(true)
          updated_at: string;
        }

        return WithDates;
      };

      class Model {
        @Required()
        name: string;
      }

      const DefaultMixins = <T extends Type<any>>(Base: T) => AutoUUID(WithDates(Base));

      class EmailTemplate extends DefaultMixins(Model) {
        @Required()
        engine: string;
      }

      // THEN
      expect(ancestorsOf(EmailTemplate).map(nameOf)).toEqual(["Model", "WithDates", "AutoUUIDMixin", "EmailTemplate"]);
      expect(compile(EmailTemplate)).toEqual({
        properties: {
          created_at: {
            format: "datetime",
            minLength: 1,
            type: "string"
          },
          engine: {
            minLength: 1,
            type: "string"
          },
          id: {
            format: "uuid",
            minLength: 1,
            type: "string"
          },
          name: {
            minLength: 1,
            type: "string"
          },
          updated_at: {
            format: "datetime",
            minLength: 1,
            type: "string"
          }
        },
        required: ["name", "created_at", "updated_at", "id", "engine"],
        type: "object"
      });
    });
    it("should keep inherited merges for nested classes declared on an inherited model", () => {
      class NestedBase {
        @Property()
        base: string;
      }

      class Nested extends NestedBase {
        @Property()
        child: string;
      }

      class Root {
        @Property()
        nested: Nested;
      }

      class Model extends Root {
        @Property()
        id: string;
      }

      expect(compile(Model)).toEqual({
        type: "object",
        properties: {
          nested: {
            $ref: "#/definitions/Nested"
          },
          id: {
            type: "string"
          }
        },
        definitions: {
          Nested: {
            type: "object",
            properties: {
              base: {
                type: "string"
              },
              child: {
                type: "string"
              }
            }
          }
        }
      });
    });

    it("compiles functional object schemas", () => {
      const schema = s.object({
        id: s.string().required()
      });

      expect(compile(schema, {inlineRefs: false})).toMatchInlineSnapshot(`
        {
          "properties": {
            "id": {
              "minLength": 1,
              "type": "string",
            },
          },
          "required": [
            "id",
          ],
          "type": "object",
        }
      `);
    });

    it("compiles functional generic schemas", () => {
      expect(compile(s.generic(ResponseWithData).of(Data), {inlineRefs: false})).toMatchInlineSnapshot(`
        {
          "allOf": [
            {
              "$ref": "#/definitions/ResponseWithData",
            },
            {
              "properties": {
                "data": {
                  "$ref": "#/definitions/Data",
                },
              },
              "type": "object",
            },
          ],
          "definitions": {
            "Data": {
              "properties": {
                "id": {
                  "type": "string",
                },
              },
              "type": "object",
            },
            "ResponseWithData": {
              "properties": {
                "data": {},
              },
              "type": "object",
            },
          },
        }
      `);
    });

    it("resolves local class references", () => {
      class Child {
        @Property()
        id: string;
      }

      class Parent {
        @Property(Child)
        child: Child;
      }

      expect(compile(Parent, {inlineRefs: false}).properties.child).toMatchInlineSnapshot(`
            {
              "$ref": "#/definitions/Child",
            }
          `);
    });

    it("resolves nested functional references", () => {
      class Data {
        @Property()
        id: string;
      }

      const schema = s.object({
        data: s.from(Data),
        items: s.array(s.from(Data))
      });

      expect(compile(schema, {inlineRefs: false})).toMatchInlineSnapshot(`
            {
              "definitions": {
                "Data": {
                  "properties": {
                    "id": {
                      "type": "string",
                    },
                  },
                  "type": "object",
                },
              },
              "properties": {
                "data": {
                  "$ref": "#/definitions/Data",
                },
                "items": {
                  "items": {
                    "$ref": "#/definitions/Data",
                  },
                  "type": "array",
                },
              },
              "type": "object",
            }
          `);
    });

    it("preserves external references", () => {
      const externalRef = "https://example.test/schemas.json#/definitions/Data";
      const schema = s.object({data: s.$ref(externalRef)});

      expect(compile(schema, {inlineRefs: false})).toMatchInlineSnapshot(`
        {
          "properties": {
            "data": {
              "$ref": "https://example.test/schemas.json#/definitions/Data",
            },
          },
          "type": "object",
        }
      `);
    });

    it("retains a circular local reference", () => {
      class Node {
        @Property(() => Node)
        child: Node;
      }

      expect(compile(Node, {inlineRefs: false}).properties.child).toMatchInlineSnapshot(`
            {
              "$ref": "#/definitions/Node",
            }
          `);
    });
  });

  describe("with inlineRefs: true", () => {
    it("compiles functional object schemas", () => {
      const schema = s.object({
        id: s.string().required()
      });

      expect(compile(schema, {inlineRefs: true})).toMatchInlineSnapshot(`
        {
          "properties": {
            "id": {
              "minLength": 1,
              "type": "string",
            },
          },
          "required": [
            "id",
          ],
          "type": "object",
        }
      `);
    });

    it("compiles functional generic schemas", () => {
      expect(compile(s.generic(ResponseWithData).of(Data), {inlineRefs: true})).toMatchInlineSnapshot(`
        {
          "properties": {
            "data": {
              "properties": {
                "id": {
                  "type": "string",
                },
              },
              "type": "object",
            },
          },
          "type": "object",
        }
      `);
    });

    it("resolves local class references", () => {
      class Child {
        @Property()
        id: string;
      }

      class Parent {
        @Property(Child)
        child: Child;
      }

      expect(compile(Parent, {inlineRefs: true}).properties.child).toMatchInlineSnapshot(`
        {
          "properties": {
            "id": {
              "type": "string",
            },
          },
          "type": "object",
        }
      `);
    });

    it("resolves nested functional references", () => {
      class Data {
        @Property()
        id: string;
      }

      const schema = s.object({
        data: s.from(Data),
        items: s.array(s.from(Data))
      });

      expect(compile(schema, {inlineRefs: true})).toMatchInlineSnapshot(`
        {
          "properties": {
            "data": {
              "properties": {
                "id": {
                  "type": "string",
                },
              },
              "type": "object",
            },
            "items": {
              "items": {
                "properties": {
                  "id": {
                    "type": "string",
                  },
                },
                "type": "object",
              },
              "type": "array",
            },
          },
          "type": "object",
        }
      `);
    });

    it("preserves external references", () => {
      const externalRef = "https://example.test/schemas.json#/definitions/Data";
      const schema = s.object({data: s.$ref(externalRef)});

      expect(compile(schema, {inlineRefs: true})).toMatchInlineSnapshot(`
        {
          "properties": {
            "data": {
              "$ref": "https://example.test/schemas.json#/definitions/Data",
            },
          },
          "type": "object",
        }
      `);
    });

    it("retains a circular local reference", () => {
      class Node {
        @Property(() => Node)
        child: Node;
      }

      expect(compile(Node, {inlineRefs: true}).properties.child).toMatchInlineSnapshot(`
        {
          "properties": {
            "child": {
              "$ref": "#/definitions/Node",
            },
          },
          "type": "object",
        }
      `);
    });
  });
});
