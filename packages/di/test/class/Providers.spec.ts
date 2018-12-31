import {Registry} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {Providers} from "../../src/class/Providers";
import {Provider} from "../../src/class/Provider";

describe("Providers", () => {
  describe("createRegistry()", () => {
    before(() => {
      this.providers = new Providers();
      this.setStub = Sinon.stub(this.providers._registries, "set");
      this.result = this.providers.createRegistry("test", Provider, {
        options: "options",
        buildable: false,
        injectable: false
      });
    });

    it("should create registry", () => {
      expect(this.result).to.be.instanceOf(Registry);
    });

    it("should call registries.set", () => {
      this.setStub.should.have.been.calledWithExactly("test", {
        registry: this.result,
        options: "options",
        injectable: false,
        buildable: false
      });
    });
  });

  describe("getRegistrySettings()", () => {
    describe("when type is a string", () => {
      before(() => {
        this.providers = new Providers();
        this.providersGetStub = Sinon.stub(this.providers, "get");
        this.hasStub = Sinon.stub(this.providers._registries, "has").returns(true);
        this.getStub = Sinon.stub(this.providers._registries, "get").returns("instance");
        this.result = this.providers.getRegistrySettings("type");
      });

      it("should not call providers.get", () => {
        return this.providersGetStub.should.not.have.been.called;
      });

      it("should call registries.has", () => {
        this.hasStub.should.have.been.calledWithExactly("type");
      });

      it("should call registries.get", () => {
        this.getStub.should.have.been.calledWithExactly("type");
      });

      it("should return settings", () => {
        expect(this.result).to.eq("instance");
      });
    });

    describe("when type is a Type", () => {
      class Test {}

      before(() => {
        this.providers = new Providers();
        this.providersGetStub = Sinon.stub(this.providers, "get").returns({type: "type"});
        this.hasStub = Sinon.stub(this.providers._registries, "has").returns(true);
        this.getStub = Sinon.stub(this.providers._registries, "get").returns("instance");
        this.result = this.providers.getRegistrySettings(Test);
      });

      it("should call providers.get", () => {
        return this.providersGetStub.should.have.been.calledWithExactly(Test);
      });

      it("should call registries.has", () => {
        this.hasStub.should.have.been.calledWithExactly("type");
      });

      it("should call registries.get", () => {
        this.getStub.should.have.been.calledWithExactly("type");
      });

      it("should return settings", () => {
        expect(this.result).to.eq("instance");
      });
    });

    describe("when type is a string but is unknow", () => {
      before(() => {
        this.providers = new Providers();
        this.providersGetStub = Sinon.stub(this.providers, "get");
        this.hasStub = Sinon.stub(this.providers._registries, "has").returns(false);
        this.getStub = Sinon.stub(this.providers._registries, "get").returns("instance");
        this.result = this.providers.getRegistrySettings("type");
      });

      it("should not call providers.get", () => {
        return this.providersGetStub.should.not.have.been.called;
      });

      it("should call registries.has", () => {
        this.hasStub.should.have.been.calledWithExactly("type");
      });

      it("should not call registries.get", () => {
        return this.getStub.should.not.have.been.called;
      });

      it("should return settings", () => {
        expect(this.result).to.deep.eq({
          registry: this.providers,
          injectable: true,
          buildable: true
        });
      });
    });
  });

  describe("createRegisterFn()", () => {
    before(() => {
      this.providers = new Providers();
      this.registryStub = {
        merge: Sinon.stub()
      };
      this.getRegistryStub = Sinon.stub(this.providers, "getRegistry").returns(this.registryStub);
      this.providers.createRegisterFn("type")("provide");
    });

    it("should call getRegistryStub()", () => {
      this.getRegistryStub.should.have.been.calledWithExactly("type");
    });
    it("should merge options", () => {
      this.registryStub.merge.should.have.been.calledWithExactly("provide", {
        provide: "provide",
        instance: undefined,
        type: "type"
      });
    });
  });

  describe("getRegistry()", () => {
    before(() => {
      this.providers = new Providers();
      this.getRegistrySettingsStub = Sinon.stub(this.providers, "getRegistrySettings").returns({registry: "registry"});
      this.result = this.providers.getRegistry("type");
    });

    it("should call getRegistrySettings", () => {
      this.getRegistrySettingsStub.should.have.been.calledWithExactly("type");
    });

    it("should return the registry", () => {
      expect(this.result).to.eq("registry");
    });
  });
});
