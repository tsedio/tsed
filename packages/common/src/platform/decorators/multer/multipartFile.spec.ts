import {MultipartFile, ParamMetadata, ParamTypes, PlatformMulterMiddleware, Post} from "@tsed/common";
import {descriptorOf, Metadata, Store} from "@tsed/core";
import {getSpec, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import * as Sinon from "sinon";

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

    expect(store.get(PlatformMulterMiddleware)).to.deep.eq({
      fields: [
        {
          maxCount: 1,
          name: "file1"
        }
      ]
    });

    const param = ParamMetadata.get(TestController, "test", 0);
    expect(param.expression).to.eq("file1.0");
    expect(param.paramType).to.eq(ParamTypes.FILES);

    it("should set endpoint metadata - OS2", () => {
      expect(getSpec(TestController)).to.deep.eq({
        paths: {
          "/": {
            post: {
              consumes: ["multipart/form-data"],
              operationId: "testControllerTest",
              parameters: [
                {
                  in: "body",
                  name: "body",
                  required: false,
                  schema: {
                    properties: {
                      file1: {
                        // name without index
                        type: "file"
                      }
                    },
                    type: "object"
                  }
                }
              ],
              responses: {
                "400": {
                  description:
                    "<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1",
                  schema: {
                    type: "string"
                  }
                }
              },
              tags: ["TestController"]
            }
          }
        },
        tags: [
          {
            name: "TestController"
          }
        ]
      });
    });

    it("should set endpoint metadata - OS3", () => {
      expect(getSpec(TestController, {specType: SpecTypes.OPENAPI})).to.deep.eq({
        paths: {
          "/": {
            post: {
              operationId: "testControllerTest",
              parameters: [],
              requestBody: {
                content: {
                  "multipart/form-data": {
                    schema: {
                      properties: {
                        file1: {
                          format: "binary",
                          type: "string"
                        }
                      },
                      type: "object"
                    }
                  }
                },
                required: false
              },
              responses: {
                "400": {
                  content: {
                    "*/*": {
                      schema: {
                        type: "object"
                      }
                    }
                  },
                  description:
                    "<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1"
                }
              },
              tags: ["TestController"]
            }
          }
        },
        tags: [
          {
            name: "TestController"
          }
        ]
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

    expect(store.get(PlatformMulterMiddleware)).to.deep.eq({
      fields: [
        {
          maxCount: 4,
          name: "file1"
        }
      ]
    });

    const param = ParamMetadata.get(TestController, "test", 0);
    expect(param.expression).to.eq("file1");
    expect(param.paramType).to.eq(ParamTypes.FILES);

    it("should set endpoint metadata - OS2", () => {
      expect(getSpec(TestController)).to.deep.eq({
        paths: {
          "/": {
            post: {
              consumes: ["multipart/form-data"],
              operationId: "testControllerTest",
              parameters: [
                {
                  in: "body",
                  name: "body",
                  required: false,
                  schema: {
                    properties: {
                      file1: {
                        items: {
                          type: "file"
                        },
                        type: "array"
                      }
                    },
                    type: "object"
                  }
                }
              ],
              responses: {
                "400": {
                  description:
                    "<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1",
                  schema: {
                    type: "string"
                  }
                }
              },
              tags: ["TestController"]
            }
          }
        },
        tags: [
          {
            name: "TestController"
          }
        ]
      });
    });

    it("should set endpoint metadata - OS3", () => {
      expect(getSpec(TestController, {specType: SpecTypes.OPENAPI})).to.deep.eq({
        paths: {
          "/": {
            post: {
              operationId: "testControllerTest",
              parameters: [],
              requestBody: {
                content: {
                  "multipart/form-data": {
                    schema: {
                      properties: {
                        file1: {
                          items: {
                            format: "binary",
                            type: "string"
                          },
                          type: "array"
                        }
                      },
                      type: "object"
                    }
                  }
                },
                required: false
              },
              responses: {
                "400": {
                  content: {
                    "*/*": {
                      schema: {
                        type: "object"
                      }
                    }
                  },
                  description:
                    "<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1"
                }
              },
              tags: ["TestController"]
            }
          }
        },
        tags: [
          {
            name: "TestController"
          }
        ]
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
      store = new Store([Test.prototype, "test", descriptorOf(Test.prototype, "test")]);
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
