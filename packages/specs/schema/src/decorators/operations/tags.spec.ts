import {getSpec, OperationPath} from "@tsed/schema";
import {Tags} from "./tags";

describe("Tags", () => {
  it("should store metadata (method)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Tags("api")
      get() {}
    }

    expect(getSpec(MyController)).toEqual({
      tags: [{name: "api"}],
      paths: {
        "/": {
          post: {
            operationId: "myControllerGet",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["api"]
          }
        }
      }
    });
  });
  it("should store metadata (method - map)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Tags({name: "api", description: "description"})
      get() {}
    }

    expect(getSpec(MyController)).toEqual({
      tags: [
        {
          name: "api",
          description: "description"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "myControllerGet",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["api"]
          }
        }
      }
    });
  });
  it("should store metadata (class)", () => {
    @Tags("api")
    class MyController {
      @OperationPath("GET", "/")
      get() {}

      @OperationPath("POST", "/")
      @Tags("allow")
      post() {}
    }

    expect(getSpec(MyController)).toEqual({
      tags: [{name: "api"}, {name: "allow"}],
      paths: {
        "/": {
          get: {
            operationId: "myControllerGet",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["api"]
          },
          post: {
            operationId: "myControllerPost",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["allow", "api"]
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
      Tags("tags")(Test.prototype, "test", 0);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("Tags cannot be used as parameter decorator on Test.test.[0]");
  });
});
