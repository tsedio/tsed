import {expect} from "chai";
import Sinon from "sinon";
import {GlobalProviders, ProviderScope, ProviderType, registerProvider, registerValue} from "../../src";

const sandbox = Sinon.createSandbox();

describe("ProviderRegistry", () => {
  describe("registerProvider()", () => {
    before(() => {
      sandbox.stub(GlobalProviders, "merge");
      sandbox.stub(GlobalProviders, "has").returns(false);
    });

    after(() => {
      sandbox.restore();
    });

    afterEach(() => {
      sandbox.resetHistory();
    });

    it("should throw an error when provide field is not given ", () => {
      // GIVEN
      // @ts-ignore
      GlobalProviders.has.returns(false);

      let actualError;
      try {
        registerProvider({provide: undefined});
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).to.deep.eq("Provider.provide is required");
    });

    it("should add provider", () => {
      class Test {}

      registerProvider({provide: Test});

      expect(GlobalProviders.merge).to.have.been.calledWithExactly(Test, {
        provide: Test
      });
    });
  });
  describe("registerValue()", () => {
    before(() => {
      sandbox.stub(GlobalProviders, "merge");
      sandbox.stub(GlobalProviders, "has").returns(false);
    });

    after(() => {
      sandbox.restore();
    });
    afterEach(() => {
      sandbox.resetHistory();
    });

    it("should add provider (1)", () => {
      const token = Symbol.for("CustomTokenValue");

      registerValue(token, "myValue");

      expect(GlobalProviders.merge).to.have.been.calledWithExactly(token, {
        provide: token,
        useValue: "myValue",
        scope: ProviderScope.SINGLETON,
        type: ProviderType.VALUE
      });
    });

    it("should add provider", () => {
      const token = Symbol.for("CustomTokenValue");

      registerValue({provide: token, useValue: "myValue", scope: ProviderScope.REQUEST});

      expect(GlobalProviders.merge).to.have.been.calledWithExactly(token, {
        provide: token,
        useValue: "myValue",
        scope: ProviderScope.REQUEST,
        type: ProviderType.VALUE
      });
    });

    it("should add provider (legacy)", () => {
      const token = Symbol.for("CustomTokenValue2");

      registerValue(token, "myValue");

      expect(GlobalProviders.merge).to.have.been.calledWithExactly(token, {
        provide: token,
        useValue: "myValue",
        scope: ProviderScope.SINGLETON,
        type: ProviderType.VALUE
      });
    });
  });
});
