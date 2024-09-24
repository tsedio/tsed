import {getSpec, OperationPath, SpecTypes} from "../../index.js";
import {Security} from "./security.js";

describe("Security", () => {
  it("should store metadata (method)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Security("oauth", "user")
      get() {}
    }

    expect(getSpec(MyController)).toEqual({
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
            security: [{oauth: ["user"]}],
            tags: ["MyController"]
          }
        }
      }
    });
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
            security: [{oauth: ["user"]}],
            tags: ["MyController"]
          }
        }
      }
    });
  });
  it("should store multiple security schemes (method)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Security([{A: ["scope-1"]}, {B: [], C: ["scope-2", "scope-3"]}])
      post() {}
    }

    expect(getSpec(MyController)).toEqual({
      tags: [
        {
          name: "MyController"
        }
      ],
      paths: {
        "/": {
          post: {
            operationId: "myControllerPost",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            security: [
              {
                A: ["scope-1"]
              },
              {
                B: [],
                C: ["scope-2", "scope-3"]
              }
            ],
            tags: ["MyController"]
          }
        }
      }
    });
  });
  it("should store metadata (class)", () => {
    @Security("oauth", "user")
    class MyController {
      @OperationPath("GET", "/")
      get() {}

      @OperationPath("POST", "/")
      @Security("oauth", "admin")
      post() {}
    }

    expect(getSpec(MyController)).toEqual({
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
            responses: {
              "200": {
                description: "Success"
              }
            },
            security: [
              {
                oauth: ["user"]
              }
            ],
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
            security: [
              {
                oauth: ["admin", "user"]
              }
            ],
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
      Security("POST", "/")(Test.prototype, "test", 0);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).toEqual("Security cannot be used as parameter decorator on Test.test.[0]");
  });
});
