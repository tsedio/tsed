import {getSpec, OperationPath, OperationVerbs} from "../../index.js";

describe("OperationPath", () => {
  it("should store metadata", () => {
    class MyController {
      @OperationPath(OperationVerbs.OPTIONS, "/")
      options() {}
    }

    expect(getSpec(MyController)).toEqual({
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/": {
          options: {
            operationId: "myControllerOptions",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyController"]
          }
        }
      }
    });
  });
  it("should throw error for unsupported usage", () => {
    let actualError: any;
    try {
      OperationPath("GET", "/")(class Test {});
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("OperationPath cannot be used as class decorator on Test");
  });
});
