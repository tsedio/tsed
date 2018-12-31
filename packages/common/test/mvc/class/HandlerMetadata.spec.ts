import {Store} from "@tsed/core";
import {ParamRegistry, Provider, ProviderRegistry, ProviderType} from "../../../src";
import {HandlerMetadata} from "../../../src/mvc/class/HandlerMetadata";
import {MiddlewareType} from "../../../src/mvc/interfaces";
import {expect} from "chai";
import * as Sinon from "sinon";

class Test {
  use(req: any, res: any, next: any) {}

  test(req: any, res: any, next: any) {}
}

class Test2 {
  use(err: any, req: any, res: any, next: any) {}
}

describe("HandlerMetadata", () => {
  describe("from function", () => {
    before(() => {
      this.isInjectableStub = Sinon.stub(ParamRegistry, "isInjectable").returns(false);
      this.hasNextFunctionStub = Sinon.stub(ParamRegistry, "hasNextFunction").returns(true);
      this.providerHasStub = Sinon.stub(ProviderRegistry, "has").returns(false);
      this.handlerMetadata = new HandlerMetadata((req: any, res: any, next: any) => {});
    });

    after(() => {
      this.isInjectableStub.restore();
      this.hasNextFunctionStub.restore();
      this.providerHasStub.restore();
    });

    it("shouldn't be injectable", () => {
      expect(this.handlerMetadata.injectable).to.eq(false);
    });

    it("should return controller type", () => {
      expect(this.handlerMetadata.type).to.eq("function");
    });

    it("should have a class method", () => {
      expect(this.handlerMetadata.methodClassName).to.eq(undefined);
    });

    it("should have a next Function", () => {
      expect(this.handlerMetadata.nextFunction).to.eq(true);
    });

    it("shouldn't have a err param", () => {
      expect(this.handlerMetadata.errorParam).to.eq(false);
    });
  });

  describe("from function err", () => {
    before(() => {
      this.isInjectableStub = Sinon.stub(ParamRegistry, "isInjectable").returns(false);
      this.hasNextFunctionStub = Sinon.stub(ParamRegistry, "hasNextFunction").returns(true);
      this.providerHasStub = Sinon.stub(ProviderRegistry, "has").returns(false);

      this.handlerMetadata = new HandlerMetadata((err: any, req: any, res: any, next: any) => {});
    });

    after(() => {
      this.isInjectableStub.restore();
      this.hasNextFunctionStub.restore();
      this.providerHasStub.restore();
    });

    it("shouldn't be injectable", () => {
      expect(this.handlerMetadata.injectable).to.eq(false);
    });

    it("should return controller type", () => {
      expect(this.handlerMetadata.type).to.eq("function");
    });

    it("should have a class method", () => {
      expect(this.handlerMetadata.methodClassName).to.eq(undefined);
    });

    it("should have a next Function", () => {
      expect(this.handlerMetadata.nextFunction).to.eq(true);
    });

    it("should have a err param", () => {
      expect(this.handlerMetadata.errorParam).to.eq(true);
    });
  });

  describe("from function with nextFn", () => {
    before(() => {
      this.isInjectableStub = Sinon.stub(ParamRegistry, "isInjectable").returns(false);
      this.hasNextFunctionStub = Sinon.stub(ParamRegistry, "hasNextFunction").returns(true);
      this.providerHasStub = Sinon.stub(ProviderRegistry, "has").returns(false);

      this.handlerMetadata = new HandlerMetadata((req: any, res: any) => {});
    });

    after(() => {
      this.isInjectableStub.restore();
      this.hasNextFunctionStub.restore();
      this.providerHasStub.restore();
    });

    it("shouldn't be injectable", () => {
      expect(this.handlerMetadata.injectable).to.eq(false);
    });

    it("should return function type", () => {
      expect(this.handlerMetadata.type).to.eq("function");
    });

    it("should have a class method", () => {
      expect(this.handlerMetadata.methodClassName).to.eq(undefined);
    });

    it("should have a next Function", () => {
      expect(this.handlerMetadata.nextFunction).to.eq(false);
    });

    it("shouldn't have a err param", () => {
      expect(this.handlerMetadata.errorParam).to.eq(false);
    });
  });

  describe("from endpoint without injection", () => {
    before(() => {
      this.provider = new Provider(Test);
      this.provider.type = ProviderType.CONTROLLER;

      this.isInjectableStub = Sinon.stub(ParamRegistry, "isInjectable").returns(false);
      this.hasNextFunctionStub = Sinon.stub(ParamRegistry, "hasNextFunction").returns(true);
      this.providerHasStub = Sinon.stub(ProviderRegistry, "has").returns(true);
      this.providerGetStub = Sinon.stub(ProviderRegistry, "get").returns(this.provider);

      this.handlerMetadata = new HandlerMetadata(Test, "test");
    });

    after(() => {
      this.isInjectableStub.restore();
      this.hasNextFunctionStub.restore();
      this.providerHasStub.restore();
      this.providerGetStub.restore();
    });

    it("shouldn't be injectable", () => {
      expect(this.handlerMetadata.injectable).to.eq(false);
    });

    it("should return controller type", () => {
      expect(this.handlerMetadata.type).to.eq("controller");
    });

    it("should have a class method", () => {
      expect(this.handlerMetadata.methodClassName).to.eq("test");
    });

    it("should have a next Function", () => {
      expect(this.handlerMetadata.nextFunction).to.eq(true);
    });

    it("shouldn't have a err param", () => {
      expect(this.handlerMetadata.errorParam).to.eq(false);
    });
  });

  describe("from endpoint with injection", () => {
    before(() => {
      this.provider = new Provider(Test);
      this.provider.type = ProviderType.CONTROLLER;

      this.isInjectableStub = Sinon.stub(ParamRegistry, "isInjectable").returns(true);
      this.hasNextFunctionStub = Sinon.stub(ParamRegistry, "hasNextFunction").returns(true);
      this.providerHasStub = Sinon.stub(ProviderRegistry, "has").returns(true);
      this.providerGetStub = Sinon.stub(ProviderRegistry, "get").returns(this.provider);

      this.handlerMetadata = new HandlerMetadata(Test, "test");
    });

    after(() => {
      this.isInjectableStub.restore();
      this.hasNextFunctionStub.restore();
      this.providerHasStub.restore();
      this.providerGetStub.restore();
    });

    it("should be injectable", () => {
      expect(this.handlerMetadata.injectable).to.eq(true);
    });

    it("should return controller type", () => {
      expect(this.handlerMetadata.type).to.eq("controller");
    });

    it("should have a class method", () => {
      expect(this.handlerMetadata.methodClassName).to.eq("test");
    });

    it("should have a next Function", () => {
      expect(this.handlerMetadata.nextFunction).to.eq(true);
    });

    it("shouldn't have a err param", () => {
      expect(this.handlerMetadata.errorParam).to.eq(false);
    });
  });

  describe("from middleware with injection", () => {
    before(() => {
      this.provider = new Provider(Test);
      this.provider.type = ProviderType.MIDDLEWARE;

      this.isInjectableStub = Sinon.stub(ParamRegistry, "isInjectable").returns(true);
      this.hasNextFunctionStub = Sinon.stub(ParamRegistry, "hasNextFunction").returns(true);
      this.providerHasStub = Sinon.stub(ProviderRegistry, "has").returns(true);
      this.providerGetStub = Sinon.stub(ProviderRegistry, "get").returns(this.provider);

      Store.from(Test).set("middlewareType", MiddlewareType.MIDDLEWARE);

      this.handlerMetadata = new HandlerMetadata(Test);
    });

    after(() => {
      this.isInjectableStub.restore();
      this.hasNextFunctionStub.restore();
      this.providerHasStub.restore();
      this.providerGetStub.restore();
    });

    it("should be injectable", () => {
      expect(this.handlerMetadata.injectable).to.eq(true);
    });

    it("should return middleware type", () => {
      expect(this.handlerMetadata.type).to.eq("middleware");
    });

    it("should have a class method", () => {
      expect(this.handlerMetadata.methodClassName).to.eq("use");
    });

    it("should have a next Function", () => {
      expect(this.handlerMetadata.nextFunction).to.eq(true);
    });

    it("shouldn't have a err param", () => {
      expect(this.handlerMetadata.errorParam).to.eq(false);
    });

    it("should return target", () => {
      expect(this.handlerMetadata.target).to.eq(Test);
    });

    it("should return services", () => {
      expect(this.handlerMetadata.services).to.be.an("array");
    });
  });

  describe("from middleware without injection", () => {
    before(() => {
      this.provider = new Provider(Test);
      this.provider.type = ProviderType.MIDDLEWARE;

      this.isInjectableStub = Sinon.stub(ParamRegistry, "isInjectable").returns(false);
      this.hasNextFunctionStub = Sinon.stub(ParamRegistry, "hasNextFunction").returns(false);
      this.providerHasStub = Sinon.stub(ProviderRegistry, "has").returns(true);
      this.providerGetStub = Sinon.stub(ProviderRegistry, "get").returns(this.provider);

      Store.from(Test).set("middlewareType", MiddlewareType.MIDDLEWARE);

      this.handlerMetadata = new HandlerMetadata(Test);
    });

    after(() => {
      this.isInjectableStub.restore();
      this.hasNextFunctionStub.restore();
      this.providerHasStub.restore();
      this.providerGetStub.restore();
    });

    it("shouldn't be injectable", () => {
      expect(this.handlerMetadata.injectable).to.eq(false);
    });

    it("should return middleware type", () => {
      expect(this.handlerMetadata.type).to.eq("middleware");
    });

    it("should have a class method", () => {
      expect(this.handlerMetadata.methodClassName).to.eq("use");
    });

    it("should have a next Function", () => {
      expect(this.handlerMetadata.nextFunction).to.eq(true);
    });

    it("shouldn't have a err param", () => {
      expect(this.handlerMetadata.errorParam).to.eq(false);
    });

    it("should return target", () => {
      expect(this.handlerMetadata.target).to.eq(Test);
    });

    it("should return services", () => {
      expect(this.handlerMetadata.services).to.be.an("array");
    });
  });

  describe("from middlewareError with injection", () => {
    before(() => {
      this.provider = new Provider(Test);
      this.provider.type = ProviderType.MIDDLEWARE;

      this.isInjectableStub = Sinon.stub(ParamRegistry, "isInjectable").returns(true);
      this.hasNextFunctionStub = Sinon.stub(ParamRegistry, "hasNextFunction").returns(true);
      this.providerHasStub = Sinon.stub(ProviderRegistry, "has").returns(true);
      this.providerGetStub = Sinon.stub(ProviderRegistry, "get").returns(this.provider);

      Store.from(Test).set("middlewareType", MiddlewareType.ERROR);

      this.handlerMetadata = new HandlerMetadata(Test);
    });

    after(() => {
      this.isInjectableStub.restore();
      this.hasNextFunctionStub.restore();
      this.providerHasStub.restore();
      this.providerGetStub.restore();
    });

    it("should be injectable", () => {
      expect(this.handlerMetadata.injectable).to.eq(true);
    });

    it("should return middleware type", () => {
      expect(this.handlerMetadata.type).to.eq("middleware");
    });

    it("should have a class method", () => {
      expect(this.handlerMetadata.methodClassName).to.eq("use");
    });

    it("should have a next Function", () => {
      expect(this.handlerMetadata.nextFunction).to.eq(true);
    });

    it("should have a err param", () => {
      expect(this.handlerMetadata.errorParam).to.eq(true);
    });

    it("should return target", () => {
      expect(this.handlerMetadata.target).to.eq(Test);
    });

    it("should return services", () => {
      expect(this.handlerMetadata.services).to.be.an("array");
    });
  });
  describe("from middlewareError without injection", () => {
    before(() => {
      this.provider = new Provider(Test);
      this.provider.type = ProviderType.MIDDLEWARE;
      this.provider.useClass = Test2;

      this.isInjectableStub = Sinon.stub(ParamRegistry, "isInjectable").returns(false);
      this.hasNextFunctionStub = Sinon.stub(ParamRegistry, "hasNextFunction").returns(false);
      this.providerHasStub = Sinon.stub(ProviderRegistry, "has").returns(true);
      this.providerGetStub = Sinon.stub(ProviderRegistry, "get").returns(this.provider);

      Store.from(Test).set("middlewareType", MiddlewareType.ERROR);
      this.handlerMetadata = new HandlerMetadata(Test2);
    });

    after(() => {
      this.isInjectableStub.restore();
      this.hasNextFunctionStub.restore();
      this.providerHasStub.restore();
      this.providerGetStub.restore();
    });

    it("shouldn't be injectable", () => {
      expect(this.handlerMetadata.injectable).to.eq(false);
    });

    it("should return middleware type", () => {
      expect(this.handlerMetadata.type).to.eq("middleware");
    });

    it("should have a class method", () => {
      expect(this.handlerMetadata.methodClassName).to.eq("use");
    });

    it("should have a next Function", () => {
      expect(this.handlerMetadata.nextFunction).to.eq(true);
    });

    it("should have a err param", () => {
      expect(this.handlerMetadata.errorParam).to.eq(true);
    });

    it("should return target", () => {
      expect(this.handlerMetadata.target).to.eq(Test2);
    });

    it("should return services", () => {
      expect(this.handlerMetadata.services).to.be.an("array");
    });
  });
});
