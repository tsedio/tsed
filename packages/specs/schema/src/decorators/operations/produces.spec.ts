import {getSpec, OperationPath, Produces, SpecTypes} from "@tsed/schema";

describe("Produces", () => {
  it("should store metadata", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Produces("text/json")
      get() {}
    }

    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).toEqual({
      tags: [
        {
          name: "MyController"
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
            tags: ["MyController"]
          }
        }
      }
    });
  });
  it("should store metadata (class)", () => {
    @Produces("text/json")
    class MyController {
      @OperationPath("GET", "/")
      get() {}

      @OperationPath("POST", "/")
      post() {}
    }

    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).toEqual({
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
            tags: ["MyController"]
          },
          post: {
            operationId: "myControllerPost",
            parameters: [],
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
  it("should throw error for unsupported usage", () => {
    class Test {
      test() {}
    }

    let actualError: any;
    try {
      Produces("text/json")(Test.prototype, "test", 0);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("Produces cannot be used as parameter decorator on Test.test.[0]");
  });
});
