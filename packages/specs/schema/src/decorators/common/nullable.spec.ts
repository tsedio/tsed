import {BodyParams} from "@tsed/platform-params";
import Ajv from "ajv";
import {SpecTypes} from "../../domain/SpecTypes";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {getSpec} from "../../utils/getSpec";
import {In} from "../operations/in";
import {Path} from "../operations/path";
import {Post} from "../operations/route";
import {Nullable} from "./nullable";
import {Property} from "./property";
import {Required} from "./required";

describe("@Nullable", () => {
  it("should declare any prop (Required + Nullable)", () => {
    // WHEN
    class Model {
      @Required(true, null) // allow null
      @Nullable(String)
      prop2: string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop2: {
          type: ["null", "string"],
          minLength: 1
        }
      },
      required: ["prop2"],
      type: "object"
    });
  });
  it("should declare any prop (String + Required + Nullable)", () => {
    // WHEN
    class Model {
      @Required(true, null, "") // allow null
      @Nullable(String)
      prop2: string | null;
    }

    // THEN
    const schema = getJsonSchema(Model);
    const ajv = new Ajv();

    ajv.compile(schema);

    expect(schema).toEqual({
      properties: {
        prop2: {
          type: ["null", "string"]
        }
      },
      required: ["prop2"],
      type: "object"
    });
  });
  it("should declare any prop (String + Nullable)", () => {
    // WHEN
    class Model {
      @Nullable(String)
      prop2: string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop2: {
          type: ["null", "string"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (String & Number + Nullable)", () => {
    // WHEN
    class Model {
      @Nullable(String, Number)
      prop2: number | string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop2: {
          type: ["null", "string", "number"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (String & Number + Required + Nullable)", () => {
    // WHEN
    class Model {
      @Required(true, null, "")
      @Nullable(String, Number)
      prop2: number | string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop2: {
          type: ["null", "string", "number"]
        }
      },
      required: ["prop2"],
      type: "object"
    });
  });
  it("should declare any prop (Date + Nullable)", () => {
    // WHEN
    class Model {
      @Nullable(Date)
      prop2: Date | null;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop2: {
          type: ["null", "string"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (Model + Nullable)", () => {
    // WHEN
    class Nested {
      @Property()
      id: string;
    }

    class Model {
      @Nullable(Nested)
      prop2: Nested | null;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      definitions: {
        Nested: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        prop2: {
          oneOf: [
            {
              type: "null"
            },
            {
              $ref: "#/definitions/Nested"
            }
          ]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (many Models + Nullable + JsonSchema)", () => {
    // WHEN
    class Nested1 {
      @Property()
      id: string;

      @Property()
      top: string;
    }

    class Nested2 {
      @Property()
      id: string;

      @Property()
      other: string;
    }

    class Model {
      @Nullable(Nested1, Nested2)
      prop2: Nested1 | Nested2 | null;
    }

    const schema = getJsonSchema(Model);
    const ajv = new Ajv({strict: true});

    ajv.validate(schema, {prop2: null});

    expect(ajv.errors).toBe(null);
    // THEN
    expect(schema).toEqual({
      definitions: {
        Nested1: {
          properties: {
            id: {
              type: "string"
            },
            top: {
              type: "string"
            }
          },
          type: "object"
        },
        Nested2: {
          properties: {
            id: {
              type: "string"
            },
            other: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        prop2: {
          oneOf: [
            {
              type: "null"
            },
            {
              $ref: "#/definitions/Nested1"
            },
            {
              $ref: "#/definitions/Nested2"
            }
          ]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (many Models + Nullable + OS3)", () => {
    // WHEN
    class Nested1 {
      @Property()
      id: string;

      @Property()
      top: string;
    }

    class Nested2 {
      @Property()
      id: string;

      @Property()
      other: string;
    }

    class Model {
      @Nullable(Nested1, Nested2)
      prop2: Nested1 | Nested2 | null;
    }

    @Path("/")
    class MyController {
      @Post("/")
      body(@BodyParams() model: Model) {}
    }

    // THEN
    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              prop2: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/Nested1"
                  },
                  {
                    $ref: "#/components/schemas/Nested2"
                  }
                ],
                nullable: true
              }
            },
            type: "object"
          },
          Nested1: {
            properties: {
              id: {
                type: "string"
              },
              top: {
                type: "string"
              }
            },
            type: "object"
          },
          Nested2: {
            properties: {
              id: {
                type: "string"
              },
              other: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "myControllerBody",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Model"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyController"]
          }
        }
      },
      tags: [
        {
          name: "MyController"
        }
      ]
    });
  });
  it("should declare any prop (many Models + Nullable + OS2)", () => {
    // WHEN
    class Nested1 {
      @Property()
      id: string;

      @Property()
      top: string;
    }

    class Nested2 {
      @Property()
      id: string;

      @Property()
      other: string;
    }

    class Model {
      @Nullable(Nested1, Nested2)
      prop2: Nested1 | Nested2 | null;
    }

    @Path("/")
    class MyController {
      @Post("/")
      body(@In("body") model: Model) {}
    }

    // THEN
    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              prop2: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/Nested1"
                  },
                  {
                    $ref: "#/components/schemas/Nested2"
                  }
                ],
                nullable: true
              }
            },
            type: "object"
          },
          Nested1: {
            properties: {
              id: {
                type: "string"
              },
              top: {
                type: "string"
              }
            },
            type: "object"
          },
          Nested2: {
            properties: {
              id: {
                type: "string"
              },
              other: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "myControllerBody",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Model"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyController"]
          }
        }
      },
      tags: [
        {
          name: "MyController"
        }
      ]
    });
  });
});
