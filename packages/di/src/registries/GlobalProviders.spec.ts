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
      expect(result).to.be.instanceof(Registry);

      expect(setStub).to.have.been.calledWithExactly("test", {
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
        expect(getStub).to.have.been.calledWithExactly("type");
        expect(hasStub).to.have.been.calledWithExactly("type");

        return expect(providers.get).to.not.have.been.called;
      });
    });

    describe("when type is a Type", () => {
      before(() => {});

      it("should return registry settings", () => {
        // GIVEN
        class Test {}

        const providers = new GlobalProviderRegistry();
        Sinon.stub(providers, "get").returns({type: "type"} as Provider<any>);

        // @ts-ignore
        const hasStub = Sinon.stub(providers._registries, "has").returns(true);
        // @ts-ignore
        const getStub = Sinon.stub(providers._registries, "get").returns("instance");

        // WHEN
        const result = providers.getRegistrySettings(Test);

        // THEN
        expect(result).to.eq("instance");

        expect(hasStub).to.have.been.calledWithExactly("type");
        expect(getStub).to.have.been.calledWithExactly("type");
        expect(providers.get).to.have.been.calledWithExactly(Test);
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
        expect(result).to.deep.eq({
          registry: providers,
          injectable: true
        });
        expect(hasStub).to.have.been.calledWithExactly("type");

        return expect(providers.get).to.not.have.been.called && expect(getStub).to.not.have.been.called;
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
      expect(providers.getRegistry).to.have.been.calledWithExactly("type");
      expect(registryStub.merge).to.have.been.calledWithExactly("provide", {
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
      expect(providers.getRegistrySettings).to.have.been.calledWithExactly("type");
      expect(result).to.eq("registry");
    });
  });
});
