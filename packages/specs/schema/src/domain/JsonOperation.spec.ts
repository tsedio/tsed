import {descriptorOf} from "@tsed/core";

import {execMapper, Get, getSpec, In, JsonEntityStore, OperationPath, Path, Redirect, Returns, SpecTypes} from "../index.js";

describe("JsonOperation", () => {
  describe("getStatus()", () => {
    it("should return the status", () => {
      class MyController {
        @OperationPath("GET", "/")
        @(Returns(200).Header("x-token", "token"))
        @(Returns(200).Header("x-token2", "token2"))
        method() {}
      }

      const entity = JsonEntityStore.from(MyController.prototype, "method", descriptorOf(MyController, "method"));

      expect(entity.operation?.getStatus()).toBe(200);
      expect(entity.operation?.status).toBe(200);
      expect(execMapper("operationResponse", [entity.operation?.response], {})).toEqual({
        content: {
          "*/*": {
            schema: {
              type: "object"
            }
          }
        },
        description: "Success",
        headers: {
          "x-token": {
            example: "token",
            schema: {
              type: "string"
            }
          },
          "x-token2": {
            example: "token2",
            schema: {
              type: "string"
            }
          }
        }
      });
      expect(entity.operation?.getHeadersOf(200)).toEqual({
        "x-token": {
          example: "token",
          type: "string"
        },
        "x-token2": {
          example: "token2",
          type: "string"
        }
      });
    });
  });
  describe("isRedirection()", () => {
    it("should return redirection status", () => {
      @Path("/")
      class MyController {
        @Redirect("/path/to")
        @Get("/")
        test() {}
      }

      const entity = JsonEntityStore.fromMethod(MyController, "test");

      expect(entity.operation.isRedirection()).toBe(true);
      expect(entity.operation.isRedirection(302)).toBe(true);
      expect(entity.operation.isRedirection(200)).toBe(false);
    });
  });
  describe("getContentTypeOf()", () => {
    it("should return the content type of", () => {
      @Path("/")
      class MyController {
        @Get("/")
        @(Returns(200, String).ContentType("text/html"))
        test() {}
      }

      const entity = JsonEntityStore.fromMethod(MyController, "test");

      expect(entity.operation.getContentTypeOf(200)).toEqual("text/html");
      expect(entity.operation.getContentTypeOf(201)).toEqual(undefined);
    });
  });
  describe("when custom parameter is used", () => {
    it("should not generate invalid parameter", () => {
      class MyController {
        @OperationPath("GET", "/")
        method(@In("custom") req: any, @In("body") type: string) {}
      }

      expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).toEqual({
        paths: {
          "/": {
            get: {
              operationId: "myControllerMethod",
              parameters: [],
              requestBody: {
                content: {
                  "application/json": {
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
              tags: ["MyController"]
            }
          }
        },
        tags: [
          {
            name: "MyController"
          }
        ]
      });
    });
  });
});
