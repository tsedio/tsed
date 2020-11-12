import {MultipartFile, ParamMetadata, ParamTypes, PlatformMulterMiddleware, Post} from "@tsed/common";
import {descriptorOf, Metadata, Store} from "@tsed/core";
import {getSpec} from "@tsed/schema";
import {expect} from "chai";
import * as Sinon from "sinon";

class Test {
  test() {}
}

describe("@MultipartFile()", () => {
  const sandbox = Sinon.createSandbox();

  describe("one file", () => {
    it("should set endpoint metadata", () => {
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

      expect(getSpec(TestController)).to.deep.eq({
        paths: {
          "/": {
            post: {
              consumes: ["multipart/form-data"],
              operationId: "testControllerTest",
              parameters: [],
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
