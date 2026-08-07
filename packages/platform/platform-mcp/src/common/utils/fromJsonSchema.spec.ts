import {JsonSchema, Property, s, string} from "@tsed/schema";
import {fromJsonSchema} from "./fromJsonSchema.js";

describe("fromJsonSchema", () => {
  it("should wrap a Ts.ED JsonSchema with the MCP SDK adapter", () => {
    const schema = s.object({
      prop1: string()
    });

    const result = fromJsonSchema(schema);

    expect(result?.["~standard"].jsonSchema.input({target: "draft-2020-12"})).toMatchObject({
      type: "object",
      properties: {
        prop1: {
          type: "string"
        }
      }
    });
  });

  it("should preserve aliases when compiling a Ts.ED JsonSchema", () => {
    const schema = new JsonSchema({
      type: "object",
      properties: {
        prop: {
          type: "string"
        }
      },
      required: ["prop"]
    }).addAlias("prop", "aliasProp");

    const result = fromJsonSchema(schema, {useAlias: true});

    expect(result?.["~standard"].jsonSchema.input({target: "draft-2020-12"})).toMatchObject({
      type: "object",
      properties: {
        aliasProp: {
          type: "string"
        }
      },
      required: ["aliasProp"]
    });
  });

  it("should inline local schema references", () => {
    class Child {
      @Property()
      id: string;
    }

    const result = fromJsonSchema(s.object({child: s.from(Child)}));

    expect(result?.["~standard"].jsonSchema.input({target: "draft-2020-12"})).toMatchObject({
      type: "object",
      properties: {
        child: {
          type: "object",
          properties: {
            id: {
              type: "string"
            }
          }
        }
      }
    });
  });
});
