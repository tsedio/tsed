import * as Sinon from "sinon";
import {
  GlobalProviders,
  ProviderScope,
  ProviderType,
  registerFactory,
  registerProvider,
  registerValue
} from "../../src";

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

      actualError.message.should.deep.eq("Provider.provide is required");
    });

    it("should add provider", () => {
      class Test {
      }

      registerProvider({provide: Test});

      GlobalProviders.merge.should.have.been.calledWithExactly(Test, {
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

      GlobalProviders.merge.should.have.been.calledWithExactly(token, {
        provide: token,
        useValue: "myValue",
        scope: ProviderScope.SINGLETON,
        type: ProviderType.VALUE
      });
    });

    it("should add provider", () => {
      const token = Symbol.for("CustomTokenValue");

      registerValue({provide: token, useValue: "myValue", scope: ProviderScope.REQUEST});

      GlobalProviders.merge.should.have.been.calledWithExactly(token, {
        provide: token,
        useValue: "myValue",
        scope: ProviderScope.REQUEST,
        type: ProviderType.VALUE
      });
    });
  });
  describe("registerFactory()", () => {
    before(() => {
      sandbox.stub(GlobalProviders.getRegistry(ProviderType.FACTORY), "merge");
    });

    after(() => {
      sandbox.restore();
    });
    afterEach(() => {
      sandbox.resetHistory();
    });

    it("should add provider (1)", () => {
      const token = Symbol.for("CustomTokenFactory");

      registerFactory(token, {factory: "factory"});

      const factoryRegistry = GlobalProviders.getRegistry(ProviderType.FACTORY);

      factoryRegistry.merge.should.have.been.calledWithExactly(token, {
        provide: token,
        useFactory: Sinon.match.func,
        scope: ProviderScope.SINGLETON,
        type: ProviderType.FACTORY
      });

      // @ts-ignore
      factoryRegistry.merge.args[0][1].useFactory().should.deep.eq({factory: "factory"});
    });

    it("should add provider (2)", () => {
      const token = Symbol.for("CustomTokenFactory");

      registerFactory({
        provide: token,
        scope: ProviderScope.REQUEST,
        useFactory() {
          return {factory: "factory"};
        }
      });

      GlobalProviders.getRegistry(ProviderType.FACTORY).merge.should.have.been.calledWithExactly(token, {
        provide: token,
        useFactory: Sinon.match.func,
        scope: ProviderScope.REQUEST,
        type: ProviderType.FACTORY
      });
    });
  });
});
