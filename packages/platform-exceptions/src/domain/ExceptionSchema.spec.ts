import SwaggerParser from "@apidevtools/swagger-parser";
import {BadRequest, Exception} from "@tsed/exceptions";
import {getJsonSchema, getSpec, OperationPath, Path, Returns, SpecTypes} from "@tsed/schema";
import Ajv from "ajv";
import {expect} from "chai";
import {unlinkSync, writeJsonSync} from "fs-extra";
import "./ExceptionSchema";

function getAjv() {
  return new Ajv({
    verbose: false,
    coerceTypes: true
  });
}

const validateSpec = async (spec: any, version = SpecTypes.SWAGGER) => {
  const file = __dirname + "/spec.json";
  spec = {
    ...spec
  };
  try {
    if (version === SpecTypes.OPENAPI) {
      spec.openapi = "3.0.1";
    } else {
      spec.swagger = "2.0";
    }

    spec.info = {
      title: "Title",
      description: "Description",
      termsOfService: "termsOfService",
      contact: {
        email: "apiteam@swagger.io"
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html"
      },
      version: "1.0.0"
    };

    writeJsonSync(file, spec, {encoding: "utf8"});
    await SwaggerParser.validate(file);
    unlinkSync(file);

    return true;
  } catch (er) {
    console.error(er);
    // unlinkSync(file);

    return er;
  }
};

describe("ExceptionSchema", () => {
  it("should generate the right json schema", () => {
    const schema = getJsonSchema(Exception);

    expect(schema).to.deep.eq({
      definitions: {
        GenericError: {
          additionalProperties: true,
          properties: {
            message: {
              description: "An error message",
              minLength: 1,
              type: "string"
            },
            name: {
              description: "The error name",
              minLength: 1,
              type: "string"
            }
          },
          required: ["name", "message"],
          type: "object"
        }
      },
      properties: {
        errors: {
          description: "A list of related errors",
          items: {
            $ref: "#/definitions/GenericError"
          },
          type: "array"
        },
        message: {
          description: "An error message",
          minLength: 1,
          type: "string"
        },
        name: {
          description: "The error name",
          minLength: 1,
          type: "string"
        },
        stack: {
          description: "The stack trace (only in development mode)",
          type: "string"
        },
        status: {
          description: "The status code of the exception",
          type: "number"
        }
      },
      required: ["name", "message", "status"],
      type: "object"
    });

    const ajv = getAjv();
    ajv.validate(schema, {status: 400});
    expect(ajv.errors).to.deep.eq([
      {
        instancePath: "",
        keyword: "required",
        message: "must have required property 'name'",
        params: {
          missingProperty: "name"
        },
        schemaPath: "#/required"
      }
    ]);
  });

  it("should generate the right spec - OS2", async () => {
    @Path("/")
    class MyController {
      @OperationPath("GET", "/")
      @(Returns(400, BadRequest).Description("BadRequest"))
      get() {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.SWAGGER});
    expect(spec).to.deep.eq({
      definitions: {
        GenericError: {
          additionalProperties: true,
          properties: {
            message: {
              description: "An error message",
              minLength: 1,
              type: "string"
            },
            name: {
              description: "The error name",
              minLength: 1,
              type: "string"
            }
          },
          required: ["name", "message"],
          type: "object"
        },
        BadRequest: {
          properties: {
            errors: {
              description: "A list of related errors",
              items: {
                $ref: "#/definitions/GenericError"
              },
              type: "array"
            },
            message: {
              description: "An error message",
              minLength: 1,
              type: "string"
            },
            name: {
              default: "BAD_REQUEST",
              description: "The error name",
              example: "BAD_REQUEST",
              minLength: 1,
              type: "string"
            },
            stack: {
              description: "The stack trace (only in development mode)",
              type: "string"
            },
            status: {
              default: 400,
              description: "The status code of the exception",
              example: 400,
              type: "number"
            }
          },
          required: ["name", "message", "status"],
          type: "object"
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "myControllerGet",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "400": {
                description: "BadRequest",
                schema: {
                  $ref: "#/definitions/BadRequest"
                }
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
    expect(await validateSpec(spec, SpecTypes.SWAGGER)).to.deep.eq(true);
  });

  it("should generate the right spec - OS3", async () => {
    @Path("/")
    class MyController {
      @OperationPath("GET", "/")
      @(Returns(400, BadRequest).Description("BadRequest"))
      get() {}
    }

    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});
    expect(spec).to.deep.eq({
      components: {
        schemas: {
          GenericError: {
            additionalProperties: true,
            properties: {
              message: {
                description: "An error message",
                minLength: 1,
                type: "string"
              },
              name: {
                description: "The error name",
                minLength: 1,
                type: "string"
              }
            },
            required: ["name", "message"],
            type: "object"
          },
          BadRequest: {
            properties: {
              errors: {
                description: "A list of related errors",
                items: {
                  $ref: "#/components/schemas/GenericError"
                },
                type: "array"
              },
              message: {
                description: "An error message",
                minLength: 1,
                type: "string"
              },
              name: {
                default: "BAD_REQUEST",
                description: "The error name",
                example: "BAD_REQUEST",
                minLength: 1,
                type: "string"
              },
              stack: {
                description: "The stack trace (only in development mode)",
                type: "string"
              },
              status: {
                default: 400,
                description: "The status code of the exception",
                example: 400,
                type: "number"
              }
            },
            required: ["name", "message", "status"],
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "myControllerGet",
            parameters: [],
            responses: {
              "400": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/BadRequest"
                    }
                  }
                },
                description: "BadRequest"
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
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).to.deep.eq(true);
  });
});
