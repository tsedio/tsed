import {Registry} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {GlobalProviderRegistry, Provider} from "../../src";

const sandbox = Sinon.createSandbox();

describe("GlobalProviderRegistry", () => {
  describe("createRegistry()", () => {
    it("should create registry", () => {
      // GIVEN
      const providers = new GlobalProviderRegistry();

      // @ts-ignore
      const setStub = sandbox.stub(providers._registries, "set");

      // WHEN
      const result = providers.createRegistry("test", Provider, {
        injectable: false
      });

      // THEN
      result.should.be.instanceOf(Registry);

      setStub.should.have.been.calledWithExactly("test", {
        registry: result,
        injectable: false
      });
    });
  });

  describe("getRegistrySettings()", () => {
    describe("when type is a string", () => {
      it("should return registry settings", () => {
        // GIVEN
        const providers = new GlobalProviderRegistry();
        Sinon.stub(providers, "get");

        // @ts-ignore
        const hasStub = Sinon.stub(providers._registries, "has").returns(true);
        // @ts-ignore
        const getStub = Sinon.stub(providers._registries, "get").returns("instance");

        // WHEN
        const result = providers.getRegistrySettings("type");

        // THEN
        expect(result).to.eq("instance");
        getStub.should.have.been.calledWithExactly("type");
        hasStub.should.have.been.calledWithExactly("type");

        return providers.get.should.not.have.been.called;
      });
    });

    describe("when type is a Type", () => {
      before(() => {

      });

      it("should return registry settings", () => {
        // GIVEN
        class Test {
        }

        const providers = new GlobalProviderRegistry();
        Sinon.stub(providers, "get").returns({type: "type"} as Provider<any>);

        // @ts-ignore
        const hasStub = Sinon.stub(providers._registries, "has").returns(true);
        // @ts-ignore
        const getStub = Sinon.stub(providers._registries, "get").returns("instance");

        // WHEN
        const result = providers.getRegistrySettings(Test);

        // THEN
        result.should.eq("instance");

        hasStub.should.have.been.calledWithExactly("type");
        getStub.should.have.been.calledWithExactly("type");
        providers.get.should.have.been.calledWithExactly(Test);
      });
    });

    describe("when type is a string but is unknow", () => {
      it("should not call providers.get", () => {
        // GIVEN
        const providers = new GlobalProviderRegistry();
        Sinon.stub(providers, "get");
        // @ts-ignore
        const hasStub = Sinon.stub(providers._registries, "has").returns(false);
        // @ts-ignore
        const getStub = Sinon.stub(providers._registries, "get").returns("instance");

        // WHEN
        const result = providers.getRegistrySettings("type");

        // THEN
        result.should.deep.eq({
          registry: providers,
          injectable: true
        });
        hasStub.should.have.been.calledWithExactly("type");

        return providers.get.should.not.have.been.called && getStub.should.not.have.been.called;
      });
    });
  });

  describe("createRegisterFn()", () => {
    it("should create a register function", () => {
      // GIVEN
      const providers = new GlobalProviderRegistry();
      const registryStub = {
        merge: Sinon.stub()
      };

      // @ts-ignore
      Sinon.stub(providers, "getRegistry").returns(registryStub);

      // WHEN
      const fn = providers.createRegisterFn("type");
      fn("provide");

      // THEN
      providers.getRegistry.should.have.been.calledWithExactly("type");
      registryStub.merge.should.have.been.calledWithExactly("provide", {
        provide: "provide",
        instance: undefined,
        type: "type"
      });
    });
  });

  describe("getRegistry()", () => {
    it("should call getRegistrySettings and return the registry", () => {
      // GIVEN
      const providers = new GlobalProviderRegistry();

      // @ts-ignore
      Sinon.stub(providers, "getRegistrySettings").returns({registry: "registry"});

      // WHEN
      const result = providers.getRegistry("type");

      // THEN
      providers.getRegistrySettings.should.have.been.calledWithExactly("type");
      result.should.eq("registry");
    });
  });
});
