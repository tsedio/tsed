import {Controller} from "@tsed/di";
import {MultipartFile, PlatformMulterFile} from "@tsed/platform-http";
import {BodyParams} from "@tsed/platform-params";

import {SpecTypes} from "../../src/index.js";
import {Description, getSpec, Post} from "../../src/index.js";
import {validateSpec} from "../helpers/validateSpec.js";

@Controller("/controllers")
class MyController {
  @Post("/")
  post(
    @Description("The file you want to upload")
    @MultipartFile("file")
    file?: PlatformMulterFile,
    @Description("The URL of the file you want to upload")
    @BodyParams("url")
    url?: string,
    @Description(
      "Set a password for this file, this will encrypt the file on the server that not even the server owner can obtain it, when fetching the file. you can fill out the `x-password` http header with your password to obtain the file via API"
    )
    @BodyParams("password")
    password?: string
  ) {
    return {
      id: "id",
      description: "description",
      prop1: "prop1",
      prop2: "prop2",
      sensitiveProp: "sensitiveProp"
    };
  }
}

describe("MultipartFile", () => {
  it("should generate a valid schema", async () => {
    const spec = getSpec(MyController, {
      specType: SpecTypes.OPENAPI
    });

    expect(spec).toEqual({
      components: {
        schemas: {
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
          },
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
        }
      },
      paths: {
        "/controllers": {
          post: {
            operationId: "myControllerPost",
            parameters: [],
            requestBody: {
              content: {
                "multipart/form-data": {
                  schema: {
                    properties: {
                      file: {
                        description: "The file you want to upload",
                        format: "binary",
                        type: "string"
                      },
                      password: {
                        type: "string",
                        description:
                          "Set a password for this file, this will encrypt the file on the server that not even the server owner can obtain it, when fetching the file. you can fill out the `x-password` http header with your password to obtain the file via API"
                      },
                      url: {
                        type: "string",
                        description: "The URL of the file you want to upload"
                      }
                    },
                    type: "object"
                  }
                }
              },

              required: false
            },
            responses: {
              "400": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/BadRequest"
                    }
                  }
                },
                description:
                  "<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1"
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

    const result = await validateSpec(spec, SpecTypes.OPENAPI);

    expect(result).toEqual(true);
  });
});
