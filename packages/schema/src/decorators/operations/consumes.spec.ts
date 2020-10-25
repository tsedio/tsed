import {Consumes, getSpec, OperationPath, SpecTypes} from "@tsed/schema";
import {expect} from "chai";

describe("Consumes", () => {
  it("should store metadata (swagger)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Consumes("text/json")
      get() {}
    }

    expect(getSpec(MyController)).to.deep.eq({
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
            consumes: ["text/json"],
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
  it("should store metadata (openspec)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Consumes("text/json")
      get() {}
    }

    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).to.deep.eq({
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
    @Consumes("text/json")
    class MyController {
      @OperationPath("GET", "/")
      get() {}

      @OperationPath("POST", "/")
      post() {}
    }

    expect(getSpec(MyController)).to.deep.eq({
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
            consumes: ["text/json"],
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
            consumes: ["text/json"],
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
      Consumes("text/json")(Test.prototype, "test", 0);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.deep.eq("Consumes cannot be used as parameter decorator on Test.test.[0]");
  });
});
