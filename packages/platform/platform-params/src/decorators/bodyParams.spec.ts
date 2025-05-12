import {Controller} from "@tsed/di";
import {Description, getJsonSchema, getSpec, JsonParameterStore, MaxLength, MinItems, Post, Required, SpecTypes} from "@tsed/schema";

import {ParamTypes} from "../domain/ParamTypes.js";
import {BodyParams, RawBodyParams} from "./bodyParams.js";

describe("@BodyParams", () => {
  it("should call useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@BodyParams("expression", Test) body: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.BODY);
    expect(param.type).toEqual(Test);
  });
  it("should create params with Buffer type", () => {
    @Controller("/")
    class MyCtrl {
      @Post()
      test(@BodyParams() body: Buffer) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "myCtrlTest",
            parameters: [],
            requestBody: {
              content: {
                "*/*": {
                  schema: {
                    type: "string"
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
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });
  });
  it("should generate the correct spec for BodyParams from metadata (string)", () => {
    class TestModel {
      @Required()
      name: string;
    }

    @Controller("/")
    class MyCtrl {
      @Post()
      test(@BodyParams() @Required() @MaxLength(10) @Description("Description") body: string) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "myCtrlTest",
            parameters: [],
            requestBody: {
              description: "Description",
              content: {
                "application/json": {
                  schema: {
                    minLength: 1,
                    maxLength: 10,
                    type: "string"
                  }
                }
              },
              required: true
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });
  });
  it("should generate the correct spec for BodyParams from metadata (string[])", () => {
    class TestModel {
      @Required()
      name: string;
    }

    @Controller("/")
    class MyCtrl {
      @Post()
      test(@BodyParams(String) @Required() @MaxLength(10) @MinItems(3) @Description("Description") body: string[]) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "myCtrlTest",
            parameters: [],
            requestBody: {
              description: "Description",
              content: {
                "application/json": {
                  schema: {
                    items: {
                      maxLength: 10,
                      type: "string"
                    },
                    minItems: 3,
                    type: "array"
                  }
                }
              },
              required: true
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });
  });
  it("should generate the correct spec for BodyParams from metadata (TestModel)", () => {
    class TestModel {
      @Required()
      name: string;
    }

    @Controller("/")
    class MyCtrl {
      @Post()
      test(@BodyParams() @Required() @Description("Description") body: TestModel) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          TestModel: {
            properties: {
              name: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["name"],
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "myCtrlTest",
            parameters: [],
            requestBody: {
              description: "Description",
              content: {
                "application/json": {
                  schema: {$ref: "#/components/schemas/TestModel"}
                }
              },
              required: true
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });
    const param = JsonParameterStore.get(MyCtrl, "test", 0);
    const schema = getJsonSchema(param);

    expect(schema).toEqual({
      properties: {
        name: {
          minLength: 1,
          type: "string"
        }
      },
      required: ["name"],
      type: "object"
    });
  });
  it("should generate the correct spec for BodyParams from metadata (TestModel[])", () => {
    class TestModel {
      @Required()
      name: string;
    }

    @Controller("/")
    class MyCtrl {
      @Post()
      test(@BodyParams(TestModel) @MinItems(2) @Required() @Description("Description") body: TestModel[]) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          TestModel: {
            properties: {
              name: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["name"],
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "myCtrlTest",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      $ref: "#/components/schemas/TestModel"
                    },
                    minItems: 2,
                    type: "array"
                  }
                }
              },
              description: "Description",
              required: true
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });

    // const param = JsonParameterStore.get(MyCtrl, "test", 0);
    //
    // const entity = getJsonEntityStore(param);
    //
    // console.log(entity._type, entity.schema);
    //
    // const schema = getJsonSchema(param);
    //
    // expect(schema).toEqual({
    //   "properties": {
    //     "name": {
    //       "minLength": 1,
    //       "type": "string"
    //     }
    //   },
    //   "required": [
    //     "name"
    //   ],
    //   "type": "object"
    // });
  });
  it("should generate the correct spec for BodyParams from given type (TestModel)", () => {
    class TestModel {
      @Required()
      name: string;
    }

    @Controller("/")
    class MyCtrl {
      @Post()
      test(@BodyParams(TestModel) @Required() @Description("Description") body: any) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          TestModel: {
            properties: {
              name: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["name"],
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "myCtrlTest",
            parameters: [],
            requestBody: {
              description: "Description",
              content: {
                "application/json": {
                  schema: {$ref: "#/components/schemas/TestModel"}
                }
              },
              required: true
            },
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });

    const param = JsonParameterStore.get(MyCtrl, "test", 0);
    const schema = getJsonSchema(param);

    expect(schema).toEqual({
      properties: {
        name: {
          minLength: 1,
          type: "string"
        }
      },
      required: ["name"],
      type: "object"
    });
  });
});

describe("RawBodyParams()", () => {
  it("should declare a RawBodyParams", () => {
    @Controller("/")
    class MyCtrl {
      @Post()
      test(@RawBodyParams() body: Buffer) {}
    }

    const spec = getSpec(MyCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/": {
          post: {
            operationId: "myCtrlTest",
            parameters: [],
            requestBody: {
              content: {
                "*/*": {
                  schema: {
                    type: "string"
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
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });

    const param = JsonParameterStore.get(MyCtrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.RAW_BODY);
    expect(param.type).toEqual(Buffer);
    expect(param.pipes).toHaveLength(0);
  });
  it("should declare RawBodyParams with options", () => {
    class Ctrl {
      test(@RawBodyParams({useValidation: true, useType: String}) param: Date) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual(undefined);
    expect(param.paramType).toEqual(ParamTypes.RAW_BODY);
    expect(param.type).toEqual(String);
    expect(param.pipes).toHaveLength(1);
  });
});
