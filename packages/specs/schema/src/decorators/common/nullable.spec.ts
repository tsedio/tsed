import {BodyParams} from "@tsed/platform-params";
import {Ajv} from "ajv";

import {SpecTypes} from "../../domain/SpecTypes.js";
import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {getSpec} from "../../utils/getSpec.js";
import {In} from "../operations/in.js";
import {Path} from "../operations/path.js";
import {Post} from "../operations/route.js";
import {Format} from "./format.js";
import {Integer} from "./integer.js";
import {MaxLength} from "./maxLength.js";
import {Minimum} from "./minimum.js";
import {Nullable} from "./nullable.js";
import {Property} from "./property.js";
import {Required} from "./required.js";

describe("@Nullable", () => {
  it("should declare any prop (Required + Nullable)", () => {
    // WHEN
    class Model {
      @Required(true, null) // allow null
      @Nullable(String)
      prop2: string | null;
    }

    // THEN
    const schema = getJsonSchema(Model);

    expect(schema).toEqual({
      properties: {
        prop2: {
          type: ["null", "string"],
          minLength: 1
        }
      },
      required: ["prop2"],
      type: "object"
    });

    const ajv = new Ajv({strict: true});

    expect(ajv.validate(schema, {prop2: null})).toBeTruthy();
    expect(ajv.validate(schema, {prop2: "test"})).toBeTruthy();
    expect(ajv.validate(schema, {prop2: 1})).toBeFalsy();
    expect(ajv.validate(schema, {prop2: ""})).toBeFalsy();

    @Path("/")
    class Test {
      @Post("/")
      test(@BodyParams() model: Model) {}
    }

    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              prop2: {
                minLength: 1,
                type: "string",
                nullable: true
              }
            },
            required: ["prop2"],
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "testTest",
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
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
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

    @Path("/")
    class Test {
      @Post("/")
      test(@BodyParams() model: Model) {}
    }

    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              prop2: {
                type: "string",
                nullable: true
              }
            },
            required: ["prop2"],
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [],
            requestBody: {
              content: {"application/json": {schema: {$ref: "#/components/schemas/Model"}}},
              required: false
            },
            responses: {"200": {description: "Success"}},
            tags: ["Test"]
          }
        }
      },
      tags: [{name: "Test"}]
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
  it("should declare any prop (Integer + Nullable)", () => {
    // WHEN
    class Model {
      @Integer()
      prop1: number;

      @Nullable(Number)
      @Integer()
      prop2: number | null;

      @Nullable(Number, String)
      @Integer()
      prop3: number | string | null;
    }

    @Path("/")
    class MyController {
      @Post("/")
      body(@BodyParams() model: Model) {}
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop1: {
          multipleOf: 1,
          type: "integer"
        },
        prop2: {
          multipleOf: 1,
          type: ["null", "integer"]
        },
        prop3: {
          anyOf: [
            {
              type: "null"
            },
            {
              multipleOf: 1,
              type: "integer"
            },
            {
              type: "string"
            }
          ]
        }
      },
      type: "object"
    });

    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              prop1: {
                multipleOf: 1,
                type: "integer"
              },
              prop2: {
                multipleOf: 1,
                nullable: true,
                type: "integer"
              },
              prop3: {
                anyOf: [
                  {
                    multipleOf: 1,
                    type: "integer"
                  },
                  {
                    type: "string"
                  }
                ],
                nullable: true
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
  it("should declare any prop (String & Number + Nullable)", () => {
    // WHEN
    class Model {
      @Nullable(String, Number)
      prop2: number | string | null;
    }

    // THEN
    const schema = getJsonSchema(Model);
    expect(schema).toEqual({
      properties: {
        prop2: {
          anyOf: [
            {
              type: "null"
            },
            {
              type: "string"
            },
            {
              type: "number"
            }
          ]
        }
      },
      type: "object"
    });

    const ajv = new Ajv({strict: true});

    expect(ajv.validate(schema, {prop2: null})).toBeTruthy();
    expect(ajv.validate(schema, {prop2: "test"})).toBeTruthy();
    expect(ajv.validate(schema, {prop2: 1})).toBeTruthy();
    expect(ajv.validate(schema, {prop2: false})).toBeFalsy();
  });
  it("should declare any prop (String & Number + Required + Nullable)", () => {
    // WHEN
    class Model {
      @Required(true, null, "")
      @Nullable(String, Number)
      @MaxLength(10)
      @Minimum(0)
      prop2: number | string | null;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop2: {
          anyOf: [
            {
              type: "null"
            },
            {
              maxLength: 10,
              type: "string"
            },
            {
              minimum: 0,
              type: "number"
            }
          ]
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
      @Format("date-time")
      prop2: Date | null;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop2: {
          format: "date-time",
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

    @Path("/")
    class Test {
      @Post("/")
      test(@BodyParams() model: Model) {}
    }

    // THEN
    expect(getSpec(Test)).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              prop2: {
                anyOf: [
                  {
                    $ref: "#/components/schemas/Nested"
                  }
                ],
                nullable: true
              }
            },
            type: "object"
          },
          Nested: {
            properties: {
              id: {
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
            operationId: "testTest",
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
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
    const schema = getJsonSchema(Model);
    expect(schema).toEqual({
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
          anyOf: [
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

    const ajv = new Ajv({strict: true});

    expect(ajv.validate(schema, {prop2: null})).toBeTruthy();
    expect(ajv.validate(schema, {prop2: {id: "id"}})).toBeTruthy();
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
          anyOf: [
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

    const ajv = new Ajv({strict: true});

    ajv.validate(schema, {prop2: null});

    expect(ajv.errors).toBe(null);
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
                anyOf: [
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

    const schema = getJsonSchema(Model);

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
          anyOf: [
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

    const ajv = new Ajv({strict: true});

    expect(ajv.validate(schema, {prop2: null})).toBeTruthy();
    expect(ajv.validate(schema, {prop2: {id: "id", other: "other"}})).toBeTruthy();
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
                anyOf: [
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
