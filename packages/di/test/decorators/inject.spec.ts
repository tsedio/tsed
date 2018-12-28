import {descriptorOf, Metadata, Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {Inject} from "../../src";

class Test {
  test() {}
}

describe("@Inject()", () => {
  describe("used on unsupported decorator type", () => {
    before(() => {
      try {
        Inject()(Test, "test", descriptorOf(Test, "test"));
      } catch (er) {
        this.error = er;
      }
    });

    it("should store metadata", () => {
      expect(this.error.message).to.deep.eq("Inject cannot used as method.static at Test.test");
    });
  });

  describe("used on method", () => {
    before(() => {
      this.getTypeStub = Sinon.stub(Metadata, "getType").returns(String);

      Inject()(Test.prototype, "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test).get("injectableProperties");
    });

    after(() => {
      this.getTypeStub.restore();
    });

    it("should store metadata", () => {
      expect(this.store).to.deep.eq({
        test: {
          bindingType: "method",
          propertyKey: "test"
        }
      });
    });
  });

  describe("used on property", () => {
    before(() => {
      Inject(String)(Test.prototype, "test");
      this.store = Store.from(Test).get("injectableProperties");
    });

    it("should store metadata", () => {
      expect(this.store).to.deep.eq({
        test: {
          bindingType: "property",
          propertyKey: "test",
          useType: String
        }
      });
    });
  });

  describe("used on constructor/params", () => {
    before(() => {
      this.getParamTypesStub = Sinon.stub(Metadata, "getParamTypes").returns([]);
      this.setParamTypesStub = Sinon.stub(Metadata, "setParamTypes");

      Inject(String)(Test.prototype, undefined, 0);
    });
    after(() => {
      this.getParamTypesStub.restore();
      this.setParamTypesStub.restore();
    });

    it("should call Metadata.getParamTypes()", () => {
      this.getParamTypesStub.should.have.been.calledWithExactly(Test.prototype, undefined);
    });

    it("should call Metadata.setParamTypes()", () => {
      this.setParamTypesStub.should.have.been.calledWithExactly(Test.prototype, undefined, [String]);
    });
  });

  describe("used on method/params", () => {
    before(() => {
      this.getParamTypesStub = Sinon.stub(Metadata, "getParamTypes").returns([]);
      this.setParamTypesStub = Sinon.stub(Metadata, "setParamTypes");

      Inject(String)(Test.prototype, "propertyKey", 0);
    });
    after(() => {
      this.getParamTypesStub.restore();
      this.setParamTypesStub.restore();
    });

    it("should call Metadata.getParamTypes()", () => {
      this.getParamTypesStub.should.have.been.calledWithExactly(Test.prototype, "propertyKey");
    });

    it("should call Metadata.setParamTypes()", () => {
      this.setParamTypesStub.should.have.been.calledWithExactly(Test.prototype, "propertyKey", [String]);
    });
  });
});
