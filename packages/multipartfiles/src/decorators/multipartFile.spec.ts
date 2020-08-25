import {ParamMetadata, ParamTypes, Post} from "@tsed/common";
import {descriptorOf, Metadata, Store} from "@tsed/core";
import {getSpec} from "@tsed/schema";
import {expect} from "chai";
import * as Sinon from "sinon";
import {MultipartFile} from "../../src";
import {MultipartFileMiddleware} from "../../src/middlewares/MultipartFileMiddleware";

class Test {
  test() {}
}

describe("@MultipartFile()", () => {
  const sandbox = Sinon.createSandbox();

  describe("new version", () => {
    describe("one file", () => {
      it("should set endpoint metadata", () => {
        // WHEN
        class TestController {
          @Post("/")
          test(@MultipartFile("file1", 1) file: any) {}
        }

        // THEN
        const store = Store.fromMethod(TestController, "test");

        expect(store.get(MultipartFileMiddleware)).to.deep.eq({
          fields: [
            {
              maxCount: 1,
              name: "file1"
            }
          ],
          options: undefined
        });

        const param = ParamMetadata.get(TestController, "test", 0);
        expect(param.expression).to.eq("files.file1.0");
        expect(param.paramType).to.eq(ParamTypes.FORM_DATA);

        expect(getSpec(TestController)).to.deep.eq({
          definitions: {},
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
        store.delete(MultipartFileMiddleware);
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
        expect(store.get(MultipartFileMiddleware)).to.deep.eq({
          fields: [
            {
              maxCount: 8,
              name: "file1"
            }
          ],
          options: undefined
        });
      });

      it("should set params metadata", () => {
        const param = ParamMetadata.get(Test, "test", 0);
        expect(param.expression).to.eq("files.file1");
        expect(param.paramType).to.eq(ParamTypes.FORM_DATA);
      });
    });
  });

  describe("legacy", () => {
    before(() => {
      sandbox.stub(Metadata, "getParamTypes");
      sandbox.stub(Store, "fromMethod");
    });

    after(() => {
      sandbox.restore();
    });

    describe("as parameter decorator", () => {
      describe("one file", () => {
        let store: Store;
        before(() => {
          store = new Store([Test.prototype, "test", descriptorOf(Test.prototype, "test")]);
          store.delete("multipartAdded");
          // @ts-ignore
          store.delete(MultipartFileMiddleware);

          // @ts-ignore
          Store.fromMethod.returns(store);

          // @ts-ignore
          Metadata.getParamTypes.returns([Object]);

          const options: any = {options: "options"};
          MultipartFile(options)(Test.prototype, "test", 0);
        });

        after(() => {
          sandbox.reset();
        });

        it("should set endpoint metadata", () => {
          expect(store.get(MultipartFileMiddleware)).to.deep.eq({
            any: true,
            options: {
              options: "options"
            }
          });
        });

        it("should set params metadata", () => {
          const param = ParamMetadata.get(Test, "test", 0);
          expect(param.expression).to.eq("files.0");
          expect(param.paramType).to.eq(ParamTypes.FORM_DATA);
        });
      });

      describe("multiple file", () => {
        let store: Store;
        before(() => {
          store = new Store([Test.prototype, "test", descriptorOf(Test.prototype, "test")]);
          store.delete("multipartAdded");
          // @ts-ignore
          store.delete(MultipartFileMiddleware);
          // @ts-ignore
          Store.fromMethod.returns(store);
          // @ts-ignore
          Metadata.getParamTypes.returns([Array]);

          const options: any = {options: "options"};
          MultipartFile(options)(Test.prototype, "test", 0);
        });

        after(() => {
          sandbox.reset();
        });

        it("should set endpoint metadata", () => {
          expect(store.get(MultipartFileMiddleware)).to.deep.eq({
            any: true,
            options: {
              options: "options"
            }
          });
        });

        it("should set params metadata", () => {
          const param = ParamMetadata.get(Test, "test", 0);
          expect(param.expression).to.eq("files");
        });
      });
    });
  });

  describe("when error", () => {
    let error: any;
    before(() => {
      try {
        MultipartFile()(Test, "test", {});
      } catch (er) {
        error = er;
      }
    });

    it("should store metadata", () => {
      expect(error.message).to.eq("MultipartFile cannot be used as class decorator on Test.test");
    });
  });
});
