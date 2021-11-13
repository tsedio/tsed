import {descriptorOf, useDecorators} from "@tsed/core";
import {Description, getSpec, In, Name, OperationPath, Path, Pattern, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Example} from "./example";

function ObjectID(name?: string) {
  return useDecorators(
    name && Name(name),
    Pattern(/^[0-9a-fA-F]{24}$/),
    Description("Mongoose ObjectId"),
    Example("5ce7ad3028890bd71749d477")
  );
}

describe("@Example", () => {
  it("should declare description on class", () => {
    // WHEN
    @Example({id: "id"})
    class Model {}

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
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
    expect(getSpec(MyController, {specType: SpecTypes.SWAGGER})).to.deep.equal({
      paths: {
        "/{id}": {
          get: {
            operationId: "myControllerGetMethod",
            parameters: [
              {
                description: "Mongoose ObjectId",
                in: "path",
                name: "id",
                pattern: "^[0-9a-fA-F]{24}$",
                required: true,
                type: "string"
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
    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).to.deep.equal({
      paths: {
        "/{id}": {
          get: {
            operationId: "myControllerGetMethod",
            parameters: [
              {
                description: "Mongoose ObjectId",
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string",
                  pattern: "^[0-9a-fA-F]{24}$",
                  example: "5ce7ad3028890bd71749d477"
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
    expect(getJsonSchema(Model)).to.deep.equal({
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
