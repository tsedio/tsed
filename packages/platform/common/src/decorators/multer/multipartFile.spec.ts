import {MultipartFile, ParamMetadata, ParamTypes, PlatformMulterMiddleware, Post} from "@tsed/common";
import {descriptorOf, Metadata, Store} from "@tsed/core";
import {getSpec, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import Sinon from "sinon";

class Test {
  test() {}
}

describe("@MultipartFile()", () => {
  const sandbox = Sinon.createSandbox();

  describe("one file", () => {
    // WHEN
    class TestController {
      @Post("/")
      test(@MultipartFile("file1", 1) file: any) {}
    }

    // THEN
    const store = Store.fromMethod(TestController, "test");
    const param = ParamMetadata.get(TestController, "test", 0);

    it("should set params properly", () => {
      expect(store.get(PlatformMulterMiddleware)).to.deep.eq({
        fields: [
          {
            maxCount: 1,
            name: "file1"
          }
        ]
      });
      expect(param.expression).to.eq("file1.0");
      expect(param.paramType).to.eq(ParamTypes.FILES);
    });

    it("should set endpoint metadata - OS3", () => {
      expect(getSpec(TestController, {specType: SpecTypes.OPENAPI})).to.deep.eq({
        paths: {
          "/": {
            post: {
              operationId: "testControllerTest",
              parameters: [],
              responses: {
                "400": {
                  content: {"application/json": {schema: {$ref: "#/components/schemas/BadRequest"}}},
                  description:
                    "<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1"
                }
              },
              requestBody: {
                required: false,
                content: {
                  "multipart/form-data": {
                    schema: {
                      properties: {file1: {type: "string", format: "binary"}},
                      type: "object"
                    }
                  }
                }
              },
              tags: ["TestController"]
            }
          }
        },
        tags: [{name: "TestController"}],
        components: {
          schemas: {
            GenericError: {
              additionalProperties: true,
              properties: {
                message: {
                  description: "An error message",
                  minLength: 1,
                  type: "string"
                },
                name: {
                  description: "The error name",
                  minLength: 1,
                  type: "string"
                }
              },
              required: ["name", "message"],
              type: "object"
            },
            BadRequest: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  minLength: 1,
                  description: "The error name",
                  example: "BAD_REQUEST",
                  default: "BAD_REQUEST"
                },
                message: {type: "string", minLength: 1, description: "An error message"},
                status: {type: "number", description: "The status code of the exception", example: 400, default: 400},
                errors: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/GenericError"
                  },
                  description: "A list of related errors"
                },
                stack: {
                  type: "string",
                  description: "The stack trace (only in development mode)"
                }
              },
              required: ["name", "message", "status"]
            }
          }
        }
      });
    });
  });

  describe("multiple file schema", () => {
    // WHEN
    class TestController {
      @Post("/")
      test(@MultipartFile("file1", 4) file: any[]) {}
    }

    // THEN
    const store = Store.fromMethod(TestController, "test");
    const param = ParamMetadata.get(TestController, "test", 0);

    it("should set params properly", () => {
      expect(store.get(PlatformMulterMiddleware)).to.deep.eq({
        fields: [
          {
            maxCount: 4,
            name: "file1"
          }
        ]
      });
      expect(param.expression).to.eq("file1");
      expect(param.paramType).to.eq(ParamTypes.FILES);
    });

    it("should set endpoint metadata - OS3", () => {
      expect(getSpec(TestController, {specType: SpecTypes.OPENAPI})).to.deep.eq({
        paths: {
          "/": {
            post: {
              operationId: "testControllerTest",
              parameters: [],
              responses: {
                "400": {
                  content: {"application/json": {schema: {$ref: "#/components/schemas/BadRequest"}}},
                  description:
                    "<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1"
                }
              },
              requestBody: {
                required: false,
                content: {
                  "multipart/form-data": {
                    schema: {
                      properties: {file1: {type: "array", items: {type: "string", format: "binary"}}},
                      type: "object"
                    }
                  }
                }
              },
              tags: ["TestController"]
            }
          }
        },
        tags: [{name: "TestController"}],
        components: {
          schemas: {
            GenericError: {
              additionalProperties: true,
              properties: {
                message: {
                  description: "An error message",
                  minLength: 1,
                  type: "string"
                },
                name: {
                  description: "The error name",
                  minLength: 1,
                  type: "string"
                }
              },
              required: ["name", "message"],
              type: "object"
            },
            BadRequest: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  minLength: 1,
                  description: "The error name",
                  example: "BAD_REQUEST",
                  default: "BAD_REQUEST"
                },
                message: {
                  type: "string",
                  minLength: 1,
                  description: "An error message"
                },
                status: {type: "number", description: "The status code of the exception", example: 400, default: 400},
                errors: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/GenericError"
                  },
                  description: "A list of related errors"
                },
                stack: {
                  type: "string",
                  description: "The stack trace (only in development mode)"
                }
              },
              required: ["name", "message", "status"]
            }
          }
        }
      });
    });
  });

  describe("multiple files", () => {
    before(() => {
      sandbox.stub(Metadata, "getParamTypes");
      sandbox.stub(Store, "fromMethod");
    });

    after(() => {
      sandbox.restore();
    });

    let store: Store;
    before(() => {
      store = Store.from(Test.prototype, "test", descriptorOf(Test.prototype, "test"));
      store.delete("multipartAdded");

      // @ts-ignore
      store.delete(PlatformMulterMiddleware);
      // @ts-ignore
      Store.fromMethod.returns(store);
      // @ts-ignore
      Metadata.getParamTypes.returns([Array]);

      MultipartFile("file1", 8)(Test.prototype, "test", 0);
    });

    after(() => {
      sandbox.reset();
    });

    it("should set endpoint metadata", () => {
      expect(store.get(PlatformMulterMiddleware)).to.deep.eq({
        fields: [
          {
            maxCount: 8,
            name: "file1"
          }
        ]
      });
    });

    it("should set params metadata", () => {
      const param = ParamMetadata.get(Test, "test", 0);
      expect(param.expression).to.eq("file1");
      expect(param.paramType).to.eq(ParamTypes.FILES);
    });
  });
});
