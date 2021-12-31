import {getSpec, In, Name, OperationPath, Optional} from "@tsed/schema";
import {Path} from "../operations/path";

describe("Optional", () => {
  it("should set metadata when optional is used on param", () => {
    @Path("/")
    class MyController {
      @OperationPath("GET", "/")
      method(@In("query") @Name("q") @Optional() q: string) {}
    }

    expect(getSpec(MyController)).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "myControllerMethod",
            parameters: [
              {
                in: "query",
                name: "q",
                required: false,
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
  });
});
