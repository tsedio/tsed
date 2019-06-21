import {descriptorOf, Metadata, Store} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {Inject} from "../../src";


describe("@Inject()", () => {
  describe("used on unsupported decorator type", () => {
    it("should store metadata", () => {
      // GIVEN
      class Test {
        test() {
        }
      }

      // WHEN
      let actualError;
      try {
        Inject()(Test, "test", descriptorOf(Test, "test"));
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).to.deep.eq("Inject cannot used as method.static decorator on Test.test");
    });
  });

  describe("used on method", () => {
    before(() => {
      Sinon.stub(Metadata, "getType").returns(String);
    });

    after(() => {
      // @ts-ignore
      Metadata.getType.restore();
    });

    it("should store metadata", () => {
      // GIVEN
      class Test {
        test() {
        }
      }

      // WHEN
      Inject()(Test.prototype, "test", descriptorOf(Test, "test"));

      // THEN
      const store = Store.from(Test).get("injectableProperties");
      store.should.deep.eq({
        test: {
          bindingType: "method",
          propertyKey: "test"
        }
      });
    });
  });

  describe("used on property", () => {
    before(() => {

    });

    it("should store metadata", () => {
      // GIVEN
      class Test {
        test() {
        }
      }

      // WHEN
      Inject(String)(Test.prototype, "test");

      // THEN
      const store = Store.from(Test).get("injectableProperties");
      store.should.deep.eq({
        test: {
          bindingType: "property",
          propertyKey: "test",
          useType: String
        }
      });
    });
  });

  describe("used on constructor/params", () => {
    const sandbox = Sinon.createSandbox();
    before(() => {
      sandbox.stub(Metadata, "getParamTypes");
      sandbox.stub(Metadata, "setParamTypes");
    });
    after(() => {
      sandbox.restore();
    });

    it("should call Metadata.getParamTypes()", () => {
      // GIVEN
      class Test {
        test() {
        }
      }

      // @ts-ignore
      Metadata.getParamTypes.returns([]);

      // WHEN
      Inject(String)(Test.prototype, undefined, 0);

      // THEN
      Metadata.getParamTypes.should.have.been.calledWithExactly(Test.prototype, undefined);
      Metadata.setParamTypes.should.have.been.calledWithExactly(Test.prototype, undefined, [String]);
    });
  });

  describe("used on method/params", () => {
    const sandbox = Sinon.createSandbox();
    before(() => {
      sandbox.stub(Metadata, "getParamTypes");
      sandbox.stub(Metadata, "setParamTypes");
    });
    after(() => {
      sandbox.restore();
    });

    it("should call Metadata.getParamTypes()", () => {
      // GIVEN
      class Test {
        test() {
        }
      }

      // @ts-ignore
      Metadata.getParamTypes.returns([]);

      // WHEN
      Inject(String)(Test.prototype, "propertyKey", 0);

      // THEN
      Metadata.getParamTypes.should.have.been.calledWithExactly(Test.prototype, "propertyKey");
      Metadata.setParamTypes.should.have.been.calledWithExactly(Test.prototype, "propertyKey", [String]);
    });
  });
});
