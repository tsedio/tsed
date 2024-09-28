import {descriptorOf, useDecorators} from "@tsed/core";

import {Description, getSpec, In, Name, OperationPath, Path, Pattern, SpecTypes} from "../../index.js";
import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {Example} from "./example.js";

function ObjectID(name?: string) {
  return useDecorators(name && Name(name), Pattern(/^[0-9a-fA-F]{24}$/), Description("An ObjectID"), Example("5ce7ad3028890bd71749d477"));
}

describe("@Example", () => {
  it("should declare description on class", () => {
    // WHEN
    @Example({id: "id"})
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      examples: [{id: "id"}],
      type: "object"
    });
  });
  it("should declare example on params", () => {
    // WHEN

    @Path("/")
    class MyController {
      @OperationPath("GET", "/:id")
      getMethod(
        @In("path")
        @Name("id")
        @ObjectID()
        id: string
      ) {
        return id;
      }
    }

    // THEN
    expect(getSpec(MyController)).toEqual({
      paths: {
        "/{id}": {
          get: {
            operationId: "myControllerGetMethod",
            parameters: [
              {
                description: "An ObjectID",
                in: "path",
                name: "id",
                required: true,
                schema: {
                  example: "5ce7ad3028890bd71749d477",
                  pattern: "^[0-9a-fA-F]{24}$",
                  type: "string"
                }
              }
            ],
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
  it("should declare description on property", () => {
    // WHEN

    class Model {
      @Example("Examples")
      method: string;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        method: {
          examples: ["Examples"],
          type: "string"
        }
      },
      type: "object"
    });
  });
});
