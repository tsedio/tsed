import {getSpec, OperationPath, Path, SpecTypes} from "@tsed/schema";
import {InFile} from "./inFile";

describe("@File()", () => {
  describe("one file", () => {
    @Path("/")
    class TestController {
      @OperationPath("POST", "/")
      test(@InFile("file1") file: any) {}
    }

    it("should set endpoint metadata - OS2", () => {
      expect(getSpec(TestController, {specType: SpecTypes.SWAGGER})).toEqual({
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
                    type: "object"
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
      expect(getSpec(TestController, {specType: SpecTypes.OPENAPI})).toEqual({
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
  describe("many files", () => {
    @Path("/")
    class TestController {
      @OperationPath("POST", "/")
      test(@InFile("file1") file: any[]) {}
    }

    it("should set endpoint metadata - OS2", () => {
      expect(getSpec(TestController, {specType: SpecTypes.SWAGGER})).toEqual({
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
                    type: "object"
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
      expect(getSpec(TestController, {specType: SpecTypes.OPENAPI})).toEqual({
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
});
