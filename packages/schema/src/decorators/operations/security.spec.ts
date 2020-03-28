import {getSpec, OperationPath} from "@tsed/schema";
import {expect} from "chai";
import {Security} from "./security";

describe("Security", () => {
  it("should store metadata (method)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Security("oauth", "user")
      get() {}
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
            responses: {
              "200": {
                description: ""
              }
            },
            security: {
              oauth: ["user"]
            },
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
            responses: {
              "200": {
                description: ""
              }
            },
            security: {
              oauth: ["user"]
            },
            tags: ["MyController"]
          },
          post: {
            operationId: "myControllerPost",
            parameters: [],
            responses: {
              "200": {
                description: ""
              }
            },
            security: {
              oauth: ["admin", "user"]
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
      Security("POST", "/")(Test.prototype, "test", 0);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.deep.eq("Security cannot be used as parameter decorator on Test.test.[0]");
  });
});
