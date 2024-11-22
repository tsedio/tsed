import {catchAsyncError} from "@tsed/core";
import {PlatformTest} from "@tsed/platform-http/testing";
import {AllOf, AnyOf, CollectionOf, getSpec, JsonParameterStore, OneOf, Post, Property, Required, SpecTypes} from "@tsed/schema";

import {BodyParams} from "../decorators/bodyParams.js";
import {PathParams} from "../decorators/pathParams.js";
import {QueryParams} from "../decorators/queryParams.js";
import {ValidationPipe} from "./ValidationPipe.js";

describe("ValidationPipe", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return value (Body)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Test {
      @Post("/")
      test(@BodyParams(String) type: string[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);
    const result = await validator.transform("value", param);

    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      type: "string"
                    },
                    type: "array"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
    expect(result).toEqual("value");
  });
  it("should return value (Body with array param)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Test {
      @Post("/")
      test(@BodyParams() type: any[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);
    const result = await validator.transform("value", param);

    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      anyOf: [
                        {
                          multipleOf: 1,
                          type: "integer"
                        },
                        {
                          type: "number"
                        },
                        {
                          type: "string"
                        },
                        {
                          type: "boolean"
                        },
                        {
                          type: "array"
                        },
                        {
                          type: "object"
                        }
                      ],
                      nullable: true
                    },
                    type: "array"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
    expect(result).toEqual("value");
  });
  it("should return value (Body with array oneOf)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Model {
      @Property()
      id: string;
    }

    class Model2 {
      @Property()
      id: string;
    }

    class Test {
      @Post("/")
      test(@BodyParams() @OneOf(Model, Model2) type: any[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);
    const result = await validator.transform("value", param);

    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          },
          Model2: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      oneOf: [
                        {
                          $ref: "#/components/schemas/Model"
                        },
                        {
                          $ref: "#/components/schemas/Model2"
                        }
                      ]
                    },
                    type: "array"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
    expect(result).toEqual("value");
  });
  it("should return value (Body with array anyOf)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Model {
      @Property()
      id: string;
    }

    class Model2 {
      @Property()
      id: string;
    }

    class Test {
      @Post("/")
      test(@BodyParams() @AnyOf(Model, Model2) type: any[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);
    const result = await validator.transform("value", param);

    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          },
          Model2: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      anyOf: [
                        {
                          $ref: "#/components/schemas/Model"
                        },
                        {
                          $ref: "#/components/schemas/Model2"
                        }
                      ]
                    },
                    type: "array"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
    expect(result).toEqual("value");
  });
  it("should return value (Body with array allOf)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Model {
      @Property()
      id: string;
    }

    class Model2 {
      @Property()
      id: string;
    }

    class Test {
      @Post("/")
      test(@BodyParams() @AllOf(Model, Model2) type: any[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);
    const result = await validator.transform("value", param);

    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          },
          Model2: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      allOf: [
                        {
                          $ref: "#/components/schemas/Model"
                        },
                        {
                          $ref: "#/components/schemas/Model2"
                        }
                      ]
                    },
                    type: "array"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
    expect(result).toEqual("value");
  });
  it("should skip validation for array path params", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = {
      validate: vi.fn().mockImplementation((o) => o)
    };

    class Test {
      @Post("/")
      test(@PathParams() type: Object) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);
    const result = await validator.transform("value", param);

    // THEN
    // @ts-ignore
    expect(validator.validator.validate).not.toHaveBeenCalled();
    expect(result).toEqual("value");
  });
  it("should return value (Query required)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Test {
      @Post("/")
      test(@QueryParams("test") @Required() @CollectionOf(String) type: string[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);

    const result: any = await validator.transform(["test"], param);

    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [
              {
                in: "query",
                name: "test",
                required: true,
                schema: {
                  items: {
                    type: "string"
                  },
                  type: "array"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });

    expect(result).toEqual(["test"]);
  });
  it("should throw an error (Query required)", async () => {
    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);
    // @ts-ignore
    validator.validator = undefined;

    class Test {
      @Post("/")
      test(@QueryParams("test") @Required() @CollectionOf(String) type: string[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);

    const result: any = await catchAsyncError(() => validator.transform(undefined, param));

    // THEN
    expect(getSpec(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "testTest",
            parameters: [
              {
                in: "query",
                name: "test",
                required: true,
                schema: {
                  items: {
                    type: "string"
                  },
                  type: "array"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });

    expect(result.message).toEqual("It should have required parameter 'test'");
  });
  it("should cast data if it's possible", async () => {
    const defaultValidator = {
      validate: vi.fn().mockResolvedValue("1")
    };

    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);

    (validator as any).validators.set("default", defaultValidator);

    class Test {
      @Post("/")
      test(@QueryParams("test") @Required() type: string) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);

    const result: any = await validator.transform(1, param);

    // THEN
    expect(result).toEqual("1");
    expect(defaultValidator.validate).toHaveBeenCalledWith("1", {
      collectionType: undefined,
      schema: {type: "string", minLength: 1},
      type: undefined
    });
  });
  it("should cast string to array", async () => {
    const defaultValidator = {
      validate: vi.fn().mockImplementation((o) => o)
    };

    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);

    (validator as any).validators.set("default", defaultValidator);

    class Test {
      @Post("/")
      test(@QueryParams("test") @Required() type: string[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);

    const result: any = await validator.transform(1, param);

    // THEN
    expect(result).toEqual([1]);
    expect(defaultValidator.validate).toHaveBeenCalledWith([1], expect.any(Object));
  });
  it("shouldn't cast object", async () => {
    const defaultValidator = {
      validate: vi.fn().mockImplementation((o) => o)
    };

    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);

    (validator as any).validators.set("default", defaultValidator);

    class Test {
      @Post("/")
      test(@QueryParams("test") @Required() type: any) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);

    const result: any = await validator.transform({}, param);

    // THEN
    expect(result).toEqual({});
    expect(defaultValidator.validate).toHaveBeenCalledWith({}, expect.any(Object));
  });
  it("should cast null string to null", async () => {
    const defaultValidator = {
      validate: vi.fn().mockImplementation((o) => o)
    };

    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);

    (validator as any).validators.set("default", defaultValidator);

    class Test {
      @Post("/")
      test(@QueryParams("test") type: string[]) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);

    const result: any = await validator.transform("null", param);

    // THEN
    expect(result).toEqual(null);
    expect(defaultValidator.validate).toHaveBeenCalledWith(null, expect.any(Object));
  });
  it("should not process undefined value", async () => {
    const defaultValidator = {
      validate: vi.fn().mockImplementation((o) => o)
    };

    const validator = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);

    (validator as any).validators.set("default", defaultValidator);

    class Test {
      @Post("/")
      test(@QueryParams("test") type: string) {}
    }

    // WHEN
    const param = JsonParameterStore.get(Test, "test", 0);

    const result: any = await validator.transform(undefined, param);

    // THEN
    expect(result).toEqual(undefined);
    expect(defaultValidator.validate).not.toHaveBeenCalled();
  });
});
