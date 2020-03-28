import {Deprecated, getSpec, OperationPath, SpecTypes} from "@tsed/schema";
import {expect} from "chai";

describe("Deprecated", () => {
  it("should store metadata (swagger)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Deprecated(true)
      get() {
      }
    }

    expect(getSpec(MyController)).to.deep.eq({
      definitions: {},
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
            deprecated: true,
            responses: {
              "200": {
                description: ""
              }
            },
            tags: ["MyController"]
          }
        }
      }
    });
  });
  it("should store metadata (openspec)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Deprecated()
      get() {
      }
    }

    expect(getSpec(MyController, {spec: SpecTypes.OPENAPI})).to.deep.eq({
      components: {
        schemas: {}
      },
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "myControllerGet",
            deprecated: true,
            parameters: [],
            responses: {
              "200": {
                description: ""
              }
            },
            tags: ["MyController"]
          }
        }
      }
    });
  });
  it("should store metadata (class)", () => {
    @Deprecated()
    class MyController {
      @OperationPath("GET", "/")
      get() {
      }

      @OperationPath("POST", "/")
      post() {
      }
    }

    expect(getSpec(MyController)).to.deep.eq({
      definitions: {},
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/": {
          get: {
            operationId: "myControllerGet",
            parameters: [],
            deprecated: true,
            responses: {
              "200": {
                description: ""
              }
            },
            tags: ["MyController"]
          },
          post: {
            operationId: "myControllerPost",
            parameters: [],
            deprecated: true,
            responses: {
              "200": {
                description: ""
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
      test() {
      }
    }

    let actualError: any;
    try {
      Deprecated()(Test.prototype, "test", 0);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.deep.eq("Deprecated cannot be used as parameter decorator on Test.test.[0]");
  });
});
