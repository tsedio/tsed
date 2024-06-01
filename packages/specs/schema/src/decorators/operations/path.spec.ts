import {getSpec, OperationPath, Path} from "../../index.js";

describe("Path", () => {
  it("should declare a path", () => {
    @Path("/path")
    class MyController {
      @OperationPath("POST", "/")
      get() {}
    }

    expect(getSpec(MyController)).toEqual({
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/path": {
          post: {
            operationId: "myControllerGet",
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
    class Test {
      test() {}
    }

    let actualError: any;
    try {
      Path("/")(Test.prototype, "test", 0);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("Path cannot be used as parameter decorator on Test.test.[0]");
  });
});
