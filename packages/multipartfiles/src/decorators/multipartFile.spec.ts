import {EndpointRegistry, ParamRegistry, ParamTypes} from "@tsed/common";
import {descriptorOf, Metadata, Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {MultipartFile} from "../../src";
import {MultipartFileMiddleware} from "../../src/middlewares/MultipartFileMiddleware";

class Test {
  test() {}
}

describe("@MultipartFile()", () => {
  const sandbox = Sinon.createSandbox();
  before(() => {
    sandbox.stub(Metadata, "getParamTypes");
    sandbox.stub(Store, "fromMethod");
    sandbox.stub(EndpointRegistry, "useBefore");
  });

  after(() => {
    sandbox.restore();
  });

  describe("new version", () => {
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

        MultipartFile("file1", 1)(Test.prototype, "test", 0);
      });

      after(() => {
        sandbox.reset();
      });

      it("should set endpoint metadata", () => {
        expect(store.get(MultipartFileMiddleware)).to.deep.eq({
          fields: [
            {
              maxCount: 1,
              name: "file1"
            }
          ],
          options: undefined
        });
      });

      it("should create middleware", () => {
        EndpointRegistry.useBefore.should.be.calledWithExactly(Test.prototype, "test", [MultipartFileMiddleware]);
      });

      it("should set params metadata", () => {
        const param = ParamRegistry.get(Test, "test", 0);
        param.expression.should.eq("files.file1.0");
        param.paramType.should.eq(ParamTypes.FORM_DATA);
      });
    });
    describe("multiple files", () => {
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

      it("should create middleware", () => {
        EndpointRegistry.useBefore.should.be.calledWithExactly(Test.prototype, "test", [MultipartFileMiddleware]);
      });

      it("should set params metadata", () => {
        const param = ParamRegistry.get(Test, "test", 0);
        param.expression.should.eq("files.file1");
        param.paramType.should.eq(ParamTypes.FORM_DATA);
      });
    });
  });

  describe("legacy", () => {
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

        it("should create middleware", () => {
          EndpointRegistry.useBefore.should.be.calledWithExactly(Test.prototype, "test", [MultipartFileMiddleware]);
        });

        it("should set params metadata", () => {
          const param = ParamRegistry.get(Test, "test", 0);
          param.expression.should.eq("files.0");
          param.paramType.should.eq(ParamTypes.FORM_DATA);
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

        it("should create middleware", () => {
          EndpointRegistry.useBefore.should.have.been.calledWithExactly(Test.prototype, "test", [MultipartFileMiddleware]);
        });

        it("should set params metadata", () => {
          const param = ParamRegistry.get(Test, "test", 0);
          param.expression.should.eq("files");
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
      expect(error.message).to.eq("MultipartFile is only supported on parameters");
    });
  });
});
