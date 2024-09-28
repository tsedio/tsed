import {catchError} from "@tsed/core";
import {QueryParams} from "@tsed/platform-params";

import {Deprecated, getSpec, OperationPath, Returns, SpecTypes} from "../../index.js";

describe("Deprecated", () => {
  it("should store metadata (swagger)", () => {
    class MyController {
      @OperationPath("POST", "/")
      @Deprecated(true)
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
            deprecated: true,
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
      @Deprecated()
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
            deprecated: true,
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
    @Deprecated()
    class MyController {
      @OperationPath("GET", "/")
      get() {}

      @OperationPath("POST", "/")
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
            deprecated: true,
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
            deprecated: true,
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
  it("should store metadata (param)", () => {
    class MyController {
      @OperationPath("GET", "/")
      get(@QueryParams("param") @Deprecated(true) param: string) {}
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
            parameters: [
              {
                deprecated: true,
                in: "query",
                name: "param",
                required: false,
                schema: {
                  type: "string"
                }
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
      }
    });
  });
  it("should store metadata (prop)", () => {
    class MyModel {
      @Deprecated()
      myProp: string;
    }

    class MyController {
      @OperationPath("GET", "/")
      @Returns(200, MyModel)
      get(@QueryParams("param") @Deprecated(true) param: string) {}
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
            parameters: [
              {
                deprecated: true,
                in: "query",
                name: "param",
                required: false,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/MyModel"
                    }
                  }
                }
              }
            },
            tags: ["MyController"]
          }
        }
      },
      components: {
        schemas: {
          MyModel: {
            type: "object",
            properties: {
              myProp: {
                type: "string",
                deprecated: true
              }
            }
          }
        }
      }
    });
  });
  it("should throw an error when the decorator is as static func decorator", () => {
    const error = catchError(() => {
      class Model {
        @Deprecated(true)
        static myStaticFunc() {}
      }
    });

    expect(error?.message).toEqual("Deprecated cannot be used as method.static decorator on Model.myStaticFunc");
  });
});
