import {JsonSchema, Property, s, string} from "@tsed/schema";
import {toZod} from "./toZod.js";

describe("toZod", () => {
  it("should transform JsonSchema to Zod instance", async () => {
    const schema = s.object({
      prop1: string()
    });

    const result = toZod(schema);

    expect(result?.toJSONSchema).toBeDefined();
  });

  it("should preserve aliases when useAlias is enabled", () => {
    const schema = new JsonSchema({
      type: "object",
      properties: {
        prop: {
          type: "string"
        }
      },
      required: ["prop"]
    }).addAlias("prop", "aliasProp");

    const result = toZod(schema, {useAlias: true});

    expect(result?.toJSONSchema()).toEqual({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "object",
      properties: {
        aliasProp: {
          type: "string"
        }
      },
      required: ["aliasProp"],
      additionalProperties: false
    });
  });

  it("should inline local schema references before converting to Zod", () => {
    class Child {
      @Property()
      id: string;
    }

    const result = toZod(s.object({child: s.from(Child)}));

    expect(result?.toJSONSchema()).toMatchObject({
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
