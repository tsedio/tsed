import {descriptorOf} from "@tsed/core";
import {Get, getSpec, In, JsonEntityStore, OperationPath, Path, Redirect, Returns} from "@tsed/schema";
import {expect} from "chai";

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

      expect(entity.operation?.getStatus()).to.equal(200);
      expect(entity.operation?.status).to.equal(200);
      expect(entity.operation?.response?.toJSON()).to.deep.equal({
        description: "Success",
        headers: {
          "x-token2": {example: "token2", type: "string"},
          "x-token": {example: "token", type: "string"}
        },
        schema: {type: "object"}
      });
      expect(entity.operation?.getHeadersOf(200)).to.deep.equal({
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

      expect(entity.operation.isRedirection()).to.eq(true);
      expect(entity.operation.isRedirection(302)).to.eq(true);
      expect(entity.operation.isRedirection(200)).to.eq(false);
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

      expect(entity.operation.getContentTypeOf(200)).to.deep.eq("text/html");
      expect(entity.operation.getContentTypeOf(201)).to.deep.eq(undefined);
    });
  });
  describe("when custom parameter is used", () => {
    it("should not generate invalid parameter", () => {
      class MyController {
        @OperationPath("GET", "/")
        method(@In("custom") req: any, @In("body") type: string) {}
      }

      expect(getSpec(MyController)).to.deep.eq({
        paths: {
          "/": {
            get: {
              operationId: "myControllerMethod",
              parameters: [
                {
                  in: "body",
                  name: "body",
                  required: false,
                  type: "string"
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
