import {getSpec, In, OperationPath, Path, Property, SpecTypes} from "../../index.js";
import {Examples} from "./examples.js";

class MyModel {
  @Property()
  id: string;
}

describe("@Examples", () => {
  it("should declare example on body params", () => {
    // WHEN
    @Path("/")
    class MyController {
      @OperationPath("POST", "/:id")
      getMethod(
        @In("body")
        @Examples({
          Example1: {
            description: "Example with hello1",
            value: {test: "hello1"}
          },
          Example2: {
            description: "Example with hello2",
            value: {test: "hello2"}
          }
        })
        model: MyModel
      ) {
        return model;
      }
    }

    // THEN
    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          MyModel: {
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
        "/{id}": {
          post: {
            operationId: "myControllerGetMethod",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string"
                }
              }
            ],
            requestBody: {
              content: {
                "application/json": {
                  examples: {
                    Example1: {
                      description: "Example with hello1",
                      value: {
                        test: "hello1"
                      }
                    },
                    Example2: {
                      description: "Example with hello2",
                      value: {
                        test: "hello2"
                      }
                    }
                  },
                  schema: {
                    $ref: "#/components/schemas/MyModel"
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
