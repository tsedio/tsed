import {descriptorOf, Store} from "@tsed/core";
import {MultipartFileFilter} from "../../../../src/multipartfiles/components/MultipartFileFilter";
import {MultipartFilesFilter} from "../../../../src/multipartfiles/components/MultipartFilesFilter";
import {MultipartFileMiddleware} from "../../../../src/multipartfiles/middlewares/MultipartFileMiddleware";
import {assert, expect, Sinon} from "../../../tools";
import Proxyquire = require("proxyquire");

// tslint:disable-next-line: variable-name
const ParamRegistry: any = {useService: Sinon.stub(), useFilter: Sinon.stub()};
// tslint:disable-next-line: variable-name
const Metadata: any = {getParamTypes: Sinon.stub().returns([Object])};

const middleware: any = Sinon.stub();
// tslint:disable-next-line: variable-name
const UseBefore: any = Sinon.stub().returns(middleware);

const {MultipartFile} = Proxyquire.load("../../../../src/multipartfiles/decorators/multipartFile", {
  "@tsed/common": {ParamRegistry, UseBefore},
  "@tsed/core": {Metadata}
});

class Test {
  test() {}
}

describe("MultipartFile", () => {
  describe("as parameter decorator", () => {
    describe("one file", () => {
      before(() => {
        this.options = {};
        MultipartFile(this.options)(Test, "test", 0);
        this.args = ParamRegistry.useFilter.args[0];
        this.store = Store.fromMethod(Test, "test");
      });

      after(() => {
        delete this.args;
        delete this.options;
        ParamRegistry.useFilter = Sinon.stub();
      });

      it("should set endpoint metadata", () => {
        expect(this.store.get(MultipartFileMiddleware)).to.deep.eq(this.options);
      });

      it("should create middleware", () => {
        UseBefore.should.be.calledWithExactly(MultipartFileMiddleware);
        middleware.should.be.calledWithExactly(Test, "test", descriptorOf(Test, "test"));
      });

      it("should set params metadata", () => {
        expect(this.args[0]).to.eq(MultipartFileFilter);
        expect(this.args[1]).to.be.an("object");
        expect(this.args[1].propertyKey).to.eq("test");
        expect(this.args[1].target).to.eq(Test);
        expect(this.args[1].parameterIndex).to.eq(0);
      });
    });

    describe("multiple file", () => {
      before(() => {
        Metadata.getParamTypes.returns([Array]);
        this.options = {};
        MultipartFile(this.options)(Test, "test", 0);
        this.args = ParamRegistry.useFilter.args[0];
        this.store = Store.from(Test, "test", {
          value: () => {}
        });
      });

      after(() => {
        delete this.args;
        delete this.options;
        ParamRegistry.useFilter = Sinon.stub();
      });

      it("should set endpoint metadata", () => {
        expect(this.store.get(MultipartFileMiddleware)).to.deep.eq(this.options);
      });

      it("should create middleware", () => {
        UseBefore.should.be.calledWithExactly(MultipartFileMiddleware);
        middleware.should.be.calledWithExactly(Test, "test", descriptorOf(Test, "test"));
      });

      it("should set params metadata", () => {
        expect(this.args[0]).to.eq(MultipartFilesFilter);
        expect(this.args[1]).to.be.an("object");
        expect(this.args[1].propertyKey).to.eq("test");
        expect(this.args[1].target).to.eq(Test);
        expect(this.args[1].parameterIndex).to.eq(0);
      });
    });
  });

  describe("as other decorator type", () => {
    before(() => {
      ParamRegistry.useFilter = Sinon.stub();
      MultipartFile()(Test, "test", {
        value: () => {}
      });
    });

    it("should do nothing", () => {
      assert(!ParamRegistry.useFilter.called, "method is called");
    });
  });
});
