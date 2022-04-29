import {descriptorOf, Metadata} from "@tsed/core";
import {expect} from "chai";
import Sinon from "sinon";
import {Inject, Injectable, InjectorService} from "../../src";

describe("@Inject()", () => {
  describe("used on unsupported decorator type", () => {
    it("should store metadata", () => {
      // GIVEN
      class Test {
        test() {}
      }

      // WHEN
      let actualError;
      try {
        Inject()(Test, "test", descriptorOf(Test, "test"));
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).to.deep.eq("Inject cannot be used as method.static decorator on Test.test");
    });
  });

  describe("used on property", () => {
    it("should store metadata", async () => {
      // GIVEN
      @Injectable()
      class Test {
        @Inject()
        test: InjectorService;
      }

      const injector = new InjectorService();
      const instance = await injector.invoke<Test>(Test);

      expect(instance).to.be.instanceof(Test);
      expect(instance.test).to.be.instanceof(InjectorService);
    });

    it("should store metadata", async () => {
      // GIVEN
      @Injectable()
      class Test {
        @Inject(InjectorService, (bean: any) => bean.get(InjectorService))
        test: InjectorService;
      }

      const injector = new InjectorService();
      const instance = await injector.invoke<Test>(Test);

      expect(instance).to.be.instanceof(Test);
      expect(instance.test).to.be.instanceof(InjectorService);
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
        test() {}
      }

      // @ts-ignore
      Metadata.getParamTypes.returns([]);

      // WHEN
      Inject(String)(Test.prototype, undefined, 0);

      // THEN
      expect(Metadata.getParamTypes).to.have.been.calledWithExactly(Test.prototype, undefined);
      expect(Metadata.setParamTypes).to.have.been.calledWithExactly(Test.prototype, undefined, [String]);
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
        test() {}
      }

      // @ts-ignore
      Metadata.getParamTypes.returns([]);

      // WHEN
      Inject(String)(Test.prototype, "propertyKey", 0);

      // THEN
      expect(Metadata.getParamTypes).to.have.been.calledWithExactly(Test.prototype, "propertyKey");
      expect(Metadata.setParamTypes).to.have.been.calledWithExactly(Test.prototype, "propertyKey", [String]);
    });
  });
});
