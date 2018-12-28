import {ParamRegistry, ParamTypes} from "@tsed/common";
import {descriptorOf, Metadata, Store} from "@tsed/core";
import {EndpointRegistry} from "../../../../packages/common/src/mvc/registries/EndpointRegistry";
import {MultipartFile} from "../../../../packages/multipartfiles/src";
import {MultipartFileFilter} from "../../../../packages/multipartfiles/src/components/MultipartFileFilter";
import {MultipartFilesFilter} from "../../../../packages/multipartfiles/src/components/MultipartFilesFilter";
import {MultipartFileMiddleware} from "../../../../packages/multipartfiles/src/middlewares/MultipartFileMiddleware";
import {expect} from "chai";
import * as Sinon from "sinon";

class Test {
  test() {}
}

describe("@MultipartFile()", () => {
  before(() => {
    this.getParamTypesStub = Sinon.stub(Metadata, "getParamTypes");
    this.storeFromMethodStub = Sinon.stub(Store, "fromMethod");
    this.useBeforeStub = Sinon.stub(EndpointRegistry, "useBefore");
    this.useFilterStub = Sinon.stub(ParamRegistry, "useFilter");
  });

  after(() => {
    this.getParamTypesStub.restore();
    this.storeFromMethodStub.restore();
    this.useBeforeStub.restore();
    this.useFilterStub.restore();
  });

  describe("new version", () => {
    describe("one file", () => {
      before(() => {
        this.store = new Store([Test.prototype, "test", descriptorOf(Test.prototype, "test")]);
        this.store.delete("multipartAdded");
        this.store.delete(MultipartFileMiddleware);

        this.storeFromMethodStub.returns(this.store);

        this.getParamTypesStub.returns([Object]);

        MultipartFile("file1", 1)(Test.prototype, "test", 0);
      });

      after(() => {
        this.getParamTypesStub.reset();
        this.storeFromMethodStub.reset();
        this.useBeforeStub.reset();
        this.useFilterStub.reset();
      });

      it("should set endpoint metadata", () => {
        expect(this.store.get(MultipartFileMiddleware)).to.deep.eq({
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
        this.useBeforeStub.should.be.calledWithExactly(Test.prototype, "test", [MultipartFileMiddleware]);
      });

      it("should set params metadata", () => {
        this.useFilterStub.should.have.been.calledWithExactly(MultipartFilesFilter, {
          expression: "file1.0",
          propertyKey: "test",
          parameterIndex: 0,
          target: Test.prototype,
          useConverter: false,
          paramType: ParamTypes.FORM_DATA
        });
      });
    });
    describe("multiple files", () => {
      before(() => {
        this.store = new Store([Test.prototype, "test", descriptorOf(Test.prototype, "test")]);
        this.store.delete("multipartAdded");
        this.store.delete(MultipartFileMiddleware);

        this.storeFromMethodStub.returns(this.store);

        this.getParamTypesStub.returns([Array]);

        MultipartFile("file1", 8)(Test.prototype, "test", 0);
      });

      after(() => {
        this.getParamTypesStub.reset();
        this.storeFromMethodStub.reset();
        this.useBeforeStub.reset();
        this.useFilterStub.reset();
      });

      it("should set endpoint metadata", () => {
        expect(this.store.get(MultipartFileMiddleware)).to.deep.eq({
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
        this.useBeforeStub.should.be.calledWithExactly(Test.prototype, "test", [MultipartFileMiddleware]);
      });

      it("should set params metadata", () => {
        this.useFilterStub.should.have.been.calledWithExactly(MultipartFilesFilter, {
          expression: "file1",
          propertyKey: "test",
          parameterIndex: 0,
          target: Test.prototype,
          useConverter: false,
          paramType: ParamTypes.FORM_DATA
        });
      });
    });
  });

  describe("legacy", () => {
    describe("as parameter decorator", () => {
      describe("one file", () => {
        before(() => {
          this.store = new Store([Test.prototype, "test", descriptorOf(Test.prototype, "test")]);
          this.store.delete("multipartAdded");
          this.store.delete(MultipartFileMiddleware);

          this.storeFromMethodStub.returns(this.store);

          this.getParamTypesStub.returns([Object]);

          this.options = {options: "options"};
          MultipartFile(this.options)(Test.prototype, "test", 0);
        });

        after(() => {
          this.getParamTypesStub.reset();
          this.storeFromMethodStub.reset();
          this.useBeforeStub.reset();
          this.useFilterStub.reset();
        });

        it("should set endpoint metadata", () => {
          expect(this.store.get(MultipartFileMiddleware)).to.deep.eq({
            any: true,
            options: {
              options: "options"
            }
          });
        });

        it("should create middleware", () => {
          this.useBeforeStub.should.be.calledWithExactly(Test.prototype, "test", [MultipartFileMiddleware]);
        });

        it("should set params metadata", () => {
          this.useFilterStub.should.have.been.calledWithExactly(MultipartFileFilter, {
            propertyKey: "test",
            parameterIndex: 0,
            target: Test.prototype,
            useConverter: false,
            paramType: ParamTypes.FORM_DATA
          });
        });
      });

      describe("multiple file", () => {
        before(() => {
          this.store = new Store([Test.prototype, "test", descriptorOf(Test.prototype, "test")]);
          this.store.delete("multipartAdded");
          this.store.delete(MultipartFileMiddleware);
          this.storeFromMethodStub.returns(this.store);

          this.getParamTypesStub.returns([Array]);

          this.options = {options: "options"};
          MultipartFile(this.options)(Test.prototype, "test", 0);
        });

        after(() => {
          this.getParamTypesStub.reset();
          this.storeFromMethodStub.reset();
          this.useBeforeStub.reset();
          this.useFilterStub.reset();
        });

        it("should set endpoint metadata", () => {
          expect(this.store.get(MultipartFileMiddleware)).to.deep.eq({
            any: true,
            options: {
              options: "options"
            }
          });
        });

        it("should create middleware", () => {
          this.useBeforeStub.should.have.been.calledWithExactly(Test.prototype, "test", [MultipartFileMiddleware]);
        });

        it("should set params metadata", () => {
          this.useFilterStub.should.have.been.calledWithExactly(MultipartFilesFilter, {
            propertyKey: "test",
            parameterIndex: 0,
            target: Test.prototype,
            useConverter: false,
            paramType: ParamTypes.FORM_DATA
          });
        });
      });
    });
  });

  describe("when error", () => {
    before(() => {
      try {
        MultipartFile()(Test, "test", {});
      } catch (er) {
        this.error = er;
      }
    });

    it("should store metadata", () => {
      expect(this.error.message).to.eq("MultipartFile is only supported on parameters");
    });
  });
});
