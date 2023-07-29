import {ForwardGroups, getJsonSchema, Groups, OneOf, Property, string} from "../../src/index";

// WHEN
class One1 {
  @Property()
  @Groups("!creation")
  id: string;

  @Property()
  label: string;
}

class One2 {
  @Property()
  @Groups("!creation")
  id: string;

  @Property()
  label: string;

  @Property()
  description: string;
}

class Model {
  @OneOf(One1, One2)
  @ForwardGroups()
  test: One1 | One2;
}

describe("OneOf and Groups", () => {
  it("should declare return schema (without groups)", () => {
    // THEN
    const schema = getJsonSchema(Model, {groups: []});

    expect(schema).toEqual({
      definitions: {
        One1: {
          properties: {
            id: {
              type: "string"
            },
            label: {
              type: "string"
            }
          },
          type: "object"
        },
        One2: {
          properties: {
            description: {
              type: "string"
            },
            id: {
              type: "string"
            },
            label: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        test: {
          oneOf: [
            {
              $ref: "#/definitions/One1"
            },
            {
              $ref: "#/definitions/One2"
            }
          ]
        }
      },
      type: "object"
    });
  });
  it("should declare return schema (with groups 'creation')", () => {
    // THEN
    const schema = getJsonSchema(Model, {
      groups: ["creation"]
    });

    expect(schema).toEqual({
      definitions: {
        One1Creation: {
          properties: {
            label: {
              type: "string"
            }
          },
          type: "object"
        },
        One2Creation: {
          properties: {
            description: {
              type: "string"
            },
            label: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        test: {
          oneOf: [
            {
              $ref: "#/definitions/One1Creation"
            },
            {
              $ref: "#/definitions/One2Creation"
            }
          ]
        }
      },
      type: "object"
    });
  });
});
